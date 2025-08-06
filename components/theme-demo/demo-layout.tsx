"use client";

import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/registry/new-york/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york/ui/tabs';
import { ThemeSidebar } from './theme-sidebar';
import { ThemePreview } from './theme-preview';
import { DemoHeaderCTA } from '@/components/demo-cta-overlay';
import { Settings, Eye } from 'lucide-react';

export function DemoLayout() {

  return (
    <div className="w-full h-[calc(100vh-6rem)] rounded-lg border bg-background overflow-hidden">
      <DemoHeaderCTA />
      {/* Desktop Layout - Resizable */}
      <div className="hidden md:block h-[calc(100%-2.5rem)]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <ThemeSidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={70}>
            <ThemePreview />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile Layout - Tabs */}
      <div className="md:hidden h-[calc(100%-2.5rem)]">
        <Tabs defaultValue="preview" className="h-full flex flex-col">
          <div className="border-b p-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="controls" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Controls
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="preview" className="flex-1 m-0">
            <ThemePreview />
          </TabsContent>
          
          <TabsContent value="controls" className="flex-1 m-0">
            <ThemeSidebar />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}