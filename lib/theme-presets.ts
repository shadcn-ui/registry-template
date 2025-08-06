import { ThemeColors } from '@/store/theme-store';
import { popularGoogleFonts } from '@/lib/google-fonts';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    light: Partial<ThemeColors>;
    dark: Partial<ThemeColors>;
  };
  isRandom?: boolean;
}

// Helper to create color-only themes (excluding layout properties)
const createColorTheme = (base: ThemeColors, overrides: Partial<ThemeColors>): Partial<ThemeColors> => {
  const merged = { ...base, ...overrides };
  const layoutProperties: readonly string[] = ['radius', 'font-sans', 'letter-spacing', 'shadow-blur', 'shadow-opacity'];
  
  const colorsOnly = Object.fromEntries(
    Object.entries(merged).filter(([key]) => !layoutProperties.includes(key))
  ) as Partial<ThemeColors>;
  
  return colorsOnly;
};

// Random theme generation utilities
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

const generateRandomRadius = () => {
  const radiusOptions = ['0rem', '0.125rem', '0.25rem', '0.375rem', '0.5rem', '0.75rem', '1rem', '1.5rem'];
  return radiusOptions[randomInt(0, radiusOptions.length - 1)];
};

const generateRandomFont = () => {
  const fonts = popularGoogleFonts.filter(font => font.category === 'sans-serif');
  const randomFont = fonts[randomInt(0, fonts.length - 1)];
  return `"${randomFont.family}", ui-sans-serif, system-ui, sans-serif`;
};

const generateRandomLetterSpacing = () => {
  const spacings = ['-0.05em', '-0.025em', '0em', '0.025em', '0.05em', '0.1em'];
  return spacings[randomInt(0, spacings.length - 1)];
};

const generateRandomShadow = () => {
  const blur = randomInt(5, 25);
  const opacity = randomFloat(0.05, 0.3).toFixed(2);
  return { blur: `${blur}px`, opacity };
};

export const generateRandomTheme = (): { light: ThemeColors; dark: ThemeColors } => {
  // Generate base colors
  const primaryHue = randomInt(0, 360);
  const secondaryHue = (primaryHue + randomInt(30, 180)) % 360;
  const accentHue = (primaryHue + randomInt(60, 120)) % 360;
  
  // Random layout properties
  const radius = generateRandomRadius();
  const fontSans = generateRandomFont();
  const letterSpacing = generateRandomLetterSpacing();
  const shadow = generateRandomShadow();
  
  // Generate light theme
  const lightPrimary = `${primaryHue} ${randomInt(60, 90)}% ${randomInt(15, 35)}%`;
  const lightSecondary = `${secondaryHue} ${randomInt(20, 60)}% ${randomInt(85, 95)}%`;
  const lightAccent = `${accentHue} ${randomInt(30, 70)}% ${randomInt(88, 96)}%`;
  const lightBackground = `${randomInt(0, 60)} ${randomInt(0, 10)}% ${randomInt(98, 100)}%`;
  const lightForeground = `${randomInt(200, 260)} ${randomInt(8, 15)}% ${randomInt(3, 8)}%`;
  
  const lightTheme: ThemeColors = {
    background: lightBackground,
    foreground: lightForeground,
    card: lightBackground,
    "card-foreground": lightForeground,
    popover: lightBackground,
    "popover-foreground": lightForeground,
    primary: lightPrimary,
    "primary-foreground": `${randomInt(0, 60)} ${randomInt(0, 10)}% ${randomInt(95, 100)}%`,
    secondary: lightSecondary,
    "secondary-foreground": `${secondaryHue} ${randomInt(60, 90)}% ${randomInt(8, 15)}%`,
    muted: lightSecondary,
    "muted-foreground": `${randomInt(200, 260)} ${randomInt(3, 8)}% ${randomInt(40, 50)}%`,
    accent: lightAccent,
    "accent-foreground": `${accentHue} ${randomInt(60, 90)}% ${randomInt(8, 15)}%`,
    destructive: `${randomInt(0, 20)} ${randomInt(80, 95)}% ${randomInt(55, 65)}%`,
    "destructive-foreground": `${randomInt(0, 60)} ${randomInt(0, 10)}% ${randomInt(95, 100)}%`,
    border: `${randomInt(200, 260)} ${randomInt(5, 15)}% ${randomInt(85, 92)}%`,
    input: `${randomInt(200, 260)} ${randomInt(5, 15)}% ${randomInt(85, 92)}%`,
    ring: lightPrimary,
    radius,
    "font-sans": fontSans,
    "letter-spacing": letterSpacing,
    "shadow-blur": shadow.blur,
    "shadow-opacity": shadow.opacity,
  };
  
  // Generate dark theme (adjust lightness values)
  const darkPrimary = `${primaryHue} ${randomInt(60, 90)}% ${randomInt(60, 80)}%`;
  const darkSecondary = `${secondaryHue} ${randomInt(15, 40)}% ${randomInt(12, 20)}%`;
  const darkAccent = `${accentHue} ${randomInt(30, 70)}% ${randomInt(12, 20)}%`;
  const darkBackground = `${randomInt(200, 260)} ${randomInt(8, 15)}% ${randomInt(3, 8)}%`;
  const darkForeground = `${randomInt(0, 60)} ${randomInt(0, 10)}% ${randomInt(95, 100)}%`;
  
  const darkTheme: ThemeColors = {
    background: darkBackground,
    foreground: darkForeground,
    card: darkBackground,
    "card-foreground": darkForeground,
    popover: darkBackground,
    "popover-foreground": darkForeground,
    primary: darkPrimary,
    "primary-foreground": `${randomInt(200, 260)} ${randomInt(5, 15)}% ${randomInt(8, 15)}%`,
    secondary: darkSecondary,
    "secondary-foreground": darkForeground,
    muted: darkSecondary,
    "muted-foreground": `${randomInt(200, 260)} ${randomInt(3, 8)}% ${randomInt(60, 70)}%`,
    accent: darkAccent,
    "accent-foreground": darkForeground,
    destructive: `${randomInt(0, 20)} ${randomInt(60, 80)}% ${randomInt(25, 35)}%`,
    "destructive-foreground": darkForeground,
    border: `${randomInt(200, 260)} ${randomInt(3, 8)}% ${randomInt(12, 20)}%`,
    input: `${randomInt(200, 260)} ${randomInt(3, 8)}% ${randomInt(12, 20)}%`,
    ring: `${randomInt(200, 260)} ${randomInt(40, 60)}% ${randomInt(80, 90)}%`,
    radius,
    "font-sans": fontSans,
    "letter-spacing": letterSpacing,
    "shadow-blur": shadow.blur,
    "shadow-opacity": shadow.opacity,
  };
  
  return { light: lightTheme, dark: darkTheme };
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
    id: 'green',
    name: 'Green',
    description: 'Fresh Pantone green theme',
    colors: {
      light: createColorTheme(defaultLight, {
        primary: "125 100% 35%",
        "primary-foreground": "0 0% 98%",
        accent: "125 100% 95%",
        "accent-foreground": "125 100% 10%",
        ring: "125 100% 35%",
      }),
      dark: createColorTheme(defaultDark, {
        primary: "125 60% 55%",
        "primary-foreground": "125 100% 10%",
        accent: "125 50% 20%",
        "accent-foreground": "125 80% 80%",
        ring: "125 60% 55%",
      }),
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
    id: 'random',
    name: 'Random',
    description: 'Generate completely random theme',
    isRandom: true,
    colors: {
      light: {},
      dark: {},
    },
  },
];