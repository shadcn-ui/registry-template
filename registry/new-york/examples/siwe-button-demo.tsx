"use client"

import { SiweButton } from "@/registry/new-york/blocks/siwe-button/siwe-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york/ui/card"
import { useAccount } from "wagmi"
import { useSiweAuthQuery } from "@/registry/new-york/blocks/siwe-button/hooks/use-siwe-auth-query"

export default function SiweButtonDemo() {
  const { isConnected } = useAccount()
  const { data: authData, isFetching: isAuthFetching } = useSiweAuthQuery()
  const isAuthenticated = authData?.ok && authData?.user?.isAuthenticated

  return (
    <Card className="w-full gap-0">
      <CardHeader className="pb-2">
        <CardTitle>Sign in with Ethereum</CardTitle>
        <CardDescription>
          Authenticate your wallet to access protected features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        <SiweButton className="w-full" />
        
        {/* Status indicators */}
        {isConnected && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <div className="flex items-center space-x-2">
                {isAuthFetching ? (
                  <>
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm text-blue-600 dark:text-blue-400">Checking</span>
                  </>
                ) : isAuthenticated ? (
                  <>
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-green-600 dark:text-green-400">Authenticated</span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">Connected</span>
                  </>
                )}
              </div>
            </div>
            {authData?.user?.address && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Address:</span>
                <span className="text-sm font-mono">
                  {authData.user.address.slice(0, 6)}...{authData.user.address.slice(-4)}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}