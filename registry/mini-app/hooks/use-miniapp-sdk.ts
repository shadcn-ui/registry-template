import { useCallback, useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import type { FrameContext } from "@farcaster/frame-core/src/context";
import type { FrameNotificationDetails } from "@farcaster/frame-core/src/schemas";

export function useMiniAppSdk() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [isFramePinned, setIsFramePinned] = useState(false);
  const [notificationDetails, setNotificationDetails] =
    useState<FrameNotificationDetails | null>(null);
  const [lastEvent, setLastEvent] = useState("");
  const [pinFrameResponse, setPinFrameResponse] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!sdk) return;

    sdk.on("frameAdded", ({ notificationDetails }) => {
      setLastEvent(
        `frameAdded${notificationDetails ? ", notifications enabled" : ""}`,
      );
      setIsFramePinned(true);
      if (notificationDetails) setNotificationDetails(notificationDetails);
    });

    sdk.on("frameAddRejected", ({ reason }) => {
      setLastEvent(`frameAddRejected, reason ${reason}`);
    });

    sdk.on("frameRemoved", () => {
      setLastEvent("frameRemoved");
      setIsFramePinned(false);
      setNotificationDetails(null);
    });

    sdk.on("notificationsEnabled", ({ notificationDetails }) => {
      setLastEvent("notificationsEnabled");
      setNotificationDetails(notificationDetails);
    });

    sdk.on("notificationsDisabled", () => {
      setLastEvent("notificationsDisabled");
      setNotificationDetails(null);
    });

    // Mark SDK as ready
    sdk.actions.ready({});
    setIsSDKLoaded(true);

    // Clean up on unmount
    return () => {
      sdk.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    const updateContext = async () => {
      const frameContext = await sdk.context;
      if (frameContext) {
        setContext(frameContext as unknown as FrameContext);
        setIsFramePinned(frameContext.client.added);
      }
    };

    if (isSDKLoaded) {
      updateContext();
    }
  }, [isSDKLoaded]);

  const pinFrame = useCallback(async () => {
    try {
      setNotificationDetails(null);
      const result = await sdk.actions.addFrame();
      console.log("addFrame result", result);
      // @ts-expect-error - result type mixup
      if (result.added) {
        if (result.notificationDetails) {
          setNotificationDetails(result.notificationDetails);
        }
        setPinFrameResponse(
          result.notificationDetails
            ? `Added, got notificaton token ${result.notificationDetails.token} and url ${result.notificationDetails.url}`
            : "Added, got no notification details",
        );
      }
    } catch (error) {
      setPinFrameResponse(`Error: ${error}`);
    }
  }, []);

  return {
    context,
    pinFrame,
    pinFrameResponse,
    isFramePinned,
    notificationDetails,
    lastEvent,
    sdk,
    isSDKLoaded,
    isAuthDialogOpen,
    setIsAuthDialogOpen,
    isSigningIn,
  };
}
