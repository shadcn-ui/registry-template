"use client"

import { useState, useEffect } from "react"
import { useOptimisticWriteContract } from "@/registry/new-york/blocks/use-optimistic-write-contract/hooks/use-optimistic-write-contract"
import { Button } from "@/registry/new-york/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york/ui/card"
import { Loader2, Clock, CheckCircle, Zap } from "lucide-react"
import { usePublicClient } from "wagmi"

const EXAMPLE_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890" as const

const EXAMPLE_ABI = [
  {
    name: "increment",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: []
  }
] as const

interface PerformanceMetrics {
  optimisticTime?: number
  blockTime?: number
  startTime?: number
}

export default function UseOptimisticWriteContractDemo() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [currentOptimisticTime, setCurrentOptimisticTime] = useState(0)
  const [currentBlockTime, setCurrentBlockTime] = useState(0)
  const publicClient = usePublicClient()

  const {
    writeContract,
    error,
    isPending,
    isSuccess,
  } = useOptimisticWriteContract()

  const pollForConfirmation = async (hash: string, startTime: number) => {
    if (!publicClient) return

    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: hash as `0x${string}`,
        timeout: 30000
      })

      if (receipt) {
        const blockTime = Date.now() - startTime
        setMetrics(prev => ({
          ...prev,
          blockTime
        }))
        setIsConfirmed(true)
      }
    } catch (error) {
      console.error("❌ [Confirmation] Failed to get transaction receipt:", error)
    }
  }

  // Timer effect for optimistic response
  useEffect(() => {
    if (metrics.startTime && !metrics.optimisticTime) {
      const interval = setInterval(() => {
        setCurrentOptimisticTime(Date.now() - metrics.startTime!)
      }, 10)
      return () => clearInterval(interval)
    }
  }, [metrics.startTime, metrics.optimisticTime])

  // Timer effect for block confirmation
  useEffect(() => {
    if (isSuccess && !isConfirmed && metrics.startTime && !metrics.blockTime) {
      const interval = setInterval(() => {
        setCurrentBlockTime(Date.now() - metrics.startTime!)
      }, 10)
      return () => clearInterval(interval)
    }
  }, [isSuccess, isConfirmed, metrics.startTime, metrics.blockTime])

  const handleSubmit = async () => {
    setIsConfirmed(false)
    setMetrics({})
    setCurrentOptimisticTime(0)
    setCurrentBlockTime(0)

    try {
      await writeContract({
        address: EXAMPLE_CONTRACT_ADDRESS,
        abi: EXAMPLE_ABI,
        functionName: "increment",
        onSuccess: (data, startTime) => {
          const optimisticTime = Date.now() - startTime

          setMetrics({
            startTime,
            optimisticTime
          })

          // Start polling for block confirmation
          if (publicClient) {
            pollForConfirmation(data.transactionHash, startTime)
          }
        },
        onError: () => {
          setMetrics({})
          setIsConfirmed(false)
        }
      })
    } catch (error) {
      // Error already handled by onError callback
    }
  }

  const formatTime = (ms?: number) => {
    if (!ms) return "—"
    return `${ms}ms`
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Optimistic Transactions</CardTitle>
          <CardDescription>
            Experience instant transaction feedback with Abstract's optimistic execution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Action Button */}
          <div className="flex justify-start -mt-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              size="lg"
              className="min-w-[200px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Executing
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Execute Transaction
                </>
              )}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-center">
              {error.message}
            </div>
          )}

          {/* Performance Monitoring */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm">Performance Monitoring</h3>
              <p className="text-xs text-muted-foreground">Track transaction confirmation speed</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Optimistic Response */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    {metrics.optimisticTime ? (
                      <CheckCircle className="w-4 h-4 text-foreground" />
                    ) : metrics.startTime ? (
                      <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium text-muted-foreground">Optimistic Response</span>
                  </div>
                  <div className="text-2xl font-mono font-semibold tabular-nums">
                    {metrics.optimisticTime
                      ? formatTime(metrics.optimisticTime)
                      : metrics.startTime
                        ? formatTime(currentOptimisticTime)
                        : formatTime(0)
                    }
                  </div>
                </div>
              </div>

              {/* Block Confirmation */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    {metrics.blockTime ? (
                      <CheckCircle className="w-4 h-4 text-foreground" />
                    ) : (isSuccess && !isConfirmed) ? (
                      <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium text-muted-foreground">Block Confirmation</span>
                  </div>
                  <div className="text-2xl font-mono font-semibold tabular-nums">
                    {metrics.blockTime
                      ? formatTime(metrics.blockTime)
                      : (isSuccess && !isConfirmed)
                        ? formatTime(currentBlockTime)
                        : formatTime(0)
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}