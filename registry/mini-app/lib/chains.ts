import { http, type Chain, type PublicClient, createPublicClient } from "viem";
import * as chains from "viem/chains";

/**
 * Supported chains configuration with Alchemy RPC support
 */
export const SUPPORTED_CHAINS = [
  { id: 1, chain: chains.mainnet, alchemyPrefix: "eth-mainnet" },
  { id: 8453, chain: chains.base, alchemyPrefix: "base-mainnet" },
  { id: 42161, chain: chains.arbitrum, alchemyPrefix: "arb-mainnet" },
  { id: 421614, chain: chains.arbitrumSepolia, alchemyPrefix: "arb-sepolia" },
  { id: 84532, chain: chains.baseSepolia, alchemyPrefix: "base-sepolia" },
  { id: 666666666, chain: chains.degen, alchemyPrefix: "degen-mainnet" },
  { id: 100, chain: chains.gnosis, alchemyPrefix: "gnosis-mainnet" },
  { id: 10, chain: chains.optimism, alchemyPrefix: "opt-mainnet" },
  { id: 11155420, chain: chains.optimismSepolia, alchemyPrefix: "opt-sepolia" },
  { id: 137, chain: chains.polygon, alchemyPrefix: "polygon-mainnet" },
  { id: 11155111, chain: chains.sepolia, alchemyPrefix: "eth-sepolia" },
  { id: 7777777, chain: chains.zora, alchemyPrefix: "zora-mainnet" },
  { id: 130, chain: chains.ham, alchemyPrefix: "unichain-mainnet" }, // Unichain
  {
    id: 10143,
    chain: {
      id: 10143,
      name: "Monad Testnet",
      network: "monad-testnet",
      nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
      rpcUrls: {
        default: { http: ["https://testnet.monad.xyz"] },
        public: { http: ["https://testnet.monad.xyz"] },
      },
    } as const,
    alchemyPrefix: null,
  },
  { id: 42220, chain: chains.celo, alchemyPrefix: null },
] as const;

/**
 * Get viem Chain object by ID
 */
export function getChainById(chainId: number): Chain {
  const config = SUPPORTED_CHAINS.find((c) => c.id === chainId);
  return config?.chain || chains.mainnet;
}

/**
 * Get HTTP transport with optional Alchemy RPC URL
 * Falls back to public RPC if no Alchemy key is available
 */
export function getTransport(chainId: number) {
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
  const config = SUPPORTED_CHAINS.find((c) => c.id === chainId);

  if (config?.alchemyPrefix && alchemyKey) {
    return http(
      `https://${config.alchemyPrefix}.g.alchemy.com/v2/${alchemyKey}`,
    );
  }

  // Fallback to default public RPC
  return http();
}

/**
 * Create a public client for a specific chain with optimal transport
 */
export function getPublicClient(chainId: number): PublicClient {
  return createPublicClient({
    chain: getChainById(chainId),
    transport: getTransport(chainId),
  }) as PublicClient;
}

/**
 * Find chain by network name (case-insensitive)
 */
export function findChainByName(networkName: string): Chain | undefined {
  const normalizedName = networkName.toLowerCase().trim();
  
  // Direct name mappings
  const nameToId: Record<string, number> = {
    ethereum: 1,
    mainnet: 1,
    base: 8453,
    arbitrum: 42161,
    "arbitrum one": 42161,
    "arbitrum sepolia": 421614,
    "base sepolia": 84532,
    degen: 666666666,
    gnosis: 100,
    optimism: 10,
    "optimism sepolia": 11155420,
    polygon: 137,
    sepolia: 11155111,
    "ethereum sepolia": 11155111,
    zora: 7777777,
    unichain: 130,
    ham: 130,
    "monad testnet": 10143,
    monad: 10143,
    celo: 42220,
  };
  
  const chainId = nameToId[normalizedName];
  return chainId ? getChainById(chainId) : undefined;
}
