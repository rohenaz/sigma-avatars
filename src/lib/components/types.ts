import type { SVGProps } from 'react';

// Type-safe color formats
export type HexColor = `#${string}`;
export type RgbColor = `rgb(${string})` | `rgba(${string})`;
export type HslColor = `hsl(${string})` | `hsla(${string})`;
export type OklchColor = `oklch(${string})`;
export type CssVariable = `var(--${string})`;

// Union of all supported color formats
export type Color =
  | HexColor
  | RgbColor
  | HslColor
  | OklchColor
  | CssVariable
  | string;

// Color palette interface for better DX
export interface ColorPalette {
  primary: Color;
  secondary: Color;
  accent: Color;
  muted: Color;
  background: Color;
}

export type AvatarProps = {
  name: string;
  colors: Color[];
  title?: boolean;
  square?: boolean;
  size?: number | string;
} & SVGProps<SVGSVGElement>;
