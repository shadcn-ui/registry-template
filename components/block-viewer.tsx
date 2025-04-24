'use client';

import { createContext, useContext, useState } from "react";
import { type Block } from "@/types/block";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import Image from "next/image";

type BlockViewerContext = {
  view: "preview" | "code" | "docs";
  setView: (view: "preview" | "code" | "docs") => void;
  block: Block;
}

const BlockViewerContext = createContext<BlockViewerContext | null>(null);

function useBlockViewer() {
  const context = useContext(BlockViewerContext);
  if (!context) {
    throw new Error("useBlockViewer must be used within a BlockViewerProvider");
  }
  return context;
}

function BlockViewerProvider({ block, children }: { block: Block, children: React.ReactNode }) {
  const [view, setView] = useState<"preview" | "code" | "docs">("preview");
  const [currentBlock] = useState<Block>(block);

  return (
    <BlockViewerContext.Provider value={{ view, setView, block: currentBlock }}>
      <div
        id={currentBlock.id}
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

function BlockCode() {
  const { block } = useBlockViewer();
  return (
    <TabsContent value="code">
      <div>
        <h2>Code</h2>
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </div>
    </TabsContent>
  )
}

function BlockDocs() {
  const { block } = useBlockViewer();
  return (
    <TabsContent value="docs">
      <div>
        <h2>Docs</h2>
        <pre>{JSON.stringify(block, null, 2)}</pre>
      </div>
    </TabsContent>
  )
}

function BlockPreview() {
  const { block } = useBlockViewer();
  return (
    <TabsContent value="preview">
      <div className="grid w-full gap-4">
        <ResizablePanelGroup direction="horizontal" className="relative z-10">
          <ResizablePanel 
            className="relative aspect-[4/2.5] rounded-xl border bg-background md:aspect-auto"
            defaultSize={100}
            minSize={30}
          >
            {/* TODO: add images for mobile and dark/light mode */}
            <Image
              src="https://ui.shadcn.com/r/styles/new-york/login-01-light.png"
              alt="Block Preview"
              data-block={block.id}
              width={1440}
              height={900}
              className="object-cover dark:hidden md:hidden md:dark:hidden"
            />
            <Image
              src="https://ui.shadcn.com/r/styles/new-york/login-01-dark.png"
              alt="Block Preview"
              data-block={block.id}
              width={1440}
              height={900}
              className="hidden object-cover dark:block md:hidden md:dark:hidden"
            />
            <iframe
              src={`https://ui.shadcn.com/view/styles/new-york/login-01`}
              height={930}
              className="relative z-20 hidden w-full bg-background md:block"
            />
          </ResizablePanel>
          <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 md:block" />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </div>
    </TabsContent>
  )
}

function BlockViewer({ block }: { block: Block }) {
  return (
    <BlockViewerProvider block={block}>
      <BlockToolbar />
      <BlockPreview />
      <BlockCode />
      <BlockDocs />
    </BlockViewerProvider>
  )
}

BlockViewer.displayName = "BlockViewer";

export {
  BlockViewer,
}