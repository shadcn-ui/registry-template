'use client';

import { Icons } from "@/components/icons";
import { type IconProps } from "@/types/block";

interface PartnerLogoProps {
  provider: string;
}

const iconMap: Record<string, React.FC<IconProps>> = {
  polar: Icons.polar,
};

export function PartnerLogo({ provider }: PartnerLogoProps) {
  const Icon = iconMap[provider.toLowerCase()];
  if (!Icon) return null;
  
  return <Icon />;
} 