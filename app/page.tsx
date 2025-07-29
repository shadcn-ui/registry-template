import * as React from "react"
import { HelloWorld } from "@/registry/new-york/blocks/hello-world/hello-world"

export default function Home() {
  return (
    <div className="flex flex-col py-8 gap-8">
      <main className="flex flex-col gap-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Custom Component Registry</h1>
          <p className="text-muted-foreground">
            A minimal example showcasing our hello-world component
          </p>
        </div>

        <div className="flex flex-col gap-4 border rounded-lg p-6 min-h-[300px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Hello World Component</h2>
            <a 
              href="/hello-world" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
            >
              View Details
            </a>
          </div>
          <div className="flex items-center justify-center min-h-[200px] relative">
            <HelloWorld />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              A simple hello world component to get you started
            </p>
            <p className="text-xs text-muted-foreground">
              Install with: <code className="bg-muted px-2 py-1 rounded">npx shadcn add hello-world</code>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
