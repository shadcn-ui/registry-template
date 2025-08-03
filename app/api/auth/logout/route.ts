import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "../nonce/route";
import { getIronOptions, SiweConfigurationError } from "@/config/auth";

/**
 * Sign in with Ethereum - Logout and destroy the current session.
 */
export async function POST() {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      getIronOptions()
    );

    // Clear all session data
    session.isAuthenticated = false;
    session.address = undefined;
    session.chainId = undefined;
    session.expirationTime = undefined;
    session.nonce = undefined;
    
    // Destroy the session
    session.destroy();

    return NextResponse.json({ ok: true, message: "Successfully logged out" });
  } catch (error) {
    // Let configuration errors bubble up to show helpful messages
    if (error instanceof SiweConfigurationError) {
      throw error;
    }
    // Catch other unexpected errors
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}