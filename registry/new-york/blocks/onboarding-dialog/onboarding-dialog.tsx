"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { cn } from "@/lib/utils"
import { type ClassValue } from "clsx"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/registry/new-york/ui/dialog"
import { ConnectWalletButton } from "@/registry/new-york/blocks/connect-wallet-button/connect-wallet-button"
import { SiweButton } from "@/registry/new-york/blocks/siwe-button/siwe-button"
import { SessionKeyButton } from "@/registry/new-york/blocks/session-keys/session-key-button"
import { useSiweAuthQuery } from "@/registry/new-york/blocks/siwe-button/hooks/use-siwe-auth-query"
import { useSessionKey } from "@/registry/new-york/blocks/session-keys/hooks/use-session-key"

interface OnboardingDialogProps {
  steps?: {
    connectWallet?: boolean
    signWithEthereum?: boolean
    createSessionKey?: boolean
  }
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onComplete?: () => void
  onStepComplete?: (step: string) => void
  className?: ClassValue
}

interface StepDefinition {
  id: string
  title: string
  subtitle: string
  component: React.ComponentType<any>
  validate: () => boolean
}

/**
 * Onboarding Dialog
 * 
 * A configurable multi-step onboarding dialog that guides users through:
 * - Wallet connection via ConnectWalletButton
 * - SIWE authentication via SiweButton
 * - Session key creation via SessionKeyButton
 * 
 * Features:
 * - Visual progress indicator showing current step
 * - Auto-detection of completed steps
 * - Configurable step selection
 * - Automatic advancement when steps complete
 */
export function OnboardingDialog({
  steps = {
    connectWallet: true,
    signWithEthereum: true,
    createSessionKey: true,
  },
  open = false,
  onOpenChange = () => {},
  onComplete = () => {},
  onStepComplete,
  className,
}: OnboardingDialogProps) {
  const { isConnected } = useAccount()
  const { data: authData } = useSiweAuthQuery()
  const { data: sessionData } = useSessionKey()

  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // Check authentication and session status
  const isAuthenticated = authData?.ok && authData?.user?.isAuthenticated
  const hasActiveSession = !!sessionData

  // Define all possible steps with their validation logic
  const allStepDefinitions: StepDefinition[] = [
    {
      id: 'connectWallet',
      title: 'Connect Wallet',
      subtitle: 'Connect your wallet to get started',
      component: ConnectWalletButton,
      validate: () => isConnected,
    },
    {
      id: 'signWithEthereum',
      title: 'Sign In with Ethereum',
      subtitle: 'Sign a message to authenticate your identity',
      component: SiweButton,
      validate: () => !!(isConnected && isAuthenticated),
    },
    {
      id: 'createSessionKey',
      title: 'Create Session Key',
      subtitle: 'Create a session key for seamless transactions',
      component: SessionKeyButton,
      validate: () => !!(isConnected && hasActiveSession),
    },
  ]

  // Filter to only enabled steps
  const enabledSteps = allStepDefinitions.filter(step => steps[step.id as keyof typeof steps])

  // Find the first incomplete step or stay at current
  const findCurrentStep = () => {
    for (let i = 0; i < enabledSteps.length; i++) {
      if (!enabledSteps[i].validate()) {
        return i
      }
    }
    return enabledSteps.length - 1 // All complete, stay at last step
  }

  // Update current step when validation changes
  useEffect(() => {
    if (open) {
      const newStepIndex = findCurrentStep()
      if (newStepIndex !== currentStepIndex) {
        setCurrentStepIndex(newStepIndex)
      }
    }
  }, [isConnected, isAuthenticated, hasActiveSession, open])

  // Check if all required steps are complete
  const allStepsComplete = enabledSteps.every(step => step.validate())

  // Handle completion
  useEffect(() => {
    if (allStepsComplete && open && enabledSteps.length > 0) {
      // Small delay to show completion state
      const timer = setTimeout(() => {
        onComplete()
        onOpenChange(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [allStepsComplete, open, onComplete, onOpenChange, enabledSteps.length])

  // Handle step completion callback
  useEffect(() => {
    if (onStepComplete && enabledSteps[currentStepIndex]?.validate()) {
      onStepComplete(enabledSteps[currentStepIndex].id)
    }
  }, [currentStepIndex, onStepComplete, enabledSteps])


  // Don't render if no steps are enabled
  if (enabledSteps.length === 0) {
    return null
  }

  const currentStep = enabledSteps[currentStepIndex]
  const StepComponent = currentStep?.component

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md", className)} showCloseButton={true}>
        <div className="flex flex-col items-center space-y-6">
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2">
            {enabledSteps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  step.validate()
                    ? "bg-green-500"
                    : index === currentStepIndex
                      ? "bg-primary"
                      : "bg-muted"
                )}
              />
            ))}
          </div>

          {/* Step Title and Description */}
          <div className="text-center space-y-2">
            <DialogTitle className="text-xl font-semibold">{currentStep?.title}</DialogTitle>
            <p className="text-muted-foreground">{currentStep?.subtitle}</p>
          </div>

          {/* Current Step Component */}
          <div className="w-full">
            {StepComponent && (
              <StepComponent className="w-full" />
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}