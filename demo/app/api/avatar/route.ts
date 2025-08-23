import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

// File-based cache directory
const CACHE_DIR = path.join(process.cwd(), '.avatar-cache');
const MAX_CACHE_FILES = 1000;

// Track in-progress conversions to prevent concurrent writes
const inProgressConversions = new Map<string, Promise<Buffer | string>>();

// Ensure cache directory exists
async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create cache directory:', error);
  }
}

// Generate cache key from avatar-affecting parameters only (exclude format)
async function getCacheKey(params: Record<string, string>): Promise<string> {
  // Exclude format from cache key since it doesn't affect avatar generation
  const { format, ...avatarParams } = params;
  
  // Sort params to ensure consistent keys
  const sortedParams = Object.keys(avatarParams)
    .sort()
    .map(key => `${key}=${avatarParams[key]}`)
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
    const sharp = (await import('sharp')).default;
    
    const searchParams = request.nextUrl.searchParams;
    
    // Extract all parameters
    const params = {
      name: searchParams.get('name') || 'default',
      variant: searchParams.get('variant') || 'beam',
      size: searchParams.get('size') || '80',
      title: searchParams.get('title') || 'false',
      colors: searchParams.get('colors') || '',
      format: searchParams.get('format') || 'svg'
    };
    
    
    // Remove any cache buster parameter if present
    searchParams.delete('t');
    
    // Generate cache key from all params
    const cacheKey = await getCacheKey(params);
    
    // Validate format
    const format = params.format.toLowerCase();
    if (!['svg', 'png', 'webp'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be svg, png, or webp' },
        { status: 400 }
      );
    }

    // Ensure cache directory exists
    await ensureCacheDir();
    
    // Check file cache first
    const cacheFile = path.join(CACHE_DIR, `${cacheKey}.${format}`);
    try {
      const cached = await fs.readFile(cacheFile);
      // Validate cached file is not empty or corrupted
      if (cached && cached.length > 0) {
        console.log(`Cache HIT for ${params.name}-${params.variant}.${format}`);
        // Return cached data with proper headers
        const contentType = format === 'svg' ? 'image/svg+xml' : `image/${format}`;
        return new NextResponse(cached as BodyInit, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
            'CDN-Cache-Control': 'max-age=31536000', // For CDN
            'Vercel-CDN-Cache-Control': 'max-age=31536000', // For Vercel
            'X-Cache': 'HIT',
            'ETag': `"${cacheKey}"`,
          },
        });
      } else {
        // Invalid cache file - delete it
        await fs.unlink(cacheFile).catch(() => {});
        console.log(`Cache INVALID (removed) for ${params.name}-${params.variant}.${format}`);
      }
    } catch (error) {
      // Cache miss - file doesn't exist
      console.log(`Cache MISS for ${params.name}-${params.variant}.${format}`);
    }
    
    // Check if another request is already processing this same avatar
    const conversionKey = `${cacheKey}.${format}`;
    if (inProgressConversions.has(conversionKey)) {
      console.log(`Waiting for in-progress conversion: ${conversionKey}`);
      try {
        const result = await inProgressConversions.get(conversionKey)!;
        const contentType = format === 'svg' ? 'image/svg+xml' : `image/${format}`;
        return new NextResponse(result as BodyInit, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Cache': 'WAIT',
            'ETag': `"${cacheKey}"`,
          },
        });
      } catch (error) {
        console.error('Error waiting for conversion:', error);
        // Fall through to generate new one
      }
    }
    
    
    // Parse parameters for avatar generation
    const name = params.name;
    const variant = params.variant;
    const size = parseInt(params.size, 10);
    const title = params.title === 'true';
    // Parse colors - handle all formats (hex, oklch, hsl, etc.)
    const colors = params.colors && params.colors.trim() !== '' 
      ? params.colors.split(',').map(c => {
          const cleaned = c.trim();
          // For hex colors that come without #, add it
          if (cleaned.match(/^[0-9A-Fa-f]{3,6}$/) && !cleaned.startsWith('#')) {
            return `#${cleaned}`;
          }
          // For all other formats (oklch, hsl, rgb, etc.) or hex with #, use as-is
          return cleaned;
        }).filter(c => c.length > 1)
      : undefined;
    
    
    // Create the avatar element
    const avatarElement = React.createElement(Avatar, {
      name,
      variant: variant as any,
      size,
      title,
      colors: colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    });
    
    // Render to string
    const svgString = ReactDOMServer.renderToStaticMarkup(avatarElement);
    
    // Create conversion promise for this request
    const conversionPromise = (async () => {
      let outputBuffer: string | Buffer = svgString;
      let contentType = 'image/svg+xml';
      
      // Convert to PNG or WebP if requested
      if (format === 'png' || format === 'webp') {
        try {
          const svgBuffer = Buffer.from(svgString);
          const sharpInstance = sharp(svgBuffer)
            .resize(size, size) // Use 1x size for faster processing
            .png({ quality: 80, compressionLevel: 6 }); // Reduce quality for speed
          
          if (format === 'webp') {
            outputBuffer = await sharpInstance
              .webp({ quality: 75, effort: 0 }) // effort: 0 is fastest
              .toBuffer();
            contentType = 'image/webp';
          } else {
            outputBuffer = await sharpInstance.toBuffer();
            contentType = 'image/png';
          }
        } catch (conversionError) {
          console.error('Failed to convert image:', conversionError);
          // Don't cache failed conversions - throw to be handled by caller
          throw conversionError;
        }
      }
      return outputBuffer;
    })();
    
    // Track this conversion
    inProgressConversions.set(conversionKey, conversionPromise);
    
    let outputBuffer: string | Buffer;
    let contentType = 'image/svg+xml';
    
    try {
      outputBuffer = await conversionPromise;
      contentType = format === 'svg' ? 'image/svg+xml' : `image/${format}`;
    } catch (conversionError) {
      // Conversion failed - clean up and return SVG fallback
      inProgressConversions.delete(conversionKey);
      console.error('Failed to convert image:', conversionError);
      return new NextResponse(svgString, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache',
          'X-Conversion-Error': 'true',
          'X-Error': conversionError instanceof Error ? conversionError.message : 'Unknown error',
        },
      });
    } finally {
      // Clean up after a delay to allow other waiting requests to get the result
      setTimeout(() => {
        inProgressConversions.delete(conversionKey);
      }, 100);
    }
    
    // Store in file cache only if conversion was successful
    try {
      // Clean up old cache files if needed
      const files = await fs.readdir(CACHE_DIR);
      if (files.length >= MAX_CACHE_FILES) {
        // Remove oldest files (simple cleanup - remove first 100 files)
        const filesToDelete = files.slice(0, 100);
        await Promise.all(filesToDelete.map(f => 
          fs.unlink(path.join(CACHE_DIR, f)).catch(() => {})
        ));
      }
      
      // Write to cache with temp file to avoid partial writes
      const tempFile = `${cacheFile}.tmp`;
      await fs.writeFile(tempFile, outputBuffer);
      await fs.rename(tempFile, cacheFile);
    } catch (error) {
      console.error('Failed to write cache:', error);
    }
    
    // Return the image with proper headers
    return new NextResponse(outputBuffer as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': contentType,
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