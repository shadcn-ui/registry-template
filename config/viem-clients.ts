import { createPublicClient, createWalletClient, http } from "viem";
import { eip712WalletActions, publicActionsL2 } from "viem/zksync";
import { chain } from "./chain";

// Global Viem public client instance
export const publicClient = createPublicClient({
    chain: chain,
    transport: http(),
}).extend(publicActionsL2());

// Global Viem wallet client instance
export const walletClient = createWalletClient({
    chain: chain,
    transport: http(),
}).extend(eip712WalletActions());
