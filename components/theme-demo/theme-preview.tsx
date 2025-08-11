"use client";

import React from 'react';
import { ScrollArea } from '@/registry/new-york/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';
import { AbstractProfile } from '@/registry/new-york/blocks/abstract-profile/abstract-profile';
import AbstractProfileDemo from '@/registry/new-york/examples/abstract-profile-demo';
import ConnectWalletButtonDemo from '@/registry/new-york/examples/connect-wallet-button-demo';
import SiweButtonDemo from '@/registry/new-york/examples/siwe-button-demo';
import SessionKeysDemo from '@/registry/new-york/examples/session-keys-demo';
import PortfolioChartDemo from '@/registry/new-york/examples/portfolio-chart-demo';
import { DemoCTAOverlay } from '@/components/demo-cta-overlay';

function ComponentShowcase() {
  const { address, isConnected } = useAccount();

  return (
    <div className="columns-1 lg:columns-2 gap-4 space-y-4">
      {/* Connect Wallet - Enhanced with Profile */}
      <Card className="w-full break-inside-avoid mb-4 relative gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </CardTitle>
          <CardDescription>One-click wallet connection</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ConnectWalletButtonDemo />
        </CardContent>
        {isConnected && address && (
          <>
            <div className="absolute right-[7.5rem] top-4 bottom-4 w-px bg-muted-foreground/20"></div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <AbstractProfile
                address={address}
                showTooltip={true}
                className="h-24 w-24"
              />
            </div>
          </>
        )}
      </Card>

      {/* Abstract Profile - Natural height */}
      <div className="w-full break-inside-avoid mb-4">
        <AbstractProfileDemo />
      </div>

      {/* SIWE Authentication - Natural height */}
      <div className="w-full break-inside-avoid mb-4">
        <SiweButtonDemo />
      </div>

      {/* Session Keys - Natural height */}
      <div className="w-full break-inside-avoid mb-4">
        <SessionKeysDemo />
      </div>

      {/* Portfolio Chart - Natural height */}
      <Card className="w-full break-inside-avoid mb-4">
        <CardContent>
          <PortfolioChartDemo />
        </CardContent>
      </Card>
    </div>
  );
}


export function ThemePreview() {
  return (
    <div className="w-full h-full theme-container relative">
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
      <DemoCTAOverlay />
    </div>
  );
}