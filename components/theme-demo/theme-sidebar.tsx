"use client";

import React, { useState } from 'react';
import { useTheme } from '@/store/theme-store';
import { ColorPicker } from './color-picker';
import { SliderControl } from './slider-control';
import { PaletteSelector } from './palette-selector';
import { Button } from '@/registry/new-york/ui/button';
import { ScrollArea } from '@/registry/new-york/ui/scroll-area';
import { Separator } from '@/registry/new-york/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york/ui/tabs';
import { Badge } from '@/registry/new-york/ui/badge';
import { Label } from '@/registry/new-york/ui/label';
import { Palette, Sun, Moon, RotateCcw, ChevronDown, ChevronUp, Code } from 'lucide-react';
import { popularGoogleFonts, loadGoogleFont, buildFontFamily } from '@/lib/google-fonts';
import { ThemeCodeModal } from './theme-code-modal';

export function ThemeSidebar() {
  const { mode, setMode, updateColor, resetTheme, getCurrentTheme } = useTheme();
  const currentTheme = getCurrentTheme();
  const [showCustomizer, setShowCustomizer] = useState(true);
  const [, setIsCustomSelected] = useState(false);

  // Preload common fonts on mount
  React.useEffect(() => {
    const preloadFonts = async () => {
      try {
        await Promise.all([
          loadGoogleFont('Inter', ['400', '500', '600']),
          loadGoogleFont('Roboto', ['400', '500', '600']),
          loadGoogleFont('Open Sans', ['400', '500', '600']),
        ]);
      } catch (error) {
        console.warn('Failed to preload fonts:', error);
      }
    };
    preloadFonts();
  }, []);

  return (
    <div className="w-full h-full flex flex-col border-r bg-background">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <h2 className="font-semibold">Theme Customizer</h2>
        </div>
        
        {/* Mode Toggle */}
        <div className="flex gap-1">
          <Button
            variant={mode === 'light' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('light')}
            className="flex-1"
          >
            <Sun className="h-4 w-4 mr-1" />
            Light
          </Button>
          <Button
            variant={mode === 'dark' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('dark')}
            className="flex-1"
          >
            <Moon className="h-4 w-4 mr-1" />
            Dark
          </Button>
        </div>

        {/* Palette Selector */}
        <PaletteSelector 
          onPresetSelect={() => setIsCustomSelected(false)}
        />
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="w-full justify-between"
          >
            <span className="text-sm font-medium">Advanced Customization</span>
            {showCustomizer ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {showCustomizer && (
            
            <Tabs defaultValue="colors" className="flex-1 flex flex-col">
              <div className="px-4 pt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                </TabsList>
              </div>
              
              <ScrollArea className="h-[calc(100vh-20rem)]" type="always">
                <div className="p-4 pr-6">
                  <TabsContent value="colors" className="space-y-6 mt-0">
              {/* Primary Colors */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Primary Colors</h3>
                  <Badge variant="secondary" className="text-xs">Core</Badge>
                </div>
                <ColorPicker
                  label="Primary"
                  value={currentTheme.primary}
                  onChange={(value) => updateColor('primary', value)}
                  contrastCheck={currentTheme.background}
                />
                <ColorPicker
                  label="Primary Foreground"
                  value={currentTheme['primary-foreground']}
                  onChange={(value) => updateColor('primary-foreground', value)}
                  contrastCheck={currentTheme.primary}
                />
              </div>

              <Separator />

              {/* Secondary Colors */}
              <div className="space-y-4">
                <h3 className="font-medium">Secondary Colors</h3>
                <ColorPicker
                  label="Secondary"
                  value={currentTheme.secondary}
                  onChange={(value) => updateColor('secondary', value)}
                />
                <ColorPicker
                  label="Secondary Foreground"
                  value={currentTheme['secondary-foreground']}
                  onChange={(value) => updateColor('secondary-foreground', value)}
                  contrastCheck={currentTheme.secondary}
                />
              </div>

              <Separator />

              {/* Background Colors */}
              <div className="space-y-4">
                <h3 className="font-medium">Background Colors</h3>
                <ColorPicker
                  label="Background"
                  value={currentTheme.background}
                  onChange={(value) => updateColor('background', value)}
                />
                <ColorPicker
                  label="Foreground"
                  value={currentTheme.foreground}
                  onChange={(value) => updateColor('foreground', value)}
                  contrastCheck={currentTheme.background}
                />
                <ColorPicker
                  label="Muted"
                  value={currentTheme.muted}
                  onChange={(value) => updateColor('muted', value)}
                />
                <ColorPicker
                  label="Muted Foreground"
                  value={currentTheme['muted-foreground']}
                  onChange={(value) => updateColor('muted-foreground', value)}
                  contrastCheck={currentTheme.muted}
                />
              </div>

              <Separator />

              {/* Accent Colors */}
              <div className="space-y-4">
                <h3 className="font-medium">Accent Colors</h3>
                <ColorPicker
                  label="Accent"
                  value={currentTheme.accent}
                  onChange={(value) => updateColor('accent', value)}
                />
                <ColorPicker
                  label="Accent Foreground"
                  value={currentTheme['accent-foreground']}
                  onChange={(value) => updateColor('accent-foreground', value)}
                  contrastCheck={currentTheme.accent}
                />
              </div>

              <Separator />

              {/* Border & Input */}
              <div className="space-y-4">
                <h3 className="font-medium">Border & Input</h3>
                <ColorPicker
                  label="Border"
                  value={currentTheme.border}
                  onChange={(value) => updateColor('border', value)}
                />
                <ColorPicker
                  label="Input"
                  value={currentTheme.input}
                  onChange={(value) => updateColor('input', value)}
                />
                <ColorPicker
                  label="Ring"
                  value={currentTheme.ring}
                  onChange={(value) => updateColor('ring', value)}
                />
              </div>

              <Separator />

              {/* Destructive */}
              <div className="space-y-4">
                <h3 className="font-medium">Destructive</h3>
                <ColorPicker
                  label="Destructive"
                  value={currentTheme.destructive}
                  onChange={(value) => updateColor('destructive', value)}
                />
                <ColorPicker
                  label="Destructive Foreground"
                  value={currentTheme['destructive-foreground']}
                  onChange={(value) => updateColor('destructive-foreground', value)}
                  contrastCheck={currentTheme.destructive}
                />
              </div>
            </TabsContent>

                  <TabsContent value="layout" className="space-y-6 mt-0">
                    <div className="space-y-4">
                      <h3 className="font-medium">Border Radius</h3>
                      <SliderControl
                        label="Radius"
                        value={currentTheme.radius}
                        onChange={(value) => updateColor('radius', value)}
                        min={0}
                        max={2}
                        step={0.05}
                        unit="rem"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Typography</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm">Font Family</Label>
                          <select 
                            value={currentTheme['font-sans']?.split(',')[0]?.replace(/['"]/g, '') || 'system'}
                            onChange={async (e) => {
                              const selectedFont = e.target.value;
                              
                              if (selectedFont === 'system') {
                                const systemFont = buildFontFamily('system', 'sans-serif');
                                updateColor('font-sans', systemFont);
                                document.body.style.fontFamily = systemFont;
                              } else {
                                try {
                                  // Load the Google Font
                                  await loadGoogleFont(selectedFont, ['300', '400', '500', '600', '700']);
                                  // Update the theme
                                  const fontFamily = buildFontFamily(selectedFont, 'sans-serif');
                                  updateColor('font-sans', fontFamily);
                                  
                                  // Force apply to body for immediate visual feedback
                                  document.body.style.fontFamily = fontFamily;
                                  
                                  // Mark as custom selection
                                  setIsCustomSelected(true);
                                } catch (error) {
                                  console.error('Failed to load font:', error);
                                }
                              }
                            }}
                            className="w-full mt-1 p-2 border rounded-md bg-background text-foreground"
                          >
                            <option value="system">System Font</option>
                            {popularGoogleFonts
                              .filter(font => font.category === 'sans-serif')
                              .map(font => (
                                <option key={font.family} value={font.family}>
                                  {font.family}
                                </option>
                              ))
                            }
                          </select>
                        </div>
                        
                        <SliderControl
                          label="Letter Spacing"
                          value={currentTheme['letter-spacing'] || '0em'}
                          onChange={(value) => updateColor('letter-spacing', value)}
                          min={-0.1}
                          max={0.1}
                          step={0.01}
                          unit="em"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Shadows</h3>
                      <div className="space-y-3">
                        <SliderControl
                          label="Shadow Blur"
                          value={currentTheme['shadow-blur'] || '10px'}
                          onChange={(value) => updateColor('shadow-blur', value)}
                          min={0}
                          max={50}
                          step={1}
                          unit="px"
                        />
                        <SliderControl
                          label="Shadow Opacity"
                          value={currentTheme['shadow-opacity'] || '0.1'}
                          onChange={(value) => updateColor('shadow-opacity', value)}
                          min={0}
                          max={1}
                          step={0.05}
                          unit=""
                        />
                      </div>
                    </div>

                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-background relative z-10 space-y-2">
        <ThemeCodeModal>
          <Button
            variant="default"
            size="sm"
            className="w-full"
          >
            <Code className="h-4 w-4 mr-2" />
            Theme Code
          </Button>
        </ThemeCodeModal>
        
        <Button
          variant="outline"
          size="sm"
          onClick={resetTheme}
          className="w-full"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Theme
        </Button>
      </div>
    </div>
  );
}