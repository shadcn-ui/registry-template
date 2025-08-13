import type { ContractsConfig } from "./types"

// TODO: Add ABIs manually for each contract below
// Each contract has a placeholder for its ABI that can be populated

// WETH9 ABI - TODO: Add ABI here
const WETH9_ABI = [
  // TODO: Add WETH9 ABI array here
  // Standard ERC20 + deposit/withdraw functions
]

// USDC ABI - TODO: Add ABI here  
const USDC_ABI = [
  // TODO: Add USDC ABI array here
  // Standard ERC20 functions
]

// USDT ABI - TODO: Add ABI here
const USDT_ABI = [
  // TODO: Add USDT ABI array here
  // Standard ERC20 functions (note: USDT has some non-standard behaviors)
]

// UniswapV2Factory ABI - TODO: Add ABI here
const UNISWAP_V2_FACTORY_ABI = [
  // TODO: Add UniswapV2Factory ABI array here
  // createPair, getPair, allPairs, etc.
]

// UniswapV2Router02 ABI - TODO: Add ABI here
const UNISWAP_V2_ROUTER_ABI = [
  // TODO: Add UniswapV2Router02 ABI array here
  // swapExactTokensForTokens, addLiquidity, removeLiquidity, etc.
]

// UniswapV3Factory ABI - TODO: Add ABI here
const UNISWAP_V3_FACTORY_ABI = [
  // TODO: Add UniswapV3Factory ABI array here
  // createPool, getPool, etc.
]

// QuoterV2 ABI - TODO: Add ABI here
const QUOTER_V2_ABI = [
  // TODO: Add QuoterV2 ABI array here
  // quoteExactInputSingle, quoteExactInput, etc.
]

// SwapRouter02 ABI - TODO: Add ABI here
const SWAP_ROUTER_02_ABI = [
  // TODO: Add SwapRouter02 ABI array here
  // exactInputSingle, exactInput, etc.
]

export const ABSTRACT_CONTRACTS: ContractsConfig = {
  tokens: {
    weth: {
      name: "Wrapped Ether",
      description: "WETH9 - Wrapped Ether contract for Abstract",
      addresses: {
        mainnet: "0x3439153EB7AF838Ad19d56E1571FBD09333C2809",
        testnet: "0x9EDCde0257F2386Ce177C3a7FCdd97787F0D841d"
      },
      abi: WETH9_ABI,
      category: "token"
    },
    usdc: {
      name: "USD Coin", 
      description: "USDC - Circle's stablecoin on Abstract",
      addresses: {
        mainnet: "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
        testnet: "0xe4C7fBB0a626ed208021ccabA6Be1566905E2dFc"
      },
      abi: USDC_ABI,
      category: "token"
    },
    usdt: {
      name: "Tether USD",
      description: "USDT - Tether's stablecoin on Abstract",
      addresses: {
        mainnet: "0x0709F39376dEEe2A2dfC94A58EdEb2Eb9DF012bD"
        // Note: No testnet address available
      },
      abi: USDT_ABI,
      category: "token"
    }
  },
  dex: {
    uniswapV2Factory: {
      name: "Uniswap V2 Factory",
      description: "Factory contract for creating Uniswap V2 pairs",
      addresses: {
        mainnet: "0x566d7510dEE58360a64C9827257cF6D0Dc43985E",
        testnet: "0x566d7510dEE58360a64C9827257cF6D0Dc43985E"
      },
      abi: UNISWAP_V2_FACTORY_ABI,
      category: "dex"
    },
    uniswapV2Router: {
      name: "Uniswap V2 Router02",
      description: "Router contract for Uniswap V2 swaps and liquidity",
      addresses: {
        mainnet: "0xad1eCa41E6F772bE3cb5A48A6141f9bcc1AF9F7c",
        testnet: "0x96ff7D9dbf52FdcAe79157d3b249282c7FABd409"
      },
      abi: UNISWAP_V2_ROUTER_ABI,
      category: "dex"
    },
    uniswapV3Factory: {
      name: "Uniswap V3 Factory", 
      description: "Factory contract for creating Uniswap V3 pools",
      addresses: {
        mainnet: "0xA1160e73B63F322ae88cC2d8E700833e71D0b2a1",
        testnet: "0x2E17FF9b877661bDFEF8879a4B31665157a960F0"
      },
      abi: UNISWAP_V3_FACTORY_ABI,
      category: "dex"
    },
    quoterV2: {
      name: "Quoter V2",
      description: "Uniswap V3 quoter for getting swap quotes",
      addresses: {
        mainnet: "0x728BD3eC25D5EDBafebB84F3d67367Cd9EBC7693",
        testnet: "0xdE41045eb15C8352413199f35d6d1A32803DaaE2"
      },
      abi: QUOTER_V2_ABI,
      category: "dex"
    },
    swapRouter02: {
      name: "Swap Router 02",
      description: "Uniswap V3 router for executing swaps",
      addresses: {
        mainnet: "0x7712FA47387542819d4E35A23f8116C90C18767C", 
        testnet: "0xb9D4347d129a83cBC40499Cd4fF223dE172a70dF"
      },
      abi: SWAP_ROUTER_02_ABI,
      category: "dex"
    }
  }
}

// Export individual ABIs for easy importing
export {
  WETH9_ABI,
  USDC_ABI, 
  USDT_ABI,
  UNISWAP_V2_FACTORY_ABI,
  UNISWAP_V2_ROUTER_ABI,
  UNISWAP_V3_FACTORY_ABI,
  QUOTER_V2_ABI,
  SWAP_ROUTER_02_ABI
}