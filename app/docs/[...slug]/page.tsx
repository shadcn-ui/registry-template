import { notFound } from "next/navigation"
import { HelloWorld } from "@/registry/new-york/blocks/hello-world/hello-world"
import { ComponentPreview } from "@/components/mdx/component-preview"
import { CodeBlock } from "@/components/mdx/code-block"

interface DocPageProps {
  params: Promise<{
    slug: string[]
  }>
}

// For now, let's create a simple static mapping
const docs = {
  "components/hello-world": {
    title: "Hello World",
    description: "A simple hello world component to get you started.",
    component: HelloWorld,
  }
}

export async function generateMetadata({ params }: DocPageProps) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug?.join("/")
  const doc = docs[slug as keyof typeof docs]

  if (!doc) {
    return {}
  }

  return {
    title: doc.title,
    description: doc.description,
  }
}

export async function generateStaticParams() {
  return Object.keys(docs).map((slug) => ({
    slug: slug.split("/"),
  }))
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug?.join("/")
  const doc = docs[slug as keyof typeof docs]

  if (!doc) {
    notFound()
  }

  if (slug === "components/hello-world") {
    return (
      <div className="flex flex-col py-8 gap-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{doc.title}</h1>
          <p className="text-muted-foreground text-lg">
            {doc.description}
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Preview</h2>
            <ComponentPreview name="hello-world">
              <HelloWorld />
            </ComponentPreview>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Installation</h2>
            <p className="text-muted-foreground mb-4">
              Install the hello-world component using the shadcn CLI:
            </p>
            <CodeBlock language="bash">
              npx shadcn add hello-world
            </CodeBlock>
          </section>
        </div>
      </div>
    )
  }

  return notFound()
}