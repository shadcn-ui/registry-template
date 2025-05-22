import { Button } from "@/registry/mini-app/ui/button";
import { Share } from "lucide-react";
import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";
import { useMemo } from "react";

type ShareCastButtonProps = {
  text: string;
  url?: string;
  variant?: "destructive" | "secondary" | "ghost" | "default";
  className?: string;
};

export function ShareCastButton({
  text,
  url,
  variant = "default",
  className,
}: ShareCastButtonProps) {
  const { sdk } = useMiniAppSdk();

  const shareUrl = useMemo(() => {
    let share = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    if (url) {
      share += `&embeds[]=${encodeURIComponent(url)}`;
    }
    return share;
  }, [text, url]);

  const onShare = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const frameContext = await sdk.context;
    if (frameContext) {
      e.preventDefault();
      sdk.actions.composeCast({
        text,
        embeds: [url],
      });
    } else if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <Button
      variant={variant}
      onClick={(e) => onShare(e)}
      size="default"
      className={`shadow-none ${className || ""}`}
    >
      <Share className="h-4 w-4 md:h-5 md:w-5" />
      Share
    </Button>
  );
}
