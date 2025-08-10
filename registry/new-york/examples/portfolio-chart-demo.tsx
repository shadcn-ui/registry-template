import { PortfolioChart } from "@/registry/new-york/blocks/portfolio-chart/portfolio-chart"

export default function PortfolioChartDemo() {
  // Example Abstract Global Wallet address
  const sampleAddress = "0x1c67724acc76821c8ad1f1f87ba2751631babd0c"

  return (
    <PortfolioChart
      address={sampleAddress}
      defaultPeriod="30d"
    />
  )
}