"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/mini-app/ui/avatar";
import { useProfile } from "@/registry/mini-app/hooks/use-profile";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  src?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
  shape?: "circle" | "square" | "rounded";
  className?: string;
  useProfileData?: boolean;
  fallbackClassName?: string;
  clickable?: boolean;
  onClickOverride?: () => void;
};

export function UserAvatar({
  src,
  fallback,
  size = "md",
  shape = "circle",
  className = "",
  useProfileData = false,
  fallbackClassName = "",
  clickable = false,
  onClickOverride,
}: UserAvatarProps) {
  const profile = useProfile();
  
  // Use profile data if requested and available
  const avatarSrc = useProfileData && profile.pfpUrl ? profile.pfpUrl : src;
  
  // Generate fallback text from profile or use provided fallback
  const getFallbackText = () => {
    if (fallback) return fallback;
    if (useProfileData && profile.displayName) {
      return profile.displayName.substring(0, 2).toUpperCase();
    }
    if (useProfileData && profile.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    return "FC";
  };

  // Size classes for predefined sizes
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
    "2xl": "h-20 w-20 text-2xl",
  };
  
  // Shape classes
  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-lg",
  };
  
  // Custom size if number is provided
  const customSizeStyle = typeof size === 'number' ? { 
    width: `${size}px`, 
    height: `${size}px`,
    fontSize: `${Math.max(size / 3, 12)}px`
  } : {};

  const handleClick = () => {
    if (onClickOverride) {
      onClickOverride();
    } else if (clickable && useProfileData && profile.fid) {
      profile.viewProfile(profile.fid);
    }
  };

  return (
    <Avatar 
      className={cn(
        typeof size === 'string' ? sizeClasses[size] : "",
        shapeClasses[shape],
        "border-0 ring-0 outline-none",
        clickable && (useProfileData && profile.fid) ? "cursor-pointer hover:opacity-80" : "",
        className
      )}
      style={customSizeStyle}
      onClick={clickable || onClickOverride ? handleClick : undefined}
    >
      <AvatarImage src={avatarSrc} alt="User Avatar" className="object-cover" />
      <AvatarFallback className={cn(
        shapeClasses[shape],
        fallbackClassName
      )}>
        {getFallbackText()}
      </AvatarFallback>
    </Avatar>
  );
} 