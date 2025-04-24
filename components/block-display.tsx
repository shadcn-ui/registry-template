import { type Block } from "@/types/block";
import { BlockViewer } from "@/components/block-viewer";

export function BlockDisplay({ block }: { block: Block }) {
  // TODO: Implement the block retrieval from the registry.json file.

  return (
    <BlockViewer block={block} />
  )

  // return (
  //   <div
  //     data-view={view}
  //     className="group/block-view-wrapper flex min-w-0 flex-col items-stretch gap-4"
  //     style={
  //       {
  //         '--height': '930px',
  //       } as React.CSSProperties
  //     }
  //   >
  //     <div className="flex flex-col gap-4">
  //       <div className="flex w-full items-center gap-2 md:pr-[14px]">
  //         <Tabs 
  //           defaultValue="preview"
  //           onValueChange={(value) => setView(value as "preview" | "code" | "docs")}
  //           className="hidden lg:flex"
  //         >
  //           <TabsList className="h-10 items-center rounded-md p-0 px-[calc(theme(spacing.1)_-_2px)] py-[theme(spacing.1)]">
  //             <TabsTrigger
  //               value="preview"
  //               className="rounded-sm px-2 text-xs"
  //             >
  //               Preview
  //             </TabsTrigger>
  //             <TabsTrigger
  //               value="code"
  //               className="rounded-sm px-2 text-xs"
  //             >
  //               Code
  //             </TabsTrigger>
  //             <TabsTrigger
  //               value="docs"
  //               className="rounded-sm px-2 text-xs"
  //             >
  //               Docs
  //             </TabsTrigger>
  //           </TabsList>

  //           <TabsContent value="preview">
  //             <BlockPreview block={block} />
  //           </TabsContent>
  //           <TabsContent value="code">
  //             <BlockCode block={block} />
  //           </TabsContent>
  //           <TabsContent value="docs">
  //             <BlockDocs block={block} />
  //           </TabsContent>
  //         </Tabs>
  //       </div>
  //     </div>
  //   </div>
  // )
}