"use client";

import * as React from "react";
import Link from "next/link";
import { OpenInVibesEngineeringButton } from "@/components/open-in-vibes-engineering-button";
import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";
import { componentItems } from "@/lib/components-config";
import {
  Clipboard as ClipboardIcon,
  Check as CheckIcon,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/registry/mini-app/ui/button";

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
      <div className="flex border rounded-t-md justify-between overflow-hidden">
        <div className="flex  text-sm font-mono">
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
        <Button variant="ghost" size="icon" onClick={handleCopy}>
          {copied ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <ClipboardIcon className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div className="relative">
        <pre className="bg-gray-800 text-white p-4 rounded-b-md overflow-x-auto">
          <code>{command}</code>
        </pre>
      </div>
    </div>
  );
}

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
        {componentItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 border rounded-lg p-4 min-h-[350px] relative"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-medium text-foreground leading-relaxed">
                {item.title}
              </h2>
              <div className="flex items-center gap-2 flex-shrink-0 sm:justify-end">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                >
                  <Link href={`/component/${item.installName}`}>
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Fullscreen
                  </Link>
                </Button>
                <OpenInVibesEngineeringButton className="h-8" />
              </div>
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
