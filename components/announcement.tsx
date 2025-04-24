import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
export function Announcement() {
  return (
    <Link
      href={siteConfig.links.registry.docs}
      className="group mb-2 inline-flex items-center gap-2 px-0.5 text-sm font-medium"
    >
      <Icons.logo className="h-4 w-4 fill-current" />
      <span className="underline-offset-4 group-hover:underline">
        Get Started with shadcn/registry
      </span>
      <ArrowRight className="ml-1 h-4 w-4" />
    </Link>
  )
}