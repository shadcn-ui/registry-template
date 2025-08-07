"use client"

import { Button } from "@/registry/new-york/ui/button"
import { requireOnboarding, onboarding } from "@/registry/new-york/blocks/onboarding-dialog/lib/require-onboarding"
import { Onboarder } from "@/registry/new-york/blocks/onboarding-dialog/onboarder"
import { toast } from "sonner"
import { useAccount } from "wagmi"
import { useSiweAuthQuery } from "@/registry/new-york/blocks/siwe-button/hooks/use-siwe-auth-query"
import { useSessionKey } from "@/registry/new-york/blocks/session-keys/hooks/use-session-key"

export default function OnboardingDialogDemo() {
  // Get current state for display
  const { isConnected } = useAccount()
  const { data: authData } = useSiweAuthQuery()
  const { data: sessionData } = useSessionKey()
  
  const isAuthenticated = !!(authData?.ok && authData?.user?.isAuthenticated)
  const hasActiveSession = !!sessionData

  // Determine current status for display
  const getStatusMessage = () => {
    const isReady = isConnected && isAuthenticated && hasActiveSession
    
    if (isReady) {
      return <span className="text-green-600">✓ Ready: all steps completed, action will execute</span>
    }

    // Show what's missing
    if (!isConnected) {
      return <span className="text-orange-600">Not connected: will ask for wallet connection</span>
    } else if (!isAuthenticated) {
      return <span className="text-orange-600">Not authenticated: will ask to sign message</span>
    } else if (!hasActiveSession) {
      return <span className="text-orange-600">No session key: will ask to create session key</span>
    }

    return <span className="text-muted-foreground">Checking authentication status...</span>
  }

  return (
    <div className="space-y-6 max-w-md">
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold mb-1">Start Onboarding</h3>
        <p className="text-sm mt-0 text-muted-foreground">
          An action that requires a multi-phase login flow to be executed.
        </p>

        <div className="space-y-2">
          <Button
            onClick={() => {
              onboarding.full(() => {
                toast.success("🎉 Action executed successfully!", {
                  description: "This only runs when onboarding is complete."
                })
              })
            }}
            className="w-full"
          >
            Execute Action
          </Button>

          {/* Status Label */}
          <p className="text-sm text-left">
            {getStatusMessage()}
          </p>
        </div>
      </div>
      
      <Onboarder />
    </div>
  )
}