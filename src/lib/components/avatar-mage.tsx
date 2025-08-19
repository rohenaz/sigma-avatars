import * as React from 'react';
import { hashCode, getUnit, getRandomColor } from '../utilities';
import type { AvatarProps } from './types';

const SIZE = 80;

// Helper to pick the darkest color from palette
function getDarkestColor(colors: string[]): string {
  for (const color of colors) {
    if (color.includes('foreground')) return color;
    if (color.includes('dark')) return color;
    if (color.includes('muted')) return color;
  }
  
  const hexColors = colors.filter(c => c.startsWith('#'));
  if (hexColors.length > 0) {
    let darkest = hexColors[0];
    let minBrightness = 255 * 3;
    
    for (const hex of hexColors) {
      if (hex.length === 7) {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        const brightness = r + g + b;
        if (brightness < minBrightness) {
          minBrightness = brightness;
          darkest = hex;
        }
      }
    }
    return darkest;
  }
  
  return colors[0] || '#000000';
}

// Helper to pick eye color - only yellow and white for consistency
function getEyeColor(num: number): string {
  const eyeColors = [
    '#FFFFFF',     // Pure white
    '#FFFF00',     // Pure yellow
    '#FFFFFF',     // Pure white (repeated for more white probability)
    '#FFFF00',     // Pure yellow (repeated for balance)
  ];
  
  return eyeColors[getUnit(num, eyeColors.length)];
}

