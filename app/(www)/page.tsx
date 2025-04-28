import { Fragment } from "react";
import { BlockDisplay } from "@/components/block-display";
import { type Block } from "@/types/block";
import { PartnerLogo } from "@/components/partner-logos";

const blocks: Block[] = [
  {
    id: "example-with-css",
    title: "Validate License Key",
    description: "Allow users to access your private components by validating their license key.",
    provider: {
      name: "Polar",
      url: "https://polar.sh",
      icon: "polar",
    }
  },
];

export default function Home() {
  return (
    <>
      {blocks.map((block) => (
        <Fragment key={block.id}>
          <div className="border-grid scroll-mt-24 border-b">
            <div className="border-grid container-wrapper">
              <div className="container flex items-center justify-between py-5">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold">{block.title}</h2>
                  <p className="text-sm text-muted-foreground">{block.description}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <a className="flex items-center gap-1 hover:underline" href={`${block.provider.url}?utm_source=zeta`}>
                    <span>Powered by</span>
                    <PartnerLogo provider={block.provider.icon} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="container-wrapper flex-1">
            <div className="border-grid container border-b py-8 first:pt-6 last:border-b-0 md:py-12">
              <BlockDisplay block={block} />
            </div>
          </div>
        </Fragment>
      ))}
    </>
  )
}