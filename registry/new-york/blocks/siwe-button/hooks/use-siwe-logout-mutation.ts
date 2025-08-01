"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { toast } from "sonner";
import { ClientSiweConfigurationError } from "@/registry/new-york/blocks/siwe-button/lib/types";

const QUERY_KEYS = {
  auth: "siwe-auth",
} as const;

interface LogoutResponse {
  ok: boolean;
  message?: string;
  isConfigurationError?: boolean;
}

async function logoutUser(): Promise<LogoutResponse> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  const result = await response.json();
  
  // Check for configuration errors and throw proper error type
  if (result.isConfigurationError) {
    throw new ClientSiweConfigurationError(result.message);
  }
  
  if (!response.ok) {
    throw new Error(result.message || "Logout failed");
  }
  
  return result;
}

/**
 * React Query mutation hook for SIWE logout functionality.
 * Handles the logout process and updates auth state.
 * 
 * @returns UseMutationResult for logout operation
 * 
 * @example
 * ```tsx
 * import { useSiweLogoutMutation } from "@/registry/new-york/blocks/siwe-button/hooks/use-siwe-logout-mutation";
 * 
 * function LogoutButton() {
 *   const logoutMutation = useSiweLogoutMutation();
 *   
 *   return (
 *     <button 
 *       onClick={() => logoutMutation.mutate()}
 *       disabled={logoutMutation.isPending}
 *     >
 *       {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
 *     </button>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // With custom success/error handling
 * function MyComponent() {
 *   const logoutMutation = useSiweLogoutMutation({
 *     onSuccess: () => {
 *       // Custom success handling
 *       router.push("/");
 *     },
 *     onError: (error) => {
 *       // Custom error handling
 *       console.error("Logout failed:", error);
 *     }
 *   });
 * 
 *   return (
 *     <button onClick={() => logoutMutation.mutate()}>
 *       Sign Out
 *     </button>
 *   );
 * }
 * ```
 */
export function useSiweLogoutMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  const { logout: walletLogout } = useLoginWithAbstract();

  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      // Immediately reset auth query data to logged out state
      queryClient.setQueryData([QUERY_KEYS.auth], {
        ok: false,
        message: "Logged out"
      });
      
      // Also invalidate to trigger refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.auth] });
      
      // Disconnect wallet for complete logout experience
      walletLogout();
      
      // Show success toast
      toast.success("Successfully signed out");
      
      // Call custom success handler if provided
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      // Don't show error toast for configuration errors - they should be thrown
      if (error instanceof ClientSiweConfigurationError) {
        throw error;
      }
      
      // Show error toast for other errors
      toast.error(error.message || "Sign out failed");
      
      // Call custom error handler if provided
      options?.onError?.(error);
    },
  });

  // If there's a configuration error, throw it during render to show in Next.js overlay
  if (mutation.error instanceof ClientSiweConfigurationError) {
    throw mutation.error;
  }

  return mutation;
}