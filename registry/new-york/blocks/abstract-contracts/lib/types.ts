export interface ContractAddress {
  mainnet?: string
  testnet?: string
}

export interface ContractInfo {
  name: string
  description: string
  addresses: ContractAddress
  abi?: any[] // ABI will be populated manually
  category: 'token' | 'dex' | 'utility'
}

export interface ContractsConfig {
  tokens: Record<string, ContractInfo>
  dex: Record<string, ContractInfo>
}

export type NetworkId = 2741 | 11124 // Abstract mainnet | Abstract testnet

export interface UseContractAddressOptions {
  chainId?: NetworkId
  throwOnMissing?: boolean
}