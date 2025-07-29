"use client"

import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"
import { MobileMenu } from "@/components/mobile-menu"
import Image from "next/image"

export function Header() {
  const isMobile = useIsMobile()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {isMobile ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          ) : (
            <Image 
              src="/abs-keycap-2.png" 
              alt="AGW Reusables" 
              className="h-12 w-12" 
              width={48} 
              height={48} 
              quality={100} 
              priority
              sizes="48px"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubLogoIcon className="h-6 w-6" />
            </a>
          </Button>
          <ModeToggle />
        </div>
      </div>
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  )
}