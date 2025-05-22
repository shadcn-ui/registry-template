import * as React from "react";
import { OpenInVibesEngineeringButton } from "@/components/open-in-vibes-engineering-button";
import { HelloWorld } from "@/registry/mini-app/blocks/hello-world/hello-world";
import { ExampleForm } from "@/registry/mini-app/blocks/example-form/example-form";
import PokemonPage from "@/registry/mini-app/blocks/complex-component/page";
import { ExampleCard } from "@/registry/mini-app/blocks/example-with-css/example-card";
// This page displays items from the custom registry.
// You are free to implement this with your own design as needed.

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
              A simple hello world component
            </h2>
            <OpenInVibesEngineeringButton
              name="hello-world"
              className="w-fit"
            />
          </div>
          <div className="flex items-center justify-center min-h-[400px] relative">
            <HelloWorld />
          </div>
        </div>

        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              A contact form with Zod validation.
            </h2>
            <OpenInVibesEngineeringButton
              name="example-form"
              className="w-fit"
            />
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
            <OpenInVibesEngineeringButton
              name="complex-component"
              className="w-fit"
            />
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
            <OpenInVibesEngineeringButton
              name="example-with-css"
              className="w-fit"
            />
          </div>
          <div className="flex items-center justify-center min-h-[400px] relative">
            <ExampleCard />
          </div>
        </div>
      </main>
    </div>
  );
}
