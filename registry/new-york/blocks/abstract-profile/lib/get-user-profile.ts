/**
 * The profile information returned from the Abstract Portal API
 */
export type AbstractPortalProfile = {
  user: {
    id: string;
    name: string;
    description: string;
    walletAddress: string;
    avatar: {
      assetType: string;
      tier: number;
      key: number;
      season: number;
    };
    banner: {
      assetType: string;
      tier: number;
      key: number;
      season: number;
    };
    tier: number;
    hasCompletedWelcomeTour: boolean;
    hasStreamingAccess: boolean;
    overrideProfilePictureUrl: string;
    lastTierSeen: number;
    metadata: {
      lastTierSeen: number;
      lastUpgradeSeen: number;
      hasCompletedWelcomeTour: boolean;
    };
    badges: {
      badge: {
        id: number;
        type: string;
        name: string;
        icon: string;
        description: string;
        requirement: string;
        url?: string;
        timeStart?: number;
        timeEnd?: number;
      };
      claimed: boolean;
    }[];
    verification: string;
  };
};

/**
 * Get the profile information of an Abstract Global Wallet given the wallet address
 * @param walletAddress - The wallet address to get the profile for
 * @returns The profile information
 */
export async function getUserProfile(walletAddress: string): Promise<AbstractPortalProfile> {
  const response = await fetch(`/api/user-profile/${walletAddress}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json();
}