import type React from "react";
import AvatarBarcode from "./components/avatar-barcode";
import AvatarBauhaus from "./components/avatar-bauhaus";
import AvatarBeam from "./components/avatar-beam";
import AvatarFractal from "./components/avatar-fractal";
import AvatarMage from "./components/avatar-mage";
import AvatarMarble from "./components/avatar-marble";
import AvatarPepe from "./components/avatar-pepe";
import AvatarPixel from "./components/avatar-pixel";
import AvatarRing from "./components/avatar-ring";
import AvatarSunset from "./components/avatar-sunset";
import type { AvatarProps } from "./components/types";
import { defaultColors } from "./utilities";

const ADVANCED_CSS_COLOR_REGEX = /oklch\(|var\(--/i;
const LEADING_HASH_REGEX = /^#/;

const AVATAR_VARIANTS = {
  barcode: AvatarBarcode,
  bauhaus: AvatarBauhaus,
  beam: AvatarBeam,
  fractal: AvatarFractal,
  mage: AvatarMage,
  marble: AvatarMarble,
  pepe: AvatarPepe,
  pixel: AvatarPixel,
  ring: AvatarRing,
  sunset: AvatarSunset,
};

const Avatar = ({
  variant = "marble",
  colors = defaultColors,
  name = "Clara Barton",
  title = false,
  size,
  backgrounds,
  api,
  className = "rounded-md",
  ...otherProps
}: AvatarProps & { variant?: keyof typeof AVATAR_VARIANTS }) => {
  // If API is provided, render as an img element
  if (api) {
    const hasAdvancedCssColors = (colors || []).some((color) =>
      ADVANCED_CSS_COLOR_REGEX.test(String(color))
    );
    // Check if api is a full URL with params or just the base endpoint
    const isFullUrl = api.includes("?");
    let finalUrl = api;

    if (!isFullUrl) {
      // Build params if api is just the endpoint
      const params = new URLSearchParams({
        name,
        size: size?.toString() || "80",
        title: title?.toString() || "false",
        variant,
        // Keep raster format for basic colors, fallback to SVG for advanced CSS color functions
        ...(!hasAdvancedCssColors && { format: "webp" }),
        ...(colors &&
          colors.length > 0 && {
            colors: colors
              .map((c) => c.replace(LEADING_HASH_REGEX, ""))
              .join(","),
          }),
      });
      finalUrl = `${api}?${params}`;
    }

    const imgSize =
      typeof size === "number" ? size : Number.parseInt(size || "80", 10);

    // Extract only HTML-compatible props
    const { style } = otherProps;

    return (
      <img
        alt={name}
        className={className as string}
        height={imgSize}
        src={finalUrl}
        style={style as React.CSSProperties}
        width={imgSize}
      />
    );
  }

  // Otherwise render SVG directly
  const AvatarComponent = AVATAR_VARIANTS[variant] || AvatarMarble;

  return (
    <AvatarComponent
      backgrounds={backgrounds}
      className={className}
      colors={colors}
      name={name}
      size={size}
      title={title}
      {...otherProps}
    />
  );
};

export default Avatar;

// Export background patterns
export {
  type BackgroundPattern,
  PATTERN_CATEGORIES,
  PATTERN_NAMES,
  PATTERN_REGISTRY,
} from "./backgrounds";
// Export types and utilities for consumers
export type { AvatarProps, Color, ColorPalette } from "./components/types";
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
} from "./utilities";
