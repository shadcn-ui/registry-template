"use client"

import { useState, useCallback } from "react"
import { useAccount, useWalletClient } from "wagmi"
import { type WriteContractParameters } from "wagmi/actions"
import { encodeFunctionData } from "viem"
import type { Abi, ContractFunctionName } from "viem"
import type { OptimisticTransactionResponse } from "../lib/types"
import { sendRawTransactionWithDetailedOutput } from "../lib/abstract-api"

type OptimisticWriteConfig<
  TConfig extends WriteContractParameters = WriteContractParameters
> = TConfig & {
  onSuccess?: (data: OptimisticTransactionResponse, startTime: number) => void
  onError?: (error: Error) => void
}

export function useOptimisticWriteContract() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const [isPending, setIsPending] = useState(false)
  const [data, setData] = useState<OptimisticTransactionResponse>()
  const [error, setError] = useState<Error>()

  const writeContract = useCallback(async <TConfig extends WriteContractParameters>(
    config: OptimisticWriteConfig<TConfig>
  ) => {
    if (!address || !walletClient) throw new Error("Wallet not connected")

    setIsPending(true)
    setError(undefined)
    setData(undefined)

    try {
      // Encode function data and prepare transaction request
      const { onSuccess, onError, ...contractParams } = config
      const txData = encodeFunctionData({
        abi: contractParams.abi as Abi,
        functionName: contractParams.functionName as ContractFunctionName<Abi>,
        args: contractParams.args as unknown[] | undefined,
      })

      const request = await walletClient.prepareTransactionRequest({
        to: contractParams.address,
        data: txData,
      })

      // Sign transaction (this triggers wallet approval popup)
      const signedTransaction = await walletClient.signTransaction(request)

      // Start timing AFTER user approval
      const startTime = Date.now()

      // Send to Abstract's optimistic endpoint
      const result = await sendRawTransactionWithDetailedOutput(signedTransaction)

      setData(result)
      config.onSuccess?.(result, startTime)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      console.error(`❌ [Optimistic] Error:`, error.message)
      setError(error)
      config.onError?.(error)
      throw error
    } finally {
      setIsPending(false)
    }
  }, [address, walletClient])

  const writeContractSync = useCallback(<TConfig extends WriteContractParameters>(
    config: OptimisticWriteConfig<TConfig>
  ) => {
    writeContract(config).catch(() => {
      // Errors already handled by onError callback and internal error state
    })
  }, [writeContract])

  const reset = useCallback(() => {
    setData(undefined)
    setError(undefined)
    setIsPending(false)
  }, [])

  return {
    writeContract: writeContractSync,
    writeContractAsync: writeContract,
    isPending,
    isLoading: isPending, // For backward compatibility
    data,
    error,
    isSuccess: !!data,
    isError: !!error,
    reset,
  }
}