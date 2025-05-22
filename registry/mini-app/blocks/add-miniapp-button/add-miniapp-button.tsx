import { Button } from "@/registry/mini-app/ui/button";
import { CircleCheckBig, Save, Share } from "lucide-react";
import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";
import { useMemo } from "react";

type AddMiniAppButtonProps = {
  text?: string;
  textDone?: string;
  variant?: "destructive" | "secondary" | "ghost" | "default";
  className?: string;
};

export function AddMiniappButton({
  text = "Add Mini App",
  textDone = "Saved",
  variant = "default",
  className,
}: AddMiniAppButtonProps) {
  const { sdk, isMiniAppSaved } = useMiniAppSdk();

  const onAddMiniApp = () => {
    sdk.actions.addMiniApp();
  };

  return (
    <Button
      variant={variant}
      onClick={(e) => onAddMiniApp()}
      size="default"
      className={`${className || ""}`}
      disabled={isMiniAppSaved}
    >
      {isMiniAppSaved ? (
        <CircleCheckBig className="h-4 w-4 md:h-5 md:w-5" />
      ) : (
        <Save className="h-4 w-4 md:h-5 md:w-5" />
      )}
      {isMiniAppSaved ? textDone : text}
    </Button>
  );
}
