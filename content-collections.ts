import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"

const docs = defineCollection({
  name: "docs",
  directory: "content/docs",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    component: z.string().optional(),
    date: z.string().optional(),
    author: z.string().optional(),
    published: z.boolean().default(true),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document)
    return {
      ...document,
      mdx,
      slug: document._meta.path,
      slugAsParams: document._meta.path.replace(/\.mdx$/, "").replace(/^\//, ""),
    }
  },
})

export default defineConfig({
  collections: [docs],
})