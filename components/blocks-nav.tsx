"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const blocks = [
  {
    name: "Dashboard",
    href: "/features/dashboard",
    code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/features/dashboard",
    hidden: true,
  },
]

// interface BlocksNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function BlocksNav({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn("flex items-center", className)} {...props}>
          <BlockLink
            block={{ name: "Authentication", href: "/", code: "", hidden: false }}
            isActive={pathname === "/"}
          />
          { blocks.map((block) => (
            <BlockLink
              key={block.href}
              block={block}
              isActive={pathname?.startsWith(block.href) ?? false}
            />
          ))}
          <BlockLink block={{ name: "More blocks coming soon", href: "/roadmap", code: "", hidden: false }} isActive={false} isLast={true} />
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}

function BlockLink({
  block,
  isActive,
  isLast,
}: {
  block: (typeof blocks)[number]
  isActive: boolean
  isLast?: boolean
}) {
  if (block.hidden) {
    return null
  }

  return (
    <Link
      href={block.href}
      key={block.href}
      className={cn(
        'flex h-7 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 text-center text-sm', 
        'font-medium text-muted-foreground transition-colors hover:text-foreground', 
        'data-[active=true]:bg-muted data-[active=true]:text-primary',
        // add text gradient
        isLast && 'transition-colors bg-gradient-to-r from-primary/80 to-primary text-transparent bg-clip-text'
      )}
      data-active={isActive}
    >
      {block.name}
    </Link>
  )
}