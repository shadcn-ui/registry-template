import type { NFTContractInfo } from "./types";

export type MintStep = "initial" | "detecting" | "sheet" | "connecting" | "approve" | "approving" | "minting" | "waiting" | "success" | "error" | "validation-error";

export type TransactionType = "approval" | "mint" | null;

export type MintState = {
  step: MintStep;
  contractInfo: NFTContractInfo | null;
  priceData: {
    mintPrice?: bigint;
    totalCost: bigint;
    erc20Details?: {
      address: string;
      symbol: string;
      decimals: number;
      allowance?: bigint;
      needsApproval?: boolean;
    };
  };
  error?: string;
  txHash?: string;
  txType: TransactionType;
  isLoading: boolean;
  validationErrors: string[];
};

export const initialState: MintState = {
  step: "initial",
  contractInfo: null,
  priceData: { totalCost: BigInt(0) },
  error: undefined,
  txHash: undefined,
  txType: null,
  isLoading: false,
  validationErrors: []
};

export type MintAction = 
  | { type: "DETECT_START" }
  | { type: "DETECT_SUCCESS"; payload: { contractInfo: NFTContractInfo; priceData: MintState["priceData"] } }
  | { type: "DETECT_ERROR"; payload: string }
  | { type: "VALIDATION_ERROR"; payload: string[] }
  | { type: "APPROVE_REQUIRED" }
  | { type: "APPROVE_START" }
  | { type: "APPROVE_TX_SUBMITTED"; payload: string }
  | { type: "APPROVE_SUCCESS" }
  | { type: "CONNECT_START" }
  | { type: "CONNECT_SUCCESS" }
  | { type: "MINT_START" }
  | { type: "MINT_TX_SUBMITTED"; payload: string }
  | { type: "TX_SUCCESS"; payload: string }
  | { type: "TX_ERROR"; payload: string }
  | { type: "RESET" }
  | { type: "UPDATE_ALLOWANCE"; payload: bigint };

export function mintReducer(state: MintState, action: MintAction): MintState {
  switch (action.type) {
    case "DETECT_START":
      return { ...state, step: "detecting", isLoading: true, error: undefined };
      
    case "DETECT_SUCCESS":
      // Check if approval is needed based on allowance
      const needsApproval = action.payload.priceData.erc20Details && 
        action.payload.contractInfo.claim &&
        (action.payload.priceData.erc20Details.allowance !== undefined) &&
        (action.payload.priceData.erc20Details.allowance < action.payload.contractInfo.claim.cost);
        
      return {
        ...state,
        step: needsApproval ? "approve" : "sheet",
        contractInfo: action.payload.contractInfo,
        priceData: {
          ...action.payload.priceData,
          erc20Details: action.payload.priceData.erc20Details ? {
            ...action.payload.priceData.erc20Details,
            needsApproval
          } : undefined
        },
        isLoading: false
      };
      
    case "DETECT_ERROR":
      return { ...state, step: "error", error: action.payload, isLoading: false };
      
    case "VALIDATION_ERROR":
      return { ...state, step: "validation-error", validationErrors: action.payload, isLoading: false };
      
    case "APPROVE_REQUIRED":
      return { ...state, step: "approve" };
      
    case "APPROVE_START":
      return { ...state, step: "approving", isLoading: true, txType: "approval" };
      
    case "APPROVE_TX_SUBMITTED":
      return { ...state, step: "waiting", txHash: action.payload, txType: "approval" };
      
    case "APPROVE_SUCCESS":
      return { 
        ...state, 
        step: "sheet", 
        isLoading: false,
        txType: null,
        txHash: undefined, // Clear tx hash after approval
        priceData: {
          ...state.priceData,
          erc20Details: state.priceData.erc20Details ? {
            ...state.priceData.erc20Details,
            needsApproval: false,
            allowance: state.contractInfo?.claim?.cost || BigInt(0)
          } : undefined
        }
      };
      
    case "CONNECT_START":
      return { ...state, step: "connecting" };
      
    case "CONNECT_SUCCESS":
      return { ...state, step: "sheet" };
      
    case "MINT_START":
      return { ...state, step: "minting", isLoading: true, txType: "mint" };
      
    case "MINT_TX_SUBMITTED":
      return { ...state, step: "waiting", txHash: action.payload, txType: "mint" };
      
    case "TX_SUCCESS":
      // Only show success for mint transactions
      return state.txType === "mint" 
        ? { ...state, step: "success", txHash: action.payload, isLoading: false, txType: null }
        : state;
      
    case "TX_ERROR":
      return { ...state, step: "error", error: action.payload, isLoading: false, txType: null };
      
    case "UPDATE_ALLOWANCE":
      if (!state.priceData.erc20Details) return state;
      
      const needsApproval = state.contractInfo?.claim 
        ? action.payload < state.contractInfo.claim.cost
        : false;
        
      return {
        ...state,
        priceData: {
          ...state.priceData,
          erc20Details: {
            ...state.priceData.erc20Details,
            allowance: action.payload,
            needsApproval
          }
        }
      };
      
    case "RESET":
      return initialState;
      
    default:
      return state;
  }
}