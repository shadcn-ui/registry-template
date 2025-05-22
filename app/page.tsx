"use client";

import * as React from "react";
import { OpenInVibesEngineeringButton } from "@/components/open-in-vibes-engineering-button";
import { DaimoPayTransferButton } from "@/registry/mini-app/blocks/daimo-pay-transfer/components/daimo-pay-transfer-button";
import { ShareCastButton } from "@/registry/mini-app/blocks/share-cast-button/share-cast-button";
import { AddMiniappButton } from "@/registry/mini-app/blocks/add-miniapp-button/add-miniapp-button";
import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";
import { Clipboard as ClipboardIcon, Check as CheckIcon } from "lucide-react";

function InstallSnippet({ installName }: { installName: string }) {
  const [tab, setTab] = React.useState<"pnpm" | "npm">("pnpm");
  const [copied, setCopied] = React.useState(false);
  const command =
    tab === "pnpm"
      ? `pnpm dlx shadcn@latest add https://hellno-mini-app-ui.vercel.app/r/${installName}.json`
      : `npx shadcn@latest add https://hellno-mini-app-ui.vercel.app/r/${installName}.json`;
  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="mt-4">
      <div className="flex border rounded-t-md overflow-hidden text-sm font-mono">
        <button
          className={`px-3 py-1 ${tab === "pnpm" ? "bg-gray-100" : ""}`}
          onClick={() => setTab("pnpm")}
        >
          pnpm
        </button>
        <button
          className={`px-3 py-1 ${tab === "npm" ? "bg-gray-100" : ""}`}
          onClick={() => setTab("npm")}
        >
          npm
        </button>
      </div>
      <div className="relative">
        <pre className="bg-gray-800 text-white p-4 rounded-b-md overflow-x-auto">
          <code>{command}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1 bg-gray-700 rounded-sm hover:bg-gray-600"
        >
          {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4 text-gray-200" />}
        </button>
      </div>
    </div>
  );
}

// This page displays items from the custom registry.
export default function Home() {
  useMiniAppSdk();

  const items = [
    {
      title: "A simple token transfer button",
      component: (
        <DaimoPayTransferButton
          text="Donate $1 to Protocol Guild"
          toAddress="0x32e3C7fD24e175701A35c224f2238d18439C7dBC"
          amount="1"
        />
      ),
      installName: "daimo-pay-transfer-button",
    },
    {
      title: "Share text and link in a cast",
      component: (
        <ShareCastButton
          text="Share hellno/mini-app-ui"
          url="https://hellno-mini-app-ui.vercel.app"
        />
      ),
      installName: "share-cast-button",
    },
    {
      title: "Add or pin a mini app",
      component: <AddMiniappButton />,
      installName: "add-miniapp-button",
    },
  ];

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
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 border rounded-lg p-4 min-h-[350px] relative"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-muted-foreground sm:pl-3">
                {item.title}
              </h2>
              <OpenInVibesEngineeringButton className="w-fit" />
            </div>
            <div className="flex items-center justify-center min-h-[300px] relative">
              {item.component}
            </div>
            <InstallSnippet installName={item.installName} />
          </div>
        ))}
      </main>
    </div>
  );
}
