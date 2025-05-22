"use client";

import * as React from "react";
import { OpenInVibesEngineeringButton } from "@/components/open-in-vibes-engineering-button";
import { DaimoPayTransferButton } from "@/registry/mini-app/blocks/daimo-pay-transfer/components/daimo-pay-transfer-button";
import { ShareCastButton } from "@/registry/mini-app/blocks/share-cast-button/share-cast-button";
import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";

// This page displays items from the custom registry.
export default function Home() {
  useMiniAppSdk();

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          hellno/mini-app-ui
        </h1>
        <p className="text-muted-foreground">
          A collection of components, hooks and utilities for mini apps using
          shadcn.
        </p>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              A simple token transfer button
            </h2>
            <OpenInVibesEngineeringButton className="w-fit" />
          </div>
          <div className="flex items-center justify-center min-h-[400px] relative">
            <DaimoPayTransferButton
              text="Donate $1 to Protocol Guild"
              toAddress="0x32e3C7fD24e175701A35c224f2238d18439C7dBC"
              amount="1"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              Share text and link in a cast
            </h2>
            <OpenInVibesEngineeringButton className="w-fit" />
          </div>
          <div className="flex items-center justify-center min-h-[500px] relative">
            <ShareCastButton
              text="Share hellno/mini-app-ui"
              url="https://hellno-mini-app-ui.vercel.app"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
