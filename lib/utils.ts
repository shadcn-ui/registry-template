import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const formatLargeNumber = (num?: number): string => {
  if (!num) return '0';

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 2000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};