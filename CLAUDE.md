# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based component registry for Farcaster mini apps, built using the shadcn architecture. It provides reusable components, hooks, and utilities that developers can install via shadcn CLI from the custom registry.

## Key Commands

**Development:**
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

**Registry Management:**
- `pnpm registry:build` - Build shadcn registry (generates public/r/*.json files)

**Pre-commit Hook:**
The repository uses Husky to run `pnpm lint` and `pnpm registry:build` before each commit. Both must pass for the commit to succeed.

## Architecture

**Registry Structure:**
- Components live in `registry/mini-app/blocks/<component-name>/`
- Hooks live in `registry/mini-app/hooks/`
- UI primitives live in `registry/mini-app/ui/`
- Registry metadata is defined in `registry.json`
- Built registry files are generated in `public/r/` for CLI consumption

**Component Installation Flow:**
1. Users run `pnpm dlx shadcn@latest add https://hellno-mini-app-ui.vercel.app/r/<component>.json`
2. shadcn CLI fetches from the custom registry endpoint
3. Components are installed with their dependencies and registryDependencies

**Key Technologies:**
- Next.js 15 with React 19
- Farcaster Frame SDK (@farcaster/frame-sdk, @farcaster/frame-core)
- Daimo Pay integration (@daimo/pay, @daimo/contract)
- Wagmi for Ethereum interaction
- Tailwind CSS for styling
- Lucide React for icons

**Registry Dependencies:**
Components can depend on other registry items via `registryDependencies` field in registry.json. The `use-miniapp-sdk` hook is commonly referenced by components.

## Development Workflow

When adding new components:
1. Create component files in `registry/mini-app/blocks/<name>/`
2. Add registry entry to `registry.json` with proper metadata
3. The pre-commit hook will automatically run `registry:build` to generate public files
4. Deploy triggers automatic Vercel deployment