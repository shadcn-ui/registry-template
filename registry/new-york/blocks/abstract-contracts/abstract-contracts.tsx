// Re-export the contracts configuration and utilities
export { ABSTRACT_CONTRACTS } from "./lib/contracts"
export { getContract, getContractAddress, ABSTRACT_NETWORKS } from "./lib/utils"
export type { NetworkId, ContractInfo, ContractsConfig } from "./lib/types"

// Export individual ABIs
export {
  WETH9_ABI,
  USDC_ABI,
  USDT_ABI,
  UNISWAP_V2_FACTORY_ABI,
  UNISWAP_V2_ROUTER_ABI,
  UNISWAP_V3_FACTORY_ABI,
  QUOTER_V2_ABI,
  SWAP_ROUTER_02_ABI
} from "./lib/contracts"