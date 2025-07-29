# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a custom component registry built on the shadcn/ui registry template for distributing reusable React components. The repository allows developers to create, maintain, and distribute custom components that can be installed via the `shadcn` CLI in any React project.

## Key Commands

### Development
- `pnpm dev` - Start the Next.js development server with Turbopack
- `pnpm build` - Build the Next.js application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint for code quality checks

### Registry Management
- `pnpm registry:build` - Build the registry components and generate static JSON files in `/public/r/`

Note: The registry build command uses a local shadcn CLI installation. Components are automatically built as static JSON files that can be consumed by the shadcn CLI.

## Architecture Overview

### Registry Structure
The repository follows a specific structure for organizing reusable components:

- **`/registry/new-york/`** - Main registry directory following shadcn's "new-york" style
  - **`blocks/`** - Complex components with multiple files (components, hooks, libs, pages)
  - **`ui/`** - Basic UI components (button, card, input, etc.)

### Component Organization
Components in `/registry/new-york/blocks/` can include:
- **Components** (`components/`) - React components
- **Hooks** (`hooks/`) - Custom React hooks  
- **Libraries** (`lib/`) - Utility functions and business logic
- **Pages** (`page.tsx`) - Full page components that can be installed as Next.js pages

### Registry Configuration
- **`registry.json`** - Central configuration defining all available components with their dependencies and file paths
- **`components.json`** - shadcn/ui configuration for the project (aliases, styling, etc.)

### Built Registry Files
- **`/public/r/*.json`** - Auto-generated static files consumed by shadcn CLI
- Each component defined in `registry.json` gets its own JSON file for distribution

## Component Types and Dependencies

### Registry Dependencies
Components can depend on other registry components using `registryDependencies` in `registry.json`. These are automatically resolved when users install components.

### External Dependencies  
Components can specify external npm packages using `dependencies` in `registry.json`. These packages must be installed by users when they add the component.

## v0 Integration

The repository includes v0.dev integration via the `OpenInV0Button` component. This allows users to open registry components directly in v0 for further customization. The integration requires:
- `NEXT_PUBLIC_BASE_URL` environment variable
- Registry components served as static JSON files

## Path Aliases

The project uses TypeScript path aliases defined in `components.json`:
- `@/components` → `/components`
- `@/lib` → `/lib`  
- `@/utils` → `/lib/utils`
- `@/ui` → `/components/ui`
- `@/hooks` → `/hooks`

## Adding New Components

When adding new components to the registry:

1. Create component files in `/registry/new-york/blocks/[component-name]/`
2. Add component definition to `registry.json` with proper file paths and dependencies
3. Run `pnpm registry:build` to generate the static JSON file
4. The component becomes available for installation via `npx shadcn add [component-name]`

## Tech Stack

- **Next.js 15.3.1** with React 19.1.0
- **Tailwind CSS v4** (using new version)
- **TypeScript** for type safety
- **shadcn/ui** component system
- **Zod** for schema validation
- **Lucide React** for icons
- **pnpm** for package management

## Important Notes

- The repository uses Tailwind v4 (newer than most shadcn projects)
- Components should follow shadcn/ui patterns and conventions
- All registry components must be compatible with the shadcn CLI installation process
- The `/app` directory serves as a showcase/demo for registry components