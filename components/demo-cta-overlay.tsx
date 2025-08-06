"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Copy, Sparkles } from "lucide-react"
import { Button } from "@/registry/new-york/ui/button"
import { Card, CardContent } from "@/registry/new-york/ui/card"

export function DemoCTAOverlay() {
  return (
    <div className="absolute bottom-4 right-4 z-10">
      <Card className="w-80 border shadow-lg">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Like what you see?</h3>
              <p className="text-xs text-muted-foreground">
                50+ components ready to copy
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button asChild size="sm" className="w-full">
              <Link href="/docs" className="flex items-center gap-2">
                <BookOpen className="h-3 w-3" />
                Explore All Components
                <ArrowRight className="h-3 w-3 ml-auto" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/docs/getting-started" className="flex items-center gap-2 justify-start">
                <Copy className="h-3 w-3" />
                Get Started Guide
              </Link>
            </Button>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-xs text-muted-foreground">
              Works with{" "}
              <span className="font-medium text-foreground">shadcn/ui</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function DemoHeaderCTA() {
  return (
    <div className="border-b bg-muted/50 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="font-medium">Live Demo</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            Customize themes in real-time
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
            <Link href="/docs">
              View Docs
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}