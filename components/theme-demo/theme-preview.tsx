"use client";

import React from 'react';
import { ScrollArea } from '@/registry/new-york/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Wallet } from 'lucide-react';
import AbstractProfileDemo from '@/registry/new-york/examples/abstract-profile-demo';

function ComponentShowcase() {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Abstract Profile
          </CardTitle>
          <CardDescription>Wallet profile with tier system</CardDescription>
        </CardHeader>
        <CardContent>
          <AbstractProfileDemo />
        </CardContent>
      </Card>
    </div>
  );
}


export function ThemePreview() {
  return (
    <div className="w-full h-full theme-container">
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Component Preview</h1>
            <p className="text-muted-foreground">
              Preview how your theme looks across components. 
              Adjust colors in the sidebar to see changes in real-time.
            </p>
          </div>
          <ComponentShowcase />
        </div>
      </ScrollArea>
    </div>
  );
}