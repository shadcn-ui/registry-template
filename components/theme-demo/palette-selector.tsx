"use client";

import React from 'react';
import { useTheme } from '@/store/theme-store';
import { themePresets } from '@/lib/theme-presets';
import { Button } from '@/registry/new-york/ui/button';
import { Label } from '@/registry/new-york/ui/label';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaletteSelectorProps {
  onPresetSelect: () => void;
}

export function PaletteSelector({ onPresetSelect }: PaletteSelectorProps) {
  const { mode, lightTheme, darkTheme, setThemeState } = useTheme();
  
  // Check if current theme matches a preset
  const currentPresetId = themePresets.find(preset => {
    const currentTheme = mode === 'light' ? lightTheme : darkTheme;
    const presetTheme = preset.colors[mode];
    
    // Check if primary colors match (simplified comparison)
    return currentTheme.primary === presetTheme.primary;
  })?.id;

  const applyPreset = (presetId: string) => {
    const preset = themePresets.find(p => p.id === presetId);
    if (!preset) return;
    
    setThemeState(prev => ({
      ...prev,
      lightTheme: {
        ...prev.lightTheme, // Preserve existing layout properties
        ...preset.colors.light, // Apply preset colors
      },
      darkTheme: {
        ...prev.darkTheme, // Preserve existing layout properties
        ...preset.colors.dark, // Apply preset colors
      },
    }));
    
    onPresetSelect(); // Reset custom selection
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-3 block">Theme Presets</Label>
        <div className="grid grid-cols-4 gap-2">
          {themePresets.map((preset) => {
            const isSelected = currentPresetId === preset.id;
            const presetTheme = preset.colors[mode];
            
            return (
              <Button
                key={preset.id}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset.id)}
                className={cn(
                  "h-12 p-0 relative overflow-hidden",
                  isSelected && "ring-2 ring-primary ring-offset-2"
                )}
              >
                {/* Color preview circles */}
                <div className="flex items-center justify-center w-full h-full">
                  <div className="flex gap-1">
                    <div 
                      className="w-3 h-3 rounded-full border border-white/20" 
                      style={{ backgroundColor: `hsl(${presetTheme.primary})` }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-white/20" 
                      style={{ backgroundColor: `hsl(${presetTheme.secondary})` }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-white/20" 
                      style={{ backgroundColor: `hsl(${presetTheme.accent})` }}
                    />
                  </div>
                </div>
                
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-1 right-1">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                )}
              </Button>
            );
          })}
          
        </div>
      </div>
    </div>
  );
}