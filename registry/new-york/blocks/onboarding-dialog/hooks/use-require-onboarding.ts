"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useSiweAuthQuery } from "@/registry/new-york/blocks/siwe-button/hooks/use-siwe-auth-query"
import { useSessionKey } from "@/registry/new-york/blocks/session-keys/hooks/use-session-key"

interface UseRequireOnboardingOptions {
  steps: {
    connectWallet?: boolean
    signWithEthereum?: boolean
    createSessionKey?: boolean
  }
  onComplete?: () => void
}

interface UseRequireOnboardingReturn {
  ready: boolean
  isLoading: boolean
  stepStates: {
    connectWallet: {
      completed: boolean
      loading: boolean
    }
    signWithEthereum: {
      completed: boolean
      loading: boolean
    }
    createSessionKey: {
      completed: boolean
      loading: boolean
    }
  }
  showModal: () => void
  require: (callback: () => void) => void
  _modalState: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onComplete: () => void
    steps: {
      connectWallet?: boolean
      signWithEthereum?: boolean
      createSessionKey?: boolean
    }
  }
}

/**
 * Hook for managing onboarding requirements and gating functionality
 * 
 * Provides:
 * - ready: boolean indicating if all required steps are completed
 * - showModal: function to manually open the onboarding modal
 * - require: function to gate actions behind onboarding completion
 * 
 * @param options Configuration for required onboarding steps
 * @returns Object with ready state and control functions
 */
export function useRequireOnboarding({
  steps,
  onComplete,
}: UseRequireOnboardingOptions): UseRequireOnboardingReturn {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Get current authentication state
  const { isConnected, isConnecting, isReconnecting } = useAccount()
  const { data: authData, isLoading: isAuthLoading } = useSiweAuthQuery()
  const { data: sessionData, isLoading: isSessionLoading } = useSessionKey()

  // Check authentication and session status
  const isAuthenticated = !!(authData?.ok && authData?.user?.isAuthenticated)
  const hasActiveSession = !!sessionData

  // Determine if any authentication process is loading
  const isLoading = !!(isConnecting || isReconnecting || 
    (steps.signWithEthereum && isAuthLoading) ||
    (steps.createSessionKey && isSessionLoading))

  // Determine if each step is completed
  const stepCompletionState = {
    connectWallet: isConnected,
    signWithEthereum: isConnected && isAuthenticated,
    createSessionKey: isConnected && hasActiveSession,
  }

  // Check if all required steps are completed
  const ready = Object.entries(steps).every(([stepKey, required]) => {
    if (!required) return true
    return stepCompletionState[stepKey as keyof typeof stepCompletionState]
  })

  // Function to manually show the modal
  const showModal = () => {
    setIsModalOpen(true)
  }

  // Function to gate actions behind onboarding completion
  const require = (callback: () => void) => {
    if (ready) {
      // All required steps completed, execute the callback
      callback()
    } else {
      // Missing required steps, show the onboarding modal
      setIsModalOpen(true)
    }
  }

  // Handle modal completion
  const handleComplete = () => {
    setIsModalOpen(false)
    onComplete?.()
  }

  // Handle modal close
  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
  }

  // Calculate detailed step states
  const stepStates = {
    connectWallet: {
      completed: isConnected,
      loading: isConnecting || isReconnecting,
    },
    signWithEthereum: {
      completed: isConnected && isAuthenticated,
      loading: steps.signWithEthereum && isAuthLoading,
    },
    createSessionKey: {
      completed: isConnected && hasActiveSession,
      loading: steps.createSessionKey && isSessionLoading,
    },
  }

  return {
    ready,
    isLoading,
    stepStates,
    showModal,
    require,
    // Internal state for the modal (consumed by components using this hook)
    _modalState: {
      open: isModalOpen,
      onOpenChange: handleModalClose,
      onComplete: handleComplete,
      steps,
    }
  }
}