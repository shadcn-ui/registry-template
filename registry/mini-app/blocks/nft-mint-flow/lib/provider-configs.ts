import { type Address } from "viem";
import type { ProviderConfig } from "@/registry/mini-app/blocks/nft-mint-flow/lib/types";
import { MANIFOLD_EXTENSION_ABI, KNOWN_CONTRACTS, PRICE_DISCOVERY_ABI, MINT_ABI } from "@/registry/mini-app/lib/nft-standards";

export const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  manifold: {
    name: "manifold",
    extensionAddresses: [
      KNOWN_CONTRACTS.manifoldExtension, // Known Manifold extension
    ],
    priceDiscovery: {
      abis: [MANIFOLD_EXTENSION_ABI],
      functionNames: ["MINT_FEE"],
      requiresInstanceId: true
    },
    mintConfig: {
      abi: MANIFOLD_EXTENSION_ABI,
      functionName: "mint",
      buildArgs: (params) => [
        params.contractAddress,
        BigInt(params.instanceId || "0"),
        Number(params.tokenId || "0"),
        params.merkleProof || [],
        params.recipient
      ],
      calculateValue: (mintFee, params) => {
        // For Manifold, value is just the mint fee
        // The actual NFT cost might be in ERC20
        return mintFee;
      }
    },
    requiredParams: ["contractAddress", "chainId"],
    supportsERC20: true
  },
  
  opensea: {
    name: "opensea",
    priceDiscovery: {
      abis: [PRICE_DISCOVERY_ABI],
      functionNames: ["mintPrice", "price", "publicMintPrice"]
    },
    mintConfig: {
      abi: MINT_ABI,
      functionName: "mint",
      buildArgs: (params) => [BigInt(params.amount || 1)],
      calculateValue: (price, params) => price * BigInt(params.amount || 1)
    },
    requiredParams: ["contractAddress", "chainId"],
    supportsERC20: false
  },

  zora: {
    name: "zora",
    priceDiscovery: {
      abis: [PRICE_DISCOVERY_ABI],
      functionNames: ["mintPrice", "price"]
    },
    mintConfig: {
      abi: MINT_ABI,
      functionName: "mint",
      buildArgs: (params) => [params.recipient, BigInt(params.amount || 1)],
      calculateValue: (price, params) => price * BigInt(params.amount || 1)
    },
    requiredParams: ["contractAddress", "chainId"],
    supportsERC20: false
  },

  generic: {
    name: "generic",
    priceDiscovery: {
      abis: [PRICE_DISCOVERY_ABI],
      functionNames: ["mintPrice", "price", "MINT_PRICE", "getMintPrice"]
    },
    mintConfig: {
      abi: MINT_ABI,
      functionName: "mint",
      buildArgs: (params) => [BigInt(params.amount || 1)],
      calculateValue: (price, params) => price * BigInt(params.amount || 1)
    },
    requiredParams: ["contractAddress", "chainId"],
    supportsERC20: false
  }
};

// Helper to get config by provider name
export function getProviderConfig(provider: string): ProviderConfig {
  return PROVIDER_CONFIGS[provider] || PROVIDER_CONFIGS.generic;
}