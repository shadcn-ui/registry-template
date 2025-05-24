import { useState } from "react";
import { Button } from "@/registry/mini-app/ui/button";
import { Input } from "@/registry/mini-app/ui/input";
import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";
import { Alchemy, Network } from "alchemy-sdk";
import { parseUnits, parseEther } from "viem";

export function ShowCoinBalance() {
  useMiniAppSdk();
  const [address, setAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const settings = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
        network: Network.BASE_MAINNET,
      };
      const alchemy = new Alchemy(settings);
      if (!address) {
        setError("Please enter an address");
        setLoading(false);
        return;
      }
      if (tokenAddress) {
        const [tokenMeta, result] = await Promise.all([
          alchemy.core.getTokenMetadata(tokenAddress),
          alchemy.core.getTokenBalances(address, [tokenAddress]),
        ]);
        const raw = result.tokenBalances[0]?.tokenBalance ?? "0";
        let formatted = raw;
        if (tokenMeta && tokenMeta.decimals != null) {
          let value: bigint;
          if (raw.startsWith("0x")) {
            value = BigInt(raw);
          } else {
            value = BigInt(raw);
          }
          // Format using parseUnits for display
          const divisor = parseUnits("1", tokenMeta.decimals);
          const display = Number(value) / Number(divisor);
          formatted = display.toFixed(4).replace(/\.0+$/, "");
          if (tokenMeta.symbol) formatted += ` ${tokenMeta.symbol}`;
        }
        setBalance(formatted);
        setAddress("");
        setTokenAddress("");
      } else {
        const ethBalance = await alchemy.core.getBalance(address);
        const divisor = parseEther("1");
        const display = Number(ethBalance) / Number(divisor);
        setBalance(ethBalance ? display.toFixed(4) + " ETH" : "0");
        setAddress("");
        setTokenAddress("");
      }
    } catch {
      setError("Failed to fetch balance");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-card rounded-xl shadow p-4 mx-2 my-4 flex flex-col gap-4">
      <Input
        className="w-full"
        placeholder="Enter address"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      <Input
        className="w-full placeholder:text-gray-400"
        placeholder="Enter token address (optional)"
        value={tokenAddress}
        onChange={e => setTokenAddress(e.target.value)}
      />
      <Button className="w-full" onClick={fetchBalance} disabled={loading}>
        {loading ? "Loading..." : "Show Balance"}
      </Button>
      {error && <div className="text-red-500 text-xs">{error}</div>}
      {balance && (
        <div className="text-lg font-bold flex items-center gap-2">
          <span className="text-muted-foreground">Balance:</span> {balance}
        </div>
      )}
    </div>
  );
}