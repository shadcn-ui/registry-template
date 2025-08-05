import { ThemeColors } from '@/store/theme-store';

interface ThemeState {
  lightTheme: ThemeColors;
  darkTheme: ThemeColors;
}

function formatColorValue(hslValue: string): string {
  // If it's already in oklch format, return as is
  if (hslValue.includes('oklch(')) {
    return hslValue;
  }
  
  // If it's in HSL format like "240 10% 3.9%", wrap in hsl() function
  const parts = hslValue.split(' ');
  if (parts.length === 3 && hslValue.includes('%')) {
    return `hsl(${hslValue})`;
  }
  
  // Return as is for other formats
  return hslValue;
}

function formatThemeVariable(key: string, value: string): string {
  // Handle special cases
  if (key === 'radius') {
    return value;
  }
  
  if (key.startsWith('font-')) {
    return value;
  }
  
  if (key === 'letter-spacing' || key === 'shadow-blur' || key === 'shadow-opacity') {
    return value;
  }
  
  // For color values, format appropriately
  return formatColorValue(value);
}

export function generateThemeCSS(themeState: ThemeState): string {
  const { lightTheme, darkTheme } = themeState;
  
  // Standard font definitions
  const fontSans = `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`;
  const fontSerif = `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`;
  const fontMono = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
  
  // Shadow definitions
  const shadows = {
    '2xs': '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
    'xs': '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
    'sm': '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
    '': '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
    'md': '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)',
    'lg': '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)',
    'xl': '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)',
    '2xl': '0 1px 3px 0px hsl(0 0% 0% / 0.25)'
  };
  
  // Chart colors (using standard chart color progression)
  const chartColors = {
    '1': 'oklch(0.8100 0.1000 252)',
    '2': 'oklch(0.6200 0.1900 260)', 
    '3': 'oklch(0.5500 0.2200 263)',
    '4': 'oklch(0.4900 0.2200 264)',
    '5': 'oklch(0.4200 0.1800 266)'
  };

  let css = '';
  
  // Root section (light theme)
  css += ':root {\n';
  
  // Core theme colors
  Object.entries(lightTheme).forEach(([key, value]) => {
    const formattedValue = formatThemeVariable(key, value);
    css += `  --${key}: ${formattedValue};\n`;
  });
  
  // Add standard font definitions if not already present
  if (!lightTheme['font-sans']) {
    css += `  --font-sans: ${fontSans};\n`;
  }
  if (!lightTheme['font-serif']) {
    css += `  --font-serif: ${fontSerif};\n`;
  }
  if (!lightTheme['font-mono']) {
    css += `  --font-mono: ${fontMono};\n`;
  }
  
  // Add chart colors
  Object.entries(chartColors).forEach(([key, value]) => {
    css += `  --chart-${key}: ${value};\n`;
  });
  
  // Add shadow definitions
  Object.entries(shadows).forEach(([key, value]) => {
    const suffix = key === '' ? '' : `-${key}`;
    css += `  --shadow${suffix}: ${value};\n`;
  });
  
  // Add tracking and spacing
  css += `  --tracking-normal: 0em;\n`;
  css += `  --spacing: 0.25rem;\n`;
  
  css += '}\n\n';
  
  // Dark theme section
  css += '.dark {\n';
  
  Object.entries(darkTheme).forEach(([key, value]) => {
    const formattedValue = formatThemeVariable(key, value);
    css += `  --${key}: ${formattedValue};\n`;
  });
  
  // Add standard font definitions for dark theme if not present
  if (!darkTheme['font-sans']) {
    css += `  --font-sans: ${fontSans};\n`;
  }
  if (!darkTheme['font-serif']) {
    css += `  --font-serif: ${fontSerif};\n`;
  }
  if (!darkTheme['font-mono']) {
    css += `  --font-mono: ${fontMono};\n`;
  }
  
  // Add chart colors for dark theme
  Object.entries(chartColors).forEach(([key, value]) => {
    css += `  --chart-${key}: ${value};\n`;
  });
  
  // Add shadow definitions for dark theme
  Object.entries(shadows).forEach(([key, value]) => {
    const suffix = key === '' ? '' : `-${key}`;
    css += `  --shadow${suffix}: ${value};\n`;
  });
  
  css += '}\n\n';
  
  // @theme inline section for Tailwind CSS
  css += '@theme inline {\n';
  
  // Color mappings
  const colorMappings = [
    'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
    'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
    'accent', 'accent-foreground', 'destructive', 'destructive-foreground', 'border', 'input', 'ring'
  ];
  
  colorMappings.forEach(color => {
    css += `  --color-${color}: var(--${color});\n`;
  });
  
  // Chart color mappings
  Object.keys(chartColors).forEach(key => {
    css += `  --color-chart-${key}: var(--chart-${key});\n`;
  });
  
  // Sidebar color mappings
  const sidebarColors = [
    'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
    'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring'
  ];
  
  sidebarColors.forEach(color => {
    css += `  --color-${color}: var(--${color});\n`;
  });
  
  // Font mappings
  css += '\n  --font-sans: var(--font-sans);\n';
  css += '  --font-mono: var(--font-mono);\n';
  css += '  --font-serif: var(--font-serif);\n';
  
  // Radius mappings
  css += '\n  --radius-sm: calc(var(--radius) - 4px);\n';
  css += '  --radius-md: calc(var(--radius) - 2px);\n';
  css += '  --radius-lg: var(--radius);\n';
  css += '  --radius-xl: calc(var(--radius) + 4px);\n';
  
  // Shadow mappings
  css += '\n';
  Object.keys(shadows).forEach(key => {
    const suffix = key === '' ? '' : `-${key}`;
    css += `  --shadow${suffix}: var(--shadow${suffix});\n`;
  });
  
  css += '}\n';
  
  return css;
}