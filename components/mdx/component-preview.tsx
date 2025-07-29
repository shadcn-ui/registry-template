import * as React from "react"
import { ComponentPreviewTabs } from "@/components/component-preview-tabs"
import { ComponentSource } from "@/components/component-source"
import { getComponentSource } from "@/lib/get-component-source"

interface ComponentPreviewProps {
  children: React.ReactNode
  name: string
  className?: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
}

export async function ComponentPreview({
  children,
  name,
  className,
  align = "center",
  hideCode = false,
}: ComponentPreviewProps) {
  // Verify component exists
  const code = getComponentSource(name)
  
  if (!code) {
    return (
      <p className="text-muted-foreground text-sm">
        Component{" "}
        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {name}
        </code>{" "}
        not found in registry.
      </p>
    )
  }

  return (
    <ComponentPreviewTabs
      className={className}
      align={align}
      hideCode={hideCode}
      component={children}
      source={<ComponentSource name={name} />}
    />
  )
}