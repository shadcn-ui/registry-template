"use client";

import { useAccount } from "wagmi";
import { Button } from "@/registry/new-york/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/registry/new-york/ui/dropdown-menu";
import { ConnectWalletButton } from "@/registry/new-york/blocks/connect-wallet-button/connect-wallet-button";
import { useSessionKey } from "@/registry/new-york/blocks/session-keys/hooks/use-session-key";
import { useCreateSessionKey } from "@/registry/new-york/blocks/session-keys/hooks/use-create-session-key";
import { useRevokeSessionKey } from "@/registry/new-york/blocks/session-keys/hooks/use-revoke-session-key";
import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx";

interface SessionKeyButtonProps {
    className?: ClassValue;
}

/**
 * Session Key Button
 * 
 * A comprehensive session key management button that handles:
 * - Wallet connection via ConnectWalletButton integration
 * - Session key creation and validation
 * - Session key revocation with confirmation
 * - Loading states and error handling via toast notifications
 * 
 * States:
 * - Not connected: Shows "Connect Wallet" button
 * - Connected but no session: Shows "Create Session Key" button  
 * - Session exists: Shows "Session Active" with dropdown containing revoke option
 */
export function SessionKeyButton({ className }: SessionKeyButtonProps) {
    const { isConnected } = useAccount();
    const { data: sessionData, isLoading: isSessionLoading } = useSessionKey();
    const createSessionMutation = useCreateSessionKey();
    const { revokeSession, isPending: isRevoking } = useRevokeSessionKey();

    // Check if user has an active session
    const hasActiveSession = !!sessionData;

    // Handle session creation
    const handleCreateSession = () => {
        createSessionMutation.mutate();
    };

    // Handle session revocation
    const handleRevokeSession = async (e: React.MouseEvent) => {
        // Prevent dropdown from closing
        e.preventDefault();
        e.stopPropagation();
        
        if (sessionData?.session) {
            await revokeSession(sessionData.session);
        }
    };

    // Not connected: Use ConnectWalletButton
    if (!isConnected) {
        return <ConnectWalletButton className={className} />;
    }

    // Connected and has active session: Show session status with dropdown
    if (isConnected && hasActiveSession && !isSessionLoading) {
        return (
            <ConnectWalletButton 
                className={className}
                customDropdownItems={[
                    <DropdownMenuSeparator key="sep" />,
                    <DropdownMenuItem 
                        key="session-info" 
                        className="focus:bg-transparent cursor-auto"
                    >
                        <div className="flex items-center justify-between w-full">
                            <span className="text-xs text-muted-foreground">Session:</span>
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 bg-green-500 rounded-full" />
                                <span className="text-xs text-green-600 dark:text-green-400">Active</span>
                            </div>
                        </div>
                    </DropdownMenuItem>,
                    <DropdownMenuSeparator key="sep2" />,
                    <DropdownMenuItem 
                        key="revoke" 
                        onClick={handleRevokeSession}
                        disabled={isRevoking}
                        className="text-destructive"
                    >
                        {isRevoking ? (
                            <>
                                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                                Revoking...
                            </>
                        ) : (
                            <>
                                <RevokeIcon className="mr-2 h-4 w-4" />
                                Revoke Session Key
                            </>
                        )}
                    </DropdownMenuItem>
                ]}
            />
        );
    }

    // Connected but no session OR loading: Show Create Session Key button
    return (
        <Button
            onClick={handleCreateSession}
            disabled={createSessionMutation.isPending || isSessionLoading}
            className={cn("cursor-pointer group min-w-40", className)}
        >
            {createSessionMutation.isPending ? (
                <>
                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                </>
            ) : isSessionLoading ? (
                <>
                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                </>
            ) : (
                <>
                    <KeyIcon className="mr-2 h-4 w-4" />
                    Create Session Key
                </>
            )}
        </Button>
    );
}

function Spinner({ className }: { className?: ClassValue }) {
    return (
        <svg
            className={cn("animate-spin", className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

function KeyIcon({ className }: { className?: ClassValue }) {
    return (
        <svg
            className={cn(className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
            />
        </svg>
    );
}

function RevokeIcon({ className }: { className?: ClassValue }) {
    return (
        <svg
            className={cn(className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );
}