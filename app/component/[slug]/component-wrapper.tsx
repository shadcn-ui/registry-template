"use client";

import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";

export function ComponentWrapper({ children }: { children: React.ReactNode }) {
  useMiniAppSdk();
  return <>{children}</>;
}