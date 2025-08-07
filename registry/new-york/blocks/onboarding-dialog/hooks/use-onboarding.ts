"use client"

import { useCallback, useMemo } from "react"
import { useAccount } from "wagmi"
import { useSiweAuthQuery } from "@/registry/new-york/blocks/siwe-button/hooks/use-siwe-auth-query"
import { useSessionKey } from "@/registry/new-york/blocks/session-keys/hooks/use-session-key"
import { requireOnboarding } from "../lib/require-onboarding"

interface OnboardingSteps {
  connectWallet?: boolean
  signWithEthereum?: boolean
  createSessionKey?: boolean
}

interface UseOnboardingReturn {
  ready: boolean
  require: () => boolean
  showDialog: () => void
}

/**
 * Hook for managing onboarding requirements and gating functionality
 * 
 * @param steps Configuration for required onboarding steps
 * @returns Object with ready state and control functions
 * 
 * @example
 * ```tsx
 * const { ready, require } = useOnboarding({
 *   connectWallet: true,
 *   signWithEthereum: true,
 *   createSessionKey: false
 * })
 * 
 * const handleClick = () => {
 *   if (!require()) return // Shows dialog if not ready
 *   doProtectedAction() // Only runs if onboarded
 * }
 * ```
 */
export function useOnboarding(steps: OnboardingSteps): UseOnboardingReturn {
  // Get current authentication state
  const { isConnected } = useAccount()
  const { data: authData } = useSiweAuthQuery()
  const { data: sessionData } = useSessionKey()
  
  // Check authentication and session status
  const isAuthenticated = !!(authData?.ok && authData?.user?.isAuthenticated)
  const hasActiveSession = !!sessionData
  
  // Check if all required steps are completed
  const ready = useMemo(() => {
    const stepStates = {
      connectWallet: isConnected,
      signWithEthereum: isConnected && isAuthenticated,
      createSessionKey: isConnected && hasActiveSession,
    }
    
    return Object.entries(steps).every(([stepKey, required]) => {
      if (!required) return true
      return stepStates[stepKey as keyof typeof stepStates]
    })
  }, [steps, isConnected, isAuthenticated, hasActiveSession])
  
  // Function to gate actions behind onboarding completion
  const require = useCallback((): boolean => {
    if (ready) {
      // All required steps completed
      return true
    } else {
      // Missing required steps, show the onboarding modal using existing global function
      requireOnboarding(steps, () => {
        // This will be called when onboarding completes, but we don't need to do anything
        // since the user's action will be in their own code after the require() call
      })
      return false
    }
  }, [ready, steps])
  
  // Function to manually show the dialog
  const showDialog = useCallback(() => {
    requireOnboarding(steps, () => {
      // Manual dialog show, no action needed on completion
    })
  }, [steps])
  
  return {
    ready,
    require,
    showDialog,
  }
}