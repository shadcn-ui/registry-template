// path: app/component/[slug]/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { componentItems } from "@/lib/components-config";
import { ArrowLeft } from "lucide-react";
import { ComponentWrapper } from "./component-wrapper";
import { InstallSnippet } from "./InstallSnippet";
import { CodeSnippet } from "./CodeSnippet";

export default function ComponentPage() {
  const params = useParams();
  const slug = params?.slug as string;

  if (!slug) {
    notFound();
  }

  const item = componentItems.find((item) => 
    item.installName === slug || item.slug === slug
  );

  if (!item) {
    notFound();
  }

  return (
    <ComponentWrapper>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/95">
        {/* Header */}
        <header className="w-full py-4 px-6 border-b border-border/50 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="p-1.5 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground/80" />
            </div>
            <h1 className="text-muted-foreground tracking-tight">
              hellno/mini-app-ui
            </h1>
          </Link>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight">{item.title}</h1>
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
              {item.isDemo && item.demoCode ? (
                <CodeSnippet code={item.demoCode} title="Example Implementation" />
              ) : (
                item.installName && <InstallSnippet installName={item.installName} />
              )}
            </div>
          </div>
        </main>
      </div>
    </ComponentWrapper>
  );
}
