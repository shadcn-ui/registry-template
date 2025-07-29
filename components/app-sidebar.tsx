"use client"

import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Blocks, Home, Layers, Puzzle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const gettingStartedItems = [
  {
    title: "Introduction",
    url: "/",
  },
]

const componentSections = [
  {
    title: "Components",
    items: [
      {
        title: "Hello World",
        url: "/hello-world",
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  if (isMobile) {
    return null
  }

  return (
    <Sidebar collapsible="none" className="bg-transparent h-[calc(100vh-56px)] pl-3 pr-2 pb-12 overflow-auto gap-2 font-sans fixed top-14 left-0 z-10">
      <SidebarContent className="gap-2 mt-8">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">Getting Started</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gettingStartedItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={cn(
                      "text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.url && "bg-accent text-accent-foreground"
                    )}
                  >
                    <a href={item.url}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {componentSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={cn(
                        "text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.url && "bg-accent text-accent-foreground"
                      )}
                    >
                      <a href={item.url}>
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}