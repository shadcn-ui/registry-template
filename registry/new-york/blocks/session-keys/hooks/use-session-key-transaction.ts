"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useAbstractClient } from "@abstract-foundation/agw-react";
import { getStoredSession } from "../lib/get-stored-session-key";
import { publicClient } from "@/config/viem-clients";
import { chain } from "@/config/chain";
import { privateKeyToAccount } from "viem/accounts";
import {
  Address,
  Abi,
  ContractFunctionName,
  ContractFunctionArgs,
  WriteContractParameters,
} from "viem";

// Generic type-safe transaction parameters for any contract ABI
type SessionKeyTransactionParams<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<
    TAbi,
    "payable" | "nonpayable"
  > = ContractFunctionName<TAbi, "payable" | "nonpayable">
> = {
  abi: TAbi;
  address: Address;
  functionName: TFunctionName;
  args?: ContractFunctionArgs<
    TAbi,
    "payable" | "nonpayable",
    TFunctionName
  >;
  value?: bigint;
};

interface UseSessionKeyTransactionOptions {
  onSuccess?: (data: { hash: Address }) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for submitting contract transactions using session keys
 * Provides gasless transactions for approved contract functions
 *
 * @example
 * ```typescript
 * const { mutate, mutateAsync } = useSessionKeyTransaction();
 *
 * // Type-safe usage with any contract
 * mutate({
 *   abi: MY_CONTRACT_ABI,
 *   address: MY_CONTRACT_ADDRESS,
 *   functionName: "transfer", // ✅ Autocomplete available based on ABI
 *   args: [recipient, amount], // ✅ TypeScript knows the correct argument types
 *   value: parseEther("0.1")
 * });
 * ```
 */
export function useSessionKeyTransaction(
  options?: UseSessionKeyTransactionOptions
) {
  const { address } = useAccount();
  const { data: abstractClient } = useAbstractClient();
  const queryClient = useQueryClient();

  const transactionMutation = useMutation<
    { hash: Address },
    Error,
    SessionKeyTransactionParams<Abi>
  >({
    mutationFn: async ({
      abi,
      address: contractAddress,
      functionName,
      args,
      value = BigInt(0),
    }) => {
      if (!address) {
        throw new Error("No wallet address found");
      }
      if (!abstractClient) {
        throw new Error("No Abstract client found");
      }

      // Get stored session
      const sessionData = await getStoredSession(abstractClient, address);
      if (!sessionData) {
        throw new Error(
          "No valid session found. Please create a session key first."
        );
      }

      const sessionClient = abstractClient.toSessionClient(
        privateKeyToAccount(sessionData.privateKey as Address),
        sessionData.session
      );

      // Submit transaction using session key
      const txHash = await sessionClient.writeContract({
        abi,
        account: sessionClient.account,
        address: contractAddress,
        functionName,
        args,
        value,
        chain,
      } as WriteContractParameters);

      if (!txHash) {
        throw new Error("Transaction failed - no hash returned");
      }

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        timeout: 10000, // 10 second timeout - if it takes longer, likely nonce issue
        pollingInterval: 1000 / 3, // Check 3 times per second
      });

      if (receipt.status !== "success") {
        // Try to get the revert reason from the transaction
        let revertReason = "Unknown revert reason";
        try {
          // Simulate the transaction to get the revert reason
          await publicClient.call({
            to: contractAddress,
            data: (await publicClient.getTransaction({ hash: txHash })).input,
            blockNumber: receipt.blockNumber,
          });
        } catch (simulationError: any) {
          if (simulationError.message) {
            revertReason = simulationError.message;
          }
        }

        throw new Error(
          `Transaction failed during execution: ${receipt.status}. Reason: ${revertReason}`
        );
      }

      return { hash: txHash };
    },
    onSuccess: (data: { hash: Address }) => {
      // Invalidate session key queries to refresh UI state
      queryClient.invalidateQueries({
        queryKey: ["session-key"], 
      });
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error("Session key transaction failed:", error);
      options?.onError?.(error);
    },
  });

  // Type-safe generic mutate function
  const mutate = <TAbi extends Abi>(
    params: SessionKeyTransactionParams<TAbi>
  ) => {
    return transactionMutation.mutate(params as SessionKeyTransactionParams<Abi>);
  };

  const mutateAsync = <TAbi extends Abi>(
    params: SessionKeyTransactionParams<TAbi>
  ) => {
    return transactionMutation.mutateAsync(params as SessionKeyTransactionParams<Abi>);
  };

  return {
    // Type-safe generic mutation functions
    mutate,
    mutateAsync,
    // Mutation state
    isPending: transactionMutation.isPending,
    isError: transactionMutation.isError,
    isSuccess: transactionMutation.isSuccess,
    error: transactionMutation.error,
    data: transactionMutation.data,
    reset: transactionMutation.reset,
  };
}