/**
 * IMPORTANT: https://docs.abs.xyz/abstract-global-wallet/session-keys/going-to-production
 * Your session key config requires approval to operate on Abstract mainnet via whitelist.
 */

import {
    LimitType,
    type SessionConfig,
} from "@abstract-foundation/agw-client/sessions";
import { parseEther, toFunctionSelector } from "viem";

/**
 * What call policies you wish to allow for the session key
 * Learn more: https://docs.abs.xyz/abstract-global-wallet/agw-client/session-keys/createSession#param-call-policies
 */
export const CALL_POLICIES = [
    {
        target: "0xC4822AbB9F05646A9Ce44EFa6dDcda0Bf45595AA" as `0x${string}`, // Contract address
        selector: toFunctionSelector("mint(address,uint256)"), // Allowed function
        // Gas parameters
        valueLimit: {
            limitType: LimitType.Unlimited,
            limit: BigInt(0),
            period: BigInt(0),
        },
        maxValuePerUse: BigInt(0),
        constraints: [],
    }
];

/**
 * What transfer policies you wish to allow for the session key
 * Learn more: https://docs.abs.xyz/abstract-global-wallet/agw-client/session-keys/createSession#param-transfer-policies
 */
export const TRANSFER_POLICIES = [
    // ... Your transfer policies here
]

export const SESSION_KEY_CONFIG: Omit<SessionConfig, "signer"> = {
    expiresAt: BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30), // 30 days from now
    feeLimit: {
        limitType: LimitType.Lifetime,
        limit: parseEther("1"), // 1 ETH lifetime gas limit
        period: BigInt(0),
    },
    callPolicies: CALL_POLICIES,
    transferPolicies: [],
};