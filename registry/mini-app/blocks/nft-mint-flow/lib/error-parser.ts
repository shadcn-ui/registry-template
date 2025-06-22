export type ErrorType = 
  | "insufficient-funds"
  | "wrong-network" 
  | "user-rejected"
  | "contract-error"
  | "allowance-error"
  | "network-error"
  | "unknown";

export interface ParsedError {
  type: ErrorType;
  message: string;
  details?: string;
  actionText?: string;
  action?: () => void;
}

/**
 * Parse blockchain errors into user-friendly messages with actionable next steps
 */
export function parseError(error: unknown, context: "approval" | "mint"): ParsedError {
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  
  // User rejected transaction
  if (errorMessage.includes("user rejected") || errorMessage.includes("user denied")) {
    return {
      type: "user-rejected",
      message: "Transaction cancelled",
      details: "You rejected the transaction in your wallet",
      actionText: "Try again"
    };
  }
  
  // Insufficient funds
  if (
    errorMessage.includes("insufficient funds") ||
    errorMessage.includes("insufficient balance") ||
    errorMessage.includes("not enough") ||
    errorMessage.includes("exceeds balance")
  ) {
    return {
      type: "insufficient-funds",
      message: "Insufficient funds",
      details: context === "approval" 
        ? "You don't have enough tokens to approve this amount"
        : "You don't have enough funds to complete this transaction. Check both token balance and ETH for gas.",
      actionText: "Check wallet balance"
    };
  }
  
  // Wrong network
  if (
    errorMessage.includes("network") ||
    errorMessage.includes("chain") ||
    errorMessage.includes("chainid")
  ) {
    return {
      type: "wrong-network",
      message: "Wrong network",
      details: "Please switch to the correct network in your wallet",
      actionText: "Switch network"
    };
  }
  
  // Contract errors
  if (
    errorMessage.includes("revert") ||
    errorMessage.includes("execution reverted") ||
    errorMessage.includes("contract error")
  ) {
    // Try to extract revert reason
    let details = "The contract rejected this transaction.";
    
    if (errorMessage.includes("sold out") || errorMessage.includes("max supply")) {
      details = "This NFT is sold out or has reached maximum supply.";
    } else if (errorMessage.includes("not started") || errorMessage.includes("not active")) {
      details = "Minting hasn't started yet or has ended.";
    } else if (errorMessage.includes("max per wallet") || errorMessage.includes("exceeds max")) {
      details = "You've reached the maximum amount allowed per wallet.";
    } else if (errorMessage.includes("allowlist") || errorMessage.includes("not eligible")) {
      details = "You're not eligible to mint this NFT. Check if it requires an allowlist.";
    }
    
    return {
      type: "contract-error",
      message: "Transaction failed",
      details,
      actionText: "Try again later"
    };
  }
  
  // Allowance errors
  if (errorMessage.includes("allowance") || errorMessage.includes("approve")) {
    return {
      type: "allowance-error",
      message: "Approval required",
      details: "You need to approve the contract to spend your tokens first",
      actionText: "Approve tokens"
    };
  }
  
  // Network/RPC errors
  if (
    errorMessage.includes("timeout") ||
    errorMessage.includes("network") ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("rpc")
  ) {
    return {
      type: "network-error",
      message: "Network error",
      details: "Connection issue with the blockchain. This is usually temporary.",
      actionText: "Try again"
    };
  }
  
  // Generic fallback
  return {
    type: "unknown",
    message: "Transaction failed",
    details: error instanceof Error ? error.message : "An unexpected error occurred",
    actionText: "Try again"
  };
}