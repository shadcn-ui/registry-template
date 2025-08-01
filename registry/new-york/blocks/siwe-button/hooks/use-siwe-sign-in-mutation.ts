"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useSignMessage } from "wagmi";
import { createSiweMessage } from "viem/siwe";
import { toast } from "sonner";
import { AuthResponse, SignInRequest, ClientSiweConfigurationError } from "@/registry/new-york/blocks/siwe-button/lib/types";

async function fetchNonce(): Promise<string> {
  const response = await fetch("/api/auth/nonce");
  
  // Check if it's a JSON error response (configuration error)
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const errorData = await response.json();
    if (errorData.isConfigurationError) {
      // Throw the configuration error to bubble up to Next.js
      throw new ClientSiweConfigurationError(errorData.message);
    }
    throw new Error(errorData.message || "Failed to fetch nonce");
  }
  
  return response.text();
}

async function verifySignature(data: SignInRequest): Promise<AuthResponse> {
  const response = await fetch("/api/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  
  // Check for configuration errors and throw them to bubble up
  if (result.isConfigurationError) {
    throw new ClientSiweConfigurationError(result.message);
  }
  
  return result;
}

export function useSiweSignInMutation() {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!address || !chainId) {
        throw new Error("Wallet not connected");
      }

      // Step 1: Fetch nonce
      const nonce = await fetchNonce();

      // Step 2: Create SIWE message
      const message = createSiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
        issuedAt: new Date(),
        expirationTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
      });

      // Step 3: Sign the message
      const signature = await signMessageAsync({
        message,
      });

      // Step 4: Verify signature
      const result = await verifySignature({
        message,
        signature: signature as `0x${string}`,
      });

      if (!result.ok) {
        throw new Error(result.message || "Sign-in failed");
      }

      return result;
    },
    onSuccess: () => {
      // Invalidate auth query to refresh user state
      queryClient.invalidateQueries({ queryKey: ["siwe-auth"] });
      toast.success("Successfully signed in!");
    },
    onError: (error: Error) => {
      // If it's a configuration error, throw it to show in Next.js overlay
      if (error instanceof ClientSiweConfigurationError) {
        throw error;
      }
      // Otherwise handle normally
      console.error("Sign-in error:", error);
      toast.error(error.message || "Failed to sign in");
    },
  });
}