// Utility to work with tweakcn/shadcn theme registry (client-side)
export interface ColorPalette {
  name: string;
  title: string;
  description?: string;
  colors: string[];
}

interface ThemeApiResponse {
  success: boolean;
  data: ColorPalette[];
  cached: boolean;
  timestamp: number;
  error?: string;
}

// Get all available color palettes from the cached API
export async function getTweakcnColorPalettes(): Promise<ColorPalette[]> {
  try {
    const response = await fetch('/api/themes');
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result: ThemeApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch themes');
    }

    return result.data;
    
  } catch (error) {
    console.error('Failed to get tweakcn color palettes:', error);
    
    // Return fallback palettes
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

