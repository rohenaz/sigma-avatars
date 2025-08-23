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
  square = false,
  ...otherProps
}: AvatarProps & { variant?: keyof typeof AVATAR_VARIANTS }) => {
  const AvatarComponent = AVATAR_VARIANTS[variant] || AvatarMarble;

  return (
    <AvatarComponent
      colors={colors}
      name={name}
      size={size}
      square={square}
      title={title}
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
