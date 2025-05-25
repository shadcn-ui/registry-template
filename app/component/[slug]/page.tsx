"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { componentItems } from "@/lib/components-config";
import {
  ArrowLeft,
  Clipboard as ClipboardIcon,
  Check as CheckIcon,
} from "lucide-react";
import { Button } from "@/registry/mini-app/ui/button";
import { ComponentWrapper } from "./component-wrapper";

function InstallSnippet({ installName }: { installName: string }) {
  const [tab, setTab] = React.useState<"pnpm" | "npm" | "bun">("pnpm");
  const [copied, setCopied] = React.useState(false);
  
  const command = React.useMemo(() => {
    switch (tab) {
      case "pnpm":
        return `pnpm dlx shadcn@latest add https://hellno-mini-app-ui.vercel.app/r/${installName}.json`;
      case "npm":
        return `npx shadcn@latest add https://hellno-mini-app-ui.vercel.app/r/${installName}.json`;
      case "bun":
        return `bun x shadcn@latest add https://hellno-mini-app-ui.vercel.app/r/${installName}.json`;
      default:
        return `pnpm dlx shadcn@latest add https://hellno-mini-app-ui.vercel.app/r/${installName}.json`;
    }
  }, [tab, installName]);
  
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

export default function ComponentPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Jika tidak ada slug, tampilkan halaman 404
  if (!slug) {
    notFound();
  }

  const item = componentItems.find((item) => item.installName === slug);

  if (!item) {
    notFound();
  }

  return (
    <ComponentWrapper>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/95">
        {/* Header */}
        <header className="w-full py-4 px-6 border-b border-border/50 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 hover:bg-muted rounded-full transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5 text-foreground/80" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight">{item.title}</h1>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          <div className="mb-6">
            <p className="text-muted-foreground">
              Component: {item.installName}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="border rounded-xl overflow-hidden bg-card/30 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-center p-8 bg-gradient-to-b from-background/20 to-background/5 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.07),transparent_60%)] pointer-events-none"></div>
                <div className="relative z-10 flex items-center justify-center min-h-[400px] w-full">
                  {item.component}
                </div>
              </div>
            </div>

            <div className="border rounded-xl p-6 bg-card/30 shadow-sm backdrop-blur-sm">
              <InstallSnippet installName={item.installName} />
            </div>
          </div>
        </main>
      </div>
    </ComponentWrapper>
  );
}
