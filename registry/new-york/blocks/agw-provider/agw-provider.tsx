"use client";

import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { chain } from "@/config/chain";
import { queryClient } from "@/config/query-client";

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
