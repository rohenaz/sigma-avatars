import AvatarBauhaus from './components/avatar-bauhaus';
import AvatarRing from './components/avatar-ring';
import AvatarPixel from './components/avatar-pixel';
import AvatarBeam from './components/avatar-beam';
import AvatarSunset from './components/avatar-sunset';
import AvatarMarble from './components/avatar-marble';
import AvatarFractal from './components/avatar-fractal';
import AvatarMage from './components/avatar-mage';
import AvatarAnime from './components/avatar-anime';
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
  anime: AvatarAnime,
  geometric: AvatarBeam, // Deprecated, use 'beam'
  abstract: AvatarBauhaus, // Deprecated, use 'bauhaus'
};

const Avatar = ({
  variant = 'marble',
  colors = defaultColors,
  name = 'Clara Barton',
  title = false,
  size,
  square = false,
  ...otherProps
}: AvatarProps & { variant?: keyof typeof AVATAR_VARIANTS; }) => {
  const AvatarComponent = AVATAR_VARIANTS[variant] || AvatarMarble;

  return (
    <AvatarComponent
      colors={colors}
      name={name}
      title={title}
      size={size}
      square={square}
      {...otherProps}
    />
  );
};

export default Avatar;

// Export types and utilities for consumers
export type { AvatarProps, Color, ColorPalette } from './components/types';
export { 
  shadcnColors, 
  shadcnColorPrefixColors, 
  defaultColors,
  paletteToArray,
  isHex,
  isCssVariable,
  isRgbColor,
  isHslColor,
  isOklchColor
} from './utilities';