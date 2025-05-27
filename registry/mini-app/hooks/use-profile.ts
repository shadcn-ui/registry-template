"use client";

import { useMiniAppSdk } from "./use-miniapp-sdk";
import { useEffect, useState, useCallback } from "react";

export type ProfileData = {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

/**
 * Hook to access the user profile information from the Farcaster SDK context
 * @returns ProfileData object containing user information and functions to interact with profiles
 */
export function useProfile() {
  const { context, isSDKLoaded, sdk } = useMiniAppSdk();
  const [profile, setProfile] = useState<ProfileData>({});

  useEffect(() => {
    if (isSDKLoaded && context?.user) {
      setProfile({
        fid: context.user.fid,
        username: context.user.username,
        displayName: context.user.displayName,
        pfpUrl: context.user.pfpUrl,
      });
    }
  }, [context, isSDKLoaded]);

  /**
   * View a user's Farcaster profile
   * @param fid - Farcaster ID of the user whose profile to view
   */
  const viewProfile = useCallback(async (fid?: number) => {
    if (!fid) {
      console.warn("No FID provided to viewProfile");
      return;
    }
    
    try {
      await sdk.actions.viewProfile({ fid });
    } catch (error) {
      console.error("Error viewing profile:", error);
    }
  }, [sdk]);

  /**
   * View the current user's profile or another user's profile if fid is provided
   */
  const viewCurrentOrSpecificProfile = useCallback((specificFid?: number) => {
    const fidToView = specificFid || profile.fid;
    if (fidToView) {
      viewProfile(fidToView);
    }
  }, [profile.fid, viewProfile]);

  return {
    ...profile,
    viewProfile,
    viewCurrentOrSpecificProfile
  };
} 