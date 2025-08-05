"use client";

import React, { useState } from 'react';
import { useTheme } from '@/store/theme-store';
import { generateThemeCSS } from '@/lib/generate-theme-css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/new-york/ui/dialog';
import { Button } from '@/registry/new-york/ui/button';
import { Copy, Check, Code } from 'lucide-react';

interface ThemeCodeModalProps {
  children: React.ReactNode;
}

export function ThemeCodeModal({ children }: ThemeCodeModalProps) {
  const { lightTheme, darkTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const generatedCSS = generateThemeCSS({ lightTheme, darkTheme });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCSS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Theme Code
          </DialogTitle>
          <DialogDescription>
            Copy this CSS code to use your custom theme in any project. Add it to your globals.css file.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
          {/* Code block header with copy button */}
          <div className="flex items-center justify-between bg-muted/30 px-4 py-2 border-b">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium font-mono">globals.css</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
              className="h-8 px-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          
          {/* Code content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto">
              <pre className="text-sm p-4 bg-code text-code-foreground font-mono leading-relaxed">
                <code>{generatedCSS}</code>
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}