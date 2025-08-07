import { useOnboardingContext } from "./onboarding-context"

interface OnboardingSteps {
  connectWallet?: boolean
  signWithEthereum?: boolean
  createSessionKey?: boolean
}

// Global reference to the onboarding context
let globalRequireOnboarding: ((
  steps: OnboardingSteps,
  callback: () => void,
  onComplete?: () => void
) => void) | null = null

// Hook to register the global function (used by Onboarder component)
export function useRegisterOnboarding() {
  const { requireOnboarding } = useOnboardingContext()
  
  // Register the global function
  if (typeof window !== "undefined") {
    globalRequireOnboarding = requireOnboarding
  }
  
  return requireOnboarding
}

/**
 * Global function to require onboarding (like toast() from sonner)
 * 
 * @param steps - Which onboarding steps to require
 * @param callback - Function to execute when onboarding is complete
 * @param onComplete - Optional callback when onboarding dialog closes
 */
export function requireOnboarding(
  steps: OnboardingSteps,
  callback: () => void,
  onComplete?: () => void
) {
  if (!globalRequireOnboarding) {
    console.error(
      "requireOnboarding called before <Onboarder /> was mounted. " +
      "Make sure to add <Onboarder /> to your app root."
    )
    return
  }
  
  globalRequireOnboarding(steps, callback, onComplete)
}

// Convenience functions for common patterns
export const onboarding = {
  /**
   * Require wallet connection only
   */
  connectWallet: (callback: () => void, onComplete?: () => void) =>
    requireOnboarding({ connectWallet: true }, callback, onComplete),
  
  /**
   * Require wallet connection + SIWE auth
   */
  authenticate: (callback: () => void, onComplete?: () => void) =>
    requireOnboarding(
      { connectWallet: true, signWithEthereum: true },
      callback,
      onComplete
    ),
  
  /**
   * Require full onboarding (all steps)
   */
  full: (callback: () => void, onComplete?: () => void) =>
    requireOnboarding(
      {
        connectWallet: true,
        signWithEthereum: true,
        createSessionKey: true,
      },
      callback,
      onComplete
    ),
}