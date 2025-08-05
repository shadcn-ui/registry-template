// Google Fonts integration utilities

interface GoogleFont {
  family: string;
  variants: string[];
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';
}

// Popular Google Fonts list
export const popularGoogleFonts: GoogleFont[] = [
  { family: 'Inter', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
  { family: 'Roboto', variants: ['300', '400', '500', '700'], category: 'sans-serif' },
  { family: 'Open Sans', variants: ['300', '400', '600', '700'], category: 'sans-serif' },
  { family: 'Lato', variants: ['300', '400', '700'], category: 'sans-serif' },
  { family: 'Montserrat', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
  { family: 'Poppins', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
  { family: 'Source Sans Pro', variants: ['300', '400', '600', '700'], category: 'sans-serif' },
  { family: 'Nunito', variants: ['300', '400', '600', '700'], category: 'sans-serif' },
  { family: 'Raleway', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
  { family: 'Ubuntu', variants: ['300', '400', '500', '700'], category: 'sans-serif' },
  { family: 'Playfair Display', variants: ['400', '500', '600', '700'], category: 'serif' },
  { family: 'Merriweather', variants: ['300', '400', '700'], category: 'serif' },
  { family: 'Source Serif Pro', variants: ['400', '600', '700'], category: 'serif' },
  { family: 'JetBrains Mono', variants: ['300', '400', '500', '600', '700'], category: 'monospace' },
  { family: 'Fira Code', variants: ['300', '400', '500', '600', '700'], category: 'monospace' },
  { family: 'Source Code Pro', variants: ['300', '400', '500', '600', '700'], category: 'monospace' },
];

// Cache for loaded fonts
const loadedFonts = new Set<string>();

/**
 * Load a Google Font dynamically
 */
export function loadGoogleFont(fontFamily: string, weights: string[] = ['400']): Promise<void> {
  return new Promise((resolve, reject) => {
    const fontKey = `${fontFamily}-${weights.join(',')}`;
    
    // Check if font is already loaded
    if (loadedFonts.has(fontKey)) {
      resolve();
      return;
    }

    // Check if link already exists
    const existingLink = document.querySelector(`link[data-font="${fontKey}"]`);
    if (existingLink) {
      resolve();
      return;
    }

    // Create Google Fonts URL
    const weightsParam = weights.join(';');
    const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@${weightsParam}&display=swap`;

    // Create and append link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    link.setAttribute('data-font', fontKey);
    
    link.onload = () => {
      loadedFonts.add(fontKey);
      resolve();
    };
    
    link.onerror = () => {
      reject(new Error(`Failed to load font: ${fontFamily}`));
    };

    document.head.appendChild(link);
  });
}

/**
 * Build CSS font-family string with fallbacks
 */
export function buildFontFamily(fontFamily: string, category: GoogleFont['category'] = 'sans-serif'): string {
  const fallbacks = {
    'sans-serif': 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    'serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'monospace': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    'display': 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    'handwriting': 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  };

  if (fontFamily === 'system') {
    return fallbacks[category];
  }

  return `"${fontFamily}", ${fallbacks[category]}`;
}

/**
 * Get font info by family name
 */
export function getFontInfo(fontFamily: string): GoogleFont | undefined {
  return popularGoogleFonts.find(font => font.family === fontFamily);
}

/**
 * Preload commonly used fonts
 */
export function preloadCommonFonts(): Promise<void[]> {
  const commonFonts = ['Inter', 'Roboto', 'Open Sans'];
  return Promise.all(
    commonFonts.map(font => loadGoogleFont(font, ['400', '500', '600']))
  );
}