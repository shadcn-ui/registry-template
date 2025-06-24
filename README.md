# hellno/mini-app-ui

A collection of components, hooks, and utilities for mini apps.
Focus: consistent UX across Farcaster clients where no standards exist.

Website: [https://hellno-mini-app-ui.vercel.app](https://hellno-mini-app-ui.vercel.app)

## Table of Contents

- [Getting Started](#getting-started)
- [Component Development Guide](#component-development-guide)
- [Develop: Add to the Registry](#develop-add-to-the-registry)
- [Scripts](#scripts)
- [License](#license)


## Getting Started

### Browse components

Website: [https://hellno-mini-app-ui.vercel.app](https://hellno-mini-app-ui.vercel.app)

### Install a component

Example to install simple token transfer button:

```bash
pnpm dlx shadcn@latest add https://hellno-mini-app-ui.vercel.app/r/daimo-pay-transfer-button.json
```

### Install all components

```bash
pnpm dlx shadcn@latest add https://hellno-mini-app-ui.vercel.app/r/all-components.json
```

This will install all available components and their dependencies at once.


## Component Development Guide

### Design Philosophy

**90/10 Principle**: Maximum impact with minimum effort. Start with the simplest solution that covers 90% of use cases.

### Key Lessons

1. **Avoid Over-Engineering**
   - Don't create abstractions that "no one will use separately"
   - Keep components self-contained rather than splitting into many files
   - Example: NFTCard should include its own data fetching, not require separate hooks

2. **LLM-Friendly Interfaces**
   - Use flat props, avoid nested objects
   - Make each prop's purpose obvious from its name
   - Example: `showTitle={true}` not `display={{ title: true }}`

3. **Clear Component Boundaries**
   - Each component should have a single, clear responsibility
   - NFTCard: Display only (no actions)
   - NFTMintButton: Action only (no preview)
   - NFTMintFlow: Combined experience

4. **Production-Ready Patterns**
   ```tsx
   // Always validate external data
   if (!Array.isArray(data) || data.length !== 2) {
     throw new Error("Invalid response structure");
   }
   
   // Prevent race conditions
   const abortController = new AbortController();
   useEffect(() => {
     return () => abortController.abort();
   }, [deps]);
   
   // Use reliable infrastructure
   const transport = process.env.NEXT_PUBLIC_ALCHEMY_KEY
     ? http(`https://${alchemyUrl}.g.alchemy.com/v2/${key}`)
     : http(); // fallback
   ```

5. **Eliminate Duplication**
   - Create shared libraries for common patterns
   - `/lib/chains.ts` - Chain configurations
   - `/lib/nft-standards.ts` - ABIs and utilities
   - `/lib/manifold-utils.ts` - Contract-specific logic

### Testing with Real Contracts

- Manifold: `0x612b60c14ea517e1a538aee7b443e014a95de2d0`
- Zora: `0x7c2668BD0D3c050703CEcC956C11Bd520c26f7d4`
- Base: `0xba5e05cb26b78eda3a2f8e3b3814726305dcac83`

### Custom shadcn Registry Pitfalls

Working with a custom shadcn registry has unique challenges:

1. **Import Path Requirements**
   - All imports MUST use `@/registry/mini-app/...` format
   - The shadcn CLI transforms these paths during installation
   - Relative imports (`./lib/types`) will fail after installation
   - Even imports within the same component's lib folder need full paths

2. **File Naming Constraints**
   - Avoid `page.tsx` - it installs to `src/components/page.tsx` (wrong location)
   - Use descriptive names that match the component: `nft-mint-flow.tsx`
   - Main component file should match the folder name

3. **Multi-File Component Structure**
   ```
   blocks/my-component/
   ├── my-component.tsx      # Main component (not page.tsx!)
   ├── my-component-part.tsx # Sub-components
   └── lib/                  # Supporting files
       ├── types.ts
       └── utils.ts
   ```

4. **Registry Dependencies**
   - Components can depend on other registry items via `registryDependencies`
   - Shared code should go in top-level `/lib` folder
   - Import shared code with `@/registry/mini-app/lib/...`

5. **Installation Behavior**
   - All files in the component folder get installed
   - Directory structure is preserved
   - The shadcn CLI handles path transformations
   - Test installation in a separate project to verify paths

⸻

## Develop: Add to the Registry
### 1.	Create files

`registry/mini-app/<name>/<name>.tsx`


### 2.	Describe item in registry.json
Add new entry in items:
```json
{
  "name": "<name>",
  "type": "registry:block",
  "title": "<Readable title>",
  "description": "<Short pitch>",
  "files": [
    { "path": "registry/mini-app/<name>/<name>.tsx", "type": "registry:component" },
    { "path": "registry/mini-app/<name>/use-<name>.ts", "type": "registry:hook" }
  ],
  "dependencies": ["@radix-ui/react-slot", "lucide-react"],
  "registryDependencies": []
}
```

### 4.	Commit
The repo runs a Husky pre-commit hook:

pnpm lint           # ESLint + Prettier
pnpm registry:build # shadcn build ➜ public/r

The hook lints, generates fresh public/r/*.json, and blocks the commit on failure.

### 5.	Push & deploy
Vercel auto-deploys; the CLI fetches from
https://hellno-mini-app-ui.vercel.app/r.

⸻

## License

MIT
