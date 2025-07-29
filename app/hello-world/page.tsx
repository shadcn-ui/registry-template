import * as React from "react"
import { HelloWorld } from "@/registry/new-york/blocks/hello-world/hello-world"

export default function HelloWorldPage() {
  return (
    <div className="flex flex-col py-8 gap-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Hello World</h1>
        <p className="text-muted-foreground text-lg">
          A simple hello world component to get you started.
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Preview</h2>
          <div className="flex flex-col gap-4 border rounded-lg p-6 min-h-[300px] relative">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Live preview of the Hello World component
              </p>
            </div>
            <div className="flex items-center justify-center min-h-[200px] relative">
              <HelloWorld />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Installation</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Install the hello-world component using the shadcn CLI:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm">npx shadcn add hello-world</code>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Usage</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Import and use the HelloWorld component in your React application:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
{`import { HelloWorld } from "@/components/hello-world"

export default function App() {
  return (
    <div>
      <HelloWorld />
    </div>
  )
}`}
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Source Code</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              The complete source code for the Hello World component:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
{`export function HelloWorld() {
  return <h1 className="text-2xl font-bold">Hello World</h1>
}`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}