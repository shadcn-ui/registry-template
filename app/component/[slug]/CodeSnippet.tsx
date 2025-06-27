"use client";

import * as React from "react";
import { Button } from "@/registry/mini-app/ui/button";
import { Clipboard as ClipboardIcon, Check as CheckIcon } from "lucide-react";

type CodeSnippetProps = {
  code: string;
  title?: string;
};

export function CodeSnippet({ code, title = "Example Code" }: CodeSnippetProps) {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4 mr-2" />
              Copy Code
            </>
          )}
        </Button>
      </div>
      <div className="relative">
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}