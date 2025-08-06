"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Code2, Download, ExternalLink, Zap } from "lucide-react"
import { Button } from "@/registry/new-york/ui/button"
import { Badge } from "@/registry/new-york/ui/badge"

export function HeroSection() {
  return (
    <div className="w-full">
      {/* Top Banner CTA - Hidden for now */}
      {/* <div className="w-full bg-primary text-primary-foreground">
        <div className="container-wrapper px-6">
          <div className="flex h-12 items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Zap className="h-4 w-4" />
              <span>
                50+ ready-to-use components • Copy & paste in seconds
              </span>
            </div>
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="hidden text-xs font-medium sm:flex"
            >
              <Link href="/docs" className="flex items-center gap-1">
                Get started now
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div> */}

      {/* Hero Content */}
      <div className="container-wrapper px-6 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 flex justify-center">
            <Badge variant="secondary" className="text-xs">
              shadcn/ui Compatible Registry
            </Badge>
          </div>
          
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Copy. Paste. Ship.
            </span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Interactive demo of customizable components. See live theme controls below, 
            then{" "}
            <Link 
              href="/docs" 
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              explore the docs
            </Link>{" "}
            to add them to your project.
          </p>

          {/* Main CTAs */}
          <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/docs" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Get Started
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link 
                href="https://github.com/jarrodwatts/agw-reusables" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Code2 className="h-4 w-4" />
                View GitHub
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}