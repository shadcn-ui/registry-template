"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useAbstractClient } from "@abstract-foundation/agw-react";
import { createAndStoreSession } from "../lib/create-and-store-session-key";
import { toast } from "sonner";

/**
 * Hook to create and store Abstract sessions
 * @returns Mutation functions and state for creating sessions
 */
export function useCreateSessionKey() {
    const { data: abstractClient } = useAbstractClient();
    const { address } = useAccount();
    const queryClient = useQueryClient();

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
        onSuccess: async () => {
            // Invalidate the session query to force a refetch
            await queryClient.invalidateQueries({
                queryKey: ["session-key", address],
            });
            
            // Also refetch immediately to ensure state updates
            await queryClient.refetchQueries({
                queryKey: ["session-key", address],
            });
            
            toast.success("Session key created successfully");
        },
        onError: (error) => {
            console.error("Failed to create session:", error);
            toast.error("Failed to create session key");
        },
    });

    return createSessionMutation;
}