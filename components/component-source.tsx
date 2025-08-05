import fs from "node:fs/promises"
import path from "node:path"
import * as React from "react"

import { highlightCode } from "@/lib/highlight-code"
import { getRegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { CopyButton } from "@/components/copy-button"
import { getIconForLanguageExtension } from "@/components/icons"

/**
 * Transforms internal registry import paths to user-facing paths
 * This ensures the component preview shows the correct import paths
 * that users will actually use after installation
 */
function transformRegistryImports(code: string): string {
  let transformedCode = code

  // 1. Transform registry hooks: @/registry/new-york/blocks/*/hooks/* → @/hooks/*
  transformedCode = transformedCode.replace(
    /@\/registry\/new-york\/blocks\/[^/]+\/hooks\/([^"']+)/g,
    "@/hooks/$1"
  )

  // 2. Transform registry lib files: @/registry/new-york/blocks/*/lib/* → @/lib/*
  transformedCode = transformedCode.replace(
    /@\/registry\/new-york\/blocks\/[^/]+\/lib\/([^"']+)/g,
    "@/lib/$1"
  )

  // 3. Transform registry block main components: @/registry/new-york/blocks/[dir]/[file] → @/components/[file]
  transformedCode = transformedCode.replace(
    /@\/registry\/new-york\/blocks\/[^/]+\/([^/"']+)(?:\.tsx?|\.jsx?)?/g,
    "@/components/$1"
  )

  // 4. Transform registry UI components: @/registry/new-york/ui/* → @/components/ui/*
  transformedCode = transformedCode.replace(
    /@\/registry\/new-york\/ui\/([^"']+)/g,
    "@/components/ui/$1"
  )

  return transformedCode
}

export async function ComponentSource({
  name,
  src,
  title,
  language,
  collapsible = true,
  className,
}: React.ComponentProps<"div"> & {
  name?: string
  src?: string
  title?: string
  language?: string
  collapsible?: boolean
}) {
  if (!name && !src) {
    return null
  }

  let code: string | undefined

  if (name) {
    const item = await getRegistryItem(name)
    code = item?.files?.[0]?.content
  }

  if (src) {
    const file = await fs.readFile(path.join(process.cwd(), src), "utf-8")
    code = file
  }

  if (!code) {
    return null
  }

  // Transform registry imports to user-facing paths
  code = transformRegistryImports(code)

  const lang = language ?? title?.split(".").pop() ?? "tsx"
  const highlightedCode = await highlightCode(code, lang)

  if (!collapsible) {
    return (
      <div className={cn("relative", className)}>
        <ComponentCode
          code={code}
          highlightedCode={highlightedCode}
          language={lang}
          title={title}
        />
      </div>
    )
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      <ComponentCode
        code={code}
        highlightedCode={highlightedCode}
        language={lang}
        title={title}
      />
    </CodeCollapsibleWrapper>
  )
}

function ComponentCode({
  code,
  highlightedCode,
  language,
  title,
}: {
  code: string
  highlightedCode: string
  language: string
  title: string | undefined
}) {
  return (
    <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
      {title && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
          data-language={language}
        >
          {getIconForLanguageExtension(language)}
          {title}
        </figcaption>
      )}
      <CopyButton value={code} />
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  )
}
