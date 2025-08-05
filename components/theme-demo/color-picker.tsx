"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/registry/new-york/ui/button';
import { Input } from '@/registry/new-york/ui/input';
import { Label } from '@/registry/new-york/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/new-york/ui/popover';
import { hslToHex, hexToHsl, meetsContrastStandard } from '@/lib/color-utils';

interface ColorPickerProps {
  label: string;
  value: string; // HSL format like "240 10% 3.9%"
  onChange: (value: string) => void;
  contrastCheck?: string; // Optional background color for contrast checking
}

export function ColorPicker({ label, value, onChange, contrastCheck }: ColorPickerProps) {
  const [hexValue, setHexValue] = useState(() => hslToHex(value));
  const [isOpen, setIsOpen] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Update hex value when HSL value changes
  useEffect(() => {
    setHexValue(hslToHex(value));
  }, [value]);

  const handleHexChange = (hex: string) => {
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      const hsl = hexToHsl(hex);
      onChange(hsl);
      setHexValue(hex);
    } else {
      setHexValue(hex); // Allow partial typing
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const hsl = hexToHsl(hex);
    onChange(hsl);
    setHexValue(hex);
  };

  // Calculate contrast if background is provided
  const contrastInfo = contrastCheck ? meetsContrastStandard(value, contrastCheck) : null;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      
      <div className="flex gap-2">
        <div className="relative">
          <input
            ref={colorInputRef}
            type="color"
            value={hexValue}
            onChange={handleColorInputChange}
            className="absolute inset-0 w-12 h-8 opacity-0 cursor-pointer"
            aria-label={`Pick color for ${label}`}
          />
          <Button
            variant="outline"
            className="w-12 h-8 p-0 border-2 pointer-events-none"
            style={{ backgroundColor: hexValue }}
          >
            <span className="sr-only">Pick color</span>
          </Button>
        </div>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2">
              <span className="text-xs">...</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-3">
              <div>
                <Label htmlFor="hex-input" className="text-sm">
                  Hex Value
                </Label>
                <Input
                  id="hex-input"
                  value={hexValue}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#000000"
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label className="text-sm">HSL Value</Label>
                <Input
                  value={value}
                  readOnly
                  className="font-mono text-sm bg-muted"
                />
              </div>

              {contrastInfo && (
                <div className="text-xs space-y-1">
                  <div className="font-medium">Contrast Ratio</div>
                  <div className="flex items-center gap-2">
                    <span>{contrastInfo.ratio.toFixed(2)}:1</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      contrastInfo.meetsAAA 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : contrastInfo.meetsAA 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {contrastInfo.meetsAAA ? 'AAA' : contrastInfo.meetsAA ? 'AA' : 'Fail'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <Input
          value={hexValue}
          onChange={(e) => handleHexChange(e.target.value)}
          placeholder="#000000"
          className="font-mono text-sm flex-1"
        />
      </div>
    </div>
  );
}