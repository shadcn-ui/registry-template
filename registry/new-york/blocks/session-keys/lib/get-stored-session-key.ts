import type { Address } from "viem";
import type { AbstractClient } from "@abstract-foundation/agw-client";
import { getSessionHash, type SessionConfig } from "@abstract-foundation/agw-client/sessions";
import { LOCAL_STORAGE_KEY_PREFIX, getEncryptionKey, decrypt } from "./session-encryption-utils";
import { validateSession } from "./validate-session-key";
import { CALL_POLICIES } from "@/config/session-key-policies";

export interface StoredSessionData {
    session: SessionConfig;
    privateKey: Address;
}

/**
 * @function getStoredSession
 * @description Retrieves, decrypts, and validates a stored session for a wallet address
 * 
 * This function performs several steps to securely retrieve and validate a stored session:
 * 1. Checks local storage for encrypted session data under the wallet address key
 * 2. Retrieves the encryption key for the wallet address
 * 3. Decrypts the session data using the encryption key
 * 4. Parses the decrypted data to obtain session information
 * 5. Validates that call policies match current configuration
 * 6. Validates the session by checking its status on-chain
 * 
 * @param {AbstractClient} abstractClient - The Abstract client instance
 * @param {Address} userAddress - The wallet address to retrieve session for
 * @returns {Promise<StoredSessionData | null>} The session data if valid, null otherwise
 */
export const getStoredSession = async (
    abstractClient: AbstractClient,
    userAddress: Address
): Promise<StoredSessionData | null> => {
    if (!userAddress) return null;

    const encryptedData = localStorage.getItem(
        `${LOCAL_STORAGE_KEY_PREFIX}${userAddress}`
    );

    if (!encryptedData) return null;

    try {
        const key = await getEncryptionKey(userAddress);
        const decryptedData = await decrypt(encryptedData, key);

        const sessionData: StoredSessionData = JSON.parse(decryptedData, (_, value) => {
            // Handle bigint deserialization
            if (typeof value === "string" && /^\d+$/.test(value)) {
                try {
                    return BigInt(value);
                } catch {
                    return value;
                }
            }
            return value;
        });

        // Check if stored call policies match current configuration
        const storedPoliciesJson = JSON.stringify(
            sessionData.session.callPolicies,
            (_, value) => typeof value === "bigint" ? value.toString() : value
        );
        const currentPoliciesJson = JSON.stringify(
            CALL_POLICIES,
            (_, value) => typeof value === "bigint" ? value.toString() : value
        );

        if (storedPoliciesJson !== currentPoliciesJson) {
            console.log("Call policies have changed, session needs refresh");
            return null;
        }

        // Validate the session is still active on-chain
        const sessionHash = getSessionHash(sessionData.session);
        const isValid = await validateSession(
            abstractClient,
            userAddress,
            sessionHash
        );

        return isValid ? sessionData : null;
    } catch (error) {
        console.error("Failed to retrieve stored session:", error);
        return null;
    }
};