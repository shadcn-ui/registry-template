"use client"

import { useQuery } from "@tanstack/react-query"

export interface PortfolioDataPoint {
  startTimestamp: number
  endTimestamp: number
  totalUsdValue: string
}

export interface PortfolioApiResponse {
  portfolio: {
    "1h": { portfolio: PortfolioDataPoint[] }
    "1d": { portfolio: PortfolioDataPoint[] }
    "7d": { portfolio: PortfolioDataPoint[] }
    "30d": { portfolio: PortfolioDataPoint[] }
    "1y": { portfolio: PortfolioDataPoint[] }
  }
}

type TimePeriod = "1d" | "7d" | "30d"

async function fetchPortfolioData(
  address: string,
  period: TimePeriod
): Promise<{ data: PortfolioDataPoint[]; currentValue: number | null }> {
  if (!address) {
    throw new Error("Address is required")
  }

  const response = await fetch(
    `https://backend.portal.abs.xyz/api/user/${address}/portfolio/value`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio data: ${response.statusText}`)
  }

  const apiData: PortfolioApiResponse = await response.json()
  
  if (!apiData.portfolio || !apiData.portfolio[period]) {
    throw new Error(`No portfolio data available for period: ${period}`)
  }

  // Get current value from the most recent data point across all available periods
  // Priority: 1h > 1d > 7d > 30d > 1y (most granular/recent first)
  let currentValue: number | null = null
  let mostRecentTimestamp = 0
  const periods = ["1h", "1d", "7d", "30d", "1y"] as const
  
  for (const p of periods) {
    const periodData = apiData.portfolio[p]?.portfolio
    if (periodData && periodData.length > 0) {
      const lastPoint = periodData[periodData.length - 1]
      if (lastPoint.endTimestamp > mostRecentTimestamp) {
        mostRecentTimestamp = lastPoint.endTimestamp
        currentValue = parseFloat(lastPoint.totalUsdValue)
      }
    }
  }

  let chartData = [...apiData.portfolio[period].portfolio]
  
  // If we have a more recent current value than the chart data ends with,
  // add it as the final point to ensure chart always ends at current time
  if (currentValue !== null && chartData.length > 0) {
    const lastChartPoint = chartData[chartData.length - 1]
    if (mostRecentTimestamp > lastChartPoint.endTimestamp) {
      chartData.push({
        startTimestamp: lastChartPoint.endTimestamp,
        endTimestamp: mostRecentTimestamp,
        totalUsdValue: currentValue.toString()
      })
    }
  }

  return {
    data: chartData,
    currentValue
  }
}

export function usePortfolioData(address: string, period: TimePeriod) {
  return useQuery({
    queryKey: ["portfolio-data", address, period],
    queryFn: () => fetchPortfolioData(address, period),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      // Don't retry if it's a client error (4xx)
      if (error.message.includes("404") || error.message.includes("400")) {
        return false
      }
      return failureCount < 3
    },
  })
}