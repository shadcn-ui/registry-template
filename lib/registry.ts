import path from 'path';
import React from 'react';
import { type RegistryItem } from 'shadcn/registry'
import { getHighlightedCode, type Code } from '@/lib/code';

export type Tree = {
  name: string;
  type: 'file' | 'folder';
  children?: Tree[];
}

export const DEFAULT_REGISTRY_STYLE = "new-york" as const;
export const DEFAULT_LANGUAGE = "tsx" as const;

export function findFirstFile(tree: Tree[]): string | undefined {
  for (const item of tree) {
    if (item.type === 'file') {
      return item.name;
    }
    if (item.children) {
      const found = findFirstFile(item.children);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Converts an array of file paths into a tree structure.
 * 
 * Example input:
 * [
 *   { path: "registry/new-york/blocks/example-with-css/example-card.tsx" },
 *   { path: "registry/new-york/blocks/example-with-css/example-card.css" }
 * ]
 * 
 * Example output:
 * [
 *   {
 *     name: "blocks",
 *     type: "folder",
 *     children: [{
 *       name: "example-with-css",
 *       type: "folder",
 *       children: [
 *         { name: "example-card.tsx", type: "file" },
 *         { name: "example-card.css", type: "file" }
 *       ]
 *     }]
 *   }
 * ]
 * 
 * The function:
 * 1. Ignores 'registry' and 'new-york' prefixes from paths
 * 2. Creates folder nodes automatically for each path segment
 * 3. Reuses existing folders when they exist
 * 4. Maintains the hierarchical structure of the files
 */
export function pathsToTree(paths: { path: string }[]): Tree[] {
  const tree: Tree[] = [];
  
  for (const { path } of paths) {
    const parts = path.split('/');
    let currentLevel = tree;

    parts.forEach((part, index) => {
      // Skip the registry/new-york/blocks prefix
      if (part === 'registry' || part === 'new-york') return;

      const existing = currentLevel.find(node => node.name === part);
      
      if (existing) {
        if (existing.type === 'folder') {
          currentLevel = existing.children!;
        }
      } else {
        const isLastPart = index === parts.length - 1;
        const newNode: Tree = {
          name: part,
          type: isLastPart ? 'file' : 'folder',
          ...(isLastPart ? {} : { children: [] })
        };
        
        currentLevel.push(newNode);
        if (!isLastPart) {
          currentLevel = newNode.children!;
        }
      }
    });
  }

  return tree;
}

export const getFilesByBlockId = React.cache(
  async (blockId: string) => {
    const registry = await import("@/registry.json") as { items: RegistryItem[] };
    const item = registry.items.find(
      (item: RegistryItem) => item.name === blockId,
    );

    if (!item) {
      return null;
    }

    return item.files as RegistryItem["files"];
  }
);

export const getFilesTreeByBlockId = React.cache(
  async (blockId: string) => {
    const files = await getFilesByBlockId(blockId);
    
    if (!files) {
      return null;
    }

    const root: Tree = {
      name: 'root',
      type: 'folder',
      children: [],
    };

    files.forEach((file) => {
      // Split the path and remove 'registry' and the style folder (new-york)
      const parts = file.path.split('/').slice(2);
      let current = root;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // This is a file
          current.children = current.children || [];
          current.children.push({
            name: part,
            type: 'file'
          });
        } else {
          // This is a folder
          current.children = current.children || [];
          let folder = current.children.find(
            child => child.type === 'folder' && child.name === part
          );
          
          if (!folder) {
            folder = {
              name: part,
              type: 'folder',
              children: []
            };
            current.children.push(folder);
          }
          
          current = folder;
        }
      });
    });

    return root.children;
  }
);

export const getFilesContentByBlockId = React.cache(
  async (blockId: string) => {
    // const files = await getFilesByBlockId(blockId);

    // get content from the r public folder
    // TODO: change this, not sure if the r public folder is the best place to get the content from - @rbadillap
    const registryItem: RegistryItem = await import(`@/public/r/${blockId}.json`);
    const { files } = registryItem;

    if (!files) {
      return null;
    }

    const content = await Promise.all(files.map(async (file) => {
      const ext = path.extname(file.path).slice(1) as Code["language"] || DEFAULT_LANGUAGE;
      const code = await getHighlightedCode(file.content, ext);

      return {
        name: path.basename(file.path),
        content: code,
        language: ext,
      } as Code;
    }))

    return content;
  }
);