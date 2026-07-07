import type {
  Color,
  ColorPalette,
  CssVariable,
  HexColor,
  HslColor,
  OklchColor,
  RgbColor,
} from "./components/types";

const HEX_COLOR_REGEX = /^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
const CSS_VARIABLE_REGEX = /^var\(--[\w-]+\)$/;
const RGB_COLOR_REGEX = /^rgba?\(/;
const HSL_COLOR_REGEX = /^hsla?\(/;
const OKLCH_COLOR_REGEX = /^oklch\(/;
const CSS_VARIABLE_NAME_REGEX = /var\(--(.+)\)/;

export const hashCode = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    const character = name.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash &= hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate deterministic ID based on name and suffix
export const generateId = (name: string, suffix: string): string => {
  const hash = hashCode(name + suffix);
  return `avatar-${hash}-${suffix}`;
};

export const getModulus = (num: number, max: number): number => num % max;

export const getDigit = (number: number, ntn: number): number =>
  Math.floor((number / 10 ** ntn) % 10);

export const getBoolean = (number: number, ntn: number): boolean =>
  !(getDigit(number, ntn) % 2);

export const getAngle = (x: number, y: number): number =>
  (Math.atan2(y, x) * 180) / Math.PI;

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
): Color => colors[number % range];

// Type guards for color validation
export const isHex = (s: string): s is HexColor => HEX_COLOR_REGEX.test(s);

export const isCssVariable = (s: string): s is CssVariable =>
  CSS_VARIABLE_REGEX.test(s);

export const isRgbColor = (s: string): s is RgbColor => RGB_COLOR_REGEX.test(s);

export const isHslColor = (s: string): s is HslColor => HSL_COLOR_REGEX.test(s);

export const isOklchColor = (s: string): s is OklchColor =>
  OKLCH_COLOR_REGEX.test(s);

export const getContrast = (hexcolor: string): string => {
  // If a leading # is provided, remove it
  let hex = hexcolor.slice(0, 1) === "#" ? hexcolor.slice(1) : hexcolor;

  // Expand 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Convert to RGB value
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);

  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Check contrast
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};

export const getContrastSafe = (
  color: Color,
  fallback: Color = "#000000"
): Color => {
  // Smart handling for CSS variables - map to foreground equivalent
  if (isCssVariable(color)) {
    const varMatch = color.match(CSS_VARIABLE_NAME_REGEX);
    if (varMatch) {
      const [, varName] = varMatch;
      // Common shadcn patterns
      if (!varName.endsWith("-foreground")) {
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
  "#92A1C6",
  "#146A7C",
  "#F0AB3D",
  "#C271B4",
  "#C20D90",
];

export const shadcnColors: Color[] = [
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "var(--muted)",
  "var(--card)",
];

export const shadcnColorPrefixColors: Color[] = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-accent)",
  "var(--color-muted)",
  "var(--color-card)",
];

// Helper to convert palette to array
export const paletteToArray = (palette: Partial<ColorPalette>): Color[] =>
  Object.values(palette).filter(Boolean) as Color[];
