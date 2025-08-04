"use client";

import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { QueryClient } from "@tanstack/react-query";
import { chain } from "@/config/chain";

const queryClient = new QueryClient();

export function NextAbstractWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AbstractWalletProvider chain={chain} queryClient={queryClient}>
      {children}
    </AbstractWalletProvider>
  );
}
