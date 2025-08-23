import * as React from 'react';
import {
  generateId,
  getBoolean,
  getContrastSafe,
  getRandomColor,
  getUnit,
  hashCode,
} from '../utilities';
import type { AvatarProps } from './types';

const SIZE = 80;

// Quadratic curve path helper
const q = (
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number
) => `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

/* Head blob - basically a circle with subtle hand-drawn wobble */
function frogBlobPath(cx: number, cy: number, s: number) {
  const S = SIZE;

  // Base circle with slight width/height variance
  const width = 0.42 + (getUnit(s + 1, 10) - 5) / 100; // 0.37 to 0.47
  const height = 0.42 + (getUnit(s + 2, 10) - 5) / 100; // 0.37 to 0.47

  // Very subtle squish factors for organic feel
  const topSquish = 1.0 + (getUnit(s + 3, 6) - 3) / 100; // 0.97 to 1.03
  const bottomSquish = 1.0 + (getUnit(s + 4, 6) - 3) / 100; // 0.97 to 1.03

  // Add subtle hand-drawn wobble to each control point - slightly increased for messier look
  const wobble1 = (getUnit(s + 10, 10) - 5) / 150; // -0.033 to 0.033
  const wobble2 = (getUnit(s + 11, 10) - 5) / 150;
  const wobble3 = (getUnit(s + 12, 10) - 5) / 150;
  const wobble4 = (getUnit(s + 13, 10) - 5) / 150;
  const wobble5 = (getUnit(s + 14, 10) - 5) / 150;
  const wobble6 = (getUnit(s + 15, 10) - 5) / 150;
  const wobble7 = (getUnit(s + 16, 10) - 5) / 150;
  const wobble8 = (getUnit(s + 17, 10) - 5) / 150;

  // Extra micro-wobbles for slightly rougher edges
  const microWobble1 = (getUnit(s + 20, 6) - 3) / 300; // -0.01 to 0.01
  const microWobble2 = (getUnit(s + 21, 6) - 3) / 300;

  // Simple circular path with slight variance and wobble - now with micro-wobbles for messier edges
  const d = `
    M ${cx - width * S + wobble1 * S} ${cy + wobble2 * S + microWobble1 * S}
    Q ${cx - width * S * (1 + wobble3 + microWobble2)} ${cy - height * S * topSquish + wobble4 * S},
      ${cx + wobble5 * S + microWobble1 * S} ${cy - height * S * topSquish}
    Q ${cx + width * S * (1 + wobble6 - microWobble2)} ${cy - height * S * topSquish + wobble7 * S + microWobble1 * S},
      ${cx + width * S + wobble8 * S} ${cy + wobble1 * S - microWobble2 * S}
    Q ${cx + width * S * (1 - wobble2 + microWobble1)} ${cy + height * S * bottomSquish + wobble3 * S},
      ${cx + wobble4 * S - microWobble2 * S} ${cy + height * S * bottomSquish}
    Q ${cx - width * S * (1 - wobble5 - microWobble1)} ${cy + height * S * bottomSquish + wobble6 * S + microWobble2 * S},
      ${cx - width * S + wobble7 * S} ${cy + wobble8 * S + microWobble1 * S}
    Z
  `;

  return d;
}

/* One eye + lid, safely clipped so the lid never bleeds into the other eye */
const EyeGroup: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  lidDrop: number;
  outline: string;
  pupil: string;
  name: string;
  eyeId: string;
}> = ({ cx, cy, rx, ry, lidDrop, outline, pupil, name, eyeId }) => {
  const uid = generateId(name, `eye-${eyeId}`);

  return (
    <g>
      <clipPath id={`clip-${uid}`}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      </clipPath>

      {/* white */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        style={{ fill: '#fff', stroke: outline, strokeWidth: 1.5 }}
      />

      {/* pupil + specular */}
      <circle
        cx={cx + rx * 0.15}
        cy={cy - ry * 0.05}
        r={Math.max(2, rx * 0.42)}
        style={{ fill: pupil }}
      />
      <circle
        cx={cx + rx * 0.04}
        cy={cy - ry * 0.15}
        r={Math.max(1, rx * 0.15)}
        style={{ fill: '#fff' }}
      />

      {/* upper lid (clipped to the white) */}
      <g clipPath={`url(#clip-${uid})`}>
        <path
          d={`M ${cx - rx} ${cy - lidDrop}
              Q ${cx} ${cy - ry - lidDrop * 0.2}
                ${cx + rx} ${cy - lidDrop}`}
          style={{
            stroke: outline,
            strokeWidth: 2,
            fill: 'none',
            strokeLinecap: 'round',
          }}
        />
      </g>
    </g>
  );
};

