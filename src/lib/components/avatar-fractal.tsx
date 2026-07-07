import type { CSSProperties } from "react";
import { generateId, getRandomColor, getUnit, hashCode } from "../utilities";
import type { AvatarProps } from "./types";

const SIZE = 80;

// Type-safe fractal definitions
interface Fractal {
  angle: number;
  angleVariance?: number;
  axiom: string;
  iterations: number;
  iterVariance?: number;
  name: string;
  rules: Record<string, string>;
}

// Dense fractals for backgrounds
const BACKGROUND_FRACTALS: Fractal[] = [
  {
    angle: 90,
    angleVariance: 5,
    axiom: "A",
    iterations: 5,
    iterVariance: 1,
    name: "Hilbert",
    rules: { A: "-BF+AFA+FB-", B: "+AF-BFB-FA+", F: "F" },
  },
  {
    angle: 60,
    angleVariance: 10,
    axiom: "A",
    iterations: 4,
    iterVariance: 1,
    name: "Gosper",
    rules: { A: "A-B--B+A++AA+B-", B: "+A-BB--B-A++A+B", F: "F" },
  },
  {
    angle: 120,
    angleVariance: 15,
    axiom: "F-G-G",
    iterations: 5,
    iterVariance: 1,
    name: "Sierpinski",
    rules: { F: "F-G+F+G-F", G: "GG" },
  },
  {
    angle: 90,
    angleVariance: 8,
    axiom: "F",
    iterations: 3,
    iterVariance: 1,
    name: "Peano",
    rules: { F: "F+F-F-F-F+F+F+F-F" },
  },
  {
    angle: 90,
    angleVariance: 5,
    axiom: "LFL+F+LFL",
    iterations: 4,
    iterVariance: 1,
    name: "Moore",
    rules: { F: "F", L: "-RF+LFL+FR-", R: "+LF-RFR-FL+" },
  },
  {
    angle: 60,
    angleVariance: 10,
    axiom: "F",
    iterations: 3,
    iterVariance: 1,
    name: "Hexagon",
    rules: { F: "F+F-F-F+F+F-F" },
  },
];

// Sparse fractals for foregrounds
const FOREGROUND_FRACTALS: Fractal[] = [
  {
    angle: 90,
    angleVariance: 15,
    axiom: "FX",
    iterations: 11,
    iterVariance: 2,
    name: "Dragon",
    rules: { F: "F", X: "X+YF+", Y: "-FX-Y" },
  },
  {
    angle: 60,
    angleVariance: 10,
    axiom: "F++F++F",
    iterations: 4,
    iterVariance: 1,
    name: "Koch",
    rules: { F: "F-F++F-F" },
  },
  {
    angle: 25,
    angleVariance: 10,
    axiom: "X",
    iterations: 4,
    iterVariance: 1,
    name: "Plant",
    rules: { F: "FF", X: "F+[[X]-X]-F[-FX]+X" },
  },
  {
    angle: 45,
    angleVariance: 15,
    axiom: "F",
    iterations: 10,
    iterVariance: 2,
    name: "Levy",
    rules: { F: "+F--F+" },
  },
  {
    angle: 25.7,
    angleVariance: 8,
    axiom: "F",
    iterations: 4,
    iterVariance: 1,
    name: "Tree",
    rules: { F: "F[+F]F[-F]F" },
  },
  {
    angle: 25,
    angleVariance: 12,
    axiom: "X",
    iterations: 5,
    iterVariance: 1,
    name: "Fern",
    rules: { F: "FF", X: "F[+X][-X]FX" },
  },
  {
    angle: 90,
    angleVariance: 10,
    axiom: "F+F+F+F",
    iterations: 3,
    iterVariance: 1,
    name: "Crystal",
    rules: { F: "FF+F+F+F+F+F-F" },
  },
];

// Generate L-System string
function generateLSystem(
  axiom: string,
  rules: Record<string, string>,
  iterations: number
): string {
  let current = axiom;

  for (let i = 0; i < iterations; i += 1) {
    let next = "";
    for (const char of current) {
      next += rules[char] || char;
    }
    current = next;
  }

  return current;
}

// Convert L-System to SVG path with bounding box tracking
interface PathResult {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
  path: string;
  pathLength: number;
}

