import { Button } from "@/registry/mini-app/ui/button";
import { Save, Share } from "lucide-react";
import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";
import { useMemo } from "react";

type AddMiniAppButtonProps = {
  text?: string;
  variant?: "destructive" | "secondary" | "ghost" | "default";
  className?: string;
};

export function AddMiniappButton({
  text = "Pin Mini App",
  variant = "default",
  className,
}: AddMiniAppButtonProps) {
  const { sdk } = useMiniAppSdk();

  const onAddMiniApp = () => {
    sdk.actions.addMiniApp();
  };

  return (
    <Button
      variant={variant}
      onClick={(e) => onAddMiniApp()}
      size="default"
      className={`${className || ""}`}
    >
      <Save className="h-4 w-4 md:h-5 md:w-5" />
      {text}
    </Button>
  );
}
