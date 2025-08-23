'use client';

import { useRef, useState } from 'react';
import { ChromePicker } from 'react-color';
import { useOnClickOutside } from '@/hooks/use-click-outside';

interface ColorDotProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorDot = ({ value, onChange }: ColorDotProps) => {
  const [pickerIsOpen, setPickerIsOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setPickerIsOpen(false));

  return (
    <div className="relative">
      <button
        className="w-8 h-8 rounded-full cursor-pointer border-2 border-border hover:border-muted-foreground transition-colors shadow-sm"
        onClick={() => setPickerIsOpen(!pickerIsOpen)}
        style={{ backgroundColor: value }}
        aria-label={`Color: ${value}`}
      />
      {pickerIsOpen && (
        <div ref={ref} className="absolute top-10 z-50">
          <ChromePicker
            color={value}
            disableAlpha
            onChange={(v: { hex: string }) => onChange(v.hex)}
          />
        </div>
      )}
    </div>
  );
};

export default ColorDot;