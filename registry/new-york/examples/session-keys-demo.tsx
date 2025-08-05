"use client";

import { SessionKeyButton } from "@/registry/new-york/blocks/session-keys/session-key-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york/ui/card";
import { useAccount } from "wagmi";
import { useSessionKey } from "@/registry/new-york/blocks/session-keys/hooks/use-session-key";
import { useCreateSessionKey } from "@/registry/new-york/blocks/session-keys/hooks/use-create-session-key";
import { useRevokeSessionKey } from "@/registry/new-york/blocks/session-keys/hooks/use-revoke-session-key";
import { getSessionHash } from "@abstract-foundation/agw-client/sessions";

export default function SessionKeyButtonDemo() {
    const { isConnected } = useAccount();
    const { data: sessionData, isFetching: isSessionFetching } = useSessionKey();
    const createSessionMutation = useCreateSessionKey();
    const { isPending: isRevoking } = useRevokeSessionKey();

    const hasActiveSession = !!sessionData;

    // Format expiry date
    const formatExpiryDate = (expiresAt: bigint) => {
        const date = new Date(Number(expiresAt) * 1000);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    // Get status info
    const getStatusInfo = () => {
        if (!isConnected) {
            return { color: "bg-gray-500", text: "Not Connected", textColor: "text-gray-600 dark:text-gray-400" };
        }
        if (isRevoking) {
            return { color: "bg-red-500", text: "Revoking Session Key", textColor: "text-red-600 dark:text-red-400" };
        }
        if (createSessionMutation.isPending) {
            return { color: "bg-blue-500", text: "Creating Session Key", textColor: "text-blue-600 dark:text-blue-400" };
        }
        if (isSessionFetching) {
            return { color: "bg-blue-500", text: "Checking Session Status", textColor: "text-blue-600 dark:text-blue-400" };
        }
        if (hasActiveSession) {
            return { color: "bg-green-500", text: "Session Active", textColor: "text-green-600 dark:text-green-400" };
        }
        return { color: "bg-yellow-500", text: "Connected", textColor: "text-yellow-600 dark:text-yellow-400" };
    };

    const statusInfo = getStatusInfo();

    return (
        <Card className="w-full gap-0 transition-all duration-300 ease-in-out">
            <CardHeader className="pb-2">
                <CardTitle>Session Key Management</CardTitle>
                <CardDescription>
                    Create a session for executing transactions without popups.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1 transition-all duration-300 ease-in-out">
                <SessionKeyButton className="w-full" />

                {/* Status indicators */}
                {isConnected && (
                    <div className="space-y-2 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <div className="flex items-center space-x-2">
                                <div className={`h-2 w-2 ${statusInfo.color} rounded-full ${isSessionFetching || createSessionMutation.isPending || isRevoking ? 'animate-pulse' : ''
                                    }`} />
                                <span className={`text-sm ${statusInfo.textColor}`}>
                                    {statusInfo.text}
                                </span>
                            </div>
                        </div>

                        {/* Session details */}
                        {hasActiveSession && sessionData && (
                            <>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Expires:</span>
                                    <span className="text-sm font-mono text-right">
                                        {formatExpiryDate(sessionData.session.expiresAt)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Call Policies:</span>
                                    <span className="text-sm">
                                        {sessionData.session.callPolicies.length} configured
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Session Hash:</span>
                                    <span className="text-sm font-mono text-right">
                                        {(() => {
                                            const hash = getSessionHash(sessionData.session);
                                            return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
                                        })()}
                                    </span>
                                </div>
                                {sessionData.session.feeLimit && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Fee Limit:</span>
                                        <span className="text-sm">
                                            {(Number(sessionData.session.feeLimit.limit) / 1e18).toFixed(4)} ETH
                                        </span>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Error states */}
                        {createSessionMutation.isError && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Error:</span>
                                <span className="text-sm text-red-600 dark:text-red-400">
                                    Creation failed
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}