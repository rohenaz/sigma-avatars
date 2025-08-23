import * as React from 'react';
import { generateId, getRandomColor, getUnit, hashCode } from '../utilities';
import { ALL_PATTERNS, selectPattern, renderBackground } from '../backgrounds';
import type { AvatarProps } from './types';

const SIZE = 80;


// Color helpers for anime-style shading
function hexToRgb(hex: string) {
  const c = hex.replace('#', '');
  const r = Number.parseInt(c.slice(0, 2), 16);
  const g = Number.parseInt(c.slice(2, 4), 16);
  const b = Number.parseInt(c.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function darken(hex: string, amount = 0.2) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

// Helper to pick eye color - white, yellow, or bright colors from palette
function getEyeColor(num: number, colors: string[]): string {
  // Check if palette has bright colors (hex colors with high luminance)
  const brightColors = colors.filter((c) => {
    if (!c.startsWith('#') || c.length !== 7) return false;
    const r = Number.parseInt(c.substring(1, 3), 16);
    const g = Number.parseInt(c.substring(3, 5), 16);
    const b = Number.parseInt(c.substring(5, 7), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 180; // Only bright colors
  });

  const eyeColors = [
    '#FFFFFF', // Pure white
    '#FFFF00', // Pure yellow
    '#FFFFFF', // Pure white (repeated for more white probability)
    '#FFFF00', // Pure yellow (repeated for balance)
    ...brightColors.slice(0, 2), // Add up to 2 bright colors from palette
  ];

  return eyeColors[getUnit(num, eyeColors.length)];
}

const AvatarMage = ({
  name,
  colors,
  title,
  size,
  ...otherProps
}: AvatarProps) => {
  const maskID = generateId(name, 'mask');
  const filterID = generateId(name, 'filter');
  const patternID = generateId(name, 'pattern');
  const num = hashCode(name);

  // Deterministic parameters
  const faceColor = '#000000'; // Always black/shadow for mage face
  const eyeColor = getEyeColor(num + 17, colors);
  const needsPupil = eyeColor === '#FFFFFF'; // Only white eyes get pupils
  const eyeShape = getUnit(num, 5); // 0=round, 1=slit, 2=diamond, 3=star, 4=oval

  // Base neutral hat colors
  const baseHatColors = [
    '#2C2416', // Dark brown
    '#1A1A1A', // Near black
    '#3D3D3D', // Dark gray
    '#2B2B2B', // Charcoal
    '#4A3C28', // Dark tan
    '#1F1F1F', // Off black
  ];
  const baseHatColor = baseHatColors[getUnit(num + 7, baseHatColors.length)];
  const tintColor = getRandomColor(num + 11, colors, colors.length);
  const hatShape = 5; // force classic wide-brim mage hat for consistent silhouette
  const tilt = getUnit(num + 13, 31) - 15; // -15 to +15 degrees for hat
  const eyeGlow = getUnit(num + 19, 4); // Eye glow intensity

  // Reduce head size significantly and move face lower for "peeking" effect
  const headScale = 0.65 + getUnit(num + 85, 15) / 100; // 0.65 .. 0.80 (much smaller)
  const faceRx = SIZE * 0.6 * headScale; // Narrower face
  const faceRy = SIZE * 0.7 * headScale; // Shorter face

  // Calculate eye spacing first
  const eyeSpacing = SIZE * (0.12 + getUnit(num + 29, 16) / 100); // 0.12 to 0.28 - reduced by ~20%

  // Rare chance (15%) for extra large eyes - but only if eyes are far apart
  const canHaveLargeEyes = eyeSpacing > SIZE * 0.18; // Only allow large eyes if spacing > 0.18
  const hasLargeEyes = canHaveLargeEyes && getUnit(num + 79, 100) < 15;

  // Scale eyes based on spacing to prevent overlap
  const spacingMultiplier = Math.min(
    1.2,
    Math.max(0.7, eyeSpacing / (SIZE * 0.15))
  ); // Scale between 0.7-1.2 based on spacing
  const eyeSizeMultiplier = (hasLargeEyes ? 1.5 : 1.0) * spacingMultiplier;

  // Base eye size from seed
  const baseEyeWidth = (7 + getUnit(num + 23, 20) / 10) * eyeSizeMultiplier;
  const baseEyeHeight = (7 + getUnit(num + 43, 30) / 10) * eyeSizeMultiplier;

  // Correlate eye size with head size; enforce minimums relative to head
  const minEyeWidth = faceRx * 0.11; // at least ~11% of head half-width
  const minEyeHeight = faceRy * 0.08; // at least ~8% of head half-height
  const maxEyeWidth = faceRx * 0.22; // cap to avoid oversized eyes
  const maxEyeHeight = faceRy * 0.18;
  const eyeWidth = Math.max(minEyeWidth, Math.min(baseEyeWidth, maxEyeWidth));
  const eyeHeight = Math.max(
    minEyeHeight,
    Math.min(baseEyeHeight, maxEyeHeight)
  );
  // Position face much lower to create "peeking over the edge" effect
  const faceY = SIZE * 0.65 + getUnit(num + 37, 8); // Face positioned in lower portion of avatar

  // New variation parameters
  const headTilt = getUnit(num + 47, 21) - 10; // -10 to +10 degrees head rotation
  const eyeTilt = getUnit(num + 53, 21) - 10; // -10 to +10 degrees for eye tilt (mirrored)
  const eyeVerticalOffset = getUnit(num + 61, 11) - 5; // -5 to +5 pixels vertical offset between eyes
  const eyeDistanceMultiplier = 0.8 + getUnit(num + 67, 8) / 10; // 0.8 to 1.6x distance variation
  // Keep spacing proportionate to head scale so small heads don't look too wide-set
  const spacingScaled = eyeSpacing * eyeDistanceMultiplier * headScale;

  // Mouth parameters - 40% chance to show small mouth
  const showMouth = getUnit(num + 71, 10) < 4; // 40% chance
  const mouthY = faceY + SIZE * 0.15; // Below eyes
  const mouthWidth = SIZE * (0.06 + getUnit(num + 73, 4) / 100); // 0.06 to 0.10 - small width

  // Collar parameters - 30% chance to show collar
  const showCollar = getUnit(num + 131, 10) < 3; // 30% chance
  const collarColor = getRandomColor(num + 133, colors, colors.length);


  // Draw eye based on shape - more organic and mystical
  const drawEye = (cx: number, isLeft: boolean) => {
    const cy =
      faceY + (isLeft ? -eyeVerticalOffset / 2 : eyeVerticalOffset / 2);
    // Eyes tilt opposite ways for natural symmetry
    const eyeAngle = isLeft ? -eyeTilt : eyeTilt;
    const elements = [];

    // Wrap everything in a transform group for eye rotation
    const eyeTransform = `rotate(${eyeAngle} ${cx} ${cy})`;

    // Add glow effect for all eyes - larger for Vivi-style
    if (eyeGlow > 0) {
      elements.push(
        <ellipse
          cx={cx}
          cy={cy}
          key={`glow-${cx}`}
          rx={eyeWidth * 1.8}
          ry={eyeHeight * 1.5}
          style={{
            fill: eyeColor,
            opacity: 0.3 - eyeGlow * 0.05,
            filter: 'blur(8px)',
          }}
        />
      );
    }

    switch (eyeShape) {
      case 0: // Anime-style sharp eye with hand-drawn curves
        elements.push(
          <path
            d={`M ${cx - eyeWidth} ${cy}
                C ${cx - eyeWidth * 0.8} ${cy - eyeHeight * 0.9} 
                  ${cx + eyeWidth * 0.4} ${cy - eyeHeight * 1.1}
                  ${cx + eyeWidth} ${cy - eyeHeight * 0.2}
                S ${cx + eyeWidth * 0.9} ${cy + eyeHeight * 0.6}
                  ${cx + eyeWidth * 0.3} ${cy + eyeHeight * 0.4}
                C ${cx - eyeWidth * 0.2} ${cy + eyeHeight * 0.3}
                  ${cx - eyeWidth * 0.7} ${cy + eyeHeight * 0.1}
                  ${cx - eyeWidth} ${cy}
                Z`}
            key={`eye-${cx}`}
            style={{ fill: eyeColor }}
          />
        );
        // Add pupil for white eyes - positioned toward upper part
        if (needsPupil) {
          elements.push(
            <ellipse
              cx={cx + eyeWidth * 0.1}
              cy={cy - eyeHeight * 0.2}
              key={`pupil-${cx}`}
              rx={eyeWidth * 0.25}
              ry={eyeHeight * 0.3}
              style={{ fill: '#000000' }}
            />
          );
        }
        break;

      case 1: // Vertical slit - sleek and minimal with reasonable width
        elements.push(
          <path
            d={`M ${cx} ${cy - eyeHeight}
                Q ${cx - eyeWidth * 0.35} ${cy - eyeHeight * 0.5} ${cx - eyeWidth * 0.3} ${cy}
                Q ${cx - eyeWidth * 0.35} ${cy + eyeHeight * 0.5} ${cx} ${cy + eyeHeight}
                Q ${cx + eyeWidth * 0.35} ${cy + eyeHeight * 0.5} ${cx + eyeWidth * 0.3} ${cy}
                Q ${cx + eyeWidth * 0.35} ${cy - eyeHeight * 0.5} ${cx} ${cy - eyeHeight}
                Z`}
            key={`eye-${cx}`}
            style={{ fill: eyeColor }}
          />
        );
        // Add vertical pupil for white eyes
        if (needsPupil) {
          elements.push(
            <ellipse
              cx={cx}
              cy={cy}
              key={`pupil-${cx}`}
              rx={eyeWidth * 0.15}
              ry={eyeHeight * 0.4}
              style={{ fill: '#000000' }}
            />
          );
        }
        break;

      case 2: // Tsurime (upward slanting anime eye)
        elements.push(
          <path
            d={`M ${cx - eyeWidth} ${cy + eyeHeight * 0.3}
                C ${cx - eyeWidth * 0.5} ${cy - eyeHeight * 0.2}
                  ${cx} ${cy - eyeHeight * 0.8}
                  ${cx + eyeWidth * 0.7} ${cy - eyeHeight}
                C ${cx + eyeWidth} ${cy - eyeHeight * 0.7}
                  ${cx + eyeWidth * 0.9} ${cy - eyeHeight * 0.3}
                  ${cx + eyeWidth * 0.6} ${cy}
                C ${cx + eyeWidth * 0.3} ${cy + eyeHeight * 0.2}
                  ${cx} ${cy + eyeHeight * 0.4}
                  ${cx - eyeWidth * 0.5} ${cy + eyeHeight * 0.35}
                Q ${cx - eyeWidth * 0.8} ${cy + eyeHeight * 0.32}
                  ${cx - eyeWidth} ${cy + eyeHeight * 0.3}
                Z`}
            key={`eye-${cx}`}
            style={{ fill: eyeColor }}
          />
        );
        break;

      case 3: // Tareme (downward slanting gentle eye)
        elements.push(
          <path
            d={`M ${cx - eyeWidth * 0.8} ${cy - eyeHeight * 0.6}
                C ${cx - eyeWidth * 0.3} ${cy - eyeHeight * 0.8}
                  ${cx + eyeWidth * 0.2} ${cy - eyeHeight * 0.7}
                  ${cx + eyeWidth * 0.8} ${cy - eyeHeight * 0.3}
                C ${cx + eyeWidth} ${cy - eyeHeight * 0.1}
                  ${cx + eyeWidth * 0.95} ${cy + eyeHeight * 0.3}
                  ${cx + eyeWidth * 0.5} ${cy + eyeHeight * 0.5}
                C ${cx} ${cy + eyeHeight * 0.6}
                  ${cx - eyeWidth * 0.4} ${cy + eyeHeight * 0.5}
                  ${cx - eyeWidth * 0.7} ${cy + eyeHeight * 0.2}
                Q ${cx - eyeWidth * 0.85} ${cy}
                  ${cx - eyeWidth * 0.8} ${cy - eyeHeight * 0.6}
                Z`}
            key={`eye-${cx}`}
            style={{ fill: eyeColor }}
          />
        );
        break;

      case 4: // Large oval (Vivi style) - iconic glowing orbs, portrait orientation
      default:
        // Main glowing oval - portrait oriented (taller than wide)
        elements.push(
          <ellipse
            cx={cx}
            cy={cy}
            key={`eye-${cx}`}
            rx={eyeWidth * 0.7} // Narrower width
            ry={eyeHeight} // Full height
            style={{
              fill: eyeColor,
              filter: 'brightness(1.2)',
            }}
          />
        );
        // Inner glow gradient effect
        elements.push(
          <ellipse
            cx={cx}
            cy={cy}
            key={`inner-glow-${cx}`}
            rx={eyeWidth * 0.6} // Narrower width
            ry={eyeHeight * 0.85}
            style={{
              fill: eyeColor,
              opacity: 0.6,
              filter: 'brightness(1.4)',
            }}
          />
        );

        if (needsPupil) {
          // Add pupil for white Vivi eyes - larger and centered
          elements.push(
            <ellipse
              cx={cx}
              cy={cy}
              key={`pupil-${cx}`}
              rx={eyeWidth * 0.3}
              ry={eyeHeight * 0.35}
              style={{ fill: '#000000' }}
            />
          );
        } else {
          // Bright center spot for colored eyes
          elements.push(
            <ellipse
              cx={cx}
              cy={cy - eyeHeight * 0.1}
              key={`center-${cx}`}
              rx={eyeWidth * 0.3} // Narrower width
              ry={eyeHeight * 0.5}
              style={{
                fill: '#FFFFFF',
                opacity: 0.5,
              }}
            />
          );
        }
        break;
    }

    // Return all elements wrapped in a group with the eye rotation
    return (
      <g key={`eye-group-${cx}`} transform={eyeTransform}>
        {elements}
      </g>
    );
  };


  return (
    <svg
      fill="none"
      height={size}
      role="img"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      {title && <title>{name}</title>}

      {/* No gradients needed */}

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
          
          width={SIZE}
        />
      </mask>

      <g mask={`url(#${maskID})`}>
        {/* Solid fallback background from palette - always visible */}
        <rect
          width={SIZE}
          height={SIZE}
          fill={getRandomColor(num * 23, colors, colors.length)}
        />
        
        {/* Pattern overlay - may have transparency */}
        {renderBackground(
          selectPattern(num * 31 + 17, ALL_PATTERNS), // Use deterministic selection
          {
            size: SIZE,
            colors: colors || ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
            seed: num,
            patternId: patternID
          }
        )}

        {/* Collar - at bottom of avatar */}
        {showCollar && (
          <path
            d={`M 0 ${SIZE * 0.75}
                C ${SIZE * 0.1} ${SIZE * 0.7}
                  ${SIZE * 0.2} ${SIZE * 0.68}
                  ${SIZE * 0.5} ${SIZE * 0.65}
                C ${SIZE * 0.8} ${SIZE * 0.68}
                  ${SIZE * 0.9} ${SIZE * 0.7}
                  ${SIZE} ${SIZE * 0.75}
                L ${SIZE} ${SIZE}
                L 0 ${SIZE}
                Z`}
            style={{ fill: collarColor }}
          />
        )}

        {/* Group for head tilt - affects face and eyes */}
        <g transform={`rotate(${headTilt} ${SIZE / 2} ${SIZE / 2})`}>
          {/* Face/head - dark void, positioned to support the eyes */}
          <ellipse
            cx={SIZE / 2}
            cy={faceY + 15}
            rx={faceRx}
            ry={faceRy}
            style={{ fill: faceColor }}
          />

          {/* Eyes - larger and more prominent with variation */}
          {drawEye(SIZE / 2 - spacingScaled, true)}
          {drawEye(SIZE / 2 + spacingScaled, false)}

          {/* Small mouth - just a horizontal line */}
          {showMouth && (
            <line
              style={{
                stroke: eyeColor === '#FFFF00' ? '#FFFFFF' : eyeColor, // Use white if eyes are yellow
                strokeWidth: 1.5,
                opacity: 0.7,
                strokeLinecap: 'round',
              }}
              x1={SIZE / 2 - mouthWidth / 2}
              x2={SIZE / 2 + mouthWidth / 2}
              y1={mouthY}
              y2={mouthY}
            />
          )}
        </g>

        {/* Hat removed per new direction */}
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          id={filterID}
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation={7} />
        </filter>
      </defs>
    </svg>
  );
};

export default AvatarMage;
