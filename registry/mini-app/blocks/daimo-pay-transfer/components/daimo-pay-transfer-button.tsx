import { cache } from "react";
import { getPokemon } from "@/registry/mini-app/blocks/complex-component/lib/pokemon";
import { Card, CardContent } from "@/registry/mini-app/ui/card";
import { PokemonImage } from "@/registry/mini-app/blocks/complex-component/components/pokemon-image";
import { DaimoPayButton } from "@daimo/pay";
import { baseUSDC } from "@daimo/contract";
import { getAddress } from "viem";
import { useAccount } from "wagmi";
import { Button } from "@/registry/mini-app/ui/button";

const cachedGetPokemon = cache(getPokemon);

export async function DaimoPayTransferButton({
  text,
  toAddress,
  amount,
  onPaymentStarted,
  onPaymentCompleted,
}: {
  text: string;
  toAddress: `0x${string}`;
  amount: string;
  onPaymentStarted?: () => void;
  onPaymentCompleted?: () => void;
}) {
  return (
    <div className="flex justify-center px-8 py-4 bg-pink-500 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-pink-400 transition-colors animate-pulse">
      <DaimoPayButton.Custom
        appId={process.env.NEXT_PUBLIC_DAIMO_PAY_KEY || "pay-demo"}
        toChain={baseUSDC.chainId}
        toUnits={amount}
        toToken={getAddress(baseUSDC.token)}
        toAddress={toAddress}
        onPaymentStarted={(e) => {
          console.log("Payment started", e);
          onPaymentStarted?.();
        }}
        onPaymentCompleted={(e) => {
          console.log("Payment completed", e);
          onPaymentCompleted?.();
        }}
        closeOnSuccess
      >
        {({ show: showDaimoModal }) => (
          <Button className="w-full" size="lg" onClick={() => showDaimoModal()}>
            {text}
          </Button>
        )}
      </DaimoPayButton.Custom>
    </div>
  );
}
