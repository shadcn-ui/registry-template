import { Icons } from "@/components/icons";

export default function Home() {
  return (
    <>
      <div className="border-grid scroll-mt-24 border-b">
          <div className="border-grid container-wrapper">
            <div className="container flex items-center justify-between py-5">
            <h2 className="text-2xl font-bold">Validate License Key</h2>
            <div className="text-sm text-muted-foreground">
              <a className="flex items-center gap-1 hover:underline" href="https://polar.sh?utm_source=zeta">
                <span>Powered by</span>
                <Icons.polar />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}