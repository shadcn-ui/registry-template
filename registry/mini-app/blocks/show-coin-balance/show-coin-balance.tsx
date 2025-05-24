import { useState, useMemo, useEffect } from "react";
import { Input } from "@/registry/mini-app/ui/input";
import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";
import { Alchemy, Network } from "alchemy-sdk";
import { parseUnits, isAddress } from "viem";

// Helper function to check if input looks like an ENS name
const isEnsName = (input: string): boolean => {
  return input.includes(".") && !isAddress(input) && input.length > 3;
};

export function ShowCoinBalance({
  defaultTokenAddress,
  chainId,
  network,
}: {
  defaultTokenAddress?: `0x${string}`;
  chainId?: number;
  network?: Network;
}) {
  useMiniAppSdk();
  const [address, setAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState(defaultTokenAddress || "");
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if address is valid (either a proper address or ENS name)
  const isValidAddress = useMemo(() => {
    return address && (isAddress(address) || isEnsName(address));
  }, [address]);

  const fetchTokenBalance = async (
    targetAddress: string,
    tokenAddr: string,
  ) => {
    setLoading(true);
    setError(null); // Clear any previous errors at start

    try {
      // Map chainId to Alchemy Network
      const getAlchemyNetwork = (chainId: number): Network => {
        switch (chainId) {
          case 1:
            return Network.ETH_MAINNET;
          case 8453:
            return Network.BASE_MAINNET;
          case 42161:
            return Network.ARB_MAINNET;
          case 421614:
            return Network.ARB_SEPOLIA;
          case 84532:
            return Network.BASE_SEPOLIA;
          case 666666666:
            return Network.DEGEN_MAINNET;
          case 100:
            return Network.GNOSIS_MAINNET;
          case 10:
            return Network.OPT_MAINNET;
          case 11155420:
            return Network.OPT_SEPOLIA;
          case 137:
            return Network.MATIC_MAINNET;
          case 11155111:
            return Network.ETH_SEPOLIA;
          case 7777777:
            return Network.ZORA_MAINNET;
          case 42220:
            return Network.CELO_MAINNET;
          default:
            return Network.BASE_MAINNET;
        }
      };

      // Use provided network or map from chainId
      const finalNetwork =
        network ||
        (chainId ? getAlchemyNetwork(chainId) : Network.BASE_MAINNET);

      // Create mainnet instance for ENS resolution
      const mainnetAlchemy = new Alchemy({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
        network: Network.ETH_MAINNET,
      });

      // Create target network instance for token balance
      const targetAlchemy = new Alchemy({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
        network: finalNetwork,
      });

      // Resolve ENS if needed (always on mainnet)
      let resolvedAddress = targetAddress;
      if (isEnsName(targetAddress)) {
        try {
          resolvedAddress =
            await mainnetAlchemy.core.resolveName(targetAddress);
          if (!resolvedAddress) {
            throw new Error("ENS name could not be resolved");
          }
        } catch (ensError) {
          setError("Failed to resolve ENS name");
          setLoading(false);
          return;
        }
      }

      // Fetch token metadata and balance on target network
      const [tokenMeta, result] = await Promise.all([
        targetAlchemy.core.getTokenMetadata(tokenAddr),
        targetAlchemy.core.getTokenBalances(resolvedAddress, [tokenAddr]),
      ]);

      const raw = result.tokenBalances[0]?.tokenBalance ?? "0";
      let formatted = raw;

      if (tokenMeta && tokenMeta.decimals != null) {
        const value = BigInt(raw);
        // Format using parseUnits for display
        const divisor = parseUnits("1", tokenMeta.decimals);
        const display = Number(value) / Number(divisor);
        formatted = display.toFixed(4).replace(/\.0+$/, "");
        if (tokenMeta.symbol) formatted += ` ${tokenMeta.symbol}`;
      }

      setBalance(formatted);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch token balance");
    }
    setLoading(false);
  };

  // Auto-fetch balance when we have both valid address and token address
  useEffect(() => {
    if (isValidAddress && tokenAddress && isAddress(tokenAddress)) {
      fetchTokenBalance(address, tokenAddress);
    } else {
      setBalance(null);
      // Only set validation errors if we don't have a successful balance
      if (!balance) {
        if (address && !isValidAddress) {
          setError("Please enter a valid address or ENS name");
        } else if (tokenAddress && !isAddress(tokenAddress)) {
          setError("Please enter a valid token address");
        } else {
          setError(null);
        }
      }
    }
  }, [isValidAddress, address, tokenAddress, balance, fetchTokenBalance]);

  return (
    <div className="bg-white dark:bg-card rounded-xl shadow p-4 mx-2 my-4 flex flex-col gap-4 min-w-80">
      <Input
        className="w-full"
        placeholder="Enter address or ENS name (e.g., vitalik.eth)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      {!defaultTokenAddress && (
        <Input
          className="w-full placeholder:text-gray-400"
          placeholder="Enter token address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
      )}
      {((loading && !balance) ||
        (!isValidAddress && address) ||
        (!tokenAddress && !balance)) && (
        <div className="text-center text-sm text-muted-foreground min-h-5">
          {loading
            ? "Fetching balance..."
            : "Enter both address and token address"}
        </div>
      )}
      {error && <div className="text-red-500 text-xs min-h-4">{error}</div>}
      {balance && (
        <div className="text-lg font-bold flex items-center gap-2 min-h-7">
          <span className="text-muted-foreground">Balance:</span> {balance}
        </div>
      )}
    </div>
  );
}
