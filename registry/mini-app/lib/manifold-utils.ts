import { type Address, type PublicClient, getAddress } from "viem";
import { MANIFOLD_ABI, KNOWN_CONTRACTS, ERC721_ABI } from "./nft-standards";

/**
 * Manifold contract utilities
 */

export interface ManifoldDetectionResult {
  isManifold: boolean;
  extensionAddress?: Address;
  extensions?: Address[];
}

export interface ManifoldClaim {
  total: number;
  totalMax: number;
  walletMax: number;
  startDate: bigint;
  endDate: bigint;
  storageProtocol: number;
  merkleRoot: `0x${string}`;
  location: string;
  tokenId: bigint;
  cost: bigint;
  paymentReceiver: Address;
  erc20: Address;
  signingAddress: Address;
}

/**
 * Detect if a contract is a Manifold contract with extensions
 */
export async function detectManifoldContract(
  client: PublicClient,
  contractAddress: Address
): Promise<ManifoldDetectionResult> {
  try {
    const extensions = await client.readContract({
      address: getAddress(contractAddress),
      abi: MANIFOLD_ABI.detection,
      functionName: "getExtensions",
    }) as Address[];
    
    if (!extensions || extensions.length === 0) {
      return { isManifold: false };
    }
    
    // Check if it has the known Manifold extension
    const knownExtension = extensions.find(
      ext => ext.toLowerCase() === KNOWN_CONTRACTS.manifoldExtension.toLowerCase()
    );
    
    return {
      isManifold: true,
      extensionAddress: knownExtension || extensions[0],
      extensions,
    };
  } catch {
    return { isManifold: false };
  }
}

/**
 * Get token URI for a Manifold NFT
 */
export async function getManifoldTokenURI(
  client: PublicClient,
  contractAddress: Address,
  tokenId: string,
  extensionAddress?: Address
): Promise<string> {
  const extension = extensionAddress || KNOWN_CONTRACTS.manifoldExtension;
  
  return await client.readContract({
    address: getAddress(extension),
    abi: MANIFOLD_ABI.extension.tokenURI,
    functionName: "tokenURI",
    args: [getAddress(contractAddress), BigInt(tokenId)],
  }) as string;
}

/**
 * Get token URI with automatic Manifold detection
 */
export async function getTokenURIWithManifoldSupport(
  client: PublicClient,
  contractAddress: Address,
  tokenId: string
): Promise<string> {
  // Try Manifold first
  const manifoldInfo = await detectManifoldContract(client, contractAddress);
  
  if (manifoldInfo.isManifold && manifoldInfo.extensionAddress) {
    try {
      return await getManifoldTokenURI(
        client,
        contractAddress,
        tokenId,
        manifoldInfo.extensionAddress
      );
    } catch (error) {
      console.warn("Failed to get Manifold tokenURI, falling back to standard", error);
    }
  }
  
  // Fallback to standard ERC721 tokenURI
  return await client.readContract({
    address: getAddress(contractAddress),
    abi: ERC721_ABI.tokenURI,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
  }) as string;
}

/**
 * Get Manifold claim information
 */
export async function getManifoldClaim(
  client: PublicClient,
  contractAddress: Address,
  instanceId: string,
  extensionAddress?: Address
): Promise<ManifoldClaim | null> {
  try {
    const extension = extensionAddress || KNOWN_CONTRACTS.manifoldExtension;
    
    const claim = await client.readContract({
      address: getAddress(extension),
      abi: MANIFOLD_ABI.extension.getClaim,
      functionName: "getClaim",
      args: [getAddress(contractAddress), BigInt(instanceId)],
    });
    
    return claim as ManifoldClaim;
  } catch {
    return null;
  }
}

/**
 * Get Manifold mint fee
 */
export async function getManifoldMintFee(
  client: PublicClient,
  extensionAddress?: Address
): Promise<bigint> {
  const extension = extensionAddress || KNOWN_CONTRACTS.manifoldExtension;
  
  try {
    return await client.readContract({
      address: getAddress(extension),
      abi: MANIFOLD_ABI.extension.fees,
      functionName: "MINT_FEE",
    }) as bigint;
  } catch {
    // Try MINT_FEE_MERKLE as fallback
    try {
      return await client.readContract({
        address: getAddress(extension),
        abi: MANIFOLD_ABI.extension.fees,
        functionName: "MINT_FEE_MERKLE",
      }) as bigint;
    } catch {
      return BigInt(0);
    }
  }
}

/**
 * Check if an address is the zero address
 */
export function isZeroAddress(address: string): boolean {
  return address === "0x0000000000000000000000000000000000000000";
}

/**
 * Format instance ID and token ID for display
 */
export function formatManifoldTokenId(instanceId: string, tokenId: string): string {
  return `${instanceId}-${tokenId}`;
}