function lSystemToPath(system: string, angle: number): PathResult {
  let x = 0;
  let y = 0;
  let currentAngle = 0;
  const stack: Array<{ x: number; y: number; angle: number }> = [];

  let minX = 0,
    maxX = 0,
    minY = 0,
    maxY = 0;
  let pathLength = 0;

  const paths: string[] = [];
  let currentPath = `M ${x} ${y}`;

  for (const char of system) {
    if (char === "F" || char === "G") {
      // Draw forward
      const rad = (currentAngle * Math.PI) / 180;
      const prevX = x,
        prevY = y;
      x += Math.cos(rad);
      y += Math.sin(rad);

      currentPath += ` L ${x} ${y}`;
      pathLength += Math.sqrt((x - prevX) ** 2 + (y - prevY) ** 2);

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    } else if (char === "+") {
      currentAngle += angle;
    } else if (char === "-") {
      currentAngle -= angle;
    } else if (char === "[") {
      stack.push({ angle: currentAngle, x, y });
    } else if (char === "]") {
      const state = stack.pop();
      if (state) {
        if (currentPath.length > 10) {
          paths.push(currentPath);
        }
        currentAngle = state.angle;
        ({ x, y } = state);
        currentPath = `M ${x} ${y}`;
      }
    }
  }

  if (currentPath.length > 10) {
    paths.push(currentPath);
  }

  return {
    maxX,
    maxY,
    minX,
    minY,
    path: paths.join(" "),
    pathLength,
  };
}

// Calculate stroke width based on coverage
function strokeWidthForCoverage(
  pathLength: number,
  targetSize: number,
  desiredCoverage: number,
  minW: number,
  maxW: number
): number {
  const area = targetSize * targetSize;
  const width = (desiredCoverage * area) / Math.max(1, pathLength);
  return Math.max(minW, Math.min(maxW, width));
}

// Fit fractal to bounding box
function fitToBox(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  targetSize: number,
  margin = 0.95
): { scale: number; translateX: number; translateY: number } {
  const width = maxX - minX;
  const height = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const scale = margin * Math.min(targetSize / width, targetSize / height);
  const translateX = targetSize / 2 - centerX * scale;
  const translateY = targetSize / 2 - centerY * scale;

  return { scale, translateX, translateY };
}

export interface FractalAvatarProps extends AvatarProps {
  animate?: boolean | "subtle" | "pulse" | "rotate";
}

