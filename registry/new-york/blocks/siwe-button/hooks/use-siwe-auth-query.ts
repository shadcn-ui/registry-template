"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { AuthResponse, ClientSiweConfigurationError } from "@/registry/new-york/blocks/siwe-button/lib/types";

const QUERY_KEYS = {
  auth: "siwe-auth",
} as const;

async function fetchAuthUser(): Promise<AuthResponse> {
  const response = await fetch("/api/auth/user");
  const result = await response.json();

  // Check for configuration errors and throw proper error type
  if (result.isConfigurationError) {
    throw new ClientSiweConfigurationError(result.message);
  }

  return result;
}

export function useSiweAuthQuery() {
  const { address, isConnected } = useAccount();

  const query = useQuery({
    queryKey: [QUERY_KEYS.auth, address],
    queryFn: fetchAuthUser,
    // Only run query if wallet is connected
    enabled: isConnected && !!address,
    // Consider auth data is fresh for 1 minute
    staleTime: 1000 * 60 * 1, // 1 minute
    // Only refetch on window focus if data is stale (not on every tab switch)
    refetchOnWindowFocus: true,
    // Always recheck when network reconnects
    refetchOnReconnect: true,
    // Background recheck every 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    // Keep auth data in cache for 10 minutes after component unmount
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error: Error & { status?: number }) => {
      // Don't retry if it's a 401 (not authenticated)
      if (error?.status === 401) {
        return false;
      }
      // Don't retry configuration errors - let them throw
      if (error instanceof ClientSiweConfigurationError) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // If there's a configuration error, throw it during render to show in Next.js overlay
  if (query.error instanceof ClientSiweConfigurationError) {
    throw query.error;
  }

  return query;
}