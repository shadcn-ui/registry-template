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
): Promise<PortfolioDataPoint[]> {
  if (!address) {
    throw new Error("Address is required")
  }

  const response = await fetch(
    `https://backend.portal.abs.xyz/api/user/${address}/portfolio/value`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio data: ${response.statusText}`)
  }

  const data: PortfolioApiResponse = await response.json()
  
  if (!data.portfolio || !data.portfolio[period]) {
    throw new Error(`No portfolio data available for period: ${period}`)
  }

  return data.portfolio[period].portfolio
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