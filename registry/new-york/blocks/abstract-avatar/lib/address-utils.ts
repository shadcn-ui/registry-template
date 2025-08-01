import { isAddress } from 'viem';

/**
 * Utility functions for formatting blockchain addresses
 */

/**
 * Trims an Ethereum address to show only the first and last few characters
 * @param address - The full Ethereum address
 * @param startChars - Number of characters to show at the start (default: 6)
 * @param endChars - Number of characters to show at the end (default: 4)
 * @returns Trimmed address in format "0x1234...5678"
 */
export function trimAddress(
    address: string,
    startChars: number = 6,
    endChars: number = 4
): string {
    if (!address) return '';
    if (address.length <= startChars + endChars) return address;

    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Checks if a string is a valid Ethereum address and trims it if so
 * @param nameOrAddress - The string to check (could be username or address)
 * @param fallbackAddress - The actual user address to use if nameOrAddress is an address
 * @returns Trimmed address if nameOrAddress is an address, otherwise returns nameOrAddress
 */
export function getDisplayName(nameOrAddress: string, fallbackAddress?: string): string {
    if (!nameOrAddress) return fallbackAddress ? trimAddress(fallbackAddress) : 'anon';

    // If the name is actually an address, trim it
    if (isAddress(nameOrAddress)) {
        return trimAddress(nameOrAddress);
    }

    // Otherwise, it's a real username, return as-is
    return nameOrAddress;
}