const AvatarFractal = ({
  name,
  colors,
  title,
  size,
  animate,
  ...otherProps
}: FractalAvatarProps) => {
  const maskID = generateId(name, "fractal-mask");
  const clipID = generateId(name, "fractal-clip");
  const gradientBgID = generateId(name, "fractal-gradient-bg");
  const gradientFgID = generateId(name, "fractal-gradient-fg");
  const gradientAccentID = generateId(name, "fractal-gradient-accent");
  const num = hashCode(name);

  // Decide if we use gradients or solid colors (20% chance for gradients)
  const useGradients = getUnit(num * 241, 100) < 20;

  // Pick colors for background and foreground - ensure they're different
  const bgColorIndex = getUnit(num * 257, Math.min(colors.length, 3)); // Use first 3 colors
  const fgColorIndex = getUnit(num * 263, Math.min(colors.length - 1, 3)) + 1; // Use colors 1-4, avoiding 0
  const bgColor = colors[bgColorIndex] || colors[0];
  const fgColor = colors[fgColorIndex] || colors[2] || colors[0];

  // Apply blend mode to foreground (20% chance) - avoid modes that completely hide layers
  const useBlendMode = getUnit(num * 269, 100) < 20;
  const blendModes: CSSProperties["mixBlendMode"][] = [
    "multiply",
    "screen",
    "overlay",
  ]; // removed darken/lighten/color-dodge/color-burn which can hide layers
  const blendMode = blendModes[getUnit(num * 271, blendModes.length)];

  // Select fractal combinations with more variation - use prime multipliers to avoid collisions
  const bgFractalIndex = getUnit(num * 31, BACKGROUND_FRACTALS.length);
  const fgFractalIndex = getUnit(num * 37 + 7, FOREGROUND_FRACTALS.length);
  const bgFractal = BACKGROUND_FRACTALS[bgFractalIndex];
  const fgFractal = FOREGROUND_FRACTALS[fgFractalIndex];

  // Vary parameters based on hash for more uniqueness - use larger prime multipliers
  // Direct calculations instead of useMemo for SSR compatibility
  const bgIterations = (() => {
    const variance = bgFractal.iterVariance || 1;
    const offset = getUnit(num * 53 + 3, variance * 2 + 1) - variance;
    return Math.max(1, bgFractal.iterations + offset);
  })();

  const bgAngle = (() => {
    const variance = bgFractal.angleVariance || 10;
    const offset = (getUnit(num * 59 + 5, variance * 2) - variance) / 2;
    return bgFractal.angle + offset;
  })();

  const fgIterations = (() => {
    const variance = fgFractal.iterVariance || 1;
    const offset = getUnit(num * 61 + 11, variance * 2 + 1) - variance;
    return Math.max(1, fgFractal.iterations + offset);
  })();

  const fgAngle = (() => {
    const variance = fgFractal.angleVariance || 10;
    const offset = (getUnit(num * 67 + 13, variance * 2) - variance) / 2;
    return fgFractal.angle + offset;
  })();

  // Generate background fractal with varied parameters
  const bgSystem = generateLSystem(
    bgFractal.axiom,
    bgFractal.rules,
    bgIterations
  );
  const bgPath = lSystemToPath(bgSystem, bgAngle);

  // Generate foreground fractal with varied parameters
  const fgSystem = generateLSystem(
    fgFractal.axiom,
    fgFractal.rules,
    fgIterations
  );
  const fgPath = lSystemToPath(fgSystem, fgAngle);

  // More varied transforms - use prime multipliers for better distribution
  // Direct calculations instead of useMemo for SSR compatibility
  const bgTransform = (() => {
    const scaleVariance = 1.2 + getUnit(num * 71 + 17, 15) / 10; // 1.2 to 2.7 (reduced from 1.8-3.8)
    const fit = fitToBox(
      bgPath.minX,
      bgPath.maxX,
      bgPath.minY,
      bgPath.maxY,
      SIZE,
      scaleVariance
    );
    const rotation = getUnit(num * 73 + 19, 60) - 30; // -30 to +30 degrees
    const offsetX = (getUnit(num * 79 + 29, 20) - 10) * 0.5; // Small position variance
    const offsetY = (getUnit(num * 83 + 31, 20) - 10) * 0.5;
    return `translate(${SIZE / 2 + offsetX}, ${SIZE / 2 + offsetY}) rotate(${rotation}) translate(${-SIZE / 2}, ${-SIZE / 2}) translate(${fit.translateX}, ${fit.translateY}) scale(${fit.scale})`;
  })();

  const fgTransform = (() => {
    const scaleVariance = 0.8 + getUnit(num * 89 + 23, 10) / 10; // 0.8 to 1.8 (reduced from 0.7-2.1)
    const fit = fitToBox(
      fgPath.minX,
      fgPath.maxX,
      fgPath.minY,
      fgPath.maxY,
      SIZE,
      scaleVariance
    );
    const rotation = getUnit(num * 97 + 37, 180) - 90; // -90 to +90 degrees - more rotation range
    // Add significant position offset for foreground
    const offsetX = (getUnit(num * 101 + 73, 40) - 20) * 1.5; // -30 to +30 pixels
    const offsetY = (getUnit(num * 103 + 79, 40) - 20) * 1.5; // -30 to +30 pixels
    return `translate(${SIZE / 2 + offsetX}, ${SIZE / 2 + offsetY}) rotate(${rotation}) translate(${-SIZE / 2}, ${-SIZE / 2}) translate(${fit.translateX}, ${fit.translateY}) scale(${fit.scale})`;
  })();

  // More varied stroke widths - use prime multipliers
  const bgCoverage = 0.1 + getUnit(num * 107 + 41, 15) / 100; // 0.1 to 0.25
  const fgCoverage = 0.05 + getUnit(num * 109 + 43, 10) / 100; // 0.05 to 0.15
  const bgStrokeWidth = strokeWidthForCoverage(
    bgPath.pathLength,
    SIZE,
    bgCoverage,
    0.5,
    4
  ); // reduced max from 10 to 4
  const fgStrokeWidth = strokeWidthForCoverage(
    fgPath.pathLength,
    SIZE,
    fgCoverage,
    0.3,
    2.5
  ); // reduced max from 4 to 2.5

  // Varied dash patterns - use prime multipliers
  // Direct calculation instead of useMemo for SSR compatibility
  const fgDashPattern = (() => {
    const useDash = getUnit(num * 113 + 47, 3) > 0; // 2/3 chance of dashes
    if (!useDash) {
      return "none";
    }

    const repeats = 8 + getUnit(num * 127 + 53, 16); // 8 to 24 repeats
    const unit = fgPath.pathLength / repeats;
    const dashRatio = 0.2 + getUnit(num * 131 + 59, 6) / 10; // 0.2 to 0.8
    const gapRatio = 0.2 + getUnit(num * 137 + 61, 4) / 10; // 0.2 to 0.6
    return `${unit * dashRatio} ${unit * gapRatio}`;
  })();

  // Vary opacity with more range - use prime multipliers
  const bgOpacity = 0.4 + getUnit(num * 139 + 67, 4) / 10; // 0.4 to 0.8 (increased minimum)
  // Make foreground fractal mostly opaque, transparency is rare (10% chance)
  const fgOpacity =
    getUnit(num * 149, 100) < 10
      ? 0.6 + getUnit(num * 151 + 71, 3) / 10 // 0.6 to 0.9 when transparent (rare)
      : 1.0; // fully opaque most of the time

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
      {title ? <title>{name}</title> : null}

      <defs>
        {/* Gradients using all colors */}
        <linearGradient id={gradientBgID} x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: colors[0] }} />
          <stop offset="50%" style={{ stopColor: colors[1] || colors[0] }} />
          <stop
            offset="100%"
            style={{ stopColor: colors[2] || colors[1] || colors[0] }}
          />
        </linearGradient>

        <linearGradient id={gradientFgID} x1="0%" x2="100%" y1="0%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: colors[2] || colors[1] || colors[0] }}
          />
          <stop
            offset="50%"
            style={{ stopColor: colors[3] || colors[2] || colors[0] }}
          />
          <stop
            offset="100%"
            style={{ stopColor: colors[4] || colors[3] || colors[0] }}
          />
        </linearGradient>

        {/* Accent gradient for additional detail */}
        <radialGradient cx="50%" cy="50%" id={gradientAccentID} r="50%">
          <stop
            offset="0%"
            style={{
              stopColor: colors[4] || colors[3] || colors[0],
              stopOpacity: 0.8,
            }}
          />
          <stop
            offset="100%"
            style={{ stopColor: colors[0], stopOpacity: 0.2 }}
          />
        </radialGradient>

        {/* Clipping mask */}
        <clipPath id={clipID}>
          <rect height={SIZE} width={SIZE} />
        </clipPath>

        {/* Mask for rounded corners */}
        <mask
          height={SIZE}
          id={maskID}
          maskUnits="userSpaceOnUse"
          width={SIZE}
          x={0}
          y={0}
        >
          <rect fill="#FFFFFF" height={SIZE} width={SIZE} />
        </mask>
      </defs>

      <g clipPath={`url(#${clipID})`} mask={`url(#${maskID})`}>
        {/* Solid fallback background from palette - always visible */}
        <rect
          height={SIZE}
          style={{
            fill: getRandomColor(num * 19, colors, colors.length),
          }}
          width={SIZE}
        />

        {/* Semi-transparent overlay - rarely uses gradient (10% chance) */}
        <rect
          height={SIZE}
          opacity={0.15}
          style={{
            fill:
              getUnit(num * 251, 100) < 10
                ? `url(#${gradientAccentID})`
                : colors[0],
          }}
          width={SIZE}
        />

        {/* Background fractal - dense, overscaled */}
        <path
          d={bgPath.path}
          style={{
            fill: "none",
            opacity: bgOpacity,
            stroke: useGradients ? `url(#${gradientBgID})` : bgColor,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: bgStrokeWidth,
          }}
          transform={bgTransform}
        />

        {/* Foreground fractal - sparse, contrasting */}
        <path
          d={fgPath.path}
          pathLength={fgPath.pathLength}
          style={{
            fill: "none",
            mixBlendMode: useBlendMode ? blendMode : "normal",
            opacity: fgOpacity,
            stroke: useGradients ? `url(#${gradientFgID})` : fgColor,
            strokeDasharray: fgDashPattern,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: fgStrokeWidth,
          }}
          transform={fgTransform}
        />

        {/* Small accent dots using the last color - each has 20% chance */}
        {Array.from({ length: 5 }, (_, i) => {
          // Each dot has independent chance to appear
          if (getUnit(num * 151 + i * 17, 100) >= 20) {
            return null;
          }

          const angle = (getUnit(num * 157 + i * 19, 360) * Math.PI) / 180;
          const radius = SIZE * (0.2 + getUnit(num * 163 + i * 23, 25) / 100);
          const dotX = SIZE / 2 + Math.cos(angle) * radius;
          const dotY = SIZE / 2 + Math.sin(angle) * radius;
          const dotSize = 0.5 + getUnit(num * 167 + i * 29, 4) / 2;

          return (
            <circle
              cx={dotX}
              cy={dotY}
              key={`dot-${dotX}-${dotY}`}
              r={dotSize}
              style={{
                fill: colors[4] || colors[3] || colors[0],
                opacity: 0.3 + getUnit(num * 173 + i * 31, 40) / 100,
              }}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default AvatarFractal;
