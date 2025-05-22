import * as React from "react";
import { OpenInVibesEngineeringButton } from "@/components/open-in-vibes-engineering-button";
import { ExampleForm } from "@/registry/mini-app/blocks/example-form/example-form";
import PokemonPage from "@/registry/mini-app/blocks/complex-component/page";
import { ExampleCard } from "@/registry/mini-app/blocks/example-with-css/example-card";
import { DaimoPayTransferButton } from "@/registry/mini-app/blocks/daimo-pay-transfer/components/daimo-pay-transfer-button";
import { Metadata } from "next";
// This page displays items from the custom registry.

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          hellno/mini-app-ui
        </h1>
        <p className="text-muted-foreground">
          A collection of components, hooks and utilities for mini apps using
          shadcn.
        </p>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              A simple token transfer button
            </h2>
            <OpenInVibesEngineeringButton className="w-fit" />
          </div>
          <div className="flex items-center justify-center min-h-[400px] relative">
            <DaimoPayTransferButton
              text="Donate $1 to Protocol Guild"
              toAddress="0x32e3C7fD24e175701A35c224f2238d18439C7dBC"
              amount="1"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              A contact form with Zod validation.
            </h2>
            <OpenInVibesEngineeringButton className="w-fit" />
          </div>
          <div className="flex items-center justify-center min-h-[500px] relative">
            <ExampleForm />
          </div>
        </div>

        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              A complex component showing hooks, libs and components.
            </h2>
            <OpenInVibesEngineeringButton className="w-fit" />
          </div>
          <div className="flex items-center justify-center min-h-[400px] relative">
            <PokemonPage />
          </div>
        </div>

        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              A login form with a CSS file.
            </h2>
            <OpenInVibesEngineeringButton className="w-fit" />
          </div>
          <div className="flex items-center justify-center min-h-[400px] relative">
            <ExampleCard />
          </div>
        </div>
      </main>
    </div>
  );
}

const frame = {
  version: "next",
  imageUrl: `https://hellno-mini-app-ui.vercel.app/opengraph-image`,
  button: {
    title: "Show hellno/mini-app-ui",
    action: {
      type: "launch_frame",
      name: "hellno/mini-app-ui",
      url: "https://hellno-mini-app-ui.vercel.app",
      splashImageUrl: "https://hellno-mini-app-ui.vercel.app/vibes-icon.png",
      splashBackgroundColor: "#fff",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "hellno/mini-app-ui",
    metadataBase: new URL("https://hellno-mini-app-ui.vercel.app"),
    openGraph: {
      title: "hellno/mini-app-ui",
      description:
        "A collection of components, hooks and utilities for mini apps",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}
