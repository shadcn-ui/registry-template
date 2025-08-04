import { LOCAL_STORAGE_KEY_PREFIX, ENCRYPTION_KEY_PREFIX } from "./session-encryption-utils";
import type { Address } from "viem";

/**
 * @function clearStoredSession
 * @description Removes all stored session data for a specific wallet address from local storage
 *
 * This function cleans up both the encrypted session data and the encryption key
 * associated with a wallet address from the browser's local storage. It's typically
 * used when a session has expired, been revoked, or when the user wants to clear
 * their session data for privacy/security reasons.
 *
 * The function removes two items from local storage:
 * 1. The encrypted session data (stored with LOCAL_STORAGE_KEY_PREFIX + address)
 * 2. The encryption key used to encrypt/decrypt the session (stored with ENCRYPTION_KEY_PREFIX + address)
 *
 * @param {Address} userAddress - The wallet address whose session data should be cleared
 */
export const clearStoredSession = (userAddress: Address) => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${userAddress}`);
    localStorage.removeItem(`${ENCRYPTION_KEY_PREFIX}${userAddress}`);
};