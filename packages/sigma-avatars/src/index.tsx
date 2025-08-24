import React from 'react';
import AvatarBarcode from './components/avatar-barcode';
import AvatarBauhaus from './components/avatar-bauhaus';
import AvatarBeam from './components/avatar-beam';
import AvatarFractal from './components/avatar-fractal';
import AvatarMage from './components/avatar-mage';
import AvatarMarble from './components/avatar-marble';
import AvatarPepe from './components/avatar-pepe';
import AvatarPixel from './components/avatar-pixel';
import AvatarRing from './components/avatar-ring';
import AvatarSunset from './components/avatar-sunset';
import type { AvatarProps } from './components/types';
import { defaultColors } from './utilities';

const AVATAR_VARIANTS = {
  pixel: AvatarPixel,
  bauhaus: AvatarBauhaus,
  ring: AvatarRing,
  beam: AvatarBeam,
  sunset: AvatarSunset,
  marble: AvatarMarble,
  fractal: AvatarFractal,
  mage: AvatarMage,
  barcode: AvatarBarcode,
  pepe: AvatarPepe,
};

const Avatar = ({
  variant = 'marble',
  colors = defaultColors,
  name = 'Clara Barton',
  title = false,
  size,
  backgrounds,
  api,
  className = 'rounded-md',
  ...otherProps
}: AvatarProps & { variant?: keyof typeof AVATAR_VARIANTS }) => {
  // If API is provided, render as an img element
  if (api) {
    // Check if api is a full URL with params or just the base endpoint
    const isFullUrl = api.includes('?');
    let finalUrl = api;
    
    if (!isFullUrl) {
      // Build params if api is just the endpoint
      const params = new URLSearchParams({
        name,
        variant,
        size: size?.toString() || '80',
        title: title?.toString() || 'false',
        format: 'webp', // Default to WebP for performance
        ...(colors && colors.length > 0 && { 
          colors: colors.map(c => c.replace(/^#/, '')).join(',')
        }),
      });
      finalUrl = `${api}?${params}`;
    }
    
    
    const imgSize = typeof size === 'number' ? size : parseInt(size || '80', 10);
    
    // Extract only HTML-compatible props
    const { style } = otherProps;
    
    return (
      <img
        src={finalUrl}
        alt={name}
        width={imgSize}
        height={imgSize}
        className={className as string}
        style={style as React.CSSProperties}
      />
    );
  }

  // Otherwise render SVG directly
  const AvatarComponent = AVATAR_VARIANTS[variant] || AvatarMarble;

  return (
    <AvatarComponent
      colors={colors}
      name={name}
      size={size}
      title={title}
      backgrounds={backgrounds}
      className={className}
      {...otherProps}
    />
  );
};

export default Avatar;

// Export types and utilities for consumers
export type { AvatarProps, Color, ColorPalette } from './components/types';
export {
  defaultColors,
  isCssVariable,
  isHex,
  isHslColor,
  isOklchColor,
  isRgbColor,
  paletteToArray,
  shadcnColorPrefixColors,
  shadcnColors,
} from './utilities';

// Export background patterns
export {
  PATTERN_NAMES,
  PATTERN_CATEGORIES,
  PATTERN_REGISTRY,
  type BackgroundPattern,
} from './backgrounds';
