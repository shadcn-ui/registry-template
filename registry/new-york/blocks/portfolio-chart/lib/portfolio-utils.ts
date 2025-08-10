import { format, formatDistance } from "date-fns"

/**
 * Formats a timestamp for display based on the selected time period
 */
export function formatTimestamp(
  timestamp: number,
  period: "1d" | "7d" | "30d",
  detailed = false
): string {
  const date = new Date(timestamp * 1000) // Convert from Unix timestamp

  if (detailed) {
    // For tooltips, show full date and time
    return format(date, "MMM d, yyyy 'at' h:mm a")
  }

  // Format based on time period for axis labels
  switch (period) {
    case "1d":
      return format(date, "h a")
    case "7d":
      return format(date, "EEE")
    case "30d":
      return format(date, "MMM d")
    default:
      return format(date, "MMM d")
  }
}

/**
 * Formats a currency value for display
 */
export function formatCurrency(
  value: number,
  compact = false,
  currency = "USD",
  forceDecimals?: number
): string {
  if (value === 0) return "$0.00"

  const minDecimals = forceDecimals !== undefined ? forceDecimals : (value < 1 ? 4 : 2)
  const maxDecimals = forceDecimals !== undefined ? forceDecimals : (value < 1 ? 4 : 2)

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: compact && Math.abs(value) >= 1000 ? "compact" : "standard",
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  })

  return formatter.format(value)
}

/**
 * Calculates the percentage change between two values
 */
export function calculatePercentageChange(
  currentValue: number,
  previousValue: number
): number {
  if (previousValue === 0) return 0
  return ((currentValue - previousValue) / previousValue) * 100
}

/**
 * Formats a percentage change with proper styling indicators
 */
export function formatPercentageChange(percentage: number): {
  value: string
  isPositive: boolean
  isNeutral: boolean
} {
  const isPositive = percentage > 0
  const isNeutral = percentage === 0
  
  const formatter = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const value = formatter.format(percentage / 100)
  
  return {
    value: isPositive ? `+${value}` : value,
    isPositive,
    isNeutral,
  }
}

/**
 * Gets a human-readable time period description
 */
export function getTimePeriodDescription(period: "1d" | "7d" | "30d"): string {
  switch (period) {
    case "1d":
      return "Past 24 Hours"
    case "7d":
      return "Past Week"
    case "30d":
      return "Past Month"
    default:
      return "Unknown Period"
  }
}