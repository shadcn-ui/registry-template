"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Default theme colors (Pantone green as default)
export type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  radius: string;
  "font-sans"?: string;
  "letter-spacing"?: string;
  "shadow-blur"?: string;
  "shadow-opacity"?: string;
};

const defaultLightTheme: ThemeColors = {
  background: "0 0% 100%",
  foreground: "240 10% 3.9%",
  card: "0 0% 100%",
  "card-foreground": "240 10% 3.9%",
  popover: "0 0% 100%",
  "popover-foreground": "240 10% 3.9%",
  primary: "240 9% 9%",
  "primary-foreground": "0 0% 98%",
  secondary: "240 4.8% 95.9%",
  "secondary-foreground": "240 5.9% 10%",
  muted: "240 4.8% 95.9%",
  "muted-foreground": "240 3.8% 46.1%",
  accent: "240 4.8% 95.9%",
  "accent-foreground": "240 5.9% 10%",
  destructive: "0 84.2% 60.2%",
  "destructive-foreground": "0 0% 98%",
  border: "240 5.9% 90%",
  input: "240 5.9% 90%",
  ring: "240 10% 3.9%",
  radius: "0.5rem",
  "font-sans": 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  "letter-spacing": "0em",
  "shadow-blur": "10px",
  "shadow-opacity": "0.1",
};

const defaultDarkTheme: ThemeColors = {
  background: "240 10% 3.9%",
  foreground: "0 0% 98%",
  card: "240 10% 3.9%",
  "card-foreground": "0 0% 98%",
  popover: "240 10% 3.9%",
  "popover-foreground": "0 0% 98%",
  primary: "0 0% 98%",
  "primary-foreground": "240 5.9% 10%",
  secondary: "240 3.7% 15.9%",
  "secondary-foreground": "0 0% 98%",
  muted: "240 3.7% 15.9%",
  "muted-foreground": "240 5% 64.9%",
  accent: "240 3.7% 15.9%",
  "accent-foreground": "0 0% 98%",
  destructive: "0 62.8% 30.6%",
  "destructive-foreground": "0 0% 98%",
  border: "240 3.7% 15.9%",
  input: "240 3.7% 15.9%",
  ring: "240 4.9% 83.9%",
  radius: "0.5rem",
  "font-sans": 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  "letter-spacing": "0em",
  "shadow-blur": "10px",
  "shadow-opacity": "0.1",
};
type ColorKey = keyof ThemeColors;

interface ThemeState {
  mode: 'light' | 'dark';
  lightTheme: ThemeColors;
  darkTheme: ThemeColors;
}

interface ThemeContextType extends ThemeState {
  setMode: (mode: 'light' | 'dark') => void;
  updateColor: (key: ColorKey, value: string) => void;
  resetTheme: () => void;
  getCurrentTheme: () => ThemeColors;
  setThemeState: (updater: (prev: ThemeState) => ThemeState) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [themeState, setThemeState] = useState<ThemeState>({
    mode: 'light',
    lightTheme: defaultLightTheme,
    darkTheme: defaultDarkTheme,
  });

  // Load theme from localStorage on mount
  useEffect(() => {
    const initializeTheme = () => {
      const saved = localStorage.getItem('theme-store');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setThemeState(parsed);
        } catch (e) {
          console.warn('Failed to parse saved theme:', e);
        }
      }
      
      // Also apply initial theme immediately
      const root = document.documentElement;
      const currentTheme = defaultLightTheme;
      
      Object.entries(currentTheme).forEach(([key, value]) => {
        if (key !== 'radius' && value.includes('%')) {
          root.style.setProperty(`--${key}`, `hsl(${value})`);
        } else {
          root.style.setProperty(`--${key}`, value);
        }
      });
    };
    
    initializeTheme();
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme-store', JSON.stringify(themeState));
  }, [themeState]);

  // Apply theme CSS variables to document root
  useEffect(() => {
    const root = document.documentElement;
    const isDocsRoute = pathname?.startsWith('/docs');
    
    // Determine which theme to use
    let currentTheme: ThemeColors;
    if (isDocsRoute) {
      // For docs routes, always use default shadcn theme colors
      currentTheme = themeState.mode === 'light' ? defaultLightTheme : defaultDarkTheme;
    } else {
      // For other routes, use customized theme
      currentTheme = themeState.mode === 'light' ? themeState.lightTheme : themeState.darkTheme;
    }
    
    // Update CSS variables
    Object.entries(currentTheme).forEach(([key, value]) => {
      // For color values (HSL format), wrap in hsl() function
      if (key !== 'radius' && !key.startsWith('font-') && value.includes('%')) {
        root.style.setProperty(`--${key}`, `hsl(${value})`);
      } else {
        root.style.setProperty(`--${key}`, value);
      }
    });

    // Always update dark class (applies to all routes)
    if (themeState.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeState, pathname]);

  const setMode = (mode: 'light' | 'dark') => {
    setThemeState(prev => ({ ...prev, mode }));
  };

  const updateColor = (key: ColorKey, value: string) => {
    setThemeState(prev => ({
      ...prev,
      [prev.mode === 'light' ? 'lightTheme' : 'darkTheme']: {
        ...prev[prev.mode === 'light' ? 'lightTheme' : 'darkTheme'],
        [key]: value,
      },
    }));
  };

  const resetTheme = () => {
    setThemeState({
      mode: 'light',
      lightTheme: defaultLightTheme,
      darkTheme: defaultDarkTheme,
    });
  };

  const getCurrentTheme = () => {
    return themeState.mode === 'light' ? themeState.lightTheme : themeState.darkTheme;
  };

  return (
    <ThemeContext.Provider
      value={{
        ...themeState,
        setMode,
        updateColor,
        resetTheme,
        getCurrentTheme,
        setThemeState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}