/* Lips as a single curve layered 3× so the outline perfectly tracks the mouth shape */
function Lips({
  x1,
  y,
  x2,
  curve,
  thickness,
  color,
  outline = '#000',
  split = '#2b1a12',
  tilt = 0,
}: {
  x1: number;
  y: number;
  x2: number;
  curve: number;
  thickness: number;
  color: string;
  outline?: string;
  split?: string;
  tilt?: number;
}) {
  const cx = (x1 + x2) / 2;
  const cy = y + curve;
  const d = q(x1, y, cx, cy, x2, y);
  const tr = tilt ? { transform: `rotate(${tilt} ${cx} ${y})` } : undefined;

  return (
    <>
      <path
        d={d}
        style={{
          stroke: outline,
          strokeWidth: thickness + 3,
          fill: 'none',
          strokeLinecap: 'round',
        }}
        {...tr}
      />
      <path
        d={d}
        style={{
          stroke: color,
          strokeWidth: thickness,
          fill: 'none',
          strokeLinecap: 'round',
        }}
        {...tr}
      />
      <path
        d={d}
        style={{
          stroke: split,
          strokeWidth: Math.max(1, thickness * 0.25),
          fill: 'none',
          strokeLinecap: 'round',
        }}
        {...tr}
      />
    </>
  );
}

