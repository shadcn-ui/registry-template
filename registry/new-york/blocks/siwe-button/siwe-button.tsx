"use client";

import { useAccount } from "wagmi";
import { Button } from "@/registry/new-york/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/registry/new-york/ui/dropdown-menu";
import { ConnectWalletButton } from "@/registry/new-york/blocks/connect-wallet-button/connect-wallet-button";
import { useSiweAuthQuery } from "@/registry/new-york/blocks/siwe-button/hooks/use-siwe-auth-query";
import { useSiweSignInMutation } from "@/registry/new-york/blocks/siwe-button/hooks/use-siwe-sign-in-mutation";
import { useSiweLogoutMutation } from "@/registry/new-york/blocks/siwe-button/hooks/use-siwe-logout-mutation";
import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx";

interface SiweButtonProps {
  className?: ClassValue;
}

/**
 * SIWE Button
 * 
 * A streamlined authentication button that handles:
 * - Wallet connection via ConnectWalletButton integration
 * - SIWE message signing and verification
 * - Authentication state management with balance display
 * - Loading states and error handling via toast notifications
 * 
 * States:
 * - Not connected: Shows "Connect Wallet" button
 * - Connected but not authenticated: Shows "Sign Message" button  
 * - Authenticated: Shows balance with dropdown containing "Sign Out"
 */
export function SiweButton({ className }: SiweButtonProps) {
  const { isConnected } = useAccount();
  const { data: authData, isLoading: isAuthLoading } = useSiweAuthQuery();
  const signInMutation = useSiweSignInMutation();
  const logoutMutation = useSiweLogoutMutation();

  // Check if user is authenticated
  const isAuthenticated = authData?.ok && authData?.user?.isAuthenticated;

  // Handle sign-in action
  const handleSignIn = () => {
    signInMutation.mutate();
  };

  // Handle sign-out action (SIWE logout + wallet disconnect)
  const handleSignOut = () => {
    logoutMutation.mutate();
  };

  // Not connected: Use ConnectWalletButton
  if (!isConnected) {
    return <ConnectWalletButton className={className} />;
  }

  // Connected and authenticated: Use ConnectWalletButton with custom dropdown
  if (isConnected && isAuthenticated) {
    return (
      <ConnectWalletButton 
        className={className}
        customDropdownItems={[
          <DropdownMenuSeparator key="sep" />,
          <DropdownMenuItem 
            key="signout" 
            onClick={handleSignOut}
            disabled={logoutMutation.isPending}
            className="text-destructive"
          >
            {logoutMutation.isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              "Sign Out"
            )}
          </DropdownMenuItem>
        ]}
      />
    );
  }

  // Connected but not authenticated OR loading: Show Sign Message button
  return (
    <Button
      onClick={handleSignIn}
      disabled={signInMutation.isPending || isAuthLoading}
      className={cn("cursor-pointer group min-w-40", className)}
    >
      {signInMutation.isPending ? (
        <>
          <Spinner className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : isAuthLoading ? (
        <>
          <Spinner className="mr-2 h-4 w-4 animate-spin" />
          Checking...
        </>
      ) : (
        <>
          <KeyIcon className="mr-2 h-4 w-4" />
          Sign Message
        </>
      )}
    </Button>
  );
}

function Spinner({ className }: { className?: ClassValue }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function KeyIcon({ className }: { className?: ClassValue }) {
  return (
    <svg
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
      />
    </svg>
  );
}