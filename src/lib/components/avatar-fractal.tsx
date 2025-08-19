import * as React from 'react';
import { hashCode, getUnit } from '../utilities';
import type { AvatarProps } from './types';

const SIZE = 80;

// Type-safe fractal definitions
interface Fractal {
  name: string;
  axiom: string;
  rules: Record<string, string>;
  angle: number;
  iterations: number;
  angleVariance?: number;
  iterVariance?: number;
}

// Dense fractals for backgrounds
const BACKGROUND_FRACTALS: Fractal[] = [
  {
    name: 'Hilbert',
    axiom: 'A',
    rules: { 'A': '-BF+AFA+FB-', 'B': '+AF-BFB-FA+', 'F': 'F' },
    angle: 90,
    iterations: 5,
    angleVariance: 5,
    iterVariance: 1,
  },
  {
    name: 'Gosper',
    axiom: 'A',
    rules: { 'A': 'A-B--B+A++AA+B-', 'B': '+A-BB--B-A++A+B', 'F': 'F' },
    angle: 60,
    iterations: 4,
    angleVariance: 10,
    iterVariance: 1,
  },
  {
    name: 'Sierpinski',
    axiom: 'F-G-G',
    rules: { 'F': 'F-G+F+G-F', 'G': 'GG' },
    angle: 120,
    iterations: 5,
    angleVariance: 15,
    iterVariance: 1,
  },
  {
    name: 'Peano',
    axiom: 'F',
    rules: { 'F': 'F+F-F-F-F+F+F+F-F' },
    angle: 90,
    iterations: 3,
    angleVariance: 8,
    iterVariance: 1,
  },
  {
    name: 'Moore',
    axiom: 'LFL+F+LFL',
    rules: { 'L': '-RF+LFL+FR-', 'R': '+LF-RFR-FL+', 'F': 'F' },
    angle: 90,
    iterations: 4,
    angleVariance: 5,
    iterVariance: 1,
  },
  {
    name: 'Hexagon',
    axiom: 'F',
    rules: { 'F': 'F+F-F-F+F+F-F' },
    angle: 60,
    iterations: 3,
    angleVariance: 10,
    iterVariance: 1,
  },
];

// Sparse fractals for foregrounds  
const FOREGROUND_FRACTALS: Fractal[] = [
  {
    name: 'Dragon',
    axiom: 'FX',
    rules: { 'X': 'X+YF+', 'Y': '-FX-Y', 'F': 'F' },
    angle: 90,
    iterations: 11,
    angleVariance: 15,
    iterVariance: 2,
  },
  {
    name: 'Koch',
    axiom: 'F++F++F',
    rules: { 'F': 'F-F++F-F' },
    angle: 60,
    iterations: 4,
    angleVariance: 10,
    iterVariance: 1,
  },
  {
    name: 'Plant',
    axiom: 'X',
    rules: { 'X': 'F+[[X]-X]-F[-FX]+X', 'F': 'FF' },
    angle: 25,
    iterations: 4,
    angleVariance: 10,
    iterVariance: 1,
  },
  {
    name: 'Levy',
    axiom: 'F',
    rules: { 'F': '+F--F+' },
    angle: 45,
    iterations: 10,
    angleVariance: 15,
    iterVariance: 2,
  },
  {
    name: 'Tree',
    axiom: 'F',
    rules: { 'F': 'F[+F]F[-F]F' },
    angle: 25.7,
    iterations: 4,
    angleVariance: 8,
    iterVariance: 1,
  },
  {
    name: 'Fern',
    axiom: 'X',
    rules: { 'X': 'F[+X][-X]FX', 'F': 'FF' },
    angle: 25,
    iterations: 5,
    angleVariance: 12,
    iterVariance: 1,
  },
  {
    name: 'Crystal',
    axiom: 'F+F+F+F',
    rules: { 'F': 'FF+F+F+F+F+F-F' },
    angle: 90,
    iterations: 3,
    angleVariance: 10,
    iterVariance: 1,
  },
];

// Generate L-System string
function generateLSystem(axiom: string, rules: Record<string, string>, iterations: number): string {
  let current = axiom;
  
  for (let i = 0; i < iterations; i++) {
    let next = '';
    for (const char of current) {
      next += rules[char] || char;
    }
    current = next;
  }
  
  return current;
}

// Convert L-System to SVG path with bounding box tracking
interface PathResult {
  path: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  pathLength: number;
}

