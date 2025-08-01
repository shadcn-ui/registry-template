import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "@/app/api/auth/nonce/route";
import { chain, getIronOptions, SiweConfigurationError } from "./config";
import { AuthUser } from "./types";

/**
 * Server-side authentication utilities for SIWE (Sign-in with Ethereum).
 * These functions provide safe and convenient ways to check authentication state
 * on the server-side in API routes, Server Components, and middleware.
 */

export interface ServerAuthResult {
  isAuthenticated: boolean;
  user?: AuthUser;
  error?: string;
}

/**
 * Safely retrieves the current authenticated user from the server-side session.
 * Returns null if not authenticated or if there's an error.
 * 
 * @returns Promise<ServerAuthResult> - Authentication result with user data or error
 * 
 * @example
 * ```tsx
 * // In a Server Component
 * import { getServerAuthUser } from "@/registry/new-york/blocks/siwe-auth/lib/auth-server";
 * 
 * export default async function ProtectedPage() {
 *   const auth = await getServerAuthUser();
 *   
 *   if (!auth.isAuthenticated) {
 *     return <div>Please sign in to access this page</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <h1>Welcome!</h1>
 *       <p>Your address: {auth.user?.address}</p>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // In an API route
 * import { getServerAuthUser } from "@/registry/new-york/blocks/siwe-auth/lib/auth-server";
 * 
 * export async function GET() {
 *   const auth = await getServerAuthUser();
 *   
 *   if (!auth.isAuthenticated) {
 *     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *   }
 *   
 *   // Access protected data
 *   const userData = await getUserData(auth.user!.address);
 *   return NextResponse.json(userData);
 * }
 * ```
 */
export async function getServerAuthUser(): Promise<ServerAuthResult> {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      getIronOptions()
    );

    // Check if user is authenticated
    if (!session.isAuthenticated || !session.address) {
      return {
        isAuthenticated: false,
        error: "No user session found"
      };
    }

    // Check if session is expired
    if (
      session.expirationTime &&
      new Date(session.expirationTime).getTime() < Date.now()
    ) {
      return {
        isAuthenticated: false,
        error: "SIWE session expired"
      };
    }

    // Check if chain matches
    if (session.chainId !== chain.id) {
      return {
        isAuthenticated: false,
        error: "Invalid chain"
      };
    }

    // Return authenticated user data
    return {
      isAuthenticated: true,
      user: {
        isAuthenticated: session.isAuthenticated,
        address: session.address,
        chainId: session.chainId,
        expirationTime: session.expirationTime,
      }
    };
  } catch (error) {
    // Handle configuration errors
    if (error instanceof SiweConfigurationError) {
      return {
        isAuthenticated: false,
        error: `Configuration error: ${error.message}`
      };
    }
    
    // Handle unexpected errors
    return {
      isAuthenticated: false,
      error: "Authentication check failed"
    };
  }
}

/**
 * Requires authentication and throws an error if not authenticated.
 * Useful for API routes that need to ensure authentication.
 * 
 * @returns Promise<AuthUser> - The authenticated user data
 * @throws Error if not authenticated
 * 
 * @example
 * ```tsx
 * // In an API route
 * import { requireServerAuth } from "@/registry/new-york/blocks/siwe-auth/lib/auth-server";
 * 
 * export async function POST(request: Request) {
 *   try {
 *     const user = await requireServerAuth();
 *     
 *     // User is guaranteed to be authenticated here
 *     const result = await performProtectedAction(user.address);
 *     return NextResponse.json(result);
 *     
 *   } catch (error) {
 *     return NextResponse.json(
 *       { error: error.message }, 
 *       { status: 401 }
 *     );
 *   }
 * }
 * ```
 */
export async function requireServerAuth(): Promise<AuthUser> {
  const auth = await getServerAuthUser();
  
  if (!auth.isAuthenticated || !auth.user) {
    throw new Error(auth.error || "Authentication required");
  }
  
  return auth.user;
}

/**
 * Checks if a user is authenticated (boolean check only).
 * Useful for conditional rendering or simple auth checks.
 * 
 * @returns Promise<boolean> - True if authenticated, false otherwise
 * 
 * @example
 * ```tsx
 * // In a Server Component
 * import { isServerAuthenticated } from "@/registry/new-york/blocks/siwe-auth/lib/auth-server";
 * 
 * export default async function HomePage() {
 *   const isAuthenticated = await isServerAuthenticated();
 *   
 *   return (
 *     <div>
 *       {isAuthenticated ? (
 *         <p>Welcome back!</p>
 *       ) : (
 *         <p>Please sign in</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const auth = await getServerAuthUser();
  return auth.isAuthenticated;
}

/**
 * Gets the authenticated user's address safely.
 * Returns null if not authenticated.
 * 
 * @returns Promise<string | null> - The user's address or null
 * 
 * @example
 * ```tsx
 * // In an API route
 * import { getServerAuthAddress } from "@/registry/new-york/blocks/siwe-auth/lib/auth-server";
 * 
 * export async function GET() {
 *   const address = await getServerAuthAddress();
 *   
 *   if (!address) {
 *     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *   }
 *   
 *   const balance = await getBalance(address);
 *   return NextResponse.json({ address, balance });
 * }
 * ```
 */
export async function getServerAuthAddress(): Promise<`0x${string}` | null> {
  const auth = await getServerAuthUser();
  return auth.user?.address || null;
}