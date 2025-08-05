"use client";

import React from 'react';
import { Label } from '@/registry/new-york/ui/label';
import { Slider } from '@/registry/new-york/ui/slider';
import { Input } from '@/registry/new-york/ui/input';

interface SliderControlProps {
  label: string;
  value: string; // e.g. "0.5rem"
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export function SliderControl({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 2, 
  step = 0.05,
  unit = 'rem'
}: SliderControlProps) {
  // Parse numeric value from string like "0.5rem"
  const numericValue = parseFloat(value.replace(unit, '')) || 0;

  const handleSliderChange = (newValue: number[]) => {
    onChange(`${newValue[0]}${unit}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    if (!isNaN(inputValue)) {
      onChange(`${inputValue}${unit}`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="w-20">
          <Input
            type="number"
            value={numericValue}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="text-xs h-7"
          />
        </div>
      </div>
      
      <Slider
        value={[numericValue]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}