# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a shadcn/ui-based component registry for Farcaster mini apps. It provides reusable components, hooks, and utilities designed for building mini apps with consistent UX across Farcaster clients.

## Key Commands

```bash
# Development
pnpm dev          # Start Next.js dev server with Turbopack on http://localhost:3000

# Build & Production
pnpm build        # Production build
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint (automatically runs in pre-commit hook)

# Registry Management
pnpm registry:build  # Generate registry JSON files in public/r/ (runs automatically in pre-commit)

# Install a component from this registry
pnpm dlx shadcn@latest add https://hellno-mini-app-ui.vercel.app/r/<component-name>.json
```

## Architecture & Structure

### Component Organization
- **Registry components**: `registry/mini-app/blocks/<component-name>/` - Self-contained component implementations
- **Hooks**: `registry/mini-app/hooks/` - Reusable React hooks
- **UI primitives**: `registry/mini-app/ui/` - Base shadcn UI components
- **Generated registry**: `public/r/*.json` - Auto-generated component registry files

### Registry System
Components must be registered in `registry.json` with:
- `name`: Component identifier
- `type`: One of `registry:component`, `registry:hook`, or `registry:block`
- `files`: Array of paths relative to project root
- `dependencies`: NPM packages required
- `registryDependencies`: Other components from this registry

Example registry entry:
```json
{
  "name": "nft-mint",
  "type": "registry:block",
  "files": ["registry/mini-app/blocks/nft-mint/nft-mint.tsx"],
  "dependencies": ["wagmi", "viem"],
  "registryDependencies": ["mini-app-provider", "use-miniapp-sdk"]
}
```

### Key Patterns

1. **Farcaster SDK Integration**
   - Always use `useMiniAppSdk()` hook to access SDK
   - Check `isSDKLoaded` before SDK operations
   - Call `sdk.actions.ready({})` when component initializes
   - Components should gracefully handle non-mini-app contexts

2. **Component Standards**
   - All components use `"use client"` directive
   - Props interfaces clearly defined with TypeScript
   - Use `cn()` utility from `@/lib/utils` for className merging
   - Support standard props: `className`, `variant`, `size` where applicable

3. **Web3 Integration**
   - Wagmi provider wraps the entire app (in layout.tsx)
   - Use `@farcaster/frame-wagmi-connector` for wallet connection
   - Components can interact with blockchain via wagmi hooks

4. **Import Conventions**
   - Use `@/` alias for project root imports
   - External registry dependencies use full URLs: `https://hellno-mini-app-ui.vercel.app/r/<component>.json`

## Adding New Components

1. Create component directory: `registry/mini-app/blocks/<component-name>/`
2. Add component implementation with proper TypeScript types
3. Add entry to `registry.json` with metadata and dependencies
4. Run `pnpm registry:build` to generate registry files
5. Component demo page automatically available at `/component/<component-name>`

## Important Notes

- Pre-commit hooks automatically run linting and registry build
- Registry JSON files in `public/r/` are auto-generated - never edit directly
- Components should work both inside Farcaster frames and standalone web contexts
- All components follow shadcn/ui patterns with New York style
- Project uses Tailwind CSS v4 with CSS variables for theming