import { readFileSync } from "fs"
import { join } from "path"

export function getComponentSource(componentName: string): string {
  try {
    // Map component names to their file paths
    const componentPaths: Record<string, string> = {
      "hello-world": "registry/new-york/blocks/hello-world/hello-world.tsx",
      "example-form": "registry/new-york/blocks/example-form/example-form.tsx",
    }

    const filePath = componentPaths[componentName]
    if (!filePath) {
      return `// Component '${componentName}' not found`
    }

    const fullPath = join(process.cwd(), filePath)
    return readFileSync(fullPath, "utf-8")
  } catch (error) {
    return `// Error loading component source: ${error}`
  }
}