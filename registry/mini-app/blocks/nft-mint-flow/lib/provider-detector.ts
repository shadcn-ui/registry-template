import { type Address, type PublicClient } from "viem";
import type { NFTProvider, NFTContractInfo, MintParams } from "./types";
import { PROVIDER_CONFIGS } from "./provider-configs";
import { getPublicClient } from "@/registry/mini-app/lib/chains";
import { 
  ERC165_ABI, 
  INTERFACE_IDS, 
  MANIFOLD_ABI 
} from "@/registry/mini-app/lib/nft-standards";

// Re-export from shared library for backward compatibility
export const getClientForChain = getPublicClient;

/**
 * Detects NFT provider and contract info with minimal RPC calls
 * Uses multicall where possible to batch requests
 */
export async function detectNFTProvider(params: MintParams): Promise<NFTContractInfo> {
  const { contractAddress, chainId, provider: specifiedProvider } = params;
  const client = getClientForChain(chainId);

  // If provider is specified, use known configuration
  if (specifiedProvider) {
    const config = PROVIDER_CONFIGS[specifiedProvider];
    
    // For Manifold, we know the extension address
    if (specifiedProvider === "manifold" && config.extensionAddresses?.[0]) {
      return {
        provider: "manifold",
        isERC1155: true,  // Manifold contracts are typically ERC1155
        isERC721: false,
        extensionAddress: config.extensionAddresses[0],
        hasManifoldExtension: true
      };
    }
    
    // For other providers, return basic info
    return {
      provider: specifiedProvider,
      isERC1155: false,
      isERC721: false
    };
  }

  try {
    // Batch 1: Check interfaces and Manifold extensions in parallel
    const [isERC721, isERC1155, extensions] = await Promise.all([
      client.readContract({
        address: contractAddress,
        abi: ERC165_ABI,
        functionName: "supportsInterface",
        args: [INTERFACE_IDS.ERC721]
      }).catch(() => false),
      
      client.readContract({
        address: contractAddress,
        abi: ERC165_ABI,
        functionName: "supportsInterface",
        args: [INTERFACE_IDS.ERC1155]
      }).catch(() => false),
      
      client.readContract({
        address: contractAddress,
        abi: MANIFOLD_ABI.detection,
        functionName: "getExtensions"
      }).catch(() => null)
    ]);

    // Check if it's a Manifold contract
    if (extensions && extensions.length > 0) {
      const knownManifoldExtension = extensions.find(ext => 
        PROVIDER_CONFIGS.manifold.extensionAddresses?.includes(ext)
      );
      
      if (knownManifoldExtension || extensions.length > 0) {
        return {
          provider: "manifold",
          isERC1155: isERC1155 as boolean,
          isERC721: isERC721 as boolean,
          extensionAddress: knownManifoldExtension || extensions[0],
          hasManifoldExtension: true
        };
      }
    }

    // TODO: Add detection for OpenSea, Zora, etc.
    // For now, return generic
    return {
      provider: "generic",
      isERC1155: isERC1155 as boolean,
      isERC721: isERC721 as boolean
    };

  } catch (error) {
    console.error("Error detecting NFT provider:", error);
    // Default to generic provider
    return {
      provider: "generic",
      isERC1155: false,
      isERC721: false
    };
  }
}

/**
 * Validates parameters based on detected provider
 */
export function validateParameters(params: MintParams, contractInfo: NFTContractInfo): {
  isValid: boolean;
  missingParams: string[];
  errors: string[];
} {
  const config = PROVIDER_CONFIGS[contractInfo.provider];
  const missingParams: string[] = [];
  const errors: string[] = [];

  // Check required params for the provider
  for (const param of config.requiredParams) {
    if (!params[param as keyof MintParams]) {
      missingParams.push(param);
    }
  }

  // Provider-specific validation
  if (contractInfo.provider === "manifold") {
    if (!params.instanceId && !params.tokenId) {
      errors.push("Manifold NFTs require either instanceId or tokenId");
      missingParams.push("instanceId or tokenId");
    }
    
    if (contractInfo.claim?.merkleRoot && contractInfo.claim.merkleRoot !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
      errors.push("This NFT requires a merkle proof for minting - not supported yet");
    }
  }

  return {
    isValid: missingParams.length === 0 && errors.length === 0,
    missingParams,
    errors
  };
}