
export interface SessionData {
  nonce?: string;
  isAuthenticated?: boolean;
  address?: `0x${string}`;
  chainId?: number;
  expirationTime?: string;
}

export interface AuthUser {
  isAuthenticated: boolean;
  address: `0x${string}`;
  chainId?: number;
  expirationTime?: string;
}

export interface AuthResponse {
  ok: boolean;
  message?: string;
  user?: AuthUser;
  isConfigurationError?: boolean;
}

export interface ConfigurationErrorResponse {
  ok: false;
  isConfigurationError: true;
  message: string;
}

/**
 * Client-side configuration error that matches the server-side SiweConfigurationError
 */
export class ClientSiweConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SiweConfigurationError";
  }
}

export interface SignInRequest {
  message: string;
  signature: `0x${string}`;
}