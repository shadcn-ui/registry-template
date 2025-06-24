import { type Address } from "viem";
import { Config } from "./manifold-nft-mint";
import { getPublicClient } from "@/registry/mini-app/lib/chains";
import { MANIFOLD_ABI, KNOWN_CONTRACTS } from "@/registry/mini-app/lib/nft-standards";
import { isZeroAddress } from "@/registry/mini-app/lib/manifold-utils";

export type Claim = {
  total: number;
  totalMax: number;
  walletMax: number;
  startDate: number;
  endDate: number;
  storageProtocol: number;
  merkleRoot: `0x${string}`;
  location: string;
  tokenId: bigint;
  cost: bigint;
  paymentReceiver: Address;
  erc20: Address;
  signingAddress: Address;
} | undefined;

// Re-export ERC20 ABI for backward compatibility
export const ERC20Abi = [
  {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}
] as const;




export async function getNftDetails(contractAddress: Address, instanceId: string, tokenId: string, chainId: number) {
  
  
  const client = getPublicClient(chainId);
  let claim: Claim | undefined;
  let instance: bigint | undefined = instanceId ? BigInt(instanceId) : undefined;
  let erc20Symbol: string | undefined;
  let erc20Decimals: number | undefined;
  let fee: bigint | undefined;
  try{
    const extensionContractAddresses = await client.readContract({
      address: contractAddress,
      abi: MANIFOLD_ABI.detection,
      functionName: "getExtensions",
    }) as Address[];
    if(extensionContractAddresses.length > 0 && extensionContractAddresses.includes(KNOWN_CONTRACTS.manifoldExtension)){
      if(instanceId){
    claim = await client.readContract({
      address: KNOWN_CONTRACTS.manifoldExtension,
      abi: MANIFOLD_ABI.extension.getClaim,
      functionName: "getClaim",
      args: [contractAddress, BigInt(instanceId)],
    });}else{
      const data = await client.readContract({
        address: KNOWN_CONTRACTS.manifoldExtension,
        abi: MANIFOLD_ABI.extension.getClaimForToken,
        functionName: "getClaimForToken",
        args: [contractAddress, BigInt(tokenId)],
      });
     
      instance = BigInt(data[0]);
      claim = data[1] as Claim;
    }
    fee = await client.readContract({
      address: KNOWN_CONTRACTS.manifoldExtension,
      abi: MANIFOLD_ABI.extension.fees,
      functionName: "MINT_FEE",
    });
  }else{
    if(instanceId){
    claim = await client.readContract({
      address: extensionContractAddresses[0],
      abi: MANIFOLD_ABI.extension.getClaim,
      functionName: "getClaim",
      args: [contractAddress, BigInt(instanceId)],
    });
  }else{
    const data = await client.readContract({
      address: extensionContractAddresses[0],
      abi: MANIFOLD_ABI.extension.getClaim,
      functionName: "getClaimForToken",
      args: [contractAddress, BigInt(tokenId)],
    });
    instance = BigInt(data[0]);
    claim = data[1] as Claim;
  }
  fee = await client.readContract({
    address: extensionContractAddresses[0],
    abi: MANIFOLD_ABI.extension.fees,
    functionName: "MINT_FEE",
  });
  }

  if(claim && claim.erc20 && !isZeroAddress(claim.erc20)){
    erc20Symbol = await client.readContract({
      address: claim.erc20,
      abi: ERC20Abi,
      functionName: "symbol",
    });
    console.log("erc20Symbol", erc20Symbol);
    erc20Decimals = await client.readContract({
      address: claim.erc20,
      abi: ERC20Abi,
      functionName: "decimals",
    });
    console.log("erc20Decimals", erc20Decimals);
  }
    const config: Config = {
      contractAddress,
      instanceId: instanceId ? instanceId : instance?.toString() as string,
      tokenId: tokenId ? BigInt(tokenId) : claim?.tokenId as bigint,
      chainId,
      claim,
      extenstionContractAddress: extensionContractAddresses.includes(KNOWN_CONTRACTS.manifoldExtension) ? KNOWN_CONTRACTS.manifoldExtension : extensionContractAddresses[0],
      erc20ContractAddress: claim?.erc20,
      erc20Decimals,
      erc20Symbol,
      mintFee: fee?.toString(),
    }
    return config;
  } catch (error) {
    console.error("Error fetching NFT details:", error);
    throw error;
  }
  
}