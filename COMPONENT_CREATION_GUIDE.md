# Component Creation Guide for AGW Reusables Registry

This document provides step-by-step instructions for creating, registering, and documenting new components in the AGW Reusables registry system.

## Overview

The AGW Reusables registry is a custom shadcn/ui registry that distributes React components compatible with the `shadcn` CLI. Components are organized into blocks, UI components, hooks, and utilities that can be installed via `npx shadcn@latest add`.

## Quick Checklist

- [ ] Create component files in appropriate directory structure
- [ ] Add registry entry to `registry.json`
- [ ] Create demo component (if applicable)
- [ ] Write MDX documentation
- [ ] Build and test registry
- [ ] Verify installation works

## Directory Structure

```
registry/new-york/
├── blocks/                    # Complex components with multiple files
│   └── [component-name]/
│       ├── [component-name].tsx      # Main component
│       ├── hooks/                    # Component-specific hooks
│       └── lib/                      # Component-specific utilities
├── examples/                  # Demo components for preview
│   └── [component-name]-demo.tsx
└── ui/                        # Base UI components (shadcn/ui style)
    └── [component-name].tsx
```

## Step 1: Create Component Files

### 1.1 Main Component Structure

Create your main component in the appropriate directory:

**For complex components (blocks):**
```
registry/new-york/blocks/[component-name]/[component-name].tsx
```

**For simple UI components:**
```
registry/new-york/ui/[component-name].tsx
```

### 1.2 Component Template

Use this template for your main component file:

```tsx
"use client"

import { cn } from "@/lib/utils"
import { type ClassValue } from "clsx"
// Import other dependencies...

interface [ComponentName]Props {
  className?: ClassValue
  // Other props...
}

/**
 * [Component Name] - Brief description
 * 
 * A comprehensive description of what the component does:
 * - Key feature 1
 * - Key feature 2
 * - Key feature 3
 */
export function [ComponentName]({ className, ...props }: [ComponentName]Props) {
  // Implementation...
  
  return (
    <div className={cn("base-classes", className)}>
      {/* Component content */}
    </div>
  )
}
```

### 1.3 Supporting Files

**For hooks (if needed):**
```
registry/new-york/blocks/[component-name]/hooks/use-[hook-name].ts
```

**For utilities (if needed):**
```
registry/new-york/blocks/[component-name]/lib/[utility-name].ts
```

**For API routes (if needed):**
```
app/api/[route-path]/route.ts
```

### 1.4 Demo Component

Create a demo component for preview and testing:

```tsx
// registry/new-york/examples/[component-name]-demo.tsx
import { [ComponentName] } from "@/registry/new-york/blocks/[component-name]/[component-name]"

export default function [ComponentName]Demo() {
  return (
    <div className="space-y-4">
      <[ComponentName] />
      {/* Additional demo variations */}
    </div>
  )
}
```

## Step 2: Register Component in registry.json

Add your component to the `registry.json` file:

```json
{
  "name": "component-name",
  "type": "registry:component",
  "title": "Human-Readable Title",
  "description": "Brief description of what the component does",
  "dependencies": [
    "npm-package-1",
    "npm-package-2"
  ],
  "registryDependencies": [
    "button",
    "dropdown-menu"
  ],
  "envVars": {
    "OPTIONAL_ENV_VAR": ""
  },
  "files": [
    {
      "path": "registry/new-york/blocks/component-name/component-name.tsx",
      "type": "registry:component"
    },
    {
      "path": "registry/new-york/blocks/component-name/hooks/use-hook-name.ts",
      "type": "registry:hook"
    },
    {
      "path": "registry/new-york/blocks/component-name/lib/utility-name.ts",
      "type": "registry:lib"
    },
    {
      "path": "app/api/route-path/route.ts",
      "type": "registry:page",
      "target": "app/api/route-path/route.ts"
    }
  ]
}
```

### Registry Entry Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Kebab-case component name (used for CLI installation) |
| `type` | Yes | Component type: `registry:component`, `registry:hook`, `registry:lib`, `registry:page` |
| `title` | Yes | Human-readable title for documentation |
| `description` | Yes | Brief description of component functionality |
| `dependencies` | No | NPM packages required by the component |
| `registryDependencies` | No | Other registry components this component depends on |
| `envVars` | No | Environment variables required by the component |
| `files` | Yes | Array of files included with the component |

### File Entry Fields

| Field | Required | Description |
|-------|----------|-------------|
| `path` | Yes | Relative path to the file from project root |
| `type` | Yes | File type: `registry:component`, `registry:hook`, `registry:lib`, `registry:page` |
| `target` | No | Custom installation path (defaults to same as `path`) |

## Step 3: Create Documentation

### 3.1 Create MDX File

Create documentation file:
```
content/docs/[category]/[component-name].mdx
```

### 3.2 Documentation Template

```mdx
---
title: Component Title
description: Brief description for meta tags and search
---

<ComponentPreview name="component-name" />

## Installation

Include any prerequisites or setup instructions:

```bash
npx shadcn@latest add "https://agw-reusables.vercel.app/r/component-name.json"
```

## Usage

### Basic Usage

```tsx
import { ComponentName } from "@/components/component-name"

