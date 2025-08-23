import * as React from 'react';
import {
  getUnit,
  getBoolean,
  getRandomColor,
  hashCode,
  generateId,
} from '../utilities';
import type { AvatarProps } from './types';

const SIZE = 80;
const MIN_STRIPE_WIDTH = 1;
const MAX_STRIPE_WIDTH = 8;

function generateBarcode(name: string, colors: string[]) {
  const numFromName = hashCode(name);
  const range = colors && colors.length;
  
  // Determine which colors to use for this barcode (2-5 colors)
  // Use hash to select a subset of colors deterministically
  const colorPattern = Math.abs(numFromName) % 8;
  let activeColors: string[] = [];
  
  switch (colorPattern) {
    case 0: // Use first 2 colors only
      activeColors = [colors[0], colors[1]];
      break;
    case 1: // Use last 2 colors only
      activeColors = [colors[3], colors[4]];
      break;
    case 2: // Use colors 1, 2, 3
      activeColors = [colors[1], colors[2], colors[3]];
      break;
    case 3: // Use colors 0, 2, 4 (alternating)
      activeColors = [colors[0], colors[2], colors[4]];
      break;
    case 4: // Use colors 0, 1, 4
      activeColors = [colors[0], colors[1], colors[4]];
      break;
    case 5: // Use all 5 colors
      activeColors = colors;
      break;
    case 6: // Use middle 3 colors
      activeColors = [colors[1], colors[2], colors[3]];
      break;
    case 7: // Use colors 0, 3, 4
      activeColors = [colors[0], colors[3], colors[4]];
      break;
    default:
      activeColors = [colors[0], colors[1]];
  }
  
  // Determine if we should use alternating pattern or random pattern
  const useAlternating = getBoolean(numFromName, 2);
  
  // Generate deterministic stripe widths and colors
  const stripes: Array<{ x: number; width: number; color: string }> = [];
  let currentX = 0;
  let stripeIndex = 0;
  
  // Keep generating stripes until we fill the width
  while (currentX < SIZE) {
    // Use different parts of the hash for different properties
    const widthSeed = numFromName + (stripeIndex * 997); // Prime number for better distribution
    const colorSeed = numFromName + (stripeIndex * 1009); // Different prime
    
    // Calculate stripe width (between MIN and MAX)
    let stripeWidth;
    if (stripeIndex % 3 === 0) {
      // Every third stripe can be wider for variety
      stripeWidth = MIN_STRIPE_WIDTH + 
        (Math.abs(widthSeed) % (MAX_STRIPE_WIDTH * 2 - MIN_STRIPE_WIDTH));
    } else {
      stripeWidth = MIN_STRIPE_WIDTH + 
        (Math.abs(widthSeed) % (MAX_STRIPE_WIDTH - MIN_STRIPE_WIDTH));
    }
    
    // Don't let the last stripe exceed the boundary
    const finalWidth = Math.min(stripeWidth, SIZE - currentX);
    
    // Get color for this stripe
    let stripeColor;
    if (useAlternating) {
      // Alternate between two colors for a classic barcode look
      stripeColor = activeColors[stripeIndex % 2];
    } else {
      // Pick from the active color palette
      stripeColor = activeColors[Math.abs(colorSeed) % activeColors.length];
    }
    
    // Only add stripe if it's different from the previous one
    const lastStripe = stripes[stripes.length - 1];
    if (!lastStripe || lastStripe.color !== stripeColor) {
      stripes.push({
        x: currentX,
        width: finalWidth,
        color: stripeColor,
      });
    } else if (lastStripe) {
      // Merge with previous stripe if same color
      lastStripe.width += finalWidth;
    }
    
    currentX += finalWidth;
    stripeIndex++;
  }
  
  // Determine background color (should contrast with the stripes)
  // Use a color that's not heavily used in stripes
  const stripeCounts = new Map<string, number>();
  stripes.forEach(stripe => {
    stripeCounts.set(stripe.color, (stripeCounts.get(stripe.color) || 0) + stripe.width);
  });
  
  // Find the least used color for background
  let backgroundColor = colors[0];
  let minUsage = Infinity;
  activeColors.forEach(color => {
    const usage = stripeCounts.get(color) || 0;
    if (usage < minUsage) {
      minUsage = usage;
      backgroundColor = color;
    }
  });
  
  return { stripes, backgroundColor, activeColors };
}

const AvatarBarcode = ({
  name,
  colors,
  title,
  square,
  size,
  ...otherProps
}: AvatarProps) => {
  const { stripes, backgroundColor } = generateBarcode(name, colors);
  const maskID = generateId(name, 'mask');

  return (
    <svg
      fill="none"
      height={size}
      role="img"
      viewBox={'0 0 ' + SIZE + ' ' + SIZE}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      {title && <title>{name}</title>}
      <mask
        height={SIZE}
        id={maskID}
        maskUnits="userSpaceOnUse"
        width={SIZE}
        x={0}
        y={0}
      >
        <rect
          fill="#FFFFFF"
          height={SIZE}
          rx={square ? undefined : SIZE * 2}
          width={SIZE}
        />
      </mask>
      <g mask={`url(#${maskID})`}>
        {/* Background */}
        <rect
          height={SIZE}
          width={SIZE}
          fill={backgroundColor}
        />
        {/* Barcode stripes */}
        {stripes.map((stripe, index) => (
          <rect
            key={index}
            x={stripe.x}
            y={0}
            width={stripe.width}
            height={SIZE}
            fill={stripe.color}
          />
        ))}
      </g>
    </svg>
  );
};

export default AvatarBarcode;