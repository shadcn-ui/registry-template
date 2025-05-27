// path: app/component/[slug]/InstallSnippet.tsx
"use client";

import * as React from "react";
import { Button } from "@/registry/mini-app/ui/button";
import { Clipboard as ClipboardIcon, Check as CheckIcon } from "lucide-react";

// Define the props for the InstallSnippet component
type InstallSnippetProps = {
  installName: string;
};

export function InstallSnippet({ installName }: InstallSnippetProps) {
  const [tab, setTab] = React.useState<"pnpm" | "npm" | "bun">("pnpm");
  const [copied, setCopied] = React.useState(false);
  
  // Use APP_URL from environment variable
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  
  const command = React.useMemo(() => {
    switch (tab) {
      case "pnpm":
        return `pnpm dlx shadcn@latest add ${appUrl}/r/${installName}.json`;
      case "npm":
        return `npx shadcn@latest add ${appUrl}/r/${installName}.json`;
      case "bun":
        return `bun x shadcn@latest add ${appUrl}/r/${installName}.json`;
      default:
        return `pnpm dlx shadcn@latest add ${appUrl}/r/${installName}.json`;
    }
  }, [tab, installName, appUrl]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-4">Install this component</h3>
      <div className="flex border rounded-t-md justify-between overflow-hidden">
        <div className="flex text-sm font-mono">
          <button
            className={`px-3 py-1 ${tab === "pnpm" ? "bg-gray-100 dark:bg-zinc-800" : ""}`}
            onClick={() => setTab("pnpm")}
          >
            pnpm
          </button>
          <button
            className={`px-3 py-1 ${tab === "npm" ? "bg-gray-100 dark:bg-zinc-800" : ""}`}
            onClick={() => setTab("npm")}
          >
            npm
          </button>
          <button
            className={`px-3 py-1 ${tab === "bun" ? "bg-gray-100 dark:bg-zinc-800" : ""}`}
            onClick={() => setTab("bun")}
          >
            bun
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