"use client";

import { Button } from "@/registry/mini-app/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function OpenInVibesEngineeringButton({
  className,
}: {
  className: string;
}) {
  return (
    <Button
      aria-label="Open in Vibes Engineering"
      size="sm"
      asChild
      variant="outline"
      className={cn("shadow-none pl-0 pr-2 border-l-0", className)}
    >
      <Link href="https://vibes.engineering">
        <Image
          width="20"
          height="20"
          src="/vibes-icon.png"
          alt="Vibes Engineering Logo"
          className="h-8 w-8 text-current rounded-l-md rounded-r-0"
        />{" "}
        Use in Vibes
      </Link>
    </Button>
  );
}
