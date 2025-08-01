"use client";

import { getUserProfile } from "@/registry/new-york/blocks/abstract-avatar/lib/get-user-profile";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

/**
 * Query keys for Abstract profile queries
 */
const QUERY_KEYS = {
  profile: "abstract-profile",
} as const;

/**
 * Hook to retrieve the Abstract Portal profile for the current connected account
 * @returns The profile data with loading and error states
 */
export function useAbstractProfile() {
  const { address } = useAccount();

  return useQuery({
    queryKey: [QUERY_KEYS.profile, address],
    queryFn: async () => {
      if (!address) {
        return null;
      }
      return await getUserProfile(address);
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to retrieve the Abstract Portal profile for a specific address
 * @param address - The address to get the profile for
 * @returns The profile data with loading and error states
 */
export function useAbstractProfileByAddress(address: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.profile, address],
    queryFn: async () => {
      if (!address) {
        return null;
      }
      return await getUserProfile(address);
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 5, // 5 minutes (longer for other users)
    refetchOnWindowFocus: false,
    retry: (failureCount, error: Error & { status?: number }) => {
      // Don't retry if it's a 404 (profile doesn't exist) or similar client errors
      if (error?.status && error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}