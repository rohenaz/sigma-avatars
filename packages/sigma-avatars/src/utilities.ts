import type {
  Color,
  ColorPalette,
  CssVariable,
  HexColor,
  HslColor,
  OklchColor,
  RgbColor,
} from './components/types';

export const hashCode = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const character = name.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate deterministic ID based on name and suffix
export const generateId = (name: string, suffix: string): string => {
  const hash = hashCode(name + suffix);
  return `avatar-${hash}-${suffix}`;
};

export const getModulus = (num: number, max: number): number => {
  return num % max;
};

export const getDigit = (number: number, ntn: number): number => {
  return Math.floor((number / 10 ** ntn) % 10);
};

export const getBoolean = (number: number, ntn: number): boolean => {
  return !(getDigit(number, ntn) % 2);
};

export const getAngle = (x: number, y: number): number => {
  return (Math.atan2(y, x) * 180) / Math.PI;
};

export const getUnit = (
  number: number,
  range: number,
  index?: number
): number => {
  // Add bit spreading to avoid collisions on small ranges
  const spread = (number ^ (number >>> 16)) * 0x85_eb_ca_6b;
  const value = Math.abs(spread) % range;

  if (index && getDigit(number, index) % 2 === 0) {
    return -value;
  }
  return value;
};

export const getRandomColor = (
  number: number,
  colors: Color[],
  range: number
): Color => {
  return colors[number % range];
};

// Type guards for color validation
export const isHex = (s: string): s is HexColor =>
  /^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(s);

export const isCssVariable = (s: string): s is CssVariable =>
  /^var\(--[\w-]+\)$/.test(s);

export const isRgbColor = (s: string): s is RgbColor => /^rgba?\(/.test(s);

export const isHslColor = (s: string): s is HslColor => /^hsla?\(/.test(s);

export const isOklchColor = (s: string): s is OklchColor => /^oklch\(/.test(s);

export const getContrast = (hexcolor: string): string => {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === '#') {
    hexcolor = hexcolor.slice(1);
  }

  // Expand 3-digit hex to 6-digit
  if (hexcolor.length === 3) {
    hexcolor = hexcolor[0] + hexcolor[0] + hexcolor[1] + hexcolor[1] + hexcolor[2] + hexcolor[2];
  }

  // Convert to RGB value
  const r = Number.parseInt(hexcolor.substring(0, 2), 16);
  const g = Number.parseInt(hexcolor.substring(2, 4), 16);
  const b = Number.parseInt(hexcolor.substring(4, 6), 16);

  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Check contrast
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};

export const getContrastSafe = (
  color: Color,
  fallback: Color = '#000000'
): Color => {
  // Smart handling for CSS variables - map to foreground equivalent
  if (isCssVariable(color)) {
    const varMatch = color.match(/var\(--(.+)\)/);
    if (varMatch) {
      const varName = varMatch[1];
      // Common shadcn patterns
      if (!varName.endsWith('-foreground')) {
        return `var(--${varName}-foreground)`;
      }
    }
    return fallback;
  }

  // Only calculate contrast for hex colors
  if (!isHex(color)) {
    return fallback;
  }

  return getContrast(color);
};

// Predefined color palettes
export const defaultColors: Color[] = [
  '#92A1C6',
  '#146A7C',
  '#F0AB3D',
  '#C271B4',
  '#C20D90',
];

export const shadcnColors: Color[] = [
  'var(--primary)',
  'var(--secondary)',
  'var(--accent)',
  'var(--muted)',
  'var(--card)',
];

export const shadcnColorPrefixColors: Color[] = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-accent)',
  'var(--color-muted)',
  'var(--color-card)',
];

// Helper to convert palette to array
export const paletteToArray = (palette: Partial<ColorPalette>): Color[] => {
  return Object.values(palette).filter(Boolean) as Color[];
};
