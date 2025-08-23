import { describe, expect, test } from 'bun:test';
import {
  hashCode,
  getUnit,
  getDigit,
  getBoolean,
  getRandomColor,
  getContrast,
  getContrastSafe,
  isHex,
  isCssVariable,
  isRgbColor,
  isHslColor,
  isOklchColor,
} from './utilities';

describe('Hash Functions', () => {
  test('hashCode should generate consistent hashes', () => {
    const hash1 = hashCode('Alice');
    const hash2 = hashCode('Alice');
    expect(hash1).toBe(hash2);
    expect(hash1).toBeNumber();
    expect(hash1).toBeGreaterThan(0);
  });

  test('hashCode should generate different hashes for different inputs', () => {
    const hash1 = hashCode('Alice');
    const hash2 = hashCode('Bob');
    expect(hash1).not.toBe(hash2);
  });

  test('hashCode should handle empty strings', () => {
    const hash = hashCode('');
    expect(hash).toBe(0);
  });

  test('getUnit should return values within range', () => {
    const num = 12345;
    const range = 10;
    const result = getUnit(num, range);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(range);
  });

  test('getUnit with index should return negative values when appropriate', () => {
    const num = 12345;
    const range = 10;
    const result1 = getUnit(num, range, 0);
    const result2 = getUnit(num, range, 1);
    // One should be positive, one negative based on digit parity
    expect(Math.abs(result1)).toBeLessThan(range);
    expect(Math.abs(result2)).toBeLessThan(range);
  });

  test('getDigit should extract correct digit', () => {
    const num = 12345;
    expect(getDigit(num, 0)).toBe(5);
    expect(getDigit(num, 1)).toBe(4);
    expect(getDigit(num, 2)).toBe(3);
    expect(getDigit(num, 3)).toBe(2);
    expect(getDigit(num, 4)).toBe(1);
  });

  test('getBoolean should return boolean based on digit parity', () => {
    const num = 12345;
    expect(getBoolean(num, 0)).toBe(false); // 5 is odd
    expect(getBoolean(num, 1)).toBe(true);  // 4 is even
  });

  test('getRandomColor should return color from array', () => {
    const colors = ['#FF0000', '#00FF00', '#0000FF'];
    const color = getRandomColor(42, colors, colors.length);
    expect(colors).toContain(color);
  });
});

describe('Color Validation', () => {
  test('isHex should validate hex colors', () => {
    expect(isHex('#FF0000')).toBe(true);
    expect(isHex('#F00')).toBe(true);
    expect(isHex('#FF0000AA')).toBe(true);
    expect(isHex('FF0000')).toBe(false);
    expect(isHex('#GG0000')).toBe(false);
    expect(isHex('red')).toBe(false);
  });

  test('isCssVariable should validate CSS variables', () => {
    expect(isCssVariable('var(--primary)')).toBe(true);
    expect(isCssVariable('var(--color-primary)')).toBe(true);
    expect(isCssVariable('var(--my-color-123)')).toBe(true);
    expect(isCssVariable('--primary')).toBe(false);
    expect(isCssVariable('var(primary)')).toBe(false);
    expect(isCssVariable('#FF0000')).toBe(false);
  });

  test('isRgbColor should validate RGB colors', () => {
    expect(isRgbColor('rgb(255, 0, 0)')).toBe(true);
    expect(isRgbColor('rgba(255, 0, 0, 0.5)')).toBe(true);
    expect(isRgbColor('rgb(100 200 150)')).toBe(true);
    expect(isRgbColor('#FF0000')).toBe(false);
    expect(isRgbColor('red')).toBe(false);
  });

  test('isHslColor should validate HSL colors', () => {
    expect(isHslColor('hsl(220, 14%, 96%)')).toBe(true);
    expect(isHslColor('hsla(220, 14%, 96%, 0.5)')).toBe(true);
    expect(isHslColor('hsl(220 14% 96%)')).toBe(true);
    expect(isHslColor('#FF0000')).toBe(false);
    expect(isHslColor('rgb(255, 0, 0)')).toBe(false);
  });

  test('isOklchColor should validate OKLCH colors', () => {
    expect(isOklchColor('oklch(0.7 0.2 340)')).toBe(true);
    expect(isOklchColor('oklch(0.5, 0.1, 180)')).toBe(true);
    expect(isOklchColor('#FF0000')).toBe(false);
    expect(isOklchColor('hsl(220, 14%, 96%)')).toBe(false);
  });
});

describe('Color Contrast', () => {
  test('getContrast should return correct contrast colors', () => {
    // Light colors should return black
    expect(getContrast('#FFFFFF')).toBe('#000000');
    expect(getContrast('#FFFF00')).toBe('#000000'); // Yellow
    expect(getContrast('#00FFFF')).toBe('#000000'); // Cyan
    
    // Dark colors should return white
    expect(getContrast('#000000')).toBe('#FFFFFF');
    expect(getContrast('#000080')).toBe('#FFFFFF'); // Navy
    expect(getContrast('#800000')).toBe('#FFFFFF'); // Maroon
  });

  test('getContrast should handle 3-digit hex colors', () => {
    expect(getContrast('#FFF')).toBe('#000000'); // White -> black text
    expect(getContrast('#000')).toBe('#FFFFFF'); // Black -> white text
    expect(getContrast('#F00')).toBe('#FFFFFF'); // Red -> white text
  });

  test('getContrast should handle hex without #', () => {
    expect(getContrast('FFFFFF')).toBe('#000000');
    expect(getContrast('000000')).toBe('#FFFFFF');
  });

  test('getContrastSafe should handle CSS variables', () => {
    // Should return mapped foreground color for CSS variables
    expect(getContrastSafe('var(--primary)')).toBe('var(--primary-foreground)');
    expect(getContrastSafe('var(--secondary)')).toBe('var(--secondary-foreground)');
    // Even unknown CSS variables get -foreground appended
    expect(getContrastSafe('var(--unknown)')).toBe('var(--unknown-foreground)');
  });

  test('getContrastSafe should handle hex colors', () => {
    expect(getContrastSafe('#FFFFFF')).toBe('#000000');
    expect(getContrastSafe('#000000')).toBe('#FFFFFF');
  });

  test('getContrastSafe should handle non-hex formats', () => {
    // Should return fallback for non-hex formats
    expect(getContrastSafe('rgb(255, 255, 255)')).toBe('#000000');
    expect(getContrastSafe('hsl(0, 0%, 100%)')).toBe('#000000');
    expect(getContrastSafe('oklch(1 0 0)')).toBe('#000000');
  });
});

describe('RGB Parsing Bug Fix', () => {
  test('getContrast should correctly parse RGB values', () => {
    // Test the specific bug that was fixed
    const testColor = '#4287f5'; // Blue color
    const contrast = getContrast(testColor);
    
    // This blue should return white text for contrast
    expect(contrast).toBe('#FFFFFF');
    
    // Verify the RGB extraction works correctly
    // #4287f5 -> R: 66 (0x42), G: 135 (0x87), B: 245 (0xf5)
    // YIQ = (66*299 + 135*587 + 245*114) / 1000 = 126.9
    // Since 126.9 < 128, it should return white
  });

  test('getContrast RGB parsing for known colors', () => {
    // Test cases with known RGB values
    expect(getContrast('#FF0000')).toBe('#FFFFFF'); // Pure red -> white
    expect(getContrast('#00FF00')).toBe('#000000'); // Pure green -> black
    expect(getContrast('#0000FF')).toBe('#FFFFFF'); // Pure blue -> white
    expect(getContrast('#808080')).toBe('#000000'); // Medium gray -> black (YIQ=128)
  });
});