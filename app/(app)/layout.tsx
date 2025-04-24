import Link from "next/link"
import { Metadata } from "next"
import { Announcement } from "@/components/announcement"
import { Button } from "@/components/ui/button"
import { 
  PageActions, 
  PageHeader, 
  PageHeaderDescription, 
  PageHeaderHeading 
} from "@/components/page-header"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { BlocksNav } from "@/components/blocks-nav"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          siteConfig.og.title
        )}&description=${encodeURIComponent(siteConfig.og.description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          siteConfig.og.title
        )}&description=${encodeURIComponent(siteConfig.og.description)}`,
      },
    ],
  },    
}

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div data-wrapper="" className="border-grid flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <PageHeader>
          <Announcement />
          <PageHeaderHeading>
            Run your own <span className="font-mono px-1 rounded-md text-rose-700">private</span> registry
          </PageHeaderHeading>
          <PageHeaderDescription>{metadata.description}</PageHeaderDescription>
          <PageActions>
            <Button>
              <Link href="#blocks">Browse blocks</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Roadmap</Link>
            </Button>          
          </PageActions>
        </PageHeader>
        <div id="blocks" className="border-grid scroll-mt-24 border-b">
          <div className="container-wrapper">
            <div className="container flex items-center py-4">
              <BlocksNav />
            </div>
          </div>
        </div>
        <div className="container-wrapper flex-1">{children}</div>
      </main>
      <SiteFooter />
    </div>
  )
}