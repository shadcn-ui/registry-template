import type { 
  AbstractRpcRequest, 
  AbstractRpcResponse, 
  OptimisticTransactionResponse 
} from "./types"

const ABSTRACT_API_URL = "https://api.testnet.abs.xyz"

export async function sendRawTransactionWithDetailedOutput(
  signedTransaction: `0x${string}`
): Promise<OptimisticTransactionResponse> {
  const request: AbstractRpcRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "unstable_sendRawTransactionWithDetailedOutput",
    params: [signedTransaction],
  }

  const response = await fetch(ABSTRACT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data: AbstractRpcResponse = await response.json()

  if (data.error) {
    // Parse common error messages to make them more user-friendly
    const errorMessage = data.error.message || ""
    
    let humanReadableError = ""

    if (errorMessage.includes("insufficient funds")) {
      humanReadableError = "ETH balance too low."
    } else if (errorMessage.includes("known transaction")) {
      humanReadableError = "Nonce issue. Please refresh."
    } else if (errorMessage.includes("nonce too low")) {
      humanReadableError = "Nonce issue. Please refresh."
    } else if (errorMessage.includes("gas required exceeds allowance")) {
      humanReadableError = "Gas issue. Please refresh."
    } else if (errorMessage.includes("replacement transaction underpriced")) {
      humanReadableError = "Gas issue. Please refresh."
    } else if (errorMessage.includes("max fee per gas less than block base fee")) {
      humanReadableError = "Transaction fee too low for current network conditions"
    } else {
      // For unknown errors, use a generic message with the error code
      humanReadableError = `Transaction failed (Error: ${errorMessage})`
    }

    throw new Error(humanReadableError)
  }

  if (!data.result || !data.result.transactionHash) {
    throw new Error(
      "Transaction submission did not return a transaction hash. Please try again."
    )
  }

  return data.result
}