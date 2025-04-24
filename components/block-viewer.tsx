'use client';

import { createContext, useContext, useState } from "react";
import { type Block } from "@/types/block";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";

type BlockViewerContext = {
  view: "preview" | "code" | "docs";
  setView: (view: "preview" | "code" | "docs") => void;
  block: Block | null;
}

const BlockViewerContext = createContext<BlockViewerContext | null>(null);

function useBlockViewer() {
  const context = useContext(BlockViewerContext);
  if (!context) {
    throw new Error("useBlockViewer must be used within a BlockViewerProvider");
  }
  return context;
}

function BlockViewerProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<"preview" | "code" | "docs">("preview");
  const [block] = useState<Block | null>(null);

  return (
    <BlockViewerContext.Provider value={{ view, setView, block }}>
      <div
        id={block?.id}
        data-view={view}
        className="group/block-view-wrapper flex min-w-0 flex-col items-stretch gap-4"
        style={
          {
            '--height': '930px',
          } as React.CSSProperties
        }
      >
        <Tabs 
          defaultValue="preview"
          onValueChange={(value) => setView(value as "preview" | "code" | "docs")}
          className="hidden lg:flex"
        >
          {children}
        </Tabs>
      </div>
    </BlockViewerContext.Provider>
  );
}

function BlockToolbar() {
  return (
    <TabsList className="h-10 items-center rounded-md p-0 px-[calc(theme(spacing.1)_-_2px)] py-[theme(spacing.1)]">
      <TabsTrigger
        value="preview"
        className="rounded-sm px-2 text-xs"
      >
        Preview
      </TabsTrigger>
      <TabsTrigger
        value="code"
        className="rounded-sm px-2 text-xs"
      >
        Code
      </TabsTrigger>
      <TabsTrigger
        value="docs"
        className="rounded-sm px-2 text-xs"
      >
        Docs
      </TabsTrigger>
    </TabsList>
  )
}

function BlockCode({ block }: { block: Block }) {
  return (
    <TabsContent value="code">
      <div>
        <h2>Code</h2>
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </div>
    </TabsContent>
  )
}

function BlockDocs({ block }: { block: Block }) {
  return (
    <TabsContent value="docs">
      <div>
        <h2>Docs</h2>
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </div>
    </TabsContent>
  )
}

function BlockPreview({ block }: { block: Block }) {
  return (
    <TabsContent value="preview">
      <div>
        <h2>Preview</h2>
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </div>
    </TabsContent>
  )
}

function BlockViewer({ block }: { block: Block }) {
  return (
    <BlockViewerProvider>
      <BlockToolbar />
      <BlockPreview block={block} />
      <BlockCode block={block} />
      <BlockDocs block={block} />
    </BlockViewerProvider>
  )
}

BlockViewer.displayName = "BlockViewer";

export {
  BlockViewer,
}