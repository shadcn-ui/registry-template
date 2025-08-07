export function ThemeScript() {
  const scriptContent = `
    (function() {
      // Default theme colors
      const defaultLightTheme = {
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

      const defaultDarkTheme = {
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

      try {
        const root = document.documentElement;
        let themeState = null;
        let mode = 'light';

        // Try to load saved theme
        try {
          const saved = localStorage.getItem('theme-store');
          if (saved) {
            themeState = JSON.parse(saved);
            mode = themeState.mode || 'light';
          }
        } catch (e) {
          console.warn('Theme script: Failed to parse saved theme');
        }

        // Use saved theme or defaults
        const currentTheme = themeState 
          ? (mode === 'light' ? themeState.lightTheme : themeState.darkTheme)
          : (mode === 'light' ? defaultLightTheme : defaultDarkTheme);

        // Apply CSS variables
        Object.entries(currentTheme).forEach(([key, value]) => {
          if (key !== 'radius' && !key.startsWith('font-') && value.includes('%')) {
            root.style.setProperty('--' + key, 'hsl(' + value + ')');
          } else {
            root.style.setProperty('--' + key, value);
          }
        });

        // Apply dark class
        if (mode === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }

        // Update meta theme color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
          metaTheme.setAttribute('content', mode === 'dark' ? '#0a0a0a' : '#ffffff');
        }
      } catch (e) {
        console.warn('Theme script error:', e);
      }
    })();
  `;

  return (
    <script 
      dangerouslySetInnerHTML={{ __html: scriptContent }} 
      suppressHydrationWarning 
    />
  );
}