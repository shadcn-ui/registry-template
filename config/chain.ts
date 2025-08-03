import { abstract, abstractTestnet } from "viem/chains";

export const chain =
  process.env.NODE_ENV === "development"
    ? abstractTestnet // Local development: Use Abstract Testnet
    : abstract; // Production: Use Abstract Mainnet
