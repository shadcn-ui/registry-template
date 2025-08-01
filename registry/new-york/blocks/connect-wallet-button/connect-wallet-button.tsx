"use client"

import { useLoginWithAbstract } from "@abstract-foundation/agw-react"
import { Button } from "@/registry/new-york/ui/button"
import { useAccount, useBalance } from "wagmi"
import { cn } from "@/lib/utils"
import { type ClassValue } from "clsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu"
import { useState } from "react"

interface ConnectWalletButtonProps {
  className?: ClassValue
  customDropdownItems?: React.ReactNode[]
}

/**
 * Connect Wallet Button for Abstract Global Wallet
 * 
 * A comprehensive wallet connection component that handles:
 * - Wallet connection/disconnection via Abstract Global Wallet
 * - Loading states during connection
 * - Balance display with wallet and Abstract logos
 * - Dropdown menu with address copy functionality
 */
export function ConnectWalletButton({ className, customDropdownItems }: ConnectWalletButtonProps) {
  // Wagmi hooks for wallet state and balance
  const { isConnected, status, address } = useAccount()
  const { data: balance, isLoading: isBalanceLoading } = useBalance({ address })

  // Abstract Global Wallet authentication
  const { login, logout } = useLoginWithAbstract()

  // Local state for connection status and copy feedback
  const isConnecting = status === 'connecting' || status === 'reconnecting'
  const [copied, setCopied] = useState(false)

  /**
   * Copy wallet address to clipboard with visual feedback
   */
  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Loading state: Show connecting button with spinning logo
  if (isConnecting) {
    return (
      <Button
        disabled
        className={cn("cursor-pointer group min-w-40", className)}
      >
        Connecting...
        <AbstractLogo className="ml-2 animate-spin" />
      </Button>
    )
  }

  // Disconnected state: Show connect button with hover animation
  if (!isConnected) {
    return (
      <Button
        onClick={login}
        className={cn("cursor-pointer group min-w-40", className)}
      >
        Connect Wallet
        <AbstractLogo className="ml-2 group-hover:animate-spin transition-transform" />
      </Button>
    )
  }

  // Connected but loading balance: Show loading state
  if (isConnected && isBalanceLoading) {
    return (
      <Button
        disabled
        className={cn("cursor-pointer group min-w-40 px-3", className)}
      >
        <WalletIcon className="mr-1 h-4 w-4" />
        Loading...
        <AbstractLogo className="ml-1 h-4 w-4 animate-spin" />
      </Button>
    )
  }

  // Format the balance for display (4 decimal places)
  const formattedBalance = balance
    ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
    : '0.0000 ETH'

  // Connected state: Show balance with dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("cursor-pointer group min-w-40 px-3", className)}
        >
          <WalletIcon className="mr-1 h-4 w-4" />
          {formattedBalance}
          <AbstractLogo className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="bottom" className="w-56">
        {/* Address display with copy functionality */}
        <DropdownMenuItem className="focus:bg-transparent cursor-auto">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground font-mono">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
            </span>
            {address && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-accent"
                onClick={(e) => {
                  // Prevent dropdown from closing when copying
                  e.preventDefault()
                  e.stopPropagation()
                  copyAddress()
                }}
              >
                {copied ? (
                  <CheckIcon className="h-2.5 w-2.5" />
                ) : (
                  <CopyIcon className="h-2.5 w-2.5" />
                )}
              </Button>
            )}
          </div>
        </DropdownMenuItem>
        {/* Custom dropdown items or default disconnect */}
        {customDropdownItems ? (
          customDropdownItems
        ) : (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              Disconnect
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function WalletIcon({ className }: { className?: ClassValue }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 640 640"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        d="M128 96C92.7 96 64 124.7 64 160L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 256C576 220.7 547.3 192 512 192L136 192C122.7 192 112 181.3 112 168C112 154.7 122.7 144 136 144L520 144C533.3 144 544 133.3 544 120C544 106.7 533.3 96 520 96L128 96zM480 320C497.7 320 512 334.3 512 352C512 369.7 497.7 384 480 384C462.3 384 448 369.7 448 352C448 334.3 462.3 320 480 320z"
        fill="currentColor"
      />
    </svg>
  )
}
function CopyIcon({ className }: { className?: ClassValue }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: ClassValue }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function AbstractLogo({ className }: { className?: ClassValue }) {
  return (
    <svg
      width="20"
      height="18"
      viewBox="0 0 52 47"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path d="M33.7221 31.0658L43.997 41.3463L39.1759 46.17L28.901 35.8895C28.0201 35.0081 26.8589 34.5273 25.6095 34.5273C24.3602 34.5273 23.199 35.0081 22.3181 35.8895L12.0432 46.17L7.22205 41.3463L17.4969 31.0658H33.7141H33.7221Z" fill="currentColor" />
      <path d="M35.4359 28.101L49.4668 31.8591L51.2287 25.2645L37.1978 21.5065C35.9965 21.186 34.9954 20.4167 34.3708 19.335C33.7461 18.2613 33.586 17.0033 33.9063 15.8013L37.6623 1.76283L31.0713 0L27.3153 14.0385L35.4279 28.093L35.4359 28.101Z" fill="currentColor" />
      <path d="M15.7912 28.101L1.76028 31.8591L-0.00158691 25.2645L14.0293 21.5065C15.2306 21.186 16.2316 20.4167 16.8563 19.335C17.4809 18.2613 17.6411 17.0033 17.3208 15.8013L13.5648 1.76283L20.1558 0L23.9118 14.0385L15.7992 28.093L15.7912 28.101Z" fill="currentColor" />
    </svg>
  )
}