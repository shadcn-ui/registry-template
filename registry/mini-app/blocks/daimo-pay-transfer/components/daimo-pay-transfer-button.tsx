"use client";

import { DaimoPayButton } from "@daimo/pay";
import { baseUSDC } from "@daimo/contract";
import { getAddress } from "viem";
import { Button } from "@/registry/mini-app/ui/button";

export function DaimoPayTransferButton({
  text,
  toChainId,
  toAddress,
  tokenAddress,
  amount,
  onPaymentStarted,
  onPaymentCompleted,
}: {
  text: string;
  toAddress: `0x${string}`;
  amount: string;
  tokenAddress?: `0x${string}`;
  toChainId?: number;
  onPaymentStarted?: () => void;
  onPaymentCompleted?: () => void;
}) {
  return (
    <div className="flex justify-center text-xl font-bold rounded-lg shadow-lg">
      <DaimoPayButton.Custom
        appId={process.env.NEXT_PUBLIC_DAIMO_PAY_KEY || "pay-demo"}
        toChain={toChainId || baseUSDC.chainId}
        toUnits={amount}
        toToken={tokenAddress || getAddress(baseUSDC.token)}
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
