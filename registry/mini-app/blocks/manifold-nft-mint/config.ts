import { type Address } from "viem";
import { Config } from "./manifold-nft-mint";
import { getPublicClient } from "@/registry/mini-app/lib/chains";
import { MANIFOLD_DETECTION_ABI, MANIFOLD_EXTENSION_ABI, KNOWN_CONTRACTS, ERC20_ABI } from "@/registry/mini-app/lib/nft-standards";
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





export async function getNftDetails(contractAddress: Address, instanceId: string, tokenId: string, chainId: number) {
  // Validate inputs
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }
  
  // Validate instanceId and tokenId can be converted to BigInt
  if (instanceId) {
    try {
      BigInt(instanceId);
    } catch {
      throw new Error("Invalid instanceId: must be a valid number string");
    }
  }
  
  if (tokenId) {
    try {
      BigInt(tokenId);
    } catch {
      throw new Error("Invalid tokenId: must be a valid number string");
    }
  }
  
  
  const client = getPublicClient(chainId);
  let claim: Claim | undefined;
  let instance: bigint | undefined = instanceId ? BigInt(instanceId) : undefined;
  let erc20Symbol: string | undefined;
  let erc20Decimals: number | undefined;
  let fee: bigint | undefined;
  try{
    const extensionContractAddresses = await client.readContract({
      address: contractAddress,
      abi: MANIFOLD_DETECTION_ABI,
      functionName: "getExtensions",
    }) as Address[];
    
    // Validate extension addresses exist
    if(!extensionContractAddresses || extensionContractAddresses.length === 0) {
      throw new Error("No Manifold extensions found on contract");
    }
    
    if(extensionContractAddresses.includes(KNOWN_CONTRACTS.manifoldExtension)){
      if(instanceId){
    claim = await client.readContract({
      address: KNOWN_CONTRACTS.manifoldExtension,
      abi: MANIFOLD_EXTENSION_ABI,
      functionName: "getClaim",
      args: [contractAddress, BigInt(instanceId)],
    });}else{
      const data = await client.readContract({
        address: KNOWN_CONTRACTS.manifoldExtension,
        abi: MANIFOLD_EXTENSION_ABI,
        functionName: "getClaimForToken",
        args: [contractAddress, BigInt(tokenId)],
      });
      
      // Validate response structure
      if (!Array.isArray(data) || data.length !== 2) {
        throw new Error("Invalid response from getClaimForToken");
      }
      
      const [rawInstanceId, rawClaim] = data;
      
      // Validate types
      if (typeof rawInstanceId !== 'bigint' || !rawClaim || typeof rawClaim !== 'object') {
        throw new Error("Invalid data types in getClaimForToken response");
      }
      
      instance = rawInstanceId;
      claim = rawClaim as Claim;
    }
    fee = await client.readContract({
      address: KNOWN_CONTRACTS.manifoldExtension,
      abi: MANIFOLD_EXTENSION_ABI,
      functionName: "MINT_FEE",
    });
  }else{
    if(instanceId){
    claim = await client.readContract({
      address: extensionContractAddresses[0],
      abi: MANIFOLD_EXTENSION_ABI,
      functionName: "getClaim",
      args: [contractAddress, BigInt(instanceId)],
    });
  }else{
    const data = await client.readContract({
      address: extensionContractAddresses[0],
      abi: MANIFOLD_EXTENSION_ABI,
      functionName: "getClaimForToken",
      args: [contractAddress, BigInt(tokenId)],
    });
    
    // Validate response structure
    if (!Array.isArray(data) || data.length !== 2) {
      throw new Error("Invalid response from getClaimForToken");
    }
    
    const [rawInstanceId, rawClaim] = data;
    
    // Validate types
    if (typeof rawInstanceId !== 'bigint' || !rawClaim || typeof rawClaim !== 'object') {
      throw new Error("Invalid data types in getClaimForToken response");
    }
    
    instance = rawInstanceId;
    claim = rawClaim as Claim;
  }
  fee = await client.readContract({
    address: extensionContractAddresses[0],
    abi: MANIFOLD_EXTENSION_ABI,
    functionName: "MINT_FEE",
  });
  }

  if(claim && claim.erc20 && !isZeroAddress(claim.erc20)){
    erc20Symbol = await client.readContract({
      address: claim.erc20,
      abi: ERC20_ABI,
      functionName: "symbol",
    }) as string;
    console.log("erc20Symbol", erc20Symbol);
    
    const decimalsResult = await client.readContract({
      address: claim.erc20,
      abi: ERC20_ABI,
      functionName: "decimals",
    });
    
    // Validate decimals is a valid number
    erc20Decimals = Number(decimalsResult);
    if (isNaN(erc20Decimals) || erc20Decimals < 0 || erc20Decimals > 255) {
      console.error("Invalid ERC20 decimals:", decimalsResult);
      erc20Decimals = 18; // Default to 18 if invalid
    }
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