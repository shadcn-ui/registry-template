import { Button } from "@/registry/mini-app/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function OpenInVibesEngineeringButton({
  className,
}: {
  className: string;
}) {
  return (
    <Button
      aria-label="Open in Vibes Engineering"
      size="sm"
      variant="outline"
      className={cn("shadow-none px-2", className)}
      asChild
    >
      <a href="https://vibes.engineering" target="_blank" rel="noreferrer">
        Use in Vibes{" "}
        <Image
          width="20"
          height="20"
          src="/vibes-icon.png"
          alt="Vibes Engineering Logo"
          className="h-5 w-5 text-current"
        />
      </a>
    </Button>
  );
}
