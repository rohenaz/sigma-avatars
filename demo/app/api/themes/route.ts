import { NextRequest, NextResponse } from 'next/server';

interface RegistryTheme {
  name: string;
  type: string;
  title: string;
  description?: string;
  css?: string;
  cssVars: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
}

interface ColorPalette {
  name: string;
  title: string;
  description?: string;
  colors: string[];
}

const REGISTRY_URL = 'https://raw.githubusercontent.com/jnsahaj/tweakcn/refs/heads/main/public/r/registry.json';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// In-memory cache
let cachedData: {
  palettes: ColorPalette[];
  timestamp: number;
} | null = null;

// Parse OKLCH color to hex (simplified conversion)
function oklchToHex(oklch: string): string {
  // Fallback mappings for common theme patterns
  if (oklch.includes('0.98') || oklch.includes('1 0')) return '#ffffff';
  if (oklch.includes('0.02') || oklch.includes('0 0')) return '#000000';
  if (oklch.includes('0.7') && oklch.includes('0.')) return '#3b82f6'; // blue-ish
  if (oklch.includes('0.6') && oklch.includes('0.1')) return '#10b981'; // green-ish
  if (oklch.includes('0.65') && oklch.includes('0.15')) return '#f59e0b'; // yellow-ish
  if (oklch.includes('0.55') && oklch.includes('0.2')) return '#ef4444'; // red-ish
  if (oklch.includes('0.6') && oklch.includes('0.25')) return '#8b5cf6'; // purple-ish

  // Extract numeric values for better conversion
  const match = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (match) {
    const [, l, c, h] = match;
    const lightness = parseFloat(l);
    const chroma = parseFloat(c);
    const hue = parseFloat(h);
    
    // Simple conversion based on hue ranges
    if (hue >= 0 && hue < 60) return lightness > 0.5 ? '#ff6b6b' : '#cc5555'; // red-ish
    if (hue >= 60 && hue < 120) return lightness > 0.5 ? '#51cf66' : '#40c057'; // green-ish
    if (hue >= 120 && hue < 180) return lightness > 0.5 ? '#22d3ee' : '#06b6d4'; // cyan-ish
    if (hue >= 180 && hue < 240) return lightness > 0.5 ? '#3b82f6' : '#1d4ed8'; // blue-ish
    if (hue >= 240 && hue < 300) return lightness > 0.5 ? '#8b5cf6' : '#7c3aed'; // purple-ish
    if (hue >= 300 && hue < 360) return lightness > 0.5 ? '#ec4899' : '#db2777'; // pink-ish
  }

  // Default fallback
  return '#6366f1';
}

// Simple HSL to hex conversion
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate theme-appropriate colors based on theme name
function getThemeBasedColors(themeName: string, index: number): string {
  const themeColorSets: Record<string, string[]> = {
    'modern-minimal': ['#1a1a1a', '#333333', '#666666', '#999999', '#cccccc'],
    'twitter': ['#1da1f2', '#14171a', '#657786', '#aab8c2', '#e1e8ed'],
    'bubblegum': ['#ff69b4', '#ff1493', '#da70d6', '#ba55d3', '#9370db'],
    'doom-64': ['#ff4444', '#ff6600', '#ffaa00', '#44ff44', '#4466ff'],
    'catppuccin': ['#f5e0dc', '#f2cdcd', '#f5c2e7', '#cba6f7', '#89b4fa'],
    't3-chat': ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
    'default': ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  };

  // Extract theme base name (remove variants like -dark, -light)
  const baseTheme = themeName.replace(/-dark|-light$/, '');
  const colors = themeColorSets[baseTheme] || themeColorSets['default'];
  
  return colors[index] || colors[0];
}

// Extract meaningful colors from theme variables
function extractColorsFromTheme(theme: RegistryTheme): string[] {
  const colors: string[] = [];
  const lightVars = theme.cssVars.light || {};
  
  // Priority order for color extraction
  const colorKeys = [
    '--primary',
    '--secondary', 
    '--accent',
    '--muted',
    '--destructive',
    '--warning',
    '--success',
    '--info'
  ];

  // Extract colors from light theme variables
  for (const key of colorKeys) {
    const value = lightVars[key];
    if (value && typeof value === 'string') {
      if (value.startsWith('oklch(')) {
        colors.push(oklchToHex(value));
      } else if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
        colors.push(value);
      } else if (value.match(/^\d+\s+\d+%?\s+\d+%?$/)) {
        // HSL values - convert to approximate hex
        const [h, s, l] = value.split(' ').map(v => parseInt(v.replace('%', '')));
        colors.push(hslToHex(h, s, l));
      }
    }
  }

  // If we don't have enough colors, add theme-based colors
  while (colors.length < 5) {
    colors.push(getThemeBasedColors(theme.name, colors.length));
  }

  return colors.slice(0, 5);
}

// Convert registry themes to color palettes
function registryToColorPalettes(themes: RegistryTheme[]): ColorPalette[] {
  return themes.map(theme => ({
    name: theme.name,
    title: theme.title,
    description: theme.description,
    colors: extractColorsFromTheme(theme)
  }));
}

async function fetchTweakcnRegistry(): Promise<ColorPalette[]> {
  try {
    console.log('Fetching tweakcn registry from:', REGISTRY_URL);
    
    const response = await fetch(REGISTRY_URL, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch registry: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Raw registry data type:', typeof data);
    console.log('Registry data sample:', Array.isArray(data) ? `Array of ${data.length} items` : Object.keys(data).slice(0, 5));
    
    // Handle different response formats
    let themes: RegistryTheme[] = [];
    if (Array.isArray(data)) {
      themes = data.filter(item => item && item.type === 'registry:style');
    } else if (data && typeof data === 'object') {
      // Check for registry format with "items" property
      if (data.items && Array.isArray(data.items)) {
        console.log('Found items array with', data.items.length, 'items');
        themes = data.items.filter((item: any) => 
          item && typeof item === 'object' && item.type === 'registry:style'
        ) as RegistryTheme[];
      } else {
        // If it's an object, extract values
        themes = Object.values(data).filter(item => 
          item && typeof item === 'object' && (item as any).type === 'registry:style'
        ) as RegistryTheme[];
      }
    }
    
    console.log(`Successfully fetched ${themes.length} themes from tweakcn registry`);
    
    return registryToColorPalettes(themes);
  } catch (error) {
    console.error('Failed to fetch tweakcn registry:', error);
    
    // Return some fallback palettes
    return [
      {
        name: 'default',
        title: 'Default',
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      },
      {
        name: 'modern-minimal',
        title: 'Modern Minimal', 
        colors: ['#1a1a1a', '#333333', '#666666', '#999999', '#cccccc']
      },
      {
        name: 'twitter',
        title: 'Twitter',
        colors: ['#1da1f2', '#14171a', '#657786', '#aab8c2', '#e1e8ed']
      }
    ];
  }
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    
    // Check if we have valid cached data
    if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
      console.log('Serving cached tweakcn themes');
      return NextResponse.json({
        success: true,
        data: cachedData.palettes,
        cached: true,
        timestamp: cachedData.timestamp
      });
    }

    // Fetch fresh data
    console.log('Fetching fresh tweakcn themes');
    const palettes = await fetchTweakcnRegistry();
    
    // Update cache
    cachedData = {
      palettes,
      timestamp: now
    };

    return NextResponse.json({
      success: true,
      data: palettes,
      cached: false,
      timestamp: now
    });

  } catch (error) {
    console.error('Error in themes API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch themes',
      data: []
    }, { status: 500 });
  }
}