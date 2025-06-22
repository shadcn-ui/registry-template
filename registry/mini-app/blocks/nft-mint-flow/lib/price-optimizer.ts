import type { PublicClient } from "viem";
import type { NFTContractInfo, MintParams } from "./types";
import { getProviderConfig } from "./provider-configs";

/**
 * Optimized price discovery that batches RPC calls where possible
 */
export async function fetchPriceData(
  client: PublicClient,
  params: MintParams,
  contractInfo: NFTContractInfo
): Promise<{
  mintPrice?: bigint;
  erc20Details?: {
    address: string;
    symbol: string;
    decimals: number;
    allowance?: bigint;
  };
  totalCost: bigint;
  claim?: NFTContractInfo["claim"];
}> {
  const config = getProviderConfig(contractInfo.provider);
  
  if (contractInfo.provider === "manifold" && contractInfo.extensionAddress) {
    // For Manifold, we need extension fee + claim cost
    const calls = [
      // Get MINT_FEE from extension
      {
        address: contractInfo.extensionAddress,
        abi: config.mintConfig.abi,
        functionName: "MINT_FEE",
        args: []
      }
    ];
    
    // Add claim fetch if we have instanceId
    if (params.instanceId) {
      calls.push({
        address: contractInfo.extensionAddress,
        abi: config.mintConfig.abi,
        functionName: "getClaim",
        args: [params.contractAddress, BigInt(params.instanceId)]
      } as any);
    }
    
    try {
      const results = await Promise.all(
        calls.map(call => 
          client.readContract(call as any).catch(err => {
            console.error("RPC call failed:", err);
            return null;
          })
        )
      );
      
      const mintFee = results[0] as bigint | null;
      const claim = results[1] as any;
      
      let totalCost = mintFee || BigInt(0);
      let erc20Details = undefined;
      
      if (claim) {
        // Store claim data in contractInfo for later use
        contractInfo.claim = {
          cost: claim.cost,
          merkleRoot: claim.merkleRoot,
          erc20: claim.erc20,
          startDate: claim.startDate,
          endDate: claim.endDate,
          walletMax: claim.walletMax
        };
        
        // Check if ERC20 payment
        if (claim.erc20 && claim.erc20 !== "0x0000000000000000000000000000000000000000") {
          // Batch ERC20 details fetch
          const [symbol, decimals, allowance] = await Promise.all([
            client.readContract({
              address: claim.erc20,
              abi: [{ name: "symbol", type: "function", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" }],
              functionName: "symbol"
            }),
            client.readContract({
              address: claim.erc20,
              abi: [{ name: "decimals", type: "function", inputs: [], outputs: [{ type: "uint8" }], stateMutability: "view" }],
              functionName: "decimals"
            }),
            params.recipient ? client.readContract({
              address: claim.erc20,
              abi: [{ 
                name: "allowance", 
                type: "function", 
                inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], 
                outputs: [{ type: "uint256" }], 
                stateMutability: "view" 
              }],
              functionName: "allowance",
              args: [params.recipient, contractInfo.extensionAddress || params.contractAddress]
            }).catch(() => BigInt(0)) : Promise.resolve(undefined) // Return undefined when no recipient, not 0
          ]);
          
          erc20Details = {
            address: claim.erc20,
            symbol: symbol as string,
            decimals: decimals as number,
            allowance: allowance as bigint
          };
          
          // For ERC20, total cost in ETH is just the mint fee
          totalCost = mintFee || BigInt(0);
        } else {
          // ETH payment - add claim cost to mint fee
          totalCost = (mintFee || BigInt(0)) + (claim.cost || BigInt(0));
        }
      }
      
      return {
        mintPrice: mintFee || BigInt(0),
        erc20Details,
        totalCost,
        claim: claim ? contractInfo.claim : undefined
      };
    } catch (err) {
      console.error("Failed to fetch Manifold price data:", err);
      return { totalCost: BigInt(0) };
    }
  } else {
    // Generic price discovery - try multiple function names
    const functionNames = config.priceDiscovery.functionNames;
    
    for (const functionName of functionNames) {
      try {
        const price = await client.readContract({
          address: params.contractAddress,
          abi: config.priceDiscovery.abis[0],
          functionName: functionName as any,
          args: []
        });
        
        if (price !== undefined) {
          const totalCost = (price as bigint) * BigInt(params.amount || 1);
          return {
            mintPrice: price as bigint,
            totalCost
          };
        }
      } catch {
        // Try next function name
        continue;
      }
    }
    
    // No price found, assume free mint
    return { mintPrice: BigInt(0), totalCost: BigInt(0) };
  }
}