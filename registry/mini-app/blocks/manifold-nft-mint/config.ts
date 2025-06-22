import { createPublicClient, http, type Address } from "viem";
import { base, mainnet } from "viem/chains";
import { Config } from "./manifold-nft-mint";
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

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

// Manifold ERC-1155 ABI for reading token details
export const manifoldERC1155Abi = [
  {"inputs":[],"name":"getExtensions","outputs":[{"internalType":"address[]","name":"extensions","type":"address[]"}],"stateMutability":"view","type":"function"}
] as const;


export const manifoldERC1155ExtensionAbi = [
  {"inputs":[{"internalType":"address","name":"creatorContractAddress","type":"address"},{"internalType":"uint256","name":"instanceId","type":"uint256"}],"name":"getClaim","outputs":[{"components":[{"internalType":"uint32","name":"total","type":"uint32"},{"internalType":"uint32","name":"totalMax","type":"uint32"},{"internalType":"uint32","name":"walletMax","type":"uint32"},{"internalType":"uint48","name":"startDate","type":"uint48"},{"internalType":"uint48","name":"endDate","type":"uint48"},{"internalType":"enum ILazyPayableClaim.StorageProtocol","name":"storageProtocol","type":"uint8"},{"internalType":"bytes32","name":"merkleRoot","type":"bytes32"},{"internalType":"string","name":"location","type":"string"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"cost","type":"uint256"},{"internalType":"address payable","name":"paymentReceiver","type":"address"},{"internalType":"address","name":"erc20","type":"address"},{"internalType":"address","name":"signingAddress","type":"address"}],"internalType":"struct IERC1155LazyPayableClaim.Claim","name":"claim","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"creatorContractAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getClaimForToken","outputs":[{"internalType":"uint256","name":"instanceId","type":"uint256"},{"components":[{"internalType":"uint32","name":"total","type":"uint32"},{"internalType":"uint32","name":"totalMax","type":"uint32"},{"internalType":"uint32","name":"walletMax","type":"uint32"},{"internalType":"uint48","name":"startDate","type":"uint48"},{"internalType":"uint48","name":"endDate","type":"uint48"},{"internalType":"enum ILazyPayableClaim.StorageProtocol","name":"storageProtocol","type":"uint8"},{"internalType":"bytes32","name":"merkleRoot","type":"bytes32"},{"internalType":"string","name":"location","type":"string"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"cost","type":"uint256"},{"internalType":"address payable","name":"paymentReceiver","type":"address"},{"internalType":"address","name":"erc20","type":"address"},{"internalType":"address","name":"signingAddress","type":"address"}],"internalType":"struct IERC1155LazyPayableClaim.Claim","name":"claim","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"creatorContractAddress","type":"address"},{"internalType":"uint256","name":"instanceId","type":"uint256"},{"internalType":"uint32","name":"mintIndex","type":"uint32"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"},{"internalType":"address","name":"mintFor","type":"address"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"MINT_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINT_FEE_MERKLE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"creatorContractAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"uri","type":"string"}],"stateMutability":"view","type":"function"}
] as const;


 export const ERC20Abi = [
  {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}
 ] as const;

const getChainFromId = (chainId: number) => {
  switch (chainId) {
    case 1:
      return mainnet;
    case 8453:
      return base;
    default:
      throw new Error(`Chain ID ${chainId} not supported`);
  }
}

const getTransport = (chainId: number) => {
  switch (chainId) {
    case 8453:
      return http(alchemyApiKey
          ? `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
          : undefined,);
    case 1:
      return http(alchemyApiKey
        ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
        : undefined,);
    default:
      return http();
  }
}
// Helper function to get the right client based on chainId
export const getClientForChain = (chainId: number) => {
  return createPublicClient({
    chain: getChainFromId(chainId),
    transport: getTransport(chainId),
  });
};


export async function getNftDetails(contractAddress: Address, instanceId: string, tokenId: string, chainId: number) {
  
  
  const client = getClientForChain(chainId);
  let claim: Claim | undefined;
  let instance: bigint | undefined = instanceId ? BigInt(instanceId) : undefined;
  let erc20Symbol: string | undefined;
  let erc20Decimals: number | undefined;
  let fee: bigint | undefined;
  try{
    const extensionContractAddresses = await client.readContract({
      address: contractAddress,
      abi: manifoldERC1155Abi,
      functionName: "getExtensions",
    });
    if(extensionContractAddresses.length > 0 && extensionContractAddresses.includes("0x26BBEA7803DcAc346D5F5f135b57Cf2c752A02bE")){
      if(instanceId){
    claim = await client.readContract({
      address: "0x26BBEA7803DcAc346D5F5f135b57Cf2c752A02bE",
      abi: manifoldERC1155ExtensionAbi,
      functionName: "getClaim",
      args: [contractAddress, BigInt(instanceId)],
    });}else{
      const data = await client.readContract({
        address: "0x26BBEA7803DcAc346D5F5f135b57Cf2c752A02bE",
        abi: manifoldERC1155ExtensionAbi,
        functionName: "getClaimForToken",
        args: [contractAddress, BigInt(tokenId)],
      });
     
      instance = BigInt(data[0]);
      claim = data[1] as Claim;
    }
    fee = await client.readContract({
      address: "0x26BBEA7803DcAc346D5F5f135b57Cf2c752A02bE",
      abi: manifoldERC1155ExtensionAbi,
      functionName: "MINT_FEE",
    });
  }else{
    if(instanceId){
    claim = await client.readContract({
      address: extensionContractAddresses[0],
      abi: manifoldERC1155ExtensionAbi,
      functionName: "getClaim",
      args: [contractAddress, BigInt(instanceId)],
    });
  }else{
    const data = await client.readContract({
      address: extensionContractAddresses[0],
      abi: manifoldERC1155ExtensionAbi,
      functionName: "getClaimForToken",
      args: [contractAddress, BigInt(tokenId)],
    });
    instance = BigInt(data[0]);
    claim = data[1] as Claim;
  }
  fee = await client.readContract({
    address: extensionContractAddresses[0],
    abi: manifoldERC1155ExtensionAbi,
    functionName: "MINT_FEE",
  });
  }

  if(claim && claim.erc20 && claim?.erc20 !== "0x0000000000000000000000000000000000000000"){
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
      extenstionContractAddress: extensionContractAddresses.includes("0x26BBEA7803DcAc346D5F5f135b57Cf2c752A02bE") ? "0x26BBEA7803DcAc346D5F5f135b57Cf2c752A02bE" : extensionContractAddresses[0],
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