const AvatarMage = ({ name, colors, title, square, size, ...otherProps }: AvatarProps) => {
  const maskID = React.useId();
  const shadowID = React.useId();
  const num = hashCode(name);
  
  // Deterministic parameters
  const faceColor = getDarkestColor(colors);
  const eyeColor = getEyeColor(num + 17);
  const eyeShape = getUnit(num, 5); // 0=round, 1=slit, 2=diamond, 3=star, 4=oval
  const hatColor = getRandomColor(num + 7, colors, colors.length);
  const hatShape = getUnit(num + 41, 4); // 0=conical, 1=hood, 2=pointed, 3=wide brim
  const tilt = getUnit(num + 13, 31) - 15; // -15 to +15 degrees for hat
  const eyeGlow = getUnit(num + 19, 4); // Eye glow intensity
  const eyeWidth = 4 + getUnit(num + 23, 30) / 10; // 4 to 7 - much larger base size
  const eyeHeight = 5 + getUnit(num + 43, 40) / 10; // 5 to 9 - taller for Vivi-style ovals
  const eyeSpacing = SIZE * (0.12 + getUnit(num + 29, 16) / 100); // 0.12 to 0.28 - reduced by ~20%
  const hatY = -10 + getUnit(num + 31, 25); // Hat vertical position -10 to +15
  const faceY = SIZE * 0.55 + getUnit(num + 37, 20) - 10; // Face vertical position - raised by 5%
  
  // New variation parameters
  const headTilt = getUnit(num + 47, 21) - 10; // -10 to +10 degrees head rotation
  const eyeTilt = getUnit(num + 53, 21) - 10; // -10 to +10 degrees for eye tilt (mirrored)
  const eyeVerticalOffset = getUnit(num + 61, 11) - 5; // -5 to +5 pixels vertical offset between eyes
  const eyeDistanceMultiplier = 0.8 + getUnit(num + 67, 8) / 10; // 0.8 to 1.6x distance variation
  
  // Draw eye based on shape - more organic and mystical
  const drawEye = (cx: number, isLeft: boolean) => {
    const cy = faceY + (isLeft ? -eyeVerticalOffset / 2 : eyeVerticalOffset / 2);
    // Eyes tilt opposite ways for natural symmetry
    const eyeAngle = isLeft ? -eyeTilt : eyeTilt;
    const elements = [];
    
    // Wrap everything in a transform group for eye rotation
    const eyeTransform = `rotate(${eyeAngle} ${cx} ${cy})`;
    
    // Add glow effect for all eyes - larger for Vivi-style
    if (eyeGlow > 0) {
      elements.push(
        <ellipse
          key={`glow-${cx}`}
          cx={cx}
          cy={cy}
          rx={eyeWidth * 1.8}
          ry={eyeHeight * 1.5}
          style={{ 
            fill: eyeColor,
            opacity: 0.3 - (eyeGlow * 0.05),
            filter: 'blur(8px)'
          }}
        />
      );
    }
    
    switch (eyeShape) {
      case 0: // Anime-style sharp eye with hand-drawn curves
        elements.push(
          <path
            key={`eye-${cx}`}
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
            style={{ fill: eyeColor }}
          />
        );
        break;
        
      case 1: // Vertical slit - sleek and minimal
        elements.push(
          <path
            key={`eye-${cx}`}
            d={`M ${cx} ${cy - eyeHeight}
                Q ${cx - eyeWidth * 0.2} ${cy - eyeHeight * 0.5} ${cx - eyeWidth * 0.15} ${cy}
                Q ${cx - eyeWidth * 0.2} ${cy + eyeHeight * 0.5} ${cx} ${cy + eyeHeight}
                Q ${cx + eyeWidth * 0.2} ${cy + eyeHeight * 0.5} ${cx + eyeWidth * 0.15} ${cy}
                Q ${cx + eyeWidth * 0.2} ${cy - eyeHeight * 0.5} ${cx} ${cy - eyeHeight}
                Z`}
            style={{ fill: eyeColor }}
          />
        );
        break;
        
      case 2: // Tsurime (upward slanting anime eye)
        elements.push(
          <path
            key={`eye-${cx}`}
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
            style={{ fill: eyeColor }}
          />
        );
        break;
        
      case 3: // Tareme (downward slanting gentle eye)
        elements.push(
          <path
            key={`eye-${cx}`}
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
            style={{ fill: eyeColor }}
          />
        );
        break;
        
      case 4: // Large oval (Vivi style) - iconic glowing orbs
      default:
        // Main glowing oval
        elements.push(
          <ellipse
            key={`eye-${cx}`}
            cx={cx}
            cy={cy}
            rx={eyeWidth}
            ry={eyeHeight}
            style={{ 
              fill: eyeColor,
              filter: 'brightness(1.2)'
            }}
          />
        );
        // Inner glow gradient effect
        elements.push(
          <ellipse
            key={`inner-glow-${cx}`}
            cx={cx}
            cy={cy}
            rx={eyeWidth * 0.85}
            ry={eyeHeight * 0.85}
            style={{ 
              fill: eyeColor,
              opacity: 0.6,
              filter: 'brightness(1.4)'
            }}
          />
        );
        // Bright center spot
        elements.push(
          <ellipse
            key={`center-${cx}`}
            cx={cx}
            cy={cy - eyeHeight * 0.1}
            rx={eyeWidth * 0.4}
            ry={eyeHeight * 0.5}
            style={{ 
              fill: '#FFFFFF',
              opacity: 0.5
            }}
          />
        );
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
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={size}
      height={size}
      role="img"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      {title && <title>{name}</title>}
      
      <defs>
        {/* Shadow gradient for hat */}
        <radialGradient id={shadowID} cx="50%" cy="30%">
          <stop offset="0%" style={{ stopColor: hatColor, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: hatColor, stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      
      <mask id={maskID} maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
        <rect width={SIZE} height={SIZE} rx={square ? undefined : SIZE * 2} fill="#FFFFFF" />
      </mask>
      
      <g mask={`url(#${maskID})`}>
        {/* Background subtle gradient */}
        <rect 
          width={SIZE} 
          height={SIZE} 
          style={{ fill: colors[0] }}
          opacity={0.08}
        />
        
        {/* Group for head tilt - affects face and eyes */}
        <g transform={`rotate(${headTilt} ${SIZE / 2} ${SIZE / 2})`}>
          {/* Face/head - dark void, much larger and positioned to be cut off */}
          <ellipse
            cx={SIZE / 2}
            cy={faceY + 10}
            rx={SIZE * 0.7}
            ry={SIZE * 0.8}
            style={{ fill: faceColor }}
          />
          
          {/* Eyes - larger and more prominent with variation */}
          {drawEye(SIZE / 2 - eyeSpacing * eyeDistanceMultiplier, true)}
          {drawEye(SIZE / 2 + eyeSpacing * eyeDistanceMultiplier, false)}
        </g>
        
        {/* Hat/cloak variations - extended beyond canvas */}
        {hatShape === 0 && (
          // Conical hat - Raiden style
          <>
            <ellipse
              cx={SIZE / 2}
              cy={hatY + 25}
              rx={SIZE * 1.2}
              ry={SIZE * 0.3}
              style={{ fill: `url(#${shadowID})` }}
              transform={`rotate(${tilt} ${SIZE / 2} ${SIZE / 2})`}
            />
            <path
              d={`M ${-SIZE * 0.5} ${hatY + 20} 
                  Q ${SIZE * 0.5} ${hatY + 15} ${SIZE * 1.5} ${hatY + 20}
                  L ${SIZE * 1.2} ${hatY - 20}
                  Q ${SIZE * 0.5} ${hatY - 15} ${SIZE * -0.2} ${hatY - 20}
                  Z`}
              style={{ fill: hatColor }}
              transform={`rotate(${tilt} ${SIZE / 2} ${SIZE / 2})`}
            />
          </>
        )}
        
        {hatShape === 1 && (
          // Hood/cloak with jagged edge
          <>
            <path
              d={`M ${-SIZE * 0.5} ${hatY + 30}
                  L ${SIZE * 0.1} ${hatY + 25}
                  L ${SIZE * 0.2} ${hatY + 28}
                  L ${SIZE * 0.35} ${hatY + 24}
                  L ${SIZE * 0.5} ${hatY + 26}
                  L ${SIZE * 0.65} ${hatY + 23}
                  L ${SIZE * 0.8} ${hatY + 27}
                  L ${SIZE * 1.5} ${hatY + 30}
                  L ${SIZE * 1.5} ${hatY - 20}
                  Q ${SIZE * 0.5} ${hatY - 25} ${-SIZE * 0.5} ${hatY - 20}
                  Z`}
              style={{ fill: hatColor }}
              transform={`rotate(${tilt} ${SIZE / 2} ${SIZE / 2})`}
            />
            <path
              d={`M ${-SIZE * 0.3} ${hatY + 5}
                  Q ${SIZE * 0.5} ${hatY - 5} ${SIZE * 1.3} ${hatY + 5}`}
              style={{ 
                fill: 'none',
                stroke: faceColor,
                strokeWidth: 1.5,
                opacity: 0.3
              }}
              transform={`rotate(${tilt} ${SIZE / 2} ${SIZE / 2})`}
            />
          </>
        )}
        
        {hatShape === 2 && (
          // Pointed wizard hat edge
          <>
            <path
              d={`M ${-SIZE * 0.5} ${hatY + 25}
                  C ${SIZE * 0.2} ${hatY + 22} ${SIZE * 0.3} ${hatY + 18} ${SIZE * 0.5} ${hatY + 10}
                  C ${SIZE * 0.7} ${hatY + 18} ${SIZE * 0.8} ${hatY + 22} ${SIZE * 1.5} ${hatY + 25}
                  L ${SIZE * 1.5} ${hatY - 20}
                  L ${SIZE * 0.5} ${hatY - 30}
                  L ${-SIZE * 0.5} ${hatY - 20}
                  Z`}
              style={{ fill: hatColor }}
              transform={`rotate(${tilt} ${SIZE / 2} ${SIZE / 2})`}
            />
            {/* Star decoration */}
            <polygon
              points={`${SIZE * 0.5},${hatY + 5} ${SIZE * 0.52},${hatY + 8} ${SIZE * 0.55},${hatY + 5} ${SIZE * 0.52},${hatY + 2} ${SIZE * 0.48},${hatY + 2} ${SIZE * 0.45},${hatY + 5} ${SIZE * 0.48},${hatY + 8}`}
              style={{ fill: eyeColor, opacity: 0.7 }}
              transform={`rotate(${tilt} ${SIZE / 2} ${SIZE / 2})`}
            />
          </>
        )}
        
        {hatShape === 3 && (
          // Wide brim with wavy edge
          <>
            <path
              d={`M ${-SIZE * 0.6} ${hatY + 22}
                  Q ${SIZE * 0} ${hatY + 18} ${SIZE * 0.2} ${hatY + 20}
                  T ${SIZE * 0.5} ${hatY + 18}
                  T ${SIZE * 0.8} ${hatY + 20}
                  Q ${SIZE * 1.0} ${hatY + 18} ${SIZE * 1.6} ${hatY + 22}
                  L ${SIZE * 1.6} ${hatY - 20}
                  Q ${SIZE * 0.5} ${hatY - 15} ${-SIZE * 0.6} ${hatY - 20}
                  Z`}
              style={{ fill: hatColor }}
              transform={`rotate(${tilt} ${SIZE / 2} ${SIZE / 2})`}
            />
            {/* Brim band */}
            <rect
              x={-SIZE * 0.2}
              y={hatY + 12}
              width={SIZE * 1.4}
              height={3}
              style={{ fill: faceColor, opacity: 0.3 }}
              transform={`rotate(${tilt} ${SIZE / 2} ${SIZE / 2})`}
            />
          </>
        )}
      </g>
    </svg>
  );
};

export default AvatarMage;