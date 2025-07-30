"use client"

import { useLoginWithAbstract } from "@abstract-foundation/agw-react"
import { Button } from "@/registry/new-york/ui/button"

export function ConnectWalletButton() {
  const { login, logout, isLoggedIn } = useLoginWithAbstract()

  return (
    <Button onClick={isLoggedIn ? logout : login}>
      {isLoggedIn ? "Disconnect" : "Connect Wallet"}
    </Button>
  )
}