export default function AvatarPepe({
  name,
  colors,
  title,
  size,
  ...otherProps
}: AvatarProps) {
  const n = hashCode(name);
  const range = colors.length;
  const maskID = generateId(name, 'mask');

  // Face style selection - 15% chance of full-canvas face (no border) - made more rare
  const isFullFace = getUnit(n + 200, 100) < 15;

  // Expression selection - 20% chance of being mad, 15% chance of crying
  const isMad = getUnit(n + 131, 100) < 20;
  const isCrying = !isMad && getUnit(n + 132, 100) < 15; // Can't be both mad and crying

  // Calculate eye separation and size first (needed for sunglasses decision)
  const baseSep = isFullFace ? 0.32 : 0.26;
  const sepVariation = (getUnit(n + 5, 10) - 5) / 100;
  const sep = SIZE * (baseSep + sepVariation); // Variable separation between centers

  // Calculate eye size (needed to check if eyes have actual gap)
  const baseEyeRx = isFullFace ? 0.16 : 0.13;
  const eyeRx = SIZE * (baseEyeRx + (getUnit(n + 9, 6) - 3) / 100); // Variable width

  // Calculate actual gap between eyes
  // The gap is: distance between centers - (2 * radius of one eye)
  // This gives us the actual space between the inner edges of the eyes
  const eyeGap = sep - 2 * eyeRx; // Actual gap between the eyes

  // Sunglasses - 25% total chance (increased for more variety), not when crying or full-face
  // 0 = none, 1 = Kanye shutter shades, 2 = nerd glasses, 3 = aviators
  let sunglassesType = 0;
  if (!(isCrying || isFullFace) && getUnit(n + 203, 100) < 25) {
    const typeRoll = getUnit(n + 204, 3) + 1; // 1, 2, or 3
    sunglassesType = typeRoll;
  }

  // Background pattern - 70% chance of having a pattern (increased!)
  const bgPattern = getUnit(n + 205, 100) < 70 ? getUnit(n + 206, 5) : -1; // 0=v-stripes, 1=h-stripes, 2=dots, 3=checkerboard, 4=diagonal, -1=none

  // Build color pools that mix classic Pepe colors with theme colors
  // Classic colors are weighted more heavily by appearing multiple times

  // Classic Pepe colors
  const classicGreens = ['#6B9F2E', '#7FAF3F', '#8FBF4F', '#5F8F1F'];
  const classicReds = ['#C03A2B', '#B84236', '#A63526', '#D04030', '#9B3021'];

  // Build complete pool from theme + classics
  const fullColorPool = [...colors, ...classicGreens, ...classicReds];

  // Helper to get brightness of a color
  const getBrightness = (color: string): number => {
    if (!color.startsWith('#')) return 999; // Non-hex colors go last
    const hex = color.substring(1);
    if (hex.length !== 6) return 999;
    const r = Number.parseInt(hex.substring(0, 2), 16);
    const g = Number.parseInt(hex.substring(2, 4), 16);
    const b = Number.parseInt(hex.substring(4, 6), 16);
    return r + g + b;
  };

  // Sort colors by brightness and pick darkest for bg
  const sortedColors = [...fullColorPool].sort(
    (a, b) => getBrightness(a) - getBrightness(b)
  );

  // Background: always darkest available color
  const bg = sortedColors[0];

  // Skin: prefer theme colors, with rare classic green appearances
  const skinPool = [
    ...sortedColors.slice(Math.floor(sortedColors.length * 0.3)), // Brighter 70% of colors (main pool)
    ...sortedColors.slice(Math.floor(sortedColors.length * 0.3)), // Double weight for theme colors
    ...classicGreens, // Only single weight for classic greens (rare)
  ];
  let skin = skinPool[getUnit(n + 141, skinPool.length)];

  // Lips: prefer theme colors, with rare classic red appearances
  const lipsPool = [
    ...sortedColors.slice(Math.floor(sortedColors.length * 0.4)), // Brighter 60% of colors (main pool)
    ...sortedColors.slice(Math.floor(sortedColors.length * 0.4)), // Double weight for theme colors
    ...classicReds, // Only single weight for classic reds (rare)
  ];
  let lipColor = lipsPool[getUnit(n + 142, lipsPool.length)];

  // Ensure contrast between colors
  if (skin === bg || Math.abs(getUnit(n + 143, 100)) < 10) {
    // 10% chance to force contrast even if different
    const contrastSkins = [
      '#6B9F2E',
      '#7FAF3F',
      '#FFB6C1',
      '#87CEEB',
      '#DDA0DD',
    ];
    skin = contrastSkins[getUnit(n + 144, contrastSkins.length)];
  }

  if (lipColor === skin || lipColor === bg) {
    const contrastLips = [
      '#C03A2B',
      '#FF69B4',
      '#FF1493',
      '#DC143C',
      '#8B008B',
    ];
    lipColor = contrastLips[getUnit(n + 145, contrastLips.length)];
  }

  // Outline must contrast with skin
  const outline = getContrastSafe(skin, '#000000');
  const pupil = '#000000'; // Always black pupils
  const lipW = SIZE * (0.46 + Math.abs(getUnit(n + 19, 8)) / 100); // 0.46..0.54 * SIZE
  const lipH = SIZE * (0.12 + Math.abs(getUnit(n + 21, 6)) / 100); // 0.12..0.18 * SIZE
  const baseCurve = lipH * (0.18 + Math.abs(getUnit(n + 25, 12)) / 100);
  const lipCurve = isMad
    ? -baseCurve * 0.8
    : isCrying
      ? -baseCurve * 0.5
      : baseCurve; // Sad when crying, frown when mad
  const lipTilt = isMad || isCrying ? 0 : getUnit(n + 23, 7) - 3; // No tilt when emotional

  // Head tilt (small so we never clip the mask)
  const tilt = getUnit(n + 1, 13) - 6; // -6..+6 deg for both styles

  // Eye geometry - adjusted based on face style with more variation
  // (baseSep, sep, and eyeRx already calculated above for sunglasses decision)
  const baseEyeRy = isFullFace ? 0.11 : 0.085;
  const eyeRy = SIZE * (baseEyeRy + (getUnit(n + 11, 6) - 3) / 100); // Variable height

  // Eye Y position with variation for full-face
  const baseEyeY = isFullFace ? 0.35 : 0.42; // Base position as ratio
  const eyeYVariation = (getUnit(n + 77, 11) - 5) / 100; // ±0.05 variation
  const eyeY =
    SIZE * (baseEyeY + (isFullFace ? eyeYVariation : 0)) -
    (isFullFace ? 0 : SIZE * 0.08);
  const baseLidDrop = SIZE * (0.03 + getUnit(n + 15, 50) / 1000); // 0.03..0.08 * SIZE
  const lidDrop = isMad ? baseLidDrop * 1.5 : baseLidDrop; // More lid drop when mad

  // Order: choose which eye is on top (so its lid never sits under the other)
  const rightOnTop = getBoolean(n + 57, 1);

  const cx = SIZE / 2,
    cy = SIZE / 2;

  // Pattern IDs
  const patternID = generateId(name, 'pattern');

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

      {/* Pattern definitions */}
      {bgPattern >= 0 && (
        <defs>
          <pattern
            height={
              bgPattern === 0
                ? SIZE
                : // vertical stripes
                  bgPattern === 1
                  ? SIZE * 0.2
                  : // horizontal stripes
                    bgPattern === 2
                    ? SIZE * 0.25
                    : // polka dots
                      bgPattern === 3
                      ? SIZE * 0.2
                      : // checkerboard
                        SIZE * 0.2 // diagonal
            }
            id={patternID}
            patternUnits="userSpaceOnUse"
            width={
              bgPattern === 0
                ? SIZE * 0.2
                : // vertical stripes
                  bgPattern === 1
                  ? SIZE
                  : // horizontal stripes
                    bgPattern === 2
                    ? SIZE * 0.25
                    : // polka dots
                      bgPattern === 3
                      ? SIZE * 0.2
                      : // checkerboard
                        SIZE * 0.2 // diagonal
            }
          >
            {bgPattern === 0 && (
              /* Vertical stripes */
              <>
                <rect fill={String(bg)} height={SIZE} width={SIZE * 0.1} />
                <rect
                  fill={String(skin)}
                  height={SIZE}
                  opacity="0.2"
                  width={SIZE * 0.1}
                  x={SIZE * 0.1}
                />
              </>
            )}
            {bgPattern === 1 && (
              /* Horizontal stripes */
              <>
                <rect fill={String(bg)} height={SIZE * 0.1} width={SIZE} />
                <rect
                  fill={String(skin)}
                  height={SIZE * 0.1}
                  opacity="0.2"
                  width={SIZE}
                  y={SIZE * 0.1}
                />
              </>
            )}
            {bgPattern === 2 && (
              /* Polka dots */
              <>
                <rect
                  fill={String(bg)}
                  height={SIZE * 0.25}
                  width={SIZE * 0.25}
                />
                <circle
                  cx={SIZE * 0.125}
                  cy={SIZE * 0.125}
                  fill={String(skin)}
                  opacity="0.25"
                  r={SIZE * 0.05}
                />
              </>
            )}
            {bgPattern === 3 && (
              /* Checkerboard */
              <>
                <rect
                  fill={String(bg)}
                  height={SIZE * 0.1}
                  width={SIZE * 0.1}
                />
                <rect
                  fill={String(skin)}
                  height={SIZE * 0.1}
                  opacity="0.2"
                  width={SIZE * 0.1}
                  x={SIZE * 0.1}
                />
                <rect
                  fill={String(skin)}
                  height={SIZE * 0.1}
                  opacity="0.2"
                  width={SIZE * 0.1}
                  y={SIZE * 0.1}
                />
                <rect
                  fill={String(bg)}
                  height={SIZE * 0.1}
                  width={SIZE * 0.1}
                  x={SIZE * 0.1}
                  y={SIZE * 0.1}
                />
              </>
            )}
            {bgPattern === 4 && (
              /* Diagonal stripes */
              <>
                <polygon
                  fill={String(skin)}
                  opacity="0.2"
                  points={`0,0 ${SIZE * 0.1},0 0,${SIZE * 0.1}`}
                />
                <polygon
                  fill={String(bg)}
                  points={`${SIZE * 0.1},0 ${SIZE * 0.2},0 ${SIZE * 0.2},${SIZE * 0.1} ${SIZE * 0.1},${SIZE * 0.2} 0,${SIZE * 0.2} 0,${SIZE * 0.1}`}
                />
                <polygon
                  fill={String(skin)}
                  opacity="0.2"
                  points={`${SIZE * 0.2},${SIZE * 0.1} ${SIZE * 0.2},${SIZE * 0.2} ${SIZE * 0.1},${SIZE * 0.2}`}
                />
              </>
            )}
          </pattern>
        </defs>
      )}

      <mask id={maskID}>
        <rect
          fill="#fff"
          height={SIZE}
          
          width={SIZE}
        />
      </mask>

      <g mask={`url(#${maskID})`}>
        {/* Solid fallback background from palette - always visible */}
        <rect height={SIZE} style={{ fill: String(bg) }} width={SIZE} />

        {/* pattern overlay on background - shows for both normal and full-face */}
        {bgPattern >= 0 && (
          <rect fill={`url(#${patternID})`} height={SIZE} width={SIZE} />
        )}

        {/* For full-face mode, fill entire canvas with skin color on top of pattern */}
        {isFullFace && (
          <rect
            height={SIZE}
            style={{ fill: String(skin), opacity: 0.95 }}
            width={SIZE}
          />
        )}

        {/* head - only draw if not full-face */}
        {!isFullFace && (
          <g transform={`rotate(${tilt} ${cx} ${cy})`}>
            <path
              d={frogBlobPath(cx, cy, n)}
              style={{
                fill: String(skin),
                stroke: String(outline),
                strokeWidth: 2,
              }}
            />
          </g>
        )}

        {/* eyes (grouped + clipped lids; draw non-dominant first) */}
        {rightOnTop ? (
          <EyeGroup
            cx={cx - sep / 2}
            cy={eyeY}
            lidDrop={lidDrop}
            outline={String(outline)}
            pupil={pupil}
            rx={eyeRx}
            ry={eyeRy}
            name={name}
            eyeId="left"
          />
        ) : (
          <EyeGroup
            cx={cx + sep / 2}
            cy={eyeY}
            lidDrop={lidDrop}
            outline={String(outline)}
            pupil={pupil}
            rx={eyeRx}
            ry={eyeRy}
            name={name}
            eyeId="right"
          />
        )}
        {rightOnTop ? (
          <EyeGroup
            cx={cx + sep / 2}
            cy={eyeY}
            lidDrop={lidDrop}
            outline={String(outline)}
            pupil={pupil}
            rx={eyeRx}
            ry={eyeRy}
            name={name}
            eyeId="right"
          />
        ) : (
          <EyeGroup
            cx={cx - sep / 2}
            cy={eyeY}
            lidDrop={lidDrop}
            outline={String(outline)}
            pupil={pupil}
            rx={eyeRx}
            ry={eyeRy}
            name={name}
            eyeId="left"
          />
        )}

        {/* Tears welling up when crying */}
        {isCrying && (
          <>
            {/* Watery eyes effect - shimmer over eyes */}
            <ellipse
              cx={cx - sep / 2}
              cy={eyeY + eyeRy * 0.5}
              rx={eyeRx * 0.9}
              ry={eyeRy * 0.4}
              style={{ fill: '#4A90E2', opacity: 0.4 }}
            />
            <ellipse
              cx={cx + sep / 2}
              cy={eyeY + eyeRy * 0.5}
              rx={eyeRx * 0.9}
              ry={eyeRy * 0.4}
              style={{ fill: '#4A90E2', opacity: 0.4 }}
            />

            {/* Tear drops */}
            <ellipse
              cx={cx - sep / 2 - eyeRx * 0.7}
              cy={eyeY + eyeRy * 1.5}
              rx={3}
              ry={5}
              style={{ fill: '#4A90E2', opacity: 0.7 }}
            />
            <ellipse
              cx={cx + sep / 2 + eyeRx * 0.7}
              cy={eyeY + eyeRy * 1.5}
              rx={3}
              ry={5}
              style={{ fill: '#4A90E2', opacity: 0.7 }}
            />

            {/* Tear streaks */}
            <path
              d={`M ${cx - sep / 2 - eyeRx * 0.7} ${eyeY + eyeRy} 
                      Q ${cx - sep / 2 - eyeRx * 0.7} ${eyeY + eyeRy * 2} 
                        ${cx - sep / 2 - eyeRx * 0.8} ${eyeY + eyeRy * 2.5}`}
              style={{
                stroke: '#4A90E2',
                strokeWidth: 2,
                fill: 'none',
                opacity: 0.3,
                strokeLinecap: 'round',
              }}
            />
            <path
              d={`M ${cx + sep / 2 + eyeRx * 0.7} ${eyeY + eyeRy} 
                      Q ${cx + sep / 2 + eyeRx * 0.7} ${eyeY + eyeRy * 2} 
                        ${cx + sep / 2 + eyeRx * 0.8} ${eyeY + eyeRy * 2.5}`}
              style={{
                stroke: '#4A90E2',
                strokeWidth: 2,
                fill: 'none',
                opacity: 0.3,
                strokeLinecap: 'round',
              }}
            />
          </>
        )}

        {/* Sunglasses overlay - 3 different styles */}
        {sunglassesType > 0 && (
          <g>
            {(() => {
              if (sunglassesType === 1) {
                // Kanye shutter shades from vectors/pepe-glasses-kanye.svg
                // viewBox 0 0 703 282
                const scale = (sep + eyeRx * 4) / 703;
                const pathCenterX = 351.5; // Center of viewBox width 703
                const pathCenterY = 141; // Center of viewBox height 282

                return (
                  <g
                    transform={`translate(${cx}, ${eyeY}) scale(${scale}) translate(-${pathCenterX}, -${pathCenterY})`}
                  >
                    <path
                      d="M236.073 1.37938C129.2 3.46326 111.636 4.95175 89.3088 15.3711C55.9669 30.8513 34.8304 58.537 23.8157 101.108L22.3272 107.062H14.5871C8.33549 107.062 6.25162 107.657 3.27466 110.634C1.06464e-06 114.206 0 114.504 0 140.999C0 173.448 0.297697 174.043 14.2894 175.234L22.9226 175.829L26.7927 187.142C42.2729 232.987 78.2941 266.031 126.223 278.535C141.406 282.405 172.664 283 191.121 279.13C220.593 273.176 260.782 256.803 284.895 240.429C319.428 217.209 341.755 189.523 348.9 160.647L351.579 150.227L353.365 159.158C356.64 176.722 372.12 202.027 389.982 218.4C419.752 246.086 464.108 268.413 508.167 277.939C528.708 282.405 558.776 282.405 576.042 277.939C601.346 271.688 623.673 259.184 641.833 241.322C657.908 225.545 672.793 200.538 677.556 181.188L679.343 174.639H687.678C693.632 174.639 696.609 174.043 698.991 171.959C702.265 169.28 702.265 168.685 702.861 143.083C703.456 108.848 702.861 107.359 686.19 106.466L680.236 106.168L676.961 94.2606C666.542 58.2394 645.405 31.4467 615.04 16.5619C591.225 4.95173 577.233 3.16556 478.993 1.08169C409.034 -0.406789 329.55 -0.406794 236.073 1.37938ZM240.241 37.996C260.782 42.1638 279.834 47.5223 294.421 53.1785C301.268 55.8578 306.925 58.5371 306.925 58.8347C306.925 59.1324 256.316 59.4301 194.991 59.4301H82.7595L87.8204 55.2624C99.7282 45.1407 122.055 37.6983 147.062 35.6144C155.397 35.019 176.236 34.7214 193.8 35.0191C218.807 34.7214 228.631 35.3168 240.241 37.996ZM545.677 35.0191C578.126 36.8052 599.262 43.0568 613.552 54.667L618.613 58.8347H506.679C445.056 58.8347 394.447 58.537 394.447 58.2393C394.447 56.7509 420.347 46.9269 433.743 43.3545C453.391 37.6983 462.917 36.2098 481.97 35.0191C505.488 33.8283 519.48 33.8283 545.677 35.0191ZM318.237 99.0237C318.535 104.978 318.535 104.68 317.344 115.992L316.451 125.519H185.167H53.5853V121.649C53.5853 117.183 57.4554 100.512 59.5392 96.6422C60.73 94.2606 68.1724 94.2606 189.335 94.2606H317.939L318.237 99.0237ZM643.619 103.489C644.81 107.955 646.298 114.802 646.894 118.672L647.787 125.816H516.205H384.623L383.135 114.504C382.242 108.252 381.944 101.108 382.242 99.0237L383.135 94.856L512.037 95.1537L640.94 95.4514L643.619 103.489ZM305.139 168.982C303.65 172.852 299.482 179.699 296.505 184.76L290.551 193.393L176.832 193.096L63.1116 192.798L59.2415 182.974C57.1577 177.318 55.0738 170.769 54.4784 167.792L53.5853 162.433H180.702H307.818L305.139 168.982ZM647.489 163.624C647.489 166.005 643.024 180.295 640.047 186.844L637.367 193.691H523.945H410.523L406.355 187.737C401.89 181.783 397.127 172.555 394.745 166.303L393.257 162.731H520.373C590.331 162.433 647.489 163.028 647.489 163.624ZM233.989 234.475C193.502 254.123 152.123 257.993 120.269 244.895C112.231 241.62 93.4766 230.903 93.4766 229.415C93.4766 229.117 127.712 228.819 169.687 229.117H245.599L233.989 234.475ZM605.216 231.796C599.262 236.559 580.805 245.49 570.683 248.765C542.998 257.398 503.404 252.04 467.383 234.773L456.07 229.415H532.281C608.491 228.819 608.789 229.117 605.216 231.796Z"
                      fill="#000000"
                    />
                  </g>
                );
              }
              if (sunglassesType === 2) {
                // Nerd glasses from vectors/pepe-glasses-nerd.svg
                // viewBox 0 0 703 221
                const scale = (sep + eyeRx * 4) / 703;
                const pathCenterX = 351.5; // Center of viewBox width 703
                const pathCenterY = 110.5; // Center of viewBox height 221

                return (
                  <g
                    transform={`translate(${cx}, ${eyeY}) scale(${scale}) translate(-${pathCenterX}, -${pathCenterY})`}
                  >
                    <path
                      d="M166.195 0.0337373C192.983 0.359001 219.782 0.140273 246.536 2.1199C266.824 3.62284 286.988 6.34272 307.186 8.56909C338.732 12.0404 370.195 12.1582 401.747 7.81764C429.277 4.02663 456.953 0.863703 484.797 0.611343C529.299 0.201959 573.819 -0.745773 618.276 2.24329C642.064 3.84718 665.818 6.02307 689.353 10.0496C700.191 11.9059 701.23 13.1957 702.107 24.0696C702.107 24.2154 702.107 24.3668 702.107 24.507C704.562 35.4202 701.916 44.0846 693.022 51.8068C683.527 60.0561 681.853 72.1862 681.004 84.1817C679.617 103.888 676.167 123.202 669.712 141.944C665.361 154.801 659.456 167.079 652.126 178.508C638.171 200.037 618.304 212.762 593.134 216.357C555.16 221.785 516.905 222.997 478.926 217.192C434.339 210.35 405.472 184.492 391.955 141.512C384.904 119.08 380.853 95.9585 376.268 72.9657C376.072 71.9675 375.802 70.9861 375.583 69.9879C373.942 62.4676 371.482 55.3342 363.065 53.0125C353.368 50.3319 343.66 49.9561 334.693 55.6595C330.406 58.3906 328.917 62.9499 327.951 67.5316C324.58 83.1947 321.675 98.9364 318.153 114.583C313.849 133.65 308.602 152.532 298.399 169.491C282.437 196.056 258.211 210.665 228.17 216.598C213.164 219.548 197.966 220.293 182.741 220.394C160.93 220.535 139.148 220.069 117.411 217.736C80.9428 213.811 56.3684 194.373 41.2102 161.707C30.3276 138.265 24.4565 113.652 22.153 88.0513C21.6586 82.5386 21.0743 77.0147 20.1304 71.5638C18.4449 61.8227 13.1862 53.9154 5.94421 47.4942C1.37654 43.4453 -0.612335 39.0037 0.168607 33.0144C0.730436 28.8308 0.634926 24.5743 1.09563 20.3739C1.76982 14.3229 3.65757 12.1863 9.63543 10.9357C26.8499 7.33535 44.3565 5.88846 61.8181 4.11073C96.5223 0.60573 131.339 -0.179367 166.195 0.0337373ZM532.614 23.2677C510.652 22.8807 488.724 22.791 466.976 26.6325C451.778 29.3243 436.873 32.8013 423.569 41.0114C411.057 48.7785 403.427 59.4337 403.787 74.7267C404.157 91.3656 405.579 107.904 408.843 124.24C416.31 161.813 441.39 187.61 478.959 194.598C514.355 201.209 550.065 200.15 585.51 194.396C614.164 189.752 633.137 172.654 643.654 146.167C652.772 123.174 654.02 99.0598 652.61 74.7435C651.806 60.8805 645.677 49.6813 633.569 42.0432C624.423 36.2782 614.349 32.9639 604.051 30.0589C580.611 23.4527 556.604 23.4808 532.614 23.2677ZM187.157 23.4471C158.548 22.8527 134.412 22.1236 110.607 27.5466C96.174 30.8329 81.8024 34.1976 69.077 42.1834C59.8573 47.9821 53.6828 55.9118 51.8457 66.8586C47.3061 93.8836 49.5983 120.415 59.2674 145.965C69.3803 172.614 88.4151 189.747 117.17 194.356C152.924 200.088 188.904 201.338 224.586 194.497C259.7 187.767 282.201 166.193 292.005 132.024C297.298 113.573 298.314 94.45 299.017 75.3548C299.522 61.7385 293.803 51.4535 283.05 43.6023C271.965 35.5043 259.155 31.5843 246.003 28.4046C225.125 23.3686 203.809 24.6921 187.157 23.4471Z"
                      fill="#000000"
                    />
                  </g>
                );
              }
              if (sunglassesType === 3) {
                // Aviators from vectors/pepe-glasses-aviator.svg with lens transparency
                // viewBox 0 0 703 257
                const scale = (sep + eyeRx * 4) / 703;
                const pathCenterX = 351.5; // Center of viewBox width 703
                const pathCenterY = 128.5; // Center of viewBox height 257
                const maskId = `aviator-mask-${n}`;

                return (
                  <>
                    <defs>
                      <mask id={maskId}>
                        {/* White background = opaque */}
                        <rect
                          fill="white"
                          height="257"
                          width="703"
                          x="0"
                          y="0"
                        />
                        {/* Black lens areas = transparent */}
                        {/* Left lens */}
                        <ellipse
                          cx="175"
                          cy="128"
                          fill="black"
                          rx="85"
                          ry="75"
                        />
                        {/* Right lens */}
                        <ellipse
                          cx="528"
                          cy="128"
                          fill="black"
                          rx="85"
                          ry="75"
                        />
                      </mask>
                    </defs>
                    <g
                      transform={`translate(${cx}, ${eyeY}) scale(${scale}) translate(-${pathCenterX}, -${pathCenterY})`}
                    >
                      {/* Lens areas with transparency */}
                      <g opacity="0.7">
                        <ellipse
                          cx="175"
                          cy="128"
                          fill="#000000"
                          rx="85"
                          ry="75"
                        />
                        <ellipse
                          cx="528"
                          cy="128"
                          fill="#000000"
                          rx="85"
                          ry="75"
                        />
                      </g>
                      {/* Frame with mask applied to cut out lens areas */}
                      <path
                        d="M555.005 2.35602C576.77 2.24799 598.497 4.1972 619.895 8.17763C679.58 19.5537 702.096 45.9427 702.979 107.412C703.274 128.582 700.979 149.718 694.547 170.196C678.47 221.365 634.623 254.74 580.775 256.493C487.758 259.514 399.933 184.928 387.658 92.5909C387.028 87.8583 385.994 83.1805 385.432 78.4342C383.137 59.0242 371.191 48.2029 351.757 48.0796C332.323 47.9563 318.822 58.8119 317.637 77.8725C312.294 163.841 237.868 237.891 170.292 252.678C89.0233 270.486 10.9807 233.789 1.55504 135.246C0.130234 120.384 -0.801371 105.679 1.00019 90.776C6.93233 41.7649 28.9347 17.821 77.2823 8.78034C122.445 0.335585 168.313 2.28755 213.879 0.787627C260.59 -0.753386 307.389 0.44518 354.154 0.44518C354.148 1.08213 488.052 2.34917 555.005 2.35602ZM262.158 10.3282C262.405 14.828 265.583 14.3554 267.878 15.2458C285.25 21.944 302.854 28.3272 311.609 46.9564C315.335 54.9012 319.055 49.2097 322.637 46.7646C334.098 38.9431 346.613 36.1625 360.347 38.3336C370.622 39.9499 379.301 50.5726 387.062 49.5384C394.597 48.5385 397.241 33.4366 406.763 28.7313C418.25 23.0467 429.772 17.4443 444.301 10.3282H262.158Z"
                        fill="#000000"
                        mask={`url(#${maskId})`}
                      />
                    </g>
                  </>
                );
              }

              return null;
            })()}
          </g>
        )}

        {/* angry eyebrows when mad - always use dark color */}
        {isMad && sunglassesType === 0 && (
          <>
            <path
              d={`M ${cx - sep / 2 - eyeRx * 1.2} ${eyeY - eyeRy * 1.5}
                  L ${cx - sep / 2 + eyeRx * 0.8} ${eyeY - eyeRy * 0.8}`}
              style={{
                stroke: '#000000',
                strokeWidth: 3,
                strokeLinecap: 'round',
              }}
            />
            <path
              d={`M ${cx + sep / 2 + eyeRx * 1.2} ${eyeY - eyeRy * 1.5}
                  L ${cx + sep / 2 - eyeRx * 0.8} ${eyeY - eyeRy * 0.8}`}
              style={{
                stroke: '#000000',
                strokeWidth: 3,
                strokeLinecap: 'round',
              }}
            />
          </>
        )}

        {/* lips (single curve layered 3×; outline perfectly tracks mouth) */}
        <Lips
          color={String(lipColor)}
          curve={lipCurve}
          outline="#000"
          split="#2b1a12"
          thickness={Math.max(10, Math.round(lipH * 0.9))}
          tilt={lipTilt}
          x1={cx - lipW / 2}
          x2={cx + lipW / 2}
          y={
            isFullFace
              ? SIZE * (0.62 + (getUnit(n + 81, 11) - 5) / 100)
              : cy + SIZE * 0.12
          }
        />
      </g>
    </svg>
  );
}
