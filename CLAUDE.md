# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a custom shadcn/ui registry template for distributing reusable React components. The project allows users to create their own component registry that's compatible with the `shadcn` CLI, enabling distribution of custom components, hooks, pages, and other files to any React project.

## Key Commands

### Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the Next.js application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Registry Management
- `pnpm run registry:build` - Build registry items and generate index (runs `shadcn build` + index generation)
- `pnpm run registry:index` - Generate registry index file only
- `shadcn build` - Build individual registry items to `public/r/` directory

## Architecture

### Registry System
The core registry system works as follows:

1. **Registry Definition**: Components are defined in `registry.json` with metadata and file paths
2. **Build Process**: `shadcn build` processes registry items and outputs JSON files to `public/r/`
3. **Index Generation**: `scripts/build-registry-index.ts` creates `registry/__index__.ts` for runtime component loading
4. **Runtime Loading**: Components are lazy-loaded via the index file using React.lazy()

### Key Directories
- `registry/new-york/blocks/` - Component implementations organized by component name
- `registry/new-york/ui/` - Base UI components (shadcn/ui components)
- `content/docs/` - MDX documentation files
- `public/r/` - Built registry JSON files served statically
- `lib/registry.ts` - Registry processing utilities

### Component Structure
Each registry component can include:
- Main component file (`.tsx`)
- Additional component dependencies
- Custom hooks (`hooks/`)
- Utility libraries (`lib/`)
- CSS files (`.css`)

### Documentation System
Uses Fumadocs for documentation:
- `source.config.ts` - Fumadocs configuration with syntax highlighting
- `content/docs/` - MDX content with automatic navigation
- Custom rehype plugins for code highlighting

### Build System
- **Next.js 15** with React 19
- **Tailwind CSS v4** (not v3)
- **TypeScript** with strict mode
- **pnpm** for package management
- Custom build script for registry index generation

## Path Aliases
- `@/components` - React components
- `@/lib` - Utility libraries  
- `@/hooks` - Custom React hooks
- `@/registry/new-york/ui` - Base UI components

## Registry Item Types
- `registry:component` - Standard React components
- `registry:page` - Full page components
- `registry:hook` - Custom React hooks
- `registry:lib` - Utility libraries
- `registry:ui` - Base UI components

## Integration Features
- **v0 Integration**: Components include "Open in v0" functionality
- **shadcn CLI Compatible**: All registry items work with standard `shadcn add` commands
- **Static Serving**: Registry items served as JSON under `/r/[name].json` route