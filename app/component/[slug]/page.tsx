"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { componentItems } from "@/lib/components-config";
import {
  ArrowLeft,
  Clipboard as ClipboardIcon,
  Check as CheckIcon,
} from "lucide-react";
import { Button } from "@/registry/mini-app/ui/button";
import { ComponentWrapper } from "./component-wrapper";

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
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Install this component</h3>
      <div className="flex border rounded-t-md justify-between overflow-hidden">
        <div className="flex text-sm font-mono">
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

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = componentItems.find((item) => item.installName === slug);

  if (!item) {
    notFound();
  }

  return (
    <ComponentWrapper>
      <div className="max-w-4xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to components
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{item.title}</h1>
            <p className="text-muted-foreground mt-1">
              Component: {item.installName}
            </p>
          </div>
        </header>

        <main className="flex flex-col flex-1 gap-8">
          <div className="flex items-center justify-center min-h-[300px] lg:min-h-[600px] border rounded-lg p-8">
            {item.component}
          </div>

          <InstallSnippet installName={item.installName} />
        </main>
      </div>
    </ComponentWrapper>
  );
}
