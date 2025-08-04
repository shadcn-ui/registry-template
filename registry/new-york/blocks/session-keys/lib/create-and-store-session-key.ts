import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { Address } from "viem";
import { SessionConfig } from "@abstract-foundation/agw-client/sessions";
import { LOCAL_STORAGE_KEY_PREFIX, getEncryptionKey, encrypt } from "./session-encryption-utils";
import { AbstractClient } from "@abstract-foundation/agw-client";
import { publicClient } from "@/config/viem-clients";
import { SESSION_KEY_CONFIG } from "@/config/session-key-policies";

/**
 * @function createAndStoreSession
 * @description Creates a new Abstract Global Wallet session and stores it securely in local storage
 *
 * @param {Address} userAddress - The wallet address that will own the session
 *
 * @returns {Promise<Object|null>} A promise that resolves to:
 *   - The created session data object (containing `session` and `privateKey`) if successful
 *   - null if the userAddress is empty or invalid
 *
 * @throws {Error} Throws "Session creation failed" if there's an error during session creation
 */
export const createAndStoreSession = async (
    abstractClient: AbstractClient,
    userAddress: Address
): Promise<{
    session: SessionConfig;
    privateKey: Address;
} | null> => {
    if (!userAddress) return null;

    try {
        const sessionPrivateKey = generatePrivateKey();
        const sessionSigner = privateKeyToAccount(sessionPrivateKey);

        const { session, transactionHash } = await abstractClient.createSession({
            session: {
                signer: sessionSigner.address,
                ...SESSION_KEY_CONFIG,
            },
        });

        if (transactionHash) {
            await publicClient.waitForTransactionReceipt({
                hash: transactionHash,
            });
        } else {
            throw new Error("Transaction hash is null. Session was not created.");
        }

        const sessionData = { session, privateKey: sessionPrivateKey };
        const key = await getEncryptionKey(userAddress);
        const encryptedData = await encrypt(
            JSON.stringify(sessionData, (_, value) =>
                typeof value === "bigint" ? value.toString() : value
            ),
            key
        );

        localStorage.setItem(
            `${LOCAL_STORAGE_KEY_PREFIX}${userAddress}`,
            encryptedData
        );
        return sessionData;
    } catch (error) {
        console.error("Failed to create session:", error);
        throw new Error(`Failed to create session key, ${error}`);
    }
};