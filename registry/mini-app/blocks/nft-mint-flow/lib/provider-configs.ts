import { type Address } from "viem";
import type { ProviderConfig } from "./types";

// Manifold Extension ABIs
const manifoldExtensionAbi = [
  {
    inputs: [
      { internalType: "address", name: "creatorContractAddress", type: "address" },
      { internalType: "uint256", name: "instanceId", type: "uint256" }
    ],
    name: "getClaim",
    outputs: [
      {
        components: [
          { internalType: "uint32", name: "total", type: "uint32" },
          { internalType: "uint32", name: "totalMax", type: "uint32" },
          { internalType: "uint32", name: "walletMax", type: "uint32" },
          { internalType: "uint48", name: "startDate", type: "uint48" },
          { internalType: "uint48", name: "endDate", type: "uint48" },
          { internalType: "uint8", name: "storageProtocol", type: "uint8" },
          { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
          { internalType: "string", name: "location", type: "string" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "cost", type: "uint256" },
          { internalType: "address", name: "paymentReceiver", type: "address" },
          { internalType: "address", name: "erc20", type: "address" },
          { internalType: "address", name: "signingAddress", type: "address" }
        ],
        internalType: "struct Claim",
        name: "claim",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "creatorContractAddress", type: "address" },
      { internalType: "uint256", name: "instanceId", type: "uint256" },
      { internalType: "uint32", name: "mintIndex", type: "uint32" },
      { internalType: "bytes32[]", name: "merkleProof", type: "bytes32[]" },
      { internalType: "address", name: "mintFor", type: "address" }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "MINT_FEE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

// Generic NFT price discovery ABIs
const genericPriceAbi = [
  {
    inputs: [],
    name: "mintPrice",
    outputs: [{ type: "uint256", name: "price" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "price",
    outputs: [{ type: "uint256", name: "price" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "MINT_PRICE",
    outputs: [{ type: "uint256", name: "price" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getMintPrice",
    outputs: [{ type: "uint256", name: "price" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

// Generic mint ABI
const genericMintAbi = [
  {
    name: "mint",
    type: "function",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "payable"
  },
  {
    name: "mint",
    type: "function",
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "payable"
  },
  {
    name: "publicMint",
    type: "function",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "payable"
  }
] as const;

export const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  manifold: {
    name: "manifold",
    extensionAddresses: [
      "0x26BBEA7803DcAc346D5F5f135b57Cf2c752A02bE" as Address, // Known Manifold extension
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
      abis: [genericPriceAbi],
      functionNames: ["mintPrice", "price", "publicMintPrice"]
    },
    mintConfig: {
      abi: genericMintAbi,
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
      abis: [genericPriceAbi],
      functionNames: ["mintPrice", "price"]
    },
    mintConfig: {
      abi: genericMintAbi,
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
      abis: [genericPriceAbi],
      functionNames: ["mintPrice", "price", "MINT_PRICE", "getMintPrice"]
    },
    mintConfig: {
      abi: genericMintAbi,
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