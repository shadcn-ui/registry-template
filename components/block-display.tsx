import { type Block } from "@/types/block";
import { BlockViewer } from "@/components/block-viewer";
import { getFilesTreeByBlockId, getFilesContentByBlockId } from "@/lib/registry";

export async function BlockDisplay({ block }: { block: Block }) {
  const [tree, code] = await Promise.all([
    getFilesTreeByBlockId(block.id),
    getFilesContentByBlockId(block.id)
  ]);

  if (!tree || !code) {
    return null;
  }

  return (
    <BlockViewer block={block} tree={tree} code={code} />
  )
}
