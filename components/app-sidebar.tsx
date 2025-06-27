import * as React from "react";
import {
  GalleryVerticalEnd,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { ComponentGroup } from "@/lib/components-config";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onComponentClick?: (componentId: string) => void;
  componentGroups: ComponentGroup[];
}

export function AppSidebar({ onComponentClick, componentGroups, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">hellno/mini-app-ui</span>
                <span className="text-xs">Component Registry</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {componentGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item, index) => (
                <SidebarMenuItem key={item.installName || item.slug || `${groupIndex}-${index}`}>
                  <SidebarMenuButton
                    onClick={() => onComponentClick?.(item.installName || item.slug || `${groupIndex}-${index}`)}
                    className="text-sm"
                  >
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
