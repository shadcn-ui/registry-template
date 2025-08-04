"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useAbstractClient } from "@abstract-foundation/agw-react";
import { getStoredSession } from "../lib/get-stored-session-key";

/**
 * Hook to retrieve and validate the stored Abstract session
 * @returns The session data with loading and error states
 */
export function useSessionKey() {
    const { address } = useAccount();
    const { data: abstractClient } = useAbstractClient();

    return useQuery({
        queryKey: ["session-key", address],
        queryFn: async () => {
            // These should never happen due to enabled condition, but adding for type safety
            if (!abstractClient) {
                throw new Error("No Abstract client found");
            }
            if (!address) {
                throw new Error("No wallet address found");
            }

            return await getStoredSession(abstractClient, address);
        },
        enabled: !!address && !!abstractClient,
        staleTime: 1000 * 60 * 5, // 5 minutes - sessions don't change often
        retry: (failureCount, error) => {
            // Don't retry if it's a client/address error (these won't resolve with retry)
            if (error.message.includes("No Abstract client") || 
                error.message.includes("No wallet address")) {
                return false;
            }
            // Retry network/validation errors up to 2 times
            return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    });
}