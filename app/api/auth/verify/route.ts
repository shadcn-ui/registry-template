import { NextRequest, NextResponse } from "next/server";
import { parseSiweMessage } from "viem/siwe";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "../nonce/route";
import { createPublicClient, http } from "viem";
import { chain, getIronOptions, SiweConfigurationError } from "@/registry/new-york/blocks/siwe-button/lib/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, signature } = body;

    // Validate required fields
    if (!message || !signature) {
      return NextResponse.json(
        { ok: false, message: "Message and signature are required." },
        { status: 400 }
      );
    }

    // Validate message is a string
    if (typeof message !== 'string') {
      return NextResponse.json(
        { ok: false, message: "Message must be a string." },
        { status: 400 }
      );
    }

    // Validate signature is a valid hex string (supports both EOA and EIP-1271 signatures)
    if (typeof signature !== 'string' || !/^0x[a-fA-F0-9]+$/.test(signature) || signature.length < 4) {
      return NextResponse.json(
        { ok: false, message: "Invalid signature format." },
        { status: 400 }
      );
    }

    // The "session" here is not related to our session keys.
    // This is just related to auth / sign in with Ethereum.
    const session = await getIronSession<SessionData>(
      await cookies(),
      getIronOptions()
    );

    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    try {
      // Validate nonce exists
      if (!session.nonce) {
        return NextResponse.json(
          { ok: false, message: "No nonce found. Please request a new nonce first." },
          { status: 422 }
        );
      }

      // Parse and validate SIWE message before signature verification
      const siweMessage = parseSiweMessage(message);

      // Validate chain ID matches expected chain
      if (siweMessage.chainId !== chain.id) {
        return NextResponse.json(
          { ok: false, message: "Invalid chain ID." },
          { status: 422 }
        );
      }

      // Validate domain matches current host to prevent cross-domain replay attacks
      const requestHost = request.headers.get("host");
      if (siweMessage.domain !== requestHost) {
        return NextResponse.json(
          { ok: false, message: "Invalid domain." },
          { status: 422 }
        );
      }

      // Validate message expiration time
      if (siweMessage.expirationTime && siweMessage.expirationTime.getTime() <= Date.now()) {
        return NextResponse.json(
          { ok: false, message: "Message has expired." },
          { status: 422 }
        );
      }

      // Create and verify the SIWE message (with EIP-1271 support for smart contract wallets)
      const valid = await publicClient.verifySiweMessage({
        message,
        signature: signature as `0x${string}`,
        nonce: session.nonce,
        blockTag: 'latest', // EIP-1271 smart contract wallet support
      });

      // Clear nonce after any verification attempt to prevent reuse
      session.nonce = undefined;

      // If verification is successful, update the auth state
      if (valid) {
        session.isAuthenticated = true;
        session.address = siweMessage.address as `0x${string}`;
        session.chainId = siweMessage.chainId;
        session.expirationTime = siweMessage.expirationTime?.toISOString();
        await session.save();
      } else {
        // Save session to persist nonce clearing even on failure
        await session.save();
      }

      if (!valid) {
        return NextResponse.json(
          { ok: false, message: "Invalid signature." },
          { status: 422 }
        );
      }
    } catch {
      return NextResponse.json(
        { ok: false, message: "Verification failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Return configuration errors as special response type
    if (error instanceof SiweConfigurationError) {
      return NextResponse.json({
        ok: false,
        isConfigurationError: true,
        message: error.message
      }, { status: 500 });
    }
    // Catch other unexpected errors
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}