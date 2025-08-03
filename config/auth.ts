import { SessionOptions } from "iron-session";
import { chain } from "./chain";

/**
 * Custom error class for SIWE authentication configuration issues.
 * These errors should bubble up to show helpful messages to developers.
 */
export class SiweConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SiweConfigurationError";
  }
}

/**
 * Validates and returns the Iron Session password from environment variables.
 * Throws a SiweConfigurationError if not properly configured.
 */
function getSessionPassword(): string {
  const password = process.env.IRON_SESSION_PASSWORD;
  
  if (!password) {
    throw new SiweConfigurationError(
      "IRON_SESSION_PASSWORD environment variable is required for SIWE authentication.\n\n" +
      "This password is used to encrypt session data and must be cryptographically secure.\n\n" +
      "To fix this:\n" +
      "1. Generate a secure password: openssl rand -base64 32\n" +
      "2. Add it to your .env.local file:\n" +
      '   IRON_SESSION_PASSWORD="your_generated_password_here"\n' +
      "3. Restart your application\n\n" +
      "SECURITY WARNING: Never use a weak or default password in production!"
    );
  }
  
  if (password.length < 32) {
    throw new SiweConfigurationError(
      "IRON_SESSION_PASSWORD must be at least 32 characters long for security.\n" +
      "Generate a new secure password using: openssl rand -base64 32"
    );
  }
  
  return password;
}

/**
 * Gets Iron Session configuration for SIWE authentication.
 * Validates IRON_SESSION_PASSWORD on first call.
 */
export function getIronOptions(): SessionOptions {
  return {
    password: getSessionPassword(),
    cookieName: "siwe-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  };
}

// Re-export chain for authentication context
export { chain };