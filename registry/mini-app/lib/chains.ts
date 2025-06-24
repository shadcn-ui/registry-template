import { http, type Chain, type PublicClient, createPublicClient } from "viem";
import * as chains from "viem/chains";

/**
 * Centralized chain configuration with Alchemy RPC support
 * Maps chain IDs to their Alchemy subdomain prefixes
 */
export const ALCHEMY_CHAIN_CONFIGS: Record<number, { name: string; url: string | null }> = {
  1: { name: 'ethereum', url: 'eth-mainnet' },
  10: { name: 'optimism', url: 'opt-mainnet' },
  137: { name: 'polygon', url: 'polygon-mainnet' },
  8453: { name: 'base', url: 'base-mainnet' },
  42161: { name: 'arbitrum', url: 'arb-mainnet' },
  7777777: { name: 'zora', url: null }, // No Alchemy support
} as const;

/**
 * Get viem Chain object by ID
 */
export function getChainById(chainId: number): Chain {
  switch (chainId) {
    case 1:
      return chains.mainnet;
    case 10:
      return chains.optimism;
    case 137:
      return chains.polygon;
    case 8453:
      return chains.base;
    case 42161:
      return chains.arbitrum;
    case 7777777:
      return chains.zora;
    default:
      // Try to find in all chains
      const chain = Object.values(chains).find(
        (c): c is Chain => typeof c === 'object' && c !== null && 'id' in c && c.id === chainId
      );
      return chain || chains.mainnet;
  }
}

/**
 * Get HTTP transport with optional Alchemy RPC URL
 * Falls back to public RPC if no Alchemy key is available
 */
export function getTransport(chainId: number) {
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
  const config = ALCHEMY_CHAIN_CONFIGS[chainId];
  
  if (config?.url && alchemyKey) {
    return http(`https://${config.url}.g.alchemy.com/v2/${alchemyKey}`);
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
 * Get all available chains mapped by normalized name
 */
export function getAvailableChains(): Record<string, Chain> {
  const availableChains: Record<string, Chain> = {};
  
  Object.entries(chains).forEach(([name, chain]) => {
    if (typeof chain === "object" && chain !== null && "id" in chain) {
      availableChains[name.toLowerCase()] = chain as Chain;
    }
  });
  
  return availableChains;
}

/**
 * Find chain by network name (fuzzy match)
 */
export function findChainByName(networkName: string): Chain | undefined {
  const normalizedName = networkName.toLowerCase().replace(/[\s-]/g, "");
  const availableChains = getAvailableChains();
  
  // Try exact match first
  if (availableChains[normalizedName]) {
    return availableChains[normalizedName];
  }
  
  // Try partial match
  const matchingChainName = Object.keys(availableChains).find(
    (chainName) =>
      chainName.includes(normalizedName) ||
      normalizedName.includes(chainName)
  );
  
  return matchingChainName ? availableChains[matchingChainName] : undefined;
}