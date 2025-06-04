# Codebase Overview

This document provides a high-level overview of the `hellno/mini-app-ui` codebase, including its purpose, architecture, directory structure, key files, and development workflow.

## Purpose

`hellno/mini-app-ui` is a collection of React components, hooks, and utilities designed to help build Farcaster mini-apps with a consistent UX. It leverages Next.js, TypeScript, Tailwind CSS, and the shadcn registry.

## Features

- Ready-to-use UI components for token transfers, sharing casts, pinning mini-apps, displaying coin balances, user avatars, user context, NFT cards, profile search, and more.
- Custom React hooks for Farcaster MiniApp SDK integration and profile management.
- Utility libraries for text manipulation and formatting.
- Integrated registry manifest (`registry.json`) and generated JSON exports for the shadcn CLI.
- Interactive demo website powered by Next.js with installation snippets.

## Technology Stack

- **Next.js** (App Router) and **React**
- **TypeScript**
- **Tailwind CSS** (with `tw-animate-css`)
- **shadcn** registry for component distribution
- **Husky** for Git hooks and pre-commit checks
- **PNPM** as the package manager

## Directory Structure

```text
. 
├── .github/                 # GitHub workflows
├── .husky/                  # Git hooks
├── app/                     # Next.js App Router source (pages, layouts)
├── components/              # Custom React components
├── lib/                     # Shared utilities (cn, components-config)
├── public/                  # Static assets (images, previews, registry JSON)
│   ├── previews/            # Component preview media (MP4)
│   └── r/                   # Generated registry JSON files for shadcn
├── registry/                # Source files for registry items
│   └── mini-app/
│       ├── blocks/          # React component source code
│       ├── hooks/           # Custom hook source code
│       └── lib/             # Utility libraries (e.g., text-utils)
├── registry.json            # Registry manifest for shadcn (items definition)
├── package.json             # Project metadata, dependencies, and scripts
├── tsconfig.json            # TypeScript configuration
├── next.config.ts           # Next.js configuration
├── postcss.config.mjs       # PostCSS configuration
├── eslint.config.mjs        # ESLint configuration
└── README.md                # Setup and contribution guidelines
```

## Key Scripts (`package.json`)

| Command               | Description                                                   |
|-----------------------|---------------------------------------------------------------|
| `pnpm dev`            | Start the Next.js development server (with Turbopack)         |
| `pnpm build`          | Build the Next.js application                                 |
| `pnpm start`          | Start the production server                                   |
| `pnpm lint`           | Run ESLint and Prettier checks                                |
| `pnpm registry:build` | Generate registry JSON files (`shadcn registry:build`)        |
| `pnpm prepare`        | Install Husky Git hooks                                       |

## Registry Items

The registry manifest (`registry.json`) defines the following items:

- **Components**
  - `daimo-pay-transfer-button`
  - `share-cast-button`
  - `add-miniapp-button`
  - `show-coin-balance`
  - `avatar`
  - `user-context`
  - `nft-card`
  - `profile-search`
- **Hooks**
  - `use-miniapp-sdk`
  - `use-profile`
- **Libraries**
  - `text-utils`

## Development Workflow

1. **Install dependencies**: `pnpm install`
2. **Start development server**: `pnpm dev`
3. **Generate registry JSON**: `pnpm registry:build` (Husky runs this on pre-commit)
4. **Run pre-commit hook**: `pnpm lint` + `pnpm registry:build`
5. **Commit and push**: Vercel auto-deploys; the shadcn CLI fetches JSON from `https://hellno-mini-app-ui.vercel.app/r/`

## License

This project is licensed under the MIT License (see the [License](#license) section in `README.md`).