export interface OptimisticTransactionResponse {
  transactionHash: `0x${string}`
  storageLogs: StorageLog[]
  events: OptimisticEvent[]
}

export interface StorageLog {
  address: `0x${string}`
  key: `0x${string}`
  writtenValue: `0x${string}`
}

export interface OptimisticEvent {
  address: `0x${string}`
  topics: `0x${string}`[]
  data: `0x${string}`
  blockHash: null
  blockNumber: null
  l1BatchNumber: `0x${string}`
  transactionHash: `0x${string}`
  transactionIndex: `0x${string}`
  logIndex: null
  transactionLogIndex: null
  logType: null
  removed: false
}

export interface AbstractRpcRequest {
  jsonrpc: "2.0"
  id: number
  method: "unstable_sendRawTransactionWithDetailedOutput"
  params: [string] // signed transaction hex
}

export interface AbstractRpcResponse {
  jsonrpc: "2.0"
  id: number
  result?: OptimisticTransactionResponse
  error?: {
    code: number
    message: string
  }
}

