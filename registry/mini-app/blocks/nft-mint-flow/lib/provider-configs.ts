import { type Address } from "viem";
import type { ProviderConfig } from "./types";
import { MANIFOLD_ABI, KNOWN_CONTRACTS, PRICE_DISCOVERY_ABI, MINT_ABI } from "@/registry/mini-app/lib/nft-standards";

// Create a combined Manifold extension ABI for provider config
const manifoldExtensionAbi = [
  ...MANIFOLD_ABI.extension.getClaim,
  ...MANIFOLD_ABI.extension.mint,
  ...MANIFOLD_ABI.extension.fees
] as const;

export const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  manifold: {
    name: "manifold",
    extensionAddresses: [
      KNOWN_CONTRACTS.manifoldExtension, // Known Manifold extension
    ],
    priceDiscovery: {
      abis: [manifoldExtensionAbi],
      functionNames: ["MINT_FEE"],
      requiresInstanceId: true
    },
    mintConfig: {
      abi: manifoldExtensionAbi,
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