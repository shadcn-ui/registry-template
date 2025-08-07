import * as React from "react"
import { useTheme } from "@/store/theme-store"

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#0a0a0a",
}

export function useMetaColor() {
  const { mode } = useTheme()

  const metaColor = React.useMemo(() => {
    return mode !== "dark"
      ? META_THEME_COLORS.light
      : META_THEME_COLORS.dark
  }, [mode])

  const setMetaColor = React.useCallback((color: string) => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color)
  }, [])

  return {
    metaColor,
    setMetaColor,
  }
}
