import type { NetworkId, ContractAddress } from "./types"
import { ABSTRACT_CONTRACTS } from "./contracts"

export const ABSTRACT_NETWORKS = {
  MAINNET: 2741 as const,
  TESTNET: 11124 as const
} as const

export function getNetworkName(chainId: NetworkId): string {
  switch (chainId) {
    case ABSTRACT_NETWORKS.MAINNET:
      return "Abstract Mainnet"
    case ABSTRACT_NETWORKS.TESTNET:  
      return "Abstract Testnet"
    default:
      return "Unknown Network"
  }
}

export function isAbstractNetwork(chainId: number): chainId is NetworkId {
  return chainId === ABSTRACT_NETWORKS.MAINNET || chainId === ABSTRACT_NETWORKS.TESTNET
}

export function getContractAddress(
  addresses: ContractAddress, 
  chainId: NetworkId,
  throwOnMissing = false
): string | undefined {
  const address = chainId === ABSTRACT_NETWORKS.MAINNET 
    ? addresses.mainnet 
    : addresses.testnet

  if (!address && throwOnMissing) {
    const networkName = getNetworkName(chainId)
    throw new Error(`Contract address not available on ${networkName}`)
  }

  return address
}

export function getContract(contractKey: string, chainId: NetworkId, throwOnMissing = false) {
  // Find contract in both tokens and dex categories
  const contract = ABSTRACT_CONTRACTS.tokens[contractKey] || ABSTRACT_CONTRACTS.dex[contractKey]
  
  if (!contract) {
    if (throwOnMissing) {
      throw new Error(`Contract "${contractKey}" not found`)
    }
    return undefined
  }

  if (!isAbstractNetwork(chainId)) {
    if (throwOnMissing) {
      throw new Error(`Unsupported chain ID: ${chainId}. Only Abstract networks are supported.`)
    }
    return undefined
  }

  const address = getContractAddress(contract.addresses, chainId, throwOnMissing)
  
  return {
    ...contract,
    address
  }
}