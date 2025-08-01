import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "../nonce/route";
import { chain, getIronOptions, SiweConfigurationError } from "@/registry/new-york/blocks/siwe-auth/lib/config";

/**
 * Sign in with Ethereum - Get the currently authenticated user information.
 * @returns
 */
export async function GET() {
  try {
    // The "session" here is not related to our session keys.
    // This is just related to auth / sign in with Ethereum.
    const session = await getIronSession<SessionData>(
      await cookies(),
      getIronOptions()
    );

    if (!session.isAuthenticated || !session.address) {
      return NextResponse.json(
        { ok: false, message: "No user session found." },
        { status: 401 }
      );
    }

    if (
      session.expirationTime &&
      new Date(session.expirationTime).getTime() < Date.now()
    ) {
      return NextResponse.json(
        { ok: false, message: "SIWE session expired." },
        { status: 401 }
      );
    }

    if (session.chainId !== chain.id) {
      return NextResponse.json(
        { ok: false, message: "Invalid chain." },
        { status: 401 }
      );
    }

    // Return the SIWE session data
    return NextResponse.json({
      ok: true,
      user: {
        isAuthenticated: session.isAuthenticated,
        address: session.address,
        chainId: session.chainId,
        expirationTime: session.expirationTime,
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