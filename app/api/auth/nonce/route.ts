import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateSiweNonce } from "viem/siwe";
import { getIronSession } from "iron-session";
import { getIronOptions, SiweConfigurationError } from "@/registry/new-york/blocks/siwe-button/lib/config";

export interface SessionData {
  nonce?: string;
  isAuthenticated?: boolean;
  address?: `0x${string}`;
  chainId?: number;
  expirationTime?: string;
}

/**
 * Sign in with Ethereum - Generate a unique nonce for the SIWE message.
 */
export async function GET() {
  try {
    // The "session" here is not related to our session keys.
    // This is just related to auth / sign in with Ethereum.
    const session = await getIronSession<SessionData>(
      await cookies(),
      getIronOptions()
    );

    // Generate and store the nonce
    const nonce = generateSiweNonce();
    session.nonce = nonce;
    await session.save();

    // Return the nonce as plain text with no-cache headers
    return new NextResponse(nonce, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
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