export default function Example() {
  return (
    <ComponentName />
  )
}
```

### Advanced Usage

Include examples with different props and configurations.

## API Reference

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `ClassValue` | `undefined` | Custom CSS classes |
| `prop1` | `string` | `""` | Description of prop1 |

## What's included

The installation command adds the following files to your project:

- [`component-name.tsx`](#component-nametsx) - Main component file
- [`use-hook-name.ts`](#use-hook-namets) - Custom hook (if applicable)

### File descriptions and code previews

<ComponentSource src="registry/new-york/blocks/component-name/component-name.tsx" />
```

### 3.3 Update Navigation

Add your new documentation page to the appropriate meta.json file:

```json
{
  "title": "Category Name",
  "pages": [
    "existing-page",
    "your-new-component"
  ]
}
```

## Step 4: Build and Test

### 4.1 Build Registry

Run the registry build commands:

```bash
# Build all registry items and generate index
pnpm run registry:build

# Or build steps separately:
shadcn build                    # Build registry items to public/r/
pnpm run registry:index         # Generate registry/__index__.ts
```

### 4.2 Test Installation

Test that your component can be installed:

```bash
npx shadcn@latest add "http://localhost:3000/r/your-component-name.json"
```

### 4.3 Verify Build Output

Check that the following files were generated:

- `public/r/your-component-name.json` - Registry definition file
- `registry/__index__.ts` - Updated index with your component

### 4.4 Test Documentation

Start the dev server and verify your component documentation:

```bash
pnpm dev
```

Visit:
- Component documentation: `http://localhost:3000/docs/category/component-name`
- Component preview: Should show in the ComponentPreview

## Step 5: Quality Checklist

Before considering your component complete:

- [ ] **Component works in isolation** - Can be imported and used without breaking
- [ ] **TypeScript types** - All props are properly typed
- [ ] **Accessibility** - Component follows accessibility best practices
- [ ] **Responsive design** - Works on mobile and desktop
- [ ] **Error handling** - Gracefully handles edge cases
- [ ] **Documentation** - Clear examples and API reference
- [ ] **Demo component** - Shows component in action
- [ ] **Registry builds** - `pnpm run registry:build` succeeds
- [ ] **Installation works** - Component can be installed via shadcn CLI
- [ ] **Dependencies correct** - All required packages listed in registry.json
- [ ] **Code style** - Follows project conventions

## Common Patterns

### File Structure Examples

**Simple UI Component:**
```
registry/new-york/ui/
└── button.tsx
```

**Complex Block Component:**
```
registry/new-york/blocks/connect-wallet-button/
├── connect-wallet-button.tsx
└── (no additional files needed)
```

**Full-Featured Block Component:**
```
registry/new-york/blocks/session-keys/
├── session-key-button.tsx
├── hooks/
│   ├── use-session-key.ts
│   ├── use-create-session-key.ts
│   └── use-revoke-session-key.ts
└── lib/
    ├── get-stored-session-key.ts
    ├── create-and-store-session-key.ts
    └── session-encryption-utils.ts
```

### Import Path Conventions

- Use `@/registry/new-york/ui/[component]` for UI components
- Use `@/lib/utils` for the `cn` utility function
- Use `@/` prefix for all internal imports
- Import external dependencies normally

### Component Naming

- **File names:** kebab-case (`connect-wallet-button.tsx`)
- **Component names:** PascalCase (`ConnectWalletButton`)
- **Registry names:** kebab-case (`connect-wallet-button`)
- **Hook names:** camelCase with `use` prefix (`useSessionKey`)

## Troubleshooting

### Build Issues

**Registry build fails:**
- Check `registry.json` syntax
- Verify all file paths exist
- Ensure all dependencies are installed

**Index generation fails:**
- Check that `public/r/` directory exists
- Verify JSON files are valid
- Check file permissions

**Component not showing in preview:**
- Ensure demo component exists in `registry/new-york/examples/`
- Verify component exports are correct
- Check browser console for errors

### Installation Issues

**Component not found:**
- Verify `public/r/component-name.json` exists
- Check registry.json entry is correct
- Ensure build process completed successfully

**Dependency errors:**
- Add missing packages to `dependencies` in registry.json
- Check that registryDependencies exist
- Verify import paths are correct

## Advanced Features

### Environment Variables

For components requiring environment variables:

```json
{
  "envVars": {
    "IRON_SESSION_PASSWORD": "",
    "NEXT_PUBLIC_API_URL": ""
  }
}
```

### Custom Installation Paths

Use the `target` field to install files to custom locations:

```json
{
  "path": "config/auth.ts",
  "type": "registry:lib",
  "target": "config/auth.ts"
}
```

### Component Dependencies

Reference other registry components:

```json
{
  "registryDependencies": [
    "button",
    "dropdown-menu",
    "connect-wallet-button"
  ]
}
```

This ensures that when your component is installed, its dependencies are installed automatically.

## Best Practices

1. **Keep components focused** - Each component should have a single, clear purpose
2. **Use TypeScript** - Provide proper type definitions for all props
3. **Follow accessibility guidelines** - Use semantic HTML and ARIA attributes
4. **Make components composable** - Allow customization through props and className
5. **Document thoroughly** - Include usage examples and API reference
6. **Test across devices** - Ensure responsive design works properly
7. **Handle edge cases** - Gracefully handle loading, error, and empty states
8. **Follow project conventions** - Use existing patterns for imports, styling, and structure