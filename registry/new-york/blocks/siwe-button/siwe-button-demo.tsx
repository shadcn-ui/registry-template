"use client";

import { useAccount } from "wagmi";
import { Button } from "@/registry/new-york/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york/ui/card";
import { ConnectWalletButton } from "@/registry/new-york/blocks/connect-wallet-button/connect-wallet-button";
import { useSiweAuthQuery } from "@/registry/new-york/blocks/siwe-auth/hooks/use-siwe-auth-query";
import { useSiweSignInMutation } from "@/registry/new-york/blocks/siwe-auth/hooks/use-siwe-sign-in-mutation";
import { useSiweLogoutMutation } from "@/registry/new-york/blocks/siwe-auth/hooks/use-siwe-logout-mutation";
import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx";

interface SiweAuthDemoProps {
  className?: ClassValue;
  title?: string;
  description?: string;
}

/**
 * Sign-in with Ethereum Authentication Demo Component
 * 
 * A comprehensive authentication demo component that showcases:
 * - Wallet connection state detection
 * - SIWE message signing and verification
 * - Authentication state management
 * - Loading states and error handling via toast notifications
 * 
 * This is the full-featured demo version with cards and detailed UI states.
 * For a simple button component, use the main SiweAuth component.
 */
export function SiweAuthDemo({ 
  className, 
  title = "Sign in with Ethereum",
  description = "Authenticate your wallet to access protected features"
}: SiweAuthDemoProps) {
  const { isConnected } = useAccount();
  const { data: authData, isLoading: isAuthLoading, isFetching: isAuthFetching, error: authError } = useSiweAuthQuery();
  const signInMutation = useSiweSignInMutation();
  const logoutMutation = useSiweLogoutMutation();

  // Check if user is authenticated
  const isAuthenticated = authData?.ok && authData?.user?.isAuthenticated;

  // Handle sign-in action
  const handleSignIn = () => {
    signInMutation.mutate();
  };

  // Handle sign-out action
  const handleSignOut = () => {
    logoutMutation.mutate();
  };

  // Wallet not connected state
  if (!isConnected) {
    return (
      <Card className={cn("w-full min-w-80 max-w-md", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Please connect your wallet first</CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectWalletButton className="w-full" />
        </CardContent>
      </Card>
    );
  }

  // Loading authentication state
  if (isAuthLoading) {
    return (
      <Card className={cn("w-full min-w-80 max-w-md", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled className="w-full">
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
            Checking authentication...
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Authenticated state
  if (isAuthenticated && authData?.user) {
    return (
      <Card className={cn("w-full min-w-80 max-w-md", className)}>
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>You are signed in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Address:</span>
            <span className="text-sm font-mono">
              {authData.user.address.slice(0, 6)}...{authData.user.address.slice(-4)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <div className="flex items-center space-x-2">
              {isAuthFetching ? (
                <>
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">Checking</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-600 dark:text-green-400">Authenticated</span>
                </>
              )}
            </div>
          </div>
          <Button 
            onClick={handleSignOut}
            disabled={logoutMutation.isPending}
            variant="outline"
            className="w-full"
          >
            {logoutMutation.isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOutIcon className="mr-2 h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Not authenticated - show sign-in option
  return (
    <Card className={cn("w-full min-w-80 max-w-md", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleSignIn}
          disabled={signInMutation.isPending}
          className="w-full"
        >
          {signInMutation.isPending ? (
            <>
              <Spinner className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <KeyIcon className="mr-2 h-4 w-4" />
              Sign Message
            </>
          )}
        </Button>
        {authError && (
          <p className="text-sm text-destructive mt-2">
            Authentication check failed. Please try signing in.
          </p>
        )}
      </CardContent>
    </Card>
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

function LogOutIcon({ className }: { className?: ClassValue }) {
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
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
      />
    </svg>
  );
}