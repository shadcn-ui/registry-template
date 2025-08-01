import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york/ui/button"
import { Skeleton } from "@/registry/new-york/ui/skeleton"

export function GitHubLink() {
  return (
    <Button asChild size="sm" variant="ghost" className="h-8 shadow-none">
      <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
        <Icons.gitHub />
        <React.Suspense fallback={<Skeleton className="h-4 w-8" />}>
          <StarsCount />
        </React.Suspense>
      </Link>
    </Button>
  )
}

export async function StarsCount() {
  try {
    const data = await fetch("https://api.github.com/repos/jarrodwatts/agw-reusables", {
      next: { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
    })
    
    if (!data.ok) {
      return <span className="text-muted-foreground w-2 text-xs tabular-nums">-</span>
    }
    
    const json = await data.json()
    const starCount = json?.stargazers_count

    if (typeof starCount !== 'number') {
      return <span className="text-muted-foreground w-2 text-xs tabular-nums">-</span>
    }

    return (
      <span className="text-muted-foreground w-2 text-xs tabular-nums">
        {starCount >= 1000
          ? `${(starCount / 1000).toFixed(1)}k`
          : starCount.toLocaleString()}
      </span>
    )
  } catch {
    return <span className="text-muted-foreground w-2 text-xs tabular-nums">-</span>
  }
}
