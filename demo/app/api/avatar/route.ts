import { NextRequest, NextResponse } from 'next/server';

// In-memory cache (persists across requests in the same instance)
const avatarCache = new Map<string, string>();
const MAX_CACHE_SIZE = 1000; // Limit cache size to prevent memory issues

// Generate cache key from all parameters
async function getCacheKey(params: Record<string, string>): Promise<string> {
  // Sort params to ensure consistent keys
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  // Use Web Crypto API for edge compatibility
  const encoder = new TextEncoder();
  const data = encoder.encode(sortedParams);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex.substring(0, 16);
}

export async function GET(request: NextRequest) {
  try {
    // Dynamic imports to avoid Next.js build issues
    const React = (await import('react')).default;
    const ReactDOMServer = (await import('react-dom/server')).default;
    const Avatar = (await import('../../../../src/lib')).default;
    
    const searchParams = request.nextUrl.searchParams;
    
    // Extract all parameters
    const params = {
      name: searchParams.get('name') || 'default',
      variant: searchParams.get('variant') || 'beam',
      size: searchParams.get('size') || '80',
      square: searchParams.get('square') || 'false',
      title: searchParams.get('title') || 'false',
      colors: searchParams.get('colors') || ''
    };
    
    // Debug logging
    console.log('API received params:', {
      ...params,
      url: request.url,
      colorsSample: params.colors ? params.colors.substring(0, 50) + '...' : 'none'
    });
    
    // Remove any cache buster parameter if present
    searchParams.delete('t');
    
    // Generate cache key from all params
    const cacheKey = await getCacheKey(params);
    
    // Check cache first
    const cached = avatarCache.get(cacheKey);
    if (cached) {
      // Return cached SVG with proper headers
      return new NextResponse(cached, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
          'CDN-Cache-Control': 'max-age=31536000', // For CDN
          'Vercel-CDN-Cache-Control': 'max-age=31536000', // For Vercel
          'X-Cache': 'HIT',
          'ETag': `"${cacheKey}"`,
        },
      });
    }
    
    // Parse parameters for avatar generation
    const name = params.name;
    const variant = params.variant;
    const size = parseInt(params.size, 10);
    const square = params.square === 'true';
    const title = params.title === 'true';
    // Parse colors - expect hex values without # (like Boring Avatars)
    const colors = params.colors && params.colors.trim() !== '' 
      ? params.colors.split(',').map(c => {
          const cleaned = c.trim();
          // Add # if not present (support both formats)
          return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
        }).filter(c => c.length > 1)
      : undefined;
    
    // Debug avatar props
    console.log('Creating avatar with:', {
      name,
      variant,
      size,
      square,
      title,
      colors: colors ? `[${colors.length} colors]` : 'undefined',
      firstColor: colors?.[0]
    });
    
    // Create the avatar element
    const avatarElement = React.createElement(Avatar, {
      name,
      variant: variant as any,
      size,
      square,
      title,
      colors,
    });
    
    // Render to string
    const svgString = ReactDOMServer.renderToStaticMarkup(avatarElement);
    
    // Store in cache (with size limit)
    if (avatarCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entries (FIFO)
      const firstKey = avatarCache.keys().next().value;
      avatarCache.delete(firstKey);
    }
    avatarCache.set(cacheKey, svgString);
    
    // Return the SVG with proper headers
    return new NextResponse(svgString, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
        'CDN-Cache-Control': 'max-age=31536000', // For CDN
        'Vercel-CDN-Cache-Control': 'max-age=31536000', // For Vercel
        'X-Cache': 'MISS',
        'ETag': `"${cacheKey}"`,
      },
    });
  } catch (error) {
    console.error('Error generating avatar:', error);
    return NextResponse.json(
      { error: 'Failed to generate avatar', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}