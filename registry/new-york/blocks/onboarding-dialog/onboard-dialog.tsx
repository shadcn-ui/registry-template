"use client"

import { useEffect } from "react"
import { OnboardingProvider, useOnboardingContext } from "./lib/onboarding-context"
import { useRegisterOnboarding } from "./lib/require-onboarding"
import { OnboardingDialog } from "./onboarding-dialog"

function OnboardDialogInner() {
  const { currentRequest, isOpen, _handleComplete, _handleClose, _isReady } = useOnboardingContext()
  
  // Register the global requireOnboarding function
  useRegisterOnboarding()
  
  // Auto-complete if steps become ready while dialog is open
  useEffect(() => {
    if (currentRequest && isOpen && _isReady(currentRequest.steps)) {
      // Small delay to show completion state
      const timer = setTimeout(() => {
        _handleComplete()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentRequest, isOpen, _isReady, _handleComplete])
  
  // Don't render anything if no active request
  if (!currentRequest) {
    return null
  }
  
  return (
    <OnboardingDialog
      steps={currentRequest.steps}
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          _handleClose()
        }
      }}
      onComplete={_handleComplete}
    />
  )
}

/**
 * OnboardDialog Component
 * 
 * Similar to Sonner's <Toaster />, this component should be placed once at your app root.
 * It renders onboarding dialogs when requireOnboarding() is called anywhere in your app.
 * 
 * Usage:
 * ```tsx
 * // In your app root (layout.tsx or _app.tsx)
 * import { OnboardDialog } from "@/components/onboard-dialog"
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <OnboardDialog />
 *       </body>
 *     </html>
 *   )
 * }
 * 
 * // Anywhere in your app
 * import { requireOnboarding } from "@/lib/require-onboarding"
 * 
 * function MyComponent() {
 *   const handleAction = () => {
 *     requireOnboarding(
 *       { connectWallet: true, signWithEthereum: true },
 *       () => console.log("Action executed!")
 *     )
 *   }
 * }
 * ```
 */
export function OnboardDialog() {
  return (
    <OnboardingProvider>
      <OnboardDialogInner />
    </OnboardingProvider>
  )
}