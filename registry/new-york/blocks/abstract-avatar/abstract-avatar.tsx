"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip";
import { Skeleton } from "@/registry/new-york/ui/skeleton";
import { useAbstractProfileByAddress } from "@/registry/new-york/blocks/abstract-avatar/hooks/use-abstract-profile";
import { getTierColor } from "@/registry/new-york/blocks/abstract-avatar/lib/tier-colors";
import { getDisplayName } from "@/registry/new-york/blocks/abstract-avatar/lib/address-utils";
import { useAccount } from "wagmi";

interface AbstractAvatarProps {
  address?: string; // Optional - defaults to connected wallet
  fallback?: string; // Optional - defaults to first 2 chars of address
  shineColor?: string; // Optional now, will use tier color if not provided
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean; // Optional tooltip
}

/**
 * Abstract Avatar Component
 * 
 * A comprehensive avatar component that integrates with the Abstract Portal API to display:
 * - User profile pictures from Abstract Portal
 * - Tier-based colored borders (Bronze, Silver, Gold, Platinum, Diamond)
 * - Loading states with skeleton placeholders
 * - Fallback support for missing profile data
 * - Responsive size variants
 * - Optional tooltips with display names
 * 
 * @param address - Optional wallet address to fetch profile for (defaults to connected wallet)
 * @param fallback - Optional fallback text to display if image fails to load (defaults to first 2 chars of address)
 * @param shineColor - Optional custom border color (defaults to tier color)
 * @param size - Avatar size variant (sm, md, lg)
 * @param showTooltip - Whether to show tooltip on hover
 */
export function AbstractAvatar({
  address: providedAddress,
  fallback: providedFallback,
  shineColor,
  size = "md",
  showTooltip = true,
}: AbstractAvatarProps) {
  const { address: connectedAddress } = useAccount();
  
  // Use provided address or fall back to connected wallet address
  const address = providedAddress || connectedAddress;
  
  // Generate fallback from address if not provided
  const fallback = providedFallback || (address ? address.slice(2, 4).toUpperCase() : "??");
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const { data: profile, isLoading } = useAbstractProfileByAddress(address);
  
  // If no address available, show a placeholder
  if (!address) {
    return (
      <div 
        className={`relative rounded-full ${sizeClasses[size]} bg-muted flex items-center justify-center`}
        style={{ border: `2px solid #C0C0C0` }}
      >
        <span className="text-xs text-muted-foreground">??</span>
      </div>
    );
  }

  const avatarSrc =
    profile?.user?.overrideProfilePictureUrl ||
    "https://abstract-assets.abs.xyz/avatars/1-1-1.png";

  const displayName = getDisplayName(profile?.user?.name || "", address);

  // Use tier-based color if shineColor not provided
  const tierColor = profile?.user?.tier ? getTierColor(profile.user.tier) : getTierColor(2);
  const finalBorderColor = shineColor || tierColor;

  if (isLoading) {
    return (
      <div 
        className={`relative rounded-full ${sizeClasses[size]}`} 
        style={{ border: `2px solid ${finalBorderColor}` }}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <Skeleton 
            className={`w-full h-full rounded-full transition-transform duration-200 hover:scale-110`} 
          />
        </div>
      </div>
    );
  }

  const avatarElement = (
    <div 
      className={`relative rounded-full ${sizeClasses[size]}`} 
      style={{ border: `2px solid ${finalBorderColor}` }}
    >
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <Avatar 
          className={`w-full h-full transition-transform duration-200 hover:scale-110`}
        >
          <AvatarImage 
            src={avatarSrc} 
            alt={`${displayName} avatar`}
            className="object-cover" 
          />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );

  if (!showTooltip) {
    return avatarElement;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {avatarElement}
      </TooltipTrigger>
      <TooltipContent>
        <p>{displayName}</p>
      </TooltipContent>
    </Tooltip>
  );
}