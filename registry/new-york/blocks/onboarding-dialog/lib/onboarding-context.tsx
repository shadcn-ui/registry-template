"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { useAccount } from "wagmi"
import { useSiweAuthQuery } from "@/registry/new-york/blocks/siwe-button/hooks/use-siwe-auth-query"
import { useSessionKey } from "@/registry/new-york/blocks/session-keys/hooks/use-session-key"

interface OnboardingSteps {
  connectWallet?: boolean
  signWithEthereum?: boolean
  createSessionKey?: boolean
}

interface OnboardingRequest {
  id: string
  steps: OnboardingSteps
  callback: () => void
  onComplete?: () => void
}

interface OnboardingContextType {
  // Internal state
  currentRequest: OnboardingRequest | null
  isOpen: boolean
  
  // Public API
  requireOnboarding: (steps: OnboardingSteps, callback: () => void, onComplete?: () => void) => void
  
  // Internal methods for the Onboarder component
  _handleComplete: () => void
  _handleClose: () => void
  _isReady: (steps: OnboardingSteps) => boolean
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

interface OnboardingProviderProps {
  children: React.ReactNode
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [currentRequest, setCurrentRequest] = useState<OnboardingRequest | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  
  // Get current authentication state
  const { isConnected } = useAccount()
  const { data: authData } = useSiweAuthQuery()
  const { data: sessionData } = useSessionKey()
  
  // Check authentication and session status
  const isAuthenticated = !!(authData?.ok && authData?.user?.isAuthenticated)
  const hasActiveSession = !!sessionData
  
  // Check if required steps are completed
  const _isReady = useCallback((steps: OnboardingSteps): boolean => {
    const stepStates = {
      connectWallet: isConnected,
      signWithEthereum: isConnected && isAuthenticated,
      createSessionKey: isConnected && hasActiveSession,
    }
    
    return Object.entries(steps).every(([stepKey, required]) => {
      if (!required) return true
      return stepStates[stepKey as keyof typeof stepStates]
    })
  }, [isConnected, isAuthenticated, hasActiveSession])
  
  const requireOnboarding = useCallback((
    steps: OnboardingSteps,
    callback: () => void,
    onComplete?: () => void
  ) => {
    if (_isReady(steps)) {
      // All required steps completed, execute immediately
      callback()
    } else {
      // Missing required steps, show onboarding modal
      const request: OnboardingRequest = {
        id: Math.random().toString(36).substr(2, 9),
        steps,
        callback,
        onComplete,
      }
      setCurrentRequest(request)
      setIsOpen(true)
    }
  }, [_isReady])
  
  const _handleComplete = useCallback(() => {
    if (currentRequest) {
      // Execute the original callback
      currentRequest.callback()
      
      // Call the completion callback if provided
      currentRequest.onComplete?.()
      
      // Clean up
      setCurrentRequest(null)
      setIsOpen(false)
    }
  }, [currentRequest])
  
  const _handleClose = useCallback(() => {
    setIsOpen(false)
    setCurrentRequest(null)
  }, [])
  
  return (
    <OnboardingContext.Provider
      value={{
        currentRequest,
        isOpen,
        requireOnboarding,
        _handleComplete,
        _handleClose,
        _isReady,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboardingContext must be used within OnboardingProvider")
  }
  return context
}