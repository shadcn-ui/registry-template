export const siteConfig = {
  name: "shadcn/registry",
  title: "Run your own private registry",
  url: {
    short: "https://git.new/zeta",
    long: "https://registry-template-zeta.vercel.app",
  },
  authors: [
    { name: "shadcn", url: "https://shadcn.com" },
    { name: "rbadillap", url: "https://rbadillap.dev" },
  ],
  description:
    "A shadcn/ui registry for sharing UI components. Designed for teams and individuals who want to distribute their own components and blocks. Open Source.",
  og: {
    title: "zeta",
    description: "A shadcn/registry with a focus on private and internal components.",
  },
  links: {
    ui: {
      twitter: "https://twitter.com/shadcn",
      github: "https://github.com/shadcn-ui/ui",
      docs: "https://ui.shadcn.com/docs",
    },
    registry: {
      twitter: "https://twitter.com/rbadillap",
      github: "https://github.com/rbadillap/registry-template-v4",
      docs: "https://ui.shadcn.com/docs/registry",
    },
  },
}

export type SiteConfig = typeof siteConfig

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}