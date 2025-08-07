"use client"

import { Button } from "@/registry/new-york/ui/button"
import { useOnboarding } from "@/registry/new-york/blocks/onboarding-dialog/hooks/use-onboarding"
import { toast } from "sonner"

export default function OnboardingDialogDemo() {
  // Use the onboarding hook with full onboarding requirements
  const { ready, require } = useOnboarding({
    connectWallet: true,
    signWithEthereum: true,
    createSessionKey: true,
  })

  // Determine current status for display
  const getStatusMessage = () => {
    if (ready) {
      return <span className="text-green-600">✓ Ready: all steps completed, action will execute</span>
    }

    return <span className="text-orange-600">Not ready: will show onboarding dialog when action is clicked</span>
  }

  const handleAction = () => {
    // This will show the dialog if not ready, or continue if ready
    if (!require()) return
    
    // This code only runs if the user is fully onboarded
    toast.success("🎉 Action executed successfully!", {
      description: "This only runs when onboarding is complete."
    })
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
            onClick={handleAction}
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
    </div>
  )
}