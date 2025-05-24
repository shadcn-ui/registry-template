# hellno/mini-app-ui

A collection of components, hooks, and utilities for mini apps.
Focus: consistent UX across Farcaster clients where no standards exist.

Website: [https://hellno-mini-app-ui.vercel.app](https://hellno-mini-app-ui.vercel.app)

## Table of Contents

- [Getting Started](#getting-started)
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
