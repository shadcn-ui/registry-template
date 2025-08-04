"use client";

import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useAbstractClient } from "@abstract-foundation/agw-react";
import { createAndStoreSession } from "../lib/create-and-store-session-key";
import { queryClient } from "@/config/query-client";

/**
 * Hook to create and store Abstract sessions
 * @returns Mutation functions and state for creating sessions
 */
export function useCreateSessionKey() {
    const { data: abstractClient } = useAbstractClient();
    const { address } = useAccount();

    const createSessionMutation = useMutation({
        mutationFn: async () => {
            if (!address) {
                throw new Error("No wallet address found");
            }
            if (!abstractClient) {
                throw new Error("No Abstract client found");
            }

            return createAndStoreSession(abstractClient, address);
        },
        onSuccess: () => {
            // Invalidate the session query to fo rce a refetch
            queryClient.invalidateQueries({
                queryKey: ["session-key", address],
            });
        },
    });

    return createSessionMutation;
}