function lSystemToPath(system: string, angle: number): PathResult {
  let x = 0;
  let y = 0;
  let currentAngle = 0;
  const stack: Array<{x: number, y: number, angle: number}> = [];
  
  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  let pathLength = 0;
  
  const paths: string[] = [];
  let currentPath = `M ${x} ${y}`;
  
  for (const char of system) {
    switch(char) {
      case 'F':
      case 'G':
        // Draw forward
        const rad = (currentAngle * Math.PI) / 180;
        const prevX = x, prevY = y;
        x += Math.cos(rad);
        y += Math.sin(rad);
        
        currentPath += ` L ${x} ${y}`;
        pathLength += Math.sqrt((x - prevX) ** 2 + (y - prevY) ** 2);
        
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        break;
      case '+':
        currentAngle += angle;
        break;
      case '-':
        currentAngle -= angle;
        break;
      case '[':
        stack.push({x, y, angle: currentAngle});
        break;
      case ']':
        const state = stack.pop();
        if (state) {
          if (currentPath.length > 10) {
            paths.push(currentPath);
          }
          x = state.x;
          y = state.y;
          currentAngle = state.angle;
          currentPath = `M ${x} ${y}`;
        }
        break;
    }
  }
  
  if (currentPath.length > 10) {
    paths.push(currentPath);
  }
  
  return {
    path: paths.join(' '),
    minX,
    maxX,
    minY,
    maxY,
    pathLength
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
  margin: number = 0.95
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
  animate?: boolean | 'subtle' | 'pulse' | 'rotate';
}

const AvatarFractal = ({ name, colors, title, square, size, animate, ...otherProps }: FractalAvatarProps) => {
  const maskID = React.useId();
  const clipID = React.useId();
  const gradientBgID = React.useId();
  const gradientFgID = React.useId();
  const num = hashCode(name);
  
  // Select fractal combinations with more variation
  const bgFractalIndex = getUnit(num, BACKGROUND_FRACTALS.length);
  const fgFractalIndex = getUnit(num + 7, FOREGROUND_FRACTALS.length);
  const bgFractal = BACKGROUND_FRACTALS[bgFractalIndex];
  const fgFractal = FOREGROUND_FRACTALS[fgFractalIndex];
  
  // Vary parameters based on hash for more uniqueness
  const bgIterations = React.useMemo(() => {
    const variance = bgFractal.iterVariance || 1;
    const offset = getUnit(num + 3, variance * 2 + 1) - variance;
    return Math.max(1, bgFractal.iterations + offset);
  }, [bgFractal, num]);
  
  const bgAngle = React.useMemo(() => {
    const variance = bgFractal.angleVariance || 10;
    const offset = (getUnit(num + 5, variance * 2) - variance) / 2;
    return bgFractal.angle + offset;
  }, [bgFractal, num]);
  
  const fgIterations = React.useMemo(() => {
    const variance = fgFractal.iterVariance || 1;
    const offset = getUnit(num + 11, variance * 2 + 1) - variance;
    return Math.max(1, fgFractal.iterations + offset);
  }, [fgFractal, num]);
  
  const fgAngle = React.useMemo(() => {
    const variance = fgFractal.angleVariance || 10;
    const offset = (getUnit(num + 13, variance * 2) - variance) / 2;
    return fgFractal.angle + offset;
  }, [fgFractal, num]);
  
  // Generate background fractal with varied parameters
  const bgSystem = React.useMemo(() => 
    generateLSystem(bgFractal.axiom, bgFractal.rules, bgIterations),
    [bgFractal, bgIterations]
  );
  
  const bgPath = React.useMemo(() => 
    lSystemToPath(bgSystem, bgAngle),
    [bgSystem, bgAngle]
  );
  
  // Generate foreground fractal with varied parameters
  const fgSystem = React.useMemo(() => 
    generateLSystem(fgFractal.axiom, fgFractal.rules, fgIterations),
    [fgFractal, fgIterations]
  );
  
  const fgPath = React.useMemo(() => 
    lSystemToPath(fgSystem, fgAngle),
    [fgSystem, fgAngle]
  );
  
  // More varied transforms
  const bgTransform = React.useMemo(() => {
    const scaleVariance = 1.8 + (getUnit(num + 17, 20) / 10); // 1.8 to 3.8
    const fit = fitToBox(bgPath.minX, bgPath.maxX, bgPath.minY, bgPath.maxY, SIZE, scaleVariance);
    const rotation = getUnit(num + 19, 60) - 30; // -30 to +30 degrees
    const offsetX = (getUnit(num + 29, 20) - 10) * 0.5; // Small position variance
    const offsetY = (getUnit(num + 31, 20) - 10) * 0.5;
    return `translate(${SIZE/2 + offsetX}, ${SIZE/2 + offsetY}) rotate(${rotation}) translate(${-SIZE/2}, ${-SIZE/2}) translate(${fit.translateX}, ${fit.translateY}) scale(${fit.scale})`;
  }, [bgPath, num]);
  
  const fgTransform = React.useMemo(() => {
    const scaleVariance = 0.5 + (getUnit(num + 23, 16) / 10); // 0.5 to 2.1 - much more zoom variation
    const fit = fitToBox(fgPath.minX, fgPath.maxX, fgPath.minY, fgPath.maxY, SIZE, scaleVariance);
    const rotation = getUnit(num + 37, 180) - 90; // -90 to +90 degrees - more rotation range
    // Add significant position offset for foreground
    const offsetX = (getUnit(num + 73, 40) - 20) * 1.5; // -30 to +30 pixels
    const offsetY = (getUnit(num + 79, 40) - 20) * 1.5; // -30 to +30 pixels
    return `translate(${SIZE/2 + offsetX}, ${SIZE/2 + offsetY}) rotate(${rotation}) translate(${-SIZE/2}, ${-SIZE/2}) translate(${fit.translateX}, ${fit.translateY}) scale(${fit.scale})`;
  }, [fgPath, num]);
  
  // More varied stroke widths
  const bgCoverage = 0.1 + (getUnit(num + 41, 15) / 100); // 0.1 to 0.25
  const fgCoverage = 0.05 + (getUnit(num + 43, 10) / 100); // 0.05 to 0.15
  const bgStrokeWidth = strokeWidthForCoverage(bgPath.pathLength, SIZE, bgCoverage, 0.5, 10);
  const fgStrokeWidth = strokeWidthForCoverage(fgPath.pathLength, SIZE, fgCoverage, 0.3, 4);
  
  // Varied dash patterns
  const fgDashPattern = React.useMemo(() => {
    const useDash = getUnit(num + 47, 3) > 0; // 2/3 chance of dashes
    if (!useDash) return 'none';
    
    const repeats = 8 + getUnit(num + 53, 16); // 8 to 24 repeats
    const unit = fgPath.pathLength / repeats;
    const dashRatio = 0.2 + (getUnit(num + 59, 6) / 10); // 0.2 to 0.8
    const gapRatio = 0.2 + (getUnit(num + 61, 4) / 10); // 0.2 to 0.6
    return `${unit * dashRatio} ${unit * gapRatio}`;
  }, [fgPath.pathLength, num]);
  
  // Vary opacity with more range
  const bgOpacity = 0.2 + (getUnit(num + 67, 6) / 10); // 0.2 to 0.8
  const fgOpacity = 0.4 + (getUnit(num + 71, 6) / 10); // 0.4 to 1.0 - more variation
  
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
        {/* Gradients */}
        <linearGradient id={gradientBgID} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: colors[0] }} />
          <stop offset="100%" style={{ stopColor: colors[1] || colors[0] }} />
        </linearGradient>
        
        <linearGradient id={gradientFgID} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: colors[2] || colors[1] || colors[0] }} />
          <stop offset="100%" style={{ stopColor: colors[3] || colors[2] || colors[0] }} />
        </linearGradient>
        
        {/* Clipping mask */}
        <clipPath id={clipID}>
          <rect width={SIZE} height={SIZE} rx={square ? 0 : SIZE * 2} />
        </clipPath>
        
        {/* Mask for rounded corners */}
        <mask id={maskID} maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
          <rect width={SIZE} height={SIZE} rx={square ? undefined : SIZE * 2} fill="#FFFFFF" />
        </mask>
      </defs>
      
      <g mask={`url(#${maskID})`} clipPath={`url(#${clipID})`}>
        {/* Background color */}
        <rect width={SIZE} height={SIZE} style={{ fill: colors[0] }} opacity={0.15} />
        
        {/* Background fractal - dense, overscaled */}
        <path
          d={bgPath.path}
          transform={bgTransform}
          style={{
            fill: 'none',
            stroke: `url(#${gradientBgID})`,
            strokeWidth: bgStrokeWidth,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            opacity: bgOpacity
          }}
        />
        
        {/* Foreground fractal - sparse, contrasting */}
        <path
          d={fgPath.path}
          transform={fgTransform}
          pathLength={fgPath.pathLength}
          style={{
            fill: 'none',
            stroke: `url(#${gradientFgID})`,
            strokeWidth: fgStrokeWidth,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeDasharray: fgDashPattern,
            opacity: fgOpacity
          }}
        />
      </g>
    </svg>
  );
};

export default AvatarFractal;