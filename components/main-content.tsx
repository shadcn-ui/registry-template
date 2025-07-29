"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const isMobile = useIsMobile()

  return (
    <div className={cn(
      "fixed top-14 right-0 bottom-0 overflow-hidden",
      isMobile ? "left-0" : "left-64"
    )}>
      <div className="flex justify-center h-full overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-2xl px-4 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}