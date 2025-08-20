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

// Color helpers for anime-style shading
function hexToRgb(hex: string) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lighten(hex: string, amount = 0.2) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount
  );
}

function darken(hex: string, amount = 0.2) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function mix(a: string, b: string, t = 0.5) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(
    A.r + (B.r - A.r) * t,
    A.g + (B.g - A.g) * t,
    A.b + (B.b - A.b) * t
  );
}

function getAccentColor(seed: number, palette: string[]) {
  // Prefer saturated/brighter colors for accents
  const candidates = palette.filter(c => {
    if (!c.startsWith('#') || c.length !== 7) return false;
    const { r, g, b } = hexToRgb(c);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const lum = 0.299*r + 0.587*g + 0.114*b;
    return sat > 0.3 && lum > 80; // moderately vivid
  });
  const pool = candidates.length ? candidates : palette.filter(p => p.startsWith('#'));
  if (!pool.length) return '#C0A060';
  return pool[getUnit(seed, pool.length)];
}

// Helper to pick eye color - white, yellow, or bright colors from palette
function getEyeColor(num: number, colors: string[]): string {
  // Check if palette has bright colors (hex colors with high luminance)
  const brightColors = colors.filter(c => {
    if (!c.startsWith('#') || c.length !== 7) return false;
    const r = parseInt(c.substring(1, 3), 16);
    const g = parseInt(c.substring(3, 5), 16);
    const b = parseInt(c.substring(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 180; // Only bright colors
  });
  
  const eyeColors = [
    '#FFFFFF',     // Pure white
    '#FFFF00',     // Pure yellow
    '#FFFFFF',     // Pure white (repeated for more white probability)
    '#FFFF00',     // Pure yellow (repeated for balance)
    ...brightColors.slice(0, 2) // Add up to 2 bright colors from palette
  ];
  
  return eyeColors[getUnit(num, eyeColors.length)];
}

const AvatarMage = ({ name, colors, title, square, size, ...otherProps }: AvatarProps) => {
  const maskID = React.useId();
  const shadowID = React.useId();
  const hatGradientID = React.useId();
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
  const hatShape = getUnit(num + 41, 6); // 0-5: 6 anime hat variants
  const tilt = getUnit(num + 13, 31) - 15; // -15 to +15 degrees for hat
  const eyeGlow = getUnit(num + 19, 4); // Eye glow intensity
  
  // Calculate eye spacing first
  const eyeSpacing = SIZE * (0.12 + getUnit(num + 29, 16) / 100); // 0.12 to 0.28 - reduced by ~20%
  
  // Rare chance (15%) for extra large eyes - but only if eyes are far apart
  const canHaveLargeEyes = eyeSpacing > SIZE * 0.18; // Only allow large eyes if spacing > 0.18
  const hasLargeEyes = canHaveLargeEyes && getUnit(num + 79, 100) < 15;
  
  // Scale eyes based on spacing to prevent overlap
  const spacingMultiplier = Math.min(1.2, Math.max(0.7, eyeSpacing / (SIZE * 0.15))); // Scale between 0.7-1.2 based on spacing
  const eyeSizeMultiplier = (hasLargeEyes ? 1.5 : 1.0) * spacingMultiplier;
  
  const eyeWidth = (7 + getUnit(num + 23, 20) / 10) * eyeSizeMultiplier; // 7-9 base, scaled by spacing
  const eyeHeight = (7 + getUnit(num + 43, 30) / 10) * eyeSizeMultiplier; // 7-10 base, scaled by spacing
  const hatY = 0 + getUnit(num + 31, 20); // Hat vertical position 0 to +20 (lowered)
  // Eyes should be positioned relative to hat brim so they peek from underneath
  const faceY = hatY + 32 + getUnit(num + 37, 8); // Position eyes just below hat brim with small variation (lowered)
  
  // New variation parameters
  const headTilt = getUnit(num + 47, 21) - 10; // -10 to +10 degrees head rotation
  const eyeTilt = getUnit(num + 53, 21) - 10; // -10 to +10 degrees for eye tilt (mirrored)
  const eyeVerticalOffset = getUnit(num + 61, 11) - 5; // -5 to +5 pixels vertical offset between eyes
  const eyeDistanceMultiplier = 0.8 + getUnit(num + 67, 8) / 10; // 0.8 to 1.6x distance variation
  
  // Mouth parameters - 40% chance to show small mouth
  const showMouth = getUnit(num + 71, 10) < 4; // 40% chance
  const mouthY = faceY + SIZE * 0.15; // Below eyes
  const mouthWidth = SIZE * (0.06 + getUnit(num + 73, 4) / 100); // 0.06 to 0.10 - small width
  
  // Collar parameters - 30% chance to show collar
  const showCollar = getUnit(num + 131, 10) < 3; // 30% chance
  const collarColor = getRandomColor(num + 133, colors, colors.length);
  
  // Anime accessories
  const hasStarBand = getUnit(num + 145, 100) < 35;
  const hasFeather = getUnit(num + 149, 100) < 25;
  const hasMoonCharm = getUnit(num + 151, 100) < 30;
  const hasVeil = getUnit(num + 153, 100) < 30;
  const hasOfuda = getUnit(num + 155, 100) < 50; // on straw or onmyoji styles
  const showSigil = getUnit(num + 311, 100) < 22; // magic circle background
  
  // Anime color setup
  const darkest = getDarkestColor(colors);
  const outlineColor = darkest || '#1A1A1A';
  const accent = getAccentColor(num + 223, colors);
  const hatBase = baseHatColor;
  const hatHighlight = lighten(mix(hatBase, '#FFFFFF', 0.18), 0.05);
  const hatShadow = darken(hatBase, 0.35);
  const bandColor = mix(accent, '#000000', 0.15);
  const sigilColor = mix(accent, '#FFFFFF', 0.5);
  
  // Cel-shading light setup
  const lightAngle = -35; // degrees, top-left light
  const gradSize = SIZE;
  const gx1 = SIZE/2 + Math.cos((lightAngle*Math.PI)/180) * gradSize;
  const gy1 = SIZE/2 + Math.sin((lightAngle*Math.PI)/180) * gradSize;
  const gx2 = SIZE/2 - Math.cos((lightAngle*Math.PI)/180) * gradSize;
  const gy2 = SIZE/2 - Math.sin((lightAngle*Math.PI)/180) * gradSize;
  
  // Outline style for anime look
  const outline = {
    stroke: outlineColor,
    strokeWidth: Math.max(1.4, SIZE * 0.018),
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const
  };
  
  // Helper to draw ofuda talisman (paper tag)
  const drawOfuda = (x: number, y: number, rot: number) => (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <rect x={x - 4} y={y} width={8} height={18} rx={1} fill="#F6E6C8" style={outline} />
      {/* Runic strokes */}
      <path d={`M ${x} ${y+2} L ${x} ${y+16}`} stroke={outlineColor} strokeWidth="1.2" strokeLinecap="round" />
      <path d={`M ${x-2} ${y+5} Q ${x} ${y+8} ${x+2} ${y+6}`} stroke={outlineColor} strokeWidth="0.9" fill="none" />
    </g>
  );
  
  // Helper to draw crescent moon charm
  const drawMoon = (cx: number, cy: number, r: number, color = '#F8E28E') => (
    <path
      d={`M ${cx} ${cy}
          m ${-r},0
          a ${r},${r} 0 1,0 ${2*r},0
          a ${r-2},${r-2} 0 1,1 ${-2*(r-2)},0`}
      fill={color}
      style={outline}
    />
  );
  
  // Main hat drawing function with 6 anime-inspired variants
  const drawHat = (shape: number, y: number, tilt: number, base: string, highlight: string, shadow: string, band: string, outline: any, seed: number, accessories: any) => {
    const elements = [];
    const transform = `rotate(${tilt} ${SIZE / 2} ${SIZE / 2})`;
    
    switch (shape) {
      case 0: // Straw Kasa (rice hat) - wide, shallow conical
        elements.push(
          <g key="kasa" transform={transform}>
            {/* Hat shadow */}
            <ellipse cx={SIZE/2} cy={y + 28} rx={SIZE * 0.7} ry={SIZE * 0.1} fill={shadow} opacity={0.3} />
            
            {/* Main cone with organic brim curve */}
            <path
              d={`M ${SIZE * 0.1} ${y + 26}
                  Q ${SIZE * 0.2} ${y + 23} ${SIZE * 0.3} ${y + 21}
                  T ${SIZE * 0.5} ${y + 18}
                  T ${SIZE * 0.7} ${y + 21}
                  Q ${SIZE * 0.8} ${y + 23} ${SIZE * 0.9} ${y + 26}
                  Q ${SIZE * 0.85} ${y + 22} ${SIZE * 0.8} ${y + 15}
                  C ${SIZE * 0.7} ${y + 8} ${SIZE * 0.6} ${y + 2} ${SIZE * 0.5} ${y}
                  C ${SIZE * 0.4} ${y + 2} ${SIZE * 0.3} ${y + 8} ${SIZE * 0.2} ${y + 15}
                  Q ${SIZE * 0.15} ${y + 22} ${SIZE * 0.1} ${y + 26}
                  Z`}
              fill={`url(#${hatGradientID})`}
              style={outline}
            />
            
            {/* Highlight ridge */}
            <path
              d={`M ${SIZE * 0.3} ${y + 19}
                  Q ${SIZE * 0.4} ${y + 16} ${SIZE * 0.5} ${y + 15}
                  Q ${SIZE * 0.6} ${y + 16} ${SIZE * 0.7} ${y + 19}`}
              stroke={highlight}
              strokeWidth={1.5}
              fill="none"
              opacity={0.7}
            />
            
            {hasOfuda && drawOfuda(SIZE * 0.75, y + 20, 15)}
          </g>
        );
        break;
        
      case 1: // Eboshi (court cap) - tall, curved elegance
        elements.push(
          <g key="eboshi" transform={transform}>
            <path
              d={`M ${SIZE * 0.25} ${y + 25}
                  C ${SIZE * 0.3} ${y + 22} ${SIZE * 0.4} ${y + 18} ${SIZE * 0.45} ${y + 12}
                  C ${SIZE * 0.48} ${y + 5} ${SIZE * 0.52} ${y - 2} ${SIZE * 0.58} ${y - 8}
                  C ${SIZE * 0.6} ${y - 5} ${SIZE * 0.62} ${y + 3} ${SIZE * 0.65} ${y + 12}
                  C ${SIZE * 0.7} ${y + 18} ${SIZE * 0.8} ${y + 22} ${SIZE * 0.85} ${y + 25}
                  Q ${SIZE * 0.75} ${y + 20} ${SIZE * 0.65} ${y + 15}
                  Q ${SIZE * 0.55} ${y + 12} ${SIZE * 0.45} ${y + 15}
                  Q ${SIZE * 0.35} ${y + 20} ${SIZE * 0.25} ${y + 25}
                  Z`}
              fill={base}
              style={outline}
            />
            
            {/* Cel-shaded highlight */}
            <path
              d={`M ${SIZE * 0.45} ${y + 12}
                  C ${SIZE * 0.48} ${y + 6} ${SIZE * 0.52} ${y} ${SIZE * 0.58} ${y - 6}
                  C ${SIZE * 0.56} ${y - 3} ${SIZE * 0.54} ${y + 3} ${SIZE * 0.52} ${y + 9}`}
              fill={highlight}
              opacity={0.6}
            />
            
            {hasStarBand && (
              <circle cx={SIZE * 0.55} cy={y + 8} r={3} fill={band} style={outline} />
            )}
          </g>
        );
        break;
        
      case 2: // Floppy Witch Hat - drooping pointed with personality
        elements.push(
          <g key="witch" transform={transform}>
            {/* Wide brim */}
            <ellipse
              cx={SIZE/2}
              cy={y + 26}
              rx={SIZE * 0.35}
              ry={SIZE * 0.08}
              fill={shadow}
              style={outline}
            />
            
            {/* Main cone with organic droop */}
            <path
              d={`M ${SIZE * 0.35} ${y + 24}
                  C ${SIZE * 0.4} ${y + 20} ${SIZE * 0.45} ${y + 15} ${SIZE * 0.48} ${y + 8}
                  C ${SIZE * 0.49} ${y} ${SIZE * 0.51} ${y - 8} ${SIZE * 0.55} ${y - 15}
                  C ${SIZE * 0.6} ${y - 20} ${SIZE * 0.7} ${y - 22} ${SIZE * 0.8} ${y - 18}
                  C ${SIZE * 0.75} ${y - 15} ${SIZE * 0.65} ${y - 12} ${SIZE * 0.58} ${y - 8}
                  C ${SIZE * 0.55} ${y} ${SIZE * 0.52} ${y + 8} ${SIZE * 0.5} ${y + 15}
                  C ${SIZE * 0.48} ${y + 20} ${SIZE * 0.42} ${y + 24} ${SIZE * 0.35} ${y + 24}
                  Z`}
              fill={base}
              style={outline}
            />
            
            {/* Cel-shaded highlight */}
            <path
              d={`M ${SIZE * 0.46} ${y + 15}
                  C ${SIZE * 0.47} ${y + 8} ${SIZE * 0.48} ${y} ${SIZE * 0.5} ${y - 8}
                  C ${SIZE * 0.49} ${y - 5} ${SIZE * 0.48} ${y + 2} ${SIZE * 0.47} ${y + 10}`}
              fill={highlight}
              opacity={0.5}
            />
            
            {hasMoonCharm && drawMoon(SIZE * 0.4, y + 18, 2.5, sigilColor)}
          </g>
        );
        break;
        
      case 3: // Wide Brim with Veil - mysterious fortune teller
        elements.push(
          <g key="veil" transform={transform}>
            {/* Wide curved brim */}
            <path
              d={`M ${SIZE * 0.1} ${y + 24}
                  Q ${SIZE * 0.2} ${y + 26} ${SIZE * 0.3} ${y + 25}
                  T ${SIZE * 0.5} ${y + 23}
                  T ${SIZE * 0.7} ${y + 25}
                  Q ${SIZE * 0.8} ${y + 26} ${SIZE * 0.9} ${y + 24}
                  Q ${SIZE * 0.85} ${y + 20} ${SIZE * 0.8} ${y + 15}
                  C ${SIZE * 0.7} ${y + 8} ${SIZE * 0.6} ${y + 3} ${SIZE * 0.5} ${y + 1}
                  C ${SIZE * 0.4} ${y + 3} ${SIZE * 0.3} ${y + 8} ${SIZE * 0.2} ${y + 15}
                  Q ${SIZE * 0.15} ${y + 20} ${SIZE * 0.1} ${y + 24}
                  Z`}
              fill={base}
              style={outline}
            />
            
            {/* Cel-shaded crown highlight */}
            <ellipse
              cx={SIZE/2}
              cy={y + 12}
              rx={SIZE * 0.15}
              ry={SIZE * 0.08}
              fill={highlight}
              opacity={0.6}
            />
            
            {hasVeil && (
              <path
                d={`M ${SIZE * 0.3} ${y + 25}
                    Q ${SIZE * 0.25} ${y + 35} ${SIZE * 0.2} ${y + 45}
                    Q ${SIZE * 0.3} ${y + 50} ${SIZE * 0.4} ${y + 48}
                    Q ${SIZE * 0.35} ${y + 38} ${SIZE * 0.3} ${y + 25}
                    Z
                    M ${SIZE * 0.7} ${y + 25}
                    Q ${SIZE * 0.75} ${y + 35} ${SIZE * 0.8} ${y + 45}
                    Q ${SIZE * 0.7} ${y + 50} ${SIZE * 0.6} ${y + 48}
                    Q ${SIZE * 0.65} ${y + 38} ${SIZE * 0.7} ${y + 25}
                    Z`}
                fill={base}
                opacity={0.4}
                style={outline}
              />
            )}
          </g>
        );
        break;
        
      case 4: // Cloak Hood - mysterious and enveloping
        elements.push(
          <g key="hood" transform={transform}>
            <path
              d={`M 0 ${y + 30}
                  C ${SIZE * 0.05} ${y + 25} ${SIZE * 0.15} ${y + 20} ${SIZE * 0.3} ${y + 15}
                  C ${SIZE * 0.4} ${y + 8} ${SIZE * 0.45} ${y} ${SIZE * 0.5} ${y - 5}
                  C ${SIZE * 0.55} ${y} ${SIZE * 0.6} ${y + 8} ${SIZE * 0.7} ${y + 15}
                  C ${SIZE * 0.85} ${y + 20} ${SIZE * 0.95} ${y + 25} ${SIZE} ${y + 30}
                  L ${SIZE} ${y - 10}
                  Q ${SIZE * 0.5} ${y - 15} 0 ${y - 10}
                  Z`}
              fill={base}
              style={outline}
            />
            
            {/* Inner shadow for depth */}
            <path
              d={`M ${SIZE * 0.2} ${y + 25}
                  C ${SIZE * 0.3} ${y + 20} ${SIZE * 0.4} ${y + 15} ${SIZE * 0.5} ${y + 12}
                  C ${SIZE * 0.6} ${y + 15} ${SIZE * 0.7} ${y + 20} ${SIZE * 0.8} ${y + 25}`}
              fill={shadow}
              opacity={0.3}
            />
            
            {hasFeather && (
              <path
                d={`M ${SIZE * 0.35} ${y + 15}
                    Q ${SIZE * 0.32} ${y + 10} ${SIZE * 0.3} ${y + 5}
                    Q ${SIZE * 0.33} ${y + 8} ${SIZE * 0.36} ${y + 12}`}
                stroke={accent}
                strokeWidth={2}
                fill="none"
                style={outline}
              />
            )}
          </g>
        );
        break;
        
      case 5: // Black Mage Style - iconic Final Fantasy inspired
      default:
        elements.push(
          <g key="black-mage" transform={transform}>
            {/* Wide shadowing brim */}
            <ellipse
              cx={SIZE/2}
              cy={y + 28}
              rx={SIZE * 0.4}
              ry={SIZE * 0.1}
              fill={shadow}
              style={outline}
            />
            
            {/* Tall pointed cone */}
            <path
              d={`M ${SIZE * 0.3} ${y + 26}
                  C ${SIZE * 0.35} ${y + 22} ${SIZE * 0.4} ${y + 18} ${SIZE * 0.45} ${y + 12}
                  C ${SIZE * 0.47} ${y + 5} ${SIZE * 0.49} ${y - 5} ${SIZE * 0.5} ${y - 12}
                  C ${SIZE * 0.51} ${y - 5} ${SIZE * 0.53} ${y + 5} ${SIZE * 0.55} ${y + 12}
                  C ${SIZE * 0.6} ${y + 18} ${SIZE * 0.65} ${y + 22} ${SIZE * 0.7} ${y + 26}
                  L ${SIZE * 0.65} ${y + 24}
                  C ${SIZE * 0.6} ${y + 20} ${SIZE * 0.55} ${y + 15} ${SIZE * 0.52} ${y + 8}
                  C ${SIZE * 0.51} ${y + 2} ${SIZE * 0.5} ${y - 8} ${SIZE * 0.49} ${y + 2}
                  C ${SIZE * 0.48} ${y + 8} ${SIZE * 0.45} ${y + 15} ${SIZE * 0.4} ${y + 20}
                  L ${SIZE * 0.35} ${y + 24}
                  Z`}
              fill={base}
              style={outline}
            />
            
            {/* Classic yellow/gold band */}
            <rect
              x={SIZE * 0.35}
              y={y + 18}
              width={SIZE * 0.3}
              height={4}
              fill={band}
              style={outline}
            />
            
            {hasStarBand && (
              <polygon
                points={`${SIZE * 0.5},${y + 16} ${SIZE * 0.52},${y + 20} ${SIZE * 0.56},${y + 20} ${SIZE * 0.53},${y + 22} ${SIZE * 0.54},${y + 26} ${SIZE * 0.5},${y + 24} ${SIZE * 0.46},${y + 26} ${SIZE * 0.47},${y + 22} ${SIZE * 0.44},${y + 20} ${SIZE * 0.48},${y + 20}`}
                fill={sigilColor}
                style={outline}
              />
            )}
          </g>
        );
        break;
    }
    
    return elements;
  };
  
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
        // Add pupil for white eyes - positioned toward upper part
        if (needsPupil) {
          elements.push(
            <ellipse
              key={`pupil-${cx}`}
              cx={cx + eyeWidth * 0.1}
              cy={cy - eyeHeight * 0.2}
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
            key={`eye-${cx}`}
            d={`M ${cx} ${cy - eyeHeight}
                Q ${cx - eyeWidth * 0.35} ${cy - eyeHeight * 0.5} ${cx - eyeWidth * 0.3} ${cy}
                Q ${cx - eyeWidth * 0.35} ${cy + eyeHeight * 0.5} ${cx} ${cy + eyeHeight}
                Q ${cx + eyeWidth * 0.35} ${cy + eyeHeight * 0.5} ${cx + eyeWidth * 0.3} ${cy}
                Q ${cx + eyeWidth * 0.35} ${cy - eyeHeight * 0.5} ${cx} ${cy - eyeHeight}
                Z`}
            style={{ fill: eyeColor }}
          />
        );
        // Add vertical pupil for white eyes
        if (needsPupil) {
          elements.push(
            <ellipse
              key={`pupil-${cx}`}
              cx={cx}
              cy={cy}
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
        
      case 4: // Large oval (Vivi style) - iconic glowing orbs, portrait orientation
      default:
        // Main glowing oval - portrait oriented (taller than wide)
        elements.push(
          <ellipse
            key={`eye-${cx}`}
            cx={cx}
            cy={cy}
            rx={eyeWidth * 0.7}  // Narrower width
            ry={eyeHeight}       // Full height
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
            rx={eyeWidth * 0.6}   // Narrower width
            ry={eyeHeight * 0.85}
            style={{ 
              fill: eyeColor,
              opacity: 0.6,
              filter: 'brightness(1.4)'
            }}
          />
        );
        
        if (needsPupil) {
          // Add pupil for white Vivi eyes - larger and centered
          elements.push(
            <ellipse
              key={`pupil-${cx}`}
              cx={cx}
              cy={cy}
              rx={eyeWidth * 0.3}
              ry={eyeHeight * 0.35}
              style={{ fill: '#000000' }}
            />
          );
        } else {
          // Bright center spot for colored eyes
          elements.push(
            <ellipse
              key={`center-${cx}`}
              cx={cx}
              cy={cy - eyeHeight * 0.1}
              rx={eyeWidth * 0.3}   // Narrower width
              ry={eyeHeight * 0.5}
              style={{ 
                fill: '#FFFFFF',
                opacity: 0.5
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
          <stop offset="0%" style={{ stopColor: baseHatColor, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: baseHatColor, stopOpacity: 0 }} />
        </radialGradient>
        
        {/* Tint gradient for hat - matches hat tilt angle */}
        <linearGradient 
          id={hatGradientID} 
          x1="0%" 
          y1="0%" 
          x2="100%" 
          y2="100%"
          gradientTransform={`rotate(${90 + tilt} 0.5 0.5)`}
        >
          <stop offset="0%" style={{ stopColor: baseHatColor }} />
          <stop offset="50%" style={{ stopColor: tintColor, stopOpacity: 0.25 }} />
          <stop offset="100%" style={{ stopColor: baseHatColor }} />
        </linearGradient>
      </defs>
      
      <mask id={maskID} maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
        <rect width={SIZE} height={SIZE} rx={square ? undefined : SIZE * 2} fill="#FFFFFF" />
      </mask>
      
      <g mask={`url(#${maskID})`}>
        {/* Background with proper color */}
        <rect 
          width={SIZE} 
          height={SIZE} 
          style={{ fill: getRandomColor(num + 97, colors, colors.length) }}
        />
        
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
            rx={SIZE * 0.7}
            ry={SIZE * 0.85}
            style={{ fill: faceColor }}
          />
          
          {/* Eyes - larger and more prominent with variation */}
          {drawEye(SIZE / 2 - eyeSpacing * eyeDistanceMultiplier, true)}
          {drawEye(SIZE / 2 + eyeSpacing * eyeDistanceMultiplier, false)}
          
          {/* Small mouth - just a horizontal line */}
          {showMouth && (
            <line
              x1={SIZE / 2 - mouthWidth / 2}
              y1={mouthY}
              x2={SIZE / 2 + mouthWidth / 2}
              y2={mouthY}
              style={{
                stroke: eyeColor === '#FFFF00' ? '#FFFFFF' : eyeColor, // Use white if eyes are yellow
                strokeWidth: 1.5,
                opacity: 0.7,
                strokeLinecap: 'round'
              }}
            />
          )}
        </g>
        
        {/* Anime-style hat rendering system */}
        {drawHat(hatShape, hatY, tilt, hatBase, hatHighlight, hatShadow, bandColor, outline, num, {
          hasStarBand, hasFeather, hasMoonCharm, hasVeil, hasOfuda
        })}
      </g>
    </svg>
  );
};

export default AvatarMage;