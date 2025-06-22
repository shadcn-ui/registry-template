import type { Address } from "viem";

export type NFTProvider = "manifold" | "opensea" | "zora" | "generic";

export interface ProviderConfig {
  name: NFTProvider;
  detectPattern?: RegExp;
  extensionAddresses?: Address[];
  priceDiscovery: PriceDiscoveryConfig;
  mintConfig: MintConfig;
  requiredParams: string[];
  supportsERC20: boolean;
}

export interface PriceDiscoveryConfig {
  abis: any[];
  functionNames: string[];
  requiresInstanceId?: boolean;
}

export interface MintConfig {
  abi: any;
  functionName: string;
  buildArgs: (params: MintParams) => any[];
  calculateValue: (price: bigint, params: MintParams) => bigint;
}

export interface MintParams {
  contractAddress: Address;
  chainId: number;
  provider?: NFTProvider;
  amount?: number;
  instanceId?: string;
  tokenId?: string;
  recipient?: Address;
  merkleProof?: string[];
}

export interface NFTContractInfo {
  provider: NFTProvider;
  isERC1155: boolean;
  isERC721: boolean;
  extensionAddress?: Address;
  hasManifoldExtension?: boolean;
  mintPrice?: bigint;
  erc20Token?: Address;
  erc20Symbol?: string;
  erc20Decimals?: number;
  claim?: {
    cost: bigint;
    merkleRoot: `0x${string}`;
    erc20: Address;
    startDate: number;
    endDate: number;
    walletMax: number;
  };
}

export interface ValidationResult {
  isValid: boolean;
  missingParams: string[];
  errors: string[];
  warnings: string[];
}