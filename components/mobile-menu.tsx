"use client"

import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const gettingStartedItems = [
  {
    title: "Introduction",
    url: "/",
  },
]

const componentSections = []

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex h-14 items-center justify-between px-4 border-b">
        <h2 className="font-semibold">Menu</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-3">Getting Started</h3>
          <div className="space-y-1">
            {gettingStartedItems.map((item) => (
              <a
                key={item.title}
                href={item.url}
                onClick={onClose}
                className={cn(
                  "block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                  pathname === item.url && "bg-accent text-accent-foreground"
                )}
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>

        {componentSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-medium text-muted-foreground mb-3">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  onClick={onClose}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                    pathname === item.url && "bg-accent text-accent-foreground"
                  )}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}