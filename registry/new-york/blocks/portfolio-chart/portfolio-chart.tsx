"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
} from "@/registry/new-york/ui/chart"
import { Button } from "@/registry/new-york/ui/button"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import { usePortfolioData } from "./hooks/use-portfolio-data"
import { formatTimestamp, formatCurrency } from "./lib/portfolio-utils"
import { type ClassValue } from "clsx"

interface PortfolioChartProps {
  className?: ClassValue
  address: string
  defaultPeriod?: "1d" | "7d" | "30d"
}

const TIME_PERIODS = [
  { key: "1d", label: "1D" },
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
] as const

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "hsl(var(--chart-1))",
  },
}

/**
 * Portfolio Chart - Displays Abstract Global Wallet portfolio value over time
 * 
 * A comprehensive portfolio visualization component that:
 * - Shows portfolio value trends using an area chart
 * - Supports multiple time periods (1h, 1d, 7d, 30d, 1y)
 * - Provides formatted tooltips with currency and timestamp
 * - Handles loading and error states gracefully
 * - Responsive design that adapts to container size
 */
export function PortfolioChart({
  className,
  address,
  defaultPeriod = "7d"
}: PortfolioChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<typeof TIME_PERIODS[number]["key"]>(defaultPeriod)
  const { data: portfolioResult, isLoading, isError, error } = usePortfolioData(address, selectedPeriod)

  const chartData = portfolioResult?.data?.map((item) => ({
    timestamp: item.startTimestamp,
    value: parseFloat(item.totalUsdValue),
    formattedTime: formatTimestamp(item.startTimestamp, selectedPeriod),
  })) ?? []

  const currentValue = portfolioResult?.currentValue ?? 0

  if (isError) {
    return (
      <div className={cn("flex items-center justify-center p-8 text-center", className)}>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Failed to load portfolio data
          </p>
          <p className="text-xs text-muted-foreground">
            {error?.message || "Please try again later"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4 w-full max-w-full", className)}>
      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Portfolio Value</h3>
          {!isLoading && currentValue > 0 && (
            <p className="text-sm text-muted-foreground">
              {formatCurrency(currentValue)} current value
            </p>
          )}
        </div>
        <div className="flex gap-1">
          {TIME_PERIODS.map((period) => (
            <Button
              key={period.key}
              variant={selectedPeriod === period.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.key)}
              className="h-7 px-2 text-xs"
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-[250px] w-full" />
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            data={chartData}
            margin={{
              left: 8,
              right: 8,
            }}
          >
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="formattedTime"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(value, true, "USD", 2)}
              fontSize={12}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0]?.payload
                if (!data) return null
                
                return (
                  <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-md">
                    <div className="font-medium">
                      {formatCurrency(data.value)}
                    </div>
                  </div>
                )
              }}
            />
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillValue)"
              stroke="var(--color-value)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  )
}