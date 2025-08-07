import { Metadata } from "next"
import { DemoLayout } from "@/components/theme-demo/demo-layout"
import { HeroSection } from "@/components/hero-section"

const title = "AGW Reusables"
const description =
  "A collection of components and features to build apps on Abstract."

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
    <div className="flex flex-1 flex-col bg-gradient-to-b from-background to-muted/20">
      <HeroSection />
      <div className="relative flex flex-1 flex-col">
        <div className="relative p-4">
          <div className="relative w-full max-w-[1600px] mx-auto h-full">
            {/* Glow effect positioned relative to demo content */}
            <div
              className="absolute w-[1800px] h-[900px] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 85% 60% at 50% 40%, rgb(from var(--primary) r g b / 0.3) 0%, rgb(from var(--primary) r g b / 0.15) 50%, transparent 75%)',
                filter: 'blur(80px)',
                animation: 'glowPulse 4s ease-in-out infinite',
                left: '50%',
                top: '-8%',
                zIndex: 0,
              }}
            />
            <div className="relative z-10">
              <DemoLayout />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
