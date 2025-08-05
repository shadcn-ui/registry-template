import { ThemeColors } from '@/store/theme-store';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    light: Partial<ThemeColors>;
    dark: Partial<ThemeColors>;
  };
}

// Helper to create color-only themes (excluding layout properties)
const createColorTheme = (base: ThemeColors, overrides: Partial<ThemeColors>): Partial<ThemeColors> => {
  const { radius, "font-sans": fontSans, "letter-spacing": letterSpacing, "shadow-blur": shadowBlur, "shadow-opacity": shadowOpacity, ...colorsOnly } = { ...base, ...overrides };
  return colorsOnly;
};

// Default shadcn theme (colors only, no layout properties)
const defaultLight: ThemeColors = {
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
};

const defaultDark: ThemeColors = {
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
};

export const themePresets: ThemePreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Classic shadcn/ui theme',
    colors: {
      light: createColorTheme(defaultLight, {}),
      dark: createColorTheme(defaultDark, {}),
    },
  },
  {
    id: 'blue',
    name: 'Blue',
    description: 'Professional blue theme',
    colors: {
      light: createColorTheme(defaultLight, {
        primary: "221 83% 53%",
        "primary-foreground": "0 0% 98%",
        accent: "221 83% 96%",
        "accent-foreground": "221 83% 10%",
        ring: "221 83% 53%",
      }),
      dark: createColorTheme(defaultDark, {
        primary: "221 83% 53%",
        "primary-foreground": "0 0% 98%",
        accent: "221 83% 15%",
        "accent-foreground": "221 83% 90%",
        ring: "221 83% 53%",
      }),
    },
  },
  {
    id: 'green',
    name: 'Green',
    description: 'Fresh green theme',
    colors: {
      light: createColorTheme(defaultLight, {
        primary: "142 76% 36%",
        "primary-foreground": "0 0% 98%",
        accent: "142 76% 95%",
        "accent-foreground": "142 76% 10%",
        ring: "142 76% 36%",
      }),
      dark: createColorTheme(defaultDark, {
        primary: "142 76% 36%",
        "primary-foreground": "0 0% 98%",
        accent: "142 76% 15%",
        "accent-foreground": "142 76% 90%",
        ring: "142 76% 36%",
      }),
    },
  },
  {
    id: 'purple',
    name: 'Purple',
    description: 'Modern purple theme',
    colors: {
      light: createColorTheme(defaultLight, {
        primary: "262 83% 58%",
        "primary-foreground": "0 0% 98%",
        accent: "262 83% 96%",
        "accent-foreground": "262 83% 10%",
        ring: "262 83% 58%",
      }),
      dark: createColorTheme(defaultDark, {
        primary: "262 83% 58%",
        "primary-foreground": "0 0% 98%",
        accent: "262 83% 15%",
        "accent-foreground": "262 83% 90%",
        ring: "262 83% 58%",
      }),
    },
  },
  {
    id: 'orange',
    name: 'Orange',
    description: 'Energetic orange theme',
    colors: {
      light: createColorTheme(defaultLight, {
        primary: "25 95% 53%",
        "primary-foreground": "0 0% 98%",
        accent: "25 95% 96%",
        "accent-foreground": "25 95% 10%",
        ring: "25 95% 53%",
      }),
      dark: createColorTheme(defaultDark, {
        primary: "25 95% 53%",
        "primary-foreground": "0 0% 98%",
        accent: "25 95% 15%",
        "accent-foreground": "25 95% 90%",
        ring: "25 95% 53%",
      }),
    },
  },
  {
    id: 'red',
    name: 'Red',
    description: 'Bold red theme',
    colors: {
      light: createColorTheme(defaultLight, {
        primary: "0 84% 60%",
        "primary-foreground": "0 0% 98%",
        accent: "0 84% 96%",
        "accent-foreground": "0 84% 10%",
        ring: "0 84% 60%",
      }),
      dark: createColorTheme(defaultDark, {
        primary: "0 84% 60%",
        "primary-foreground": "0 0% 98%",
        accent: "0 84% 15%",
        "accent-foreground": "0 84% 90%",
        ring: "0 84% 60%",
      }),
    },
  },
  {
    id: 'yellow',
    name: 'Yellow',
    description: 'Bright yellow theme',
    colors: {
      light: createColorTheme(defaultLight, {
        primary: "48 96% 53%",
        "primary-foreground": "240 10% 3.9%",
        accent: "48 96% 96%",
        "accent-foreground": "48 96% 10%",
        ring: "48 96% 53%",
      }),
      dark: createColorTheme(defaultDark, {
        primary: "48 96% 53%",
        "primary-foreground": "240 10% 3.9%",
        accent: "48 96% 15%",
        "accent-foreground": "48 96% 90%",
        ring: "48 96% 53%",
      }),
    },
  },
  {
    id: 'teal',
    name: 'Teal',
    description: 'Cool teal theme',
    colors: {
      light: createColorTheme(defaultLight, {
        primary: "173 80% 40%",
        "primary-foreground": "0 0% 98%",
        accent: "173 80% 96%",
        "accent-foreground": "173 80% 10%",
        ring: "173 80% 40%",
      }),
      dark: createColorTheme(defaultDark, {
        primary: "173 80% 40%",
        "primary-foreground": "0 0% 98%",
        accent: "173 80% 15%",
        "accent-foreground": "173 80% 90%",
        ring: "173 80% 40%",
      }),
    },
  },
];