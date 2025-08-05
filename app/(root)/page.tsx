import { Metadata } from "next"
import { DemoLayout } from "@/components/theme-demo/demo-layout"

const title = "Abstract Global Wallet Components"
const description =
  "Interactive demo showcasing customizable theme controls and Abstract Global Wallet components. Adjust colors in real-time and see how they apply to authentication, profiles, and wallet interfaces."

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

export default function IndexPage() {
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="w-full max-w-[1600px] mx-auto h-full">
        <DemoLayout />
      </div>
    </div>
  )
}
