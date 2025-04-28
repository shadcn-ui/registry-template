'use client';

import { createContext, useContext, useState, useMemo, Fragment } from "react";
import Image from "next/image";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sidebar, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarProvider } from "@/components/ui/sidebar";
import { type Block } from "@/types/block";
import { ChevronRight, File, Folder, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeDisplay } from "@/components/code-display";
import { type Tree, findFirstFile, pathsToTree } from "@/lib/registry";
import { type Code } from "@/lib/code";

type BlockViewerContext = {
  // states
  view: "preview" | "code" | "docs";
  setView: (view: "preview" | "code" | "docs") => void;
  activeFile: string;
  setActiveFile: (file: string) => void;

  // primitives
  block: Block;
  tree: Tree[];
  code: Code[];
}

const BlockViewerContext = createContext<BlockViewerContext | null>(null);

function useBlockViewer() {
  const context = useContext(BlockViewerContext);
  if (!context) {
    throw new Error("useBlockViewer must be used within a BlockViewerProvider");
  }
  return context;
}

function BlockViewerProvider(
  { 
    block, 
    children, 
    tree, 
    code 
  }: { 
    block: Block, 
    children: React.ReactNode, 
    tree: Tree[], 
    code: Code[] 
  }
) {
  const [view, setView] = useState<"preview" | "code" | "docs">("preview");
  const [currentBlock] = useState<Block>(block);

  const [activeFile, setActiveFile] = useState<BlockViewerContext['activeFile']>(() => {
    return findFirstFile(tree) || '';
  });

  return (
    <BlockViewerContext.Provider value={{ view, setView, activeFile, setActiveFile, block: currentBlock, tree, code }}>
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

function FileTree({ level = 0, items }: { level?: number; items?: Tree[] }) {
  const { tree, activeFile, setActiveFile } = useBlockViewer();
  const filesToRender = items || tree;

  return (
    <>
      {filesToRender.map((file, index) => (
        <Fragment key={`${file.name}-${index}`}>
          {file.type === 'folder' ? (
            <SidebarMenuItem>
              <Collapsible
                key={`${file.name}-${index}`}
                className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                // TODO: smartly open the first folder
                // defaultOpen={file.children?.length && file.children.length > 0}
                defaultOpen
                >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      "whitespace-nowrap rounded-none pl-[--index]", 
                      "hover:bg-zinc-700 hover:text-white focus-visible:bg-zinc-700 focus-visible:text-white active:bg-zinc-700",
                      "active:text-white data-[active=true]:bg-zinc-700 data-[active=true]:text-white", 
                      "data-[state=open]:hover:bg-zinc-700 data-[state=open]:hover:text-white"
                    )}
                    style={
                      {
                        "--index": `${level * 1.2}rem`,
                      } as React.CSSProperties
                    }
                  >
                    <ChevronRight className="h-4 w-4 transition-transform" />
                    <Folder className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub
                    className="w-full p-0"
                  >
                    {file.children && <FileTree level={level + 1} items={file.children} />}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuButton
              isActive={file.name === activeFile}
              onClick={() => file.name && setActiveFile(file.name)}
              className={cn(
                "whitespace-nowrap rounded-none pl-[--index]", 
                "hover:bg-zinc-700 hover:text-white focus:bg-zinc-700 focus:text-white focus-visible:bg-zinc-700", 
                "focus-visible:text-white active:bg-zinc-700 active:text-white data-[active=true]:bg-zinc-700 ", 
                "data-[active=true]:text-white data-[state=open]:hover:bg-gray-700 data-[state=open]:hover:text-white"
              )}
              data-index={index}
              style={
                {
                  "--index": `${level * 1.2}rem`,
                } as React.CSSProperties
              }
            >
              <ChevronRight className="invisible" />
              <File className="h-4 w-4" />
              {file.name}
            </SidebarMenuButton>
          )}
        </Fragment>
      ))}
    </>
  );
}

function BlockCode() {
  const { code, activeFile } = useBlockViewer();

  return (
    <TabsContent value="code" className="flex-1">
      <div className="mr-[14px] flex overflow-hidden rounded-xl bg-background/80 text-accent-foreground group-data-[view=preview]/block-view-wrapper:hidden md:h-[var(--height)]">
        <div className="w-[280px]">
          <SidebarProvider className="flex !min-h-full flex-col">
            <Sidebar
              collapsible="none"
              className="w-full flex-1 border-r border-zinc-700 bg-zinc-900 text-white"
            >

              <SidebarGroupLabel className="h-12 rounded-none border-b border-zinc-700 px-4 text-sm text-white">
                Files
              </SidebarGroupLabel>
              <SidebarGroup className="p-0 pt-5">
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1.5">
                    <FileTree />
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </Sidebar>
          </SidebarProvider>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-12 items-center gap-2 border-b border-zinc-700 bg-zinc-900 px-4 text-sm font-medium">
            <File className="size-4" />
            <span>{activeFile}</span>
            <div className="ml-auto flex items-center gap-2">
              <Copy className="size-4" />
            </div>
          </div>
          <CodeDisplay code={code.find((file) => file.name === activeFile) as Code} />
        </div>
      </div>
    </TabsContent>
  );
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

function BlockViewer({ block, tree: rawTree, code }: { block: Block, tree: Tree[], code: Code[] }) {
  const processedTree = useMemo(() => {
    if (block.files) {
      return pathsToTree(block.files);
    }
    return rawTree;
  }, [block.files, rawTree]);

  return (
    <BlockViewerProvider block={block} tree={processedTree} code={code}>
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