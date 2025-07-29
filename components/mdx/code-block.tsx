"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  children: string
  language?: string
  className?: string
}

export function CodeBlock({ children, language, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = React.useCallback(async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [children])

  return (
    <div className={cn("relative", className)}>
      <Button
        onClick={copyToClipboard}
        size="icon"
        variant="outline"
        className="absolute right-2 top-2 z-10 h-6 w-6"
      >
        {copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
        <span className="sr-only">Copy code</span>
      </Button>
      <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm">
        <code className={language ? `language-${language}` : ""}>{children}</code>
      </pre>
    </div>
  )
}