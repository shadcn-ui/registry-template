# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based component registry for Farcaster mini apps, built using the shadcn architecture. It provides reusable components, hooks, and utilities that developers can install via shadcn CLI from the custom registry.

## LLM Component Development Guide

### Interface Design Rules

- **FLAT PROPS**: No nested objects in component props
- **EXPLICIT TYPES**: `contractAddress: string` not `contract: { address: string }`
- **SINGLE RESPONSIBILITY**: One component = one clear purpose
- **NO HOOKS EXPORT**: Components only, no separate hook files
- **SELF-CONTAINED**: Each component includes all logic it needs

### Code Patterns

#### ✅ GOOD: Self-contained with flat props
```tsx
<NFTCard 
  contractAddress="0x..." 
  tokenId="1"
  network="ethereum"
  showTitle={true}
  showOwner={false}
/>
```

#### ❌ BAD: Nested config objects
```tsx
<NFTCard 
  config={{ 
    contract: { address: "0x...", tokenId: "1" },
    display: { showTitle: true, showOwner: false }
  }}
/>
```

#### ❌ BAD: Too many abstractions
```tsx
// Don't create separate files for every piece
useNFTMetadata.ts
useNFTImage.ts  
useNFTPrice.ts
NFTCard.tsx
NFTCardTypes.ts
NFTCardUtils.ts
NFTCardContext.tsx
```

#### ✅ GOOD: Everything in one place
```tsx
// nft-card.tsx - contains everything needed
export function NFTCard(props: NFTCardProps) {
  // All logic contained within component
}
```

### Standard Libraries Location

Always use these shared libraries instead of creating duplicates:
- **Chains**: `/registry/mini-app/lib/chains.ts` - RPC configuration, chain detection
- **NFT Standards**: `/registry/mini-app/lib/nft-standards.ts` - ABIs and constants
- **Manifold Utils**: `/registry/mini-app/lib/manifold-utils.ts` - Manifold-specific logic

### ABI Usage Pattern

Always use full contract ABIs, not parsed fragments:

```typescript
// ✅ GOOD: Full ABI as const array
export const MANIFOLD_EXTENSION_ABI = [
  { name: "tokenURI", inputs: [...], outputs: [...], type: "function" },
  { name: "getClaim", inputs: [...], outputs: [...], type: "function" },
  // ... all functions
] as const;

// ❌ BAD: Mixed formats
export const MANIFOLD_ABI = {
  tokenURI: parseAbi([...]),     // parsed
  getClaim: [{...}] as const,     // raw array
  mint: parseAbi([...])           // parsed
};
```

### Error Handling Checklist

- [ ] **Abort controllers** for all async operations
- [ ] **Input validation** with clear error messages
- [ ] **Network failure** fallbacks
- [ ] **Type validation** for external data
- [ ] **Race condition** prevention

Example implementation:
```tsx
const abortControllerRef = useRef<AbortController | null>(null);

useEffect(() => {
  // Cancel previous request
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
  
  const abortController = new AbortController();
  abortControllerRef.current = abortController;
  
  // Make request with abort signal
  fetch(url, { signal: abortController.signal })
    .then(handleResponse)
    .catch(err => {
      if (err.name === 'AbortError') return;
      handleError(err);
    });
    
  return () => abortController.abort();
}, [deps]);
```

### Data Validation Pattern

Never trust external data:
```typescript
// Validate contract response
const data = await client.readContract({...});

if (!Array.isArray(data) || data.length !== 2) {
  throw new Error("Invalid response structure");
}

const [instanceId, claim] = data;

if (typeof instanceId !== 'bigint' || !claim || typeof claim !== 'object') {
  throw new Error("Invalid data types");
}
```

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
- Shared libraries live in `registry/mini-app/lib/`
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

## Important Notes

- **90/10 Principle**: Start with simple version that covers 80% of use cases
- **Real Examples**: Always test with actual on-chain contracts
- **No Over-Engineering**: Avoid unnecessary abstractions
- **LLM Friendly**: Keep interfaces flat and explicit for AI code generation