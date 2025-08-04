import type { Address } from "viem";


/**
 * @constant {string} LOCAL_STORAGE_KEY_PREFIX
 * @description Prefix used for storing encrypted session data in local storage
 *
 * The actual storage key is created by appending the user's wallet address to this prefix,
 * ensuring each wallet address has its own unique storage key.
 * The prefix includes the current NODE_ENV to separate data between environments.
 */
export const LOCAL_STORAGE_KEY_PREFIX = `abstract_session_${process.env.NODE_ENV || "development"}_`;

/**
 * @constant {string} ENCRYPTION_KEY_PREFIX
 * @description Prefix used for storing encryption keys in local storage
 *
 * The actual storage key is created by appending the user's wallet address to this prefix,
 * ensuring each wallet address has its own unique encryption key stored separately from the
 * encrypted session data.
 * The prefix includes the current NODE_ENV to separate data between environments.
 */
export const ENCRYPTION_KEY_PREFIX = `encryption_key_${process.env.NODE_ENV || "development"}_`;


/**
 * @function getEncryptionKey
 * @description Retrieves or generates an AES-GCM encryption key for a specific wallet address
 *
 * This function manages encryption keys used to secure session data in local storage.
 * It first checks if an encryption key already exists for the given wallet address.
 * If found, it imports and returns the existing key. Otherwise, it generates a new
 * 256-bit AES-GCM key, stores it in local storage, and returns it.
 *
 * The encryption keys are stored in local storage with a prefix (defined in constants.ts)
 * followed by the wallet address to ensure each wallet has its own unique encryption key.
 *
 * @param {Address} userAddress - The wallet address to get or generate an encryption key for
 *
 * @returns {Promise<CryptoKey>} A promise that resolves to a CryptoKey object that can be
 *                              used with the Web Crypto API for encryption and decryption
 */
export const getEncryptionKey = async (
    userAddress: Address
): Promise<CryptoKey> => {
    const storedKey = localStorage.getItem(
        `${ENCRYPTION_KEY_PREFIX}${userAddress}`
    );

    if (storedKey) {
        return crypto.subtle.importKey(
            "raw",
            Buffer.from(storedKey, "hex"),
            { name: "AES-GCM" },
            false,
            ["encrypt", "decrypt"]
        );
    }

    const key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    const exportedKey = await crypto.subtle.exportKey("raw", key);
    localStorage.setItem(
        `${ENCRYPTION_KEY_PREFIX}${userAddress}`,
        Buffer.from(exportedKey).toString("hex")
    );

    return key;
};

/**
 * @function encrypt
 * @description Encrypts data using AES-GCM encryption with a provided CryptoKey
 *
 * This function uses the Web Crypto API to encrypt session data for secure storage
 * in the browser's local storage. It generates a random initialization vector (IV)
 * for each encryption operation to ensure security. The encrypted data and IV are
 * both stored in the returned JSON string.
 *
 * @param {string} data - The data to encrypt, typically a stringified JSON object
 *                        containing session information and private keys
 * @param {CryptoKey} key - The AES-GCM encryption key to use
 *
 * @returns {Promise<string>} A promise that resolves to a JSON string containing
 *                           the encrypted data and the initialization vector (IV)
 *                           both encoded as hex strings
 */
export const encrypt = async (
    data: string,
    key: CryptoKey
): Promise<string> => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        new TextEncoder().encode(data)
    );

    return JSON.stringify({
        iv: Buffer.from(iv).toString("hex"),
        data: Buffer.from(encrypted).toString("hex"),
    });
};

/**
 * @function decrypt
 * @description Decrypts data that was encrypted using the encrypt function
 *
 * This function uses the Web Crypto API to decrypt session data that was previously
 * encrypted with the corresponding encrypt function. It expects the input to be a
 * JSON string containing both the encrypted data and the initialization vector (IV)
 * that was used for encryption.
 *
 * @param {string} encryptedData - The encrypted data JSON string containing both the
 *                                encrypted data and the initialization vector (IV)
 *                                as hex strings
 * @param {CryptoKey} key - The AES-GCM decryption key to use (same key used for encryption)
 *
 * @returns {Promise<string>} A promise that resolves to the decrypted data as a string
 *
 * @throws Will throw an error if decryption fails, which may happen if the encryption
 *        key is incorrect or the data has been tampered with
 */
export const decrypt = async (
    encryptedData: string,
    key: CryptoKey
): Promise<string> => {
    const { iv, data } = JSON.parse(encryptedData);
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: Buffer.from(iv, "hex") },
        key,
        Buffer.from(data, "hex")
    );

    return new TextDecoder().decode(decrypted);
};