"use client";

import { useRevokeSessions } from "@abstract-foundation/agw-react";
import { useAccount } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clearStoredSession } from "../lib/clear-stored-session-key";
import type { SessionConfig } from "@abstract-foundation/agw-client/sessions";

/**
 * Hook to revoke session keys with proper cleanup and error handling
 * @returns Mutation functions and state for revoking sessions
 */
export function useRevokeSessionKey() {
    const { address } = useAccount();
    const { revokeSessionsAsync, isPending, isError, error } = useRevokeSessions();
    const queryClient = useQueryClient();

    const revokeSession = async (session: SessionConfig) => {
        if (!address) {
            toast.error("No wallet address found");
            return;
        }

        try {
            const result = await revokeSessionsAsync({
                sessions: session
            });

            // The result might be undefined or have different structure
            console.log("Revoke result:", result);

            // Clear local storage after successful revocation
            clearStoredSession(address);
            
            // Invalidate the session query to force a refetch
            await queryClient.invalidateQueries({
                queryKey: ["session-key", address],
            });
            
            // Also refetch immediately to ensure state updates
            await queryClient.refetchQueries({
                queryKey: ["session-key", address],
            });

            toast.success("Session key revoked successfully");
        } catch (err) {
            console.error("Failed to revoke session:", err);
            toast.error("Failed to revoke session key");
            throw err;
        }
    };

    return {
        revokeSession,
        isPending,
        isError,
        error
    };
}