import { type Block } from "@/types/block";
import { BlockViewer } from "@/components/block-viewer";

export function BlockDisplay({ block }: { block: Block }) {
  // TODO: Implement the block retrieval from the registry.json file.

  return (
    <BlockViewer block={block} />
  )
}