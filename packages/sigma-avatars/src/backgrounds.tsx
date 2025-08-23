import * as React from 'react';
import { getUnit, getRandomColor } from './utilities';

export interface BackgroundProps {
  size: number;
  colors: string[];
  seed: number; // From hashCode
  patternId: string; // Unique ID for defs
  maskId?: string; // Mask ID for clipping
  filterUrl?: string; // Optional filter reference
}

export interface BackgroundPattern {
  id: string;
  name: string;
  type: 'svg-path' | 'pattern' | 'gradient' | 'solid';
  render: (props: BackgroundProps) => React.ReactNode;
  needsDefs?: boolean; // Whether pattern needs to be in <defs>
}

// Helper to calculate transform for organic shapes
function calculateTransform(seed: number, size: number, index: number = 0): string {
  const translateX = getUnit(seed * (index + 1), size / 10, 1);
  const translateY = getUnit(seed * (index + 1), size / 10, 2);
  const scale = 1.2 + getUnit(seed * (index + 1), size / 20) / 10;
  const rotate = getUnit(seed * (index + 1), 360, 1);
  
  return `translate(${translateX} ${translateY}) rotate(${rotate} ${size / 2} ${size / 2}) scale(${scale})`;
}

// ===========================================
// ORGANIC/BLOB PATTERNS (from Marble variant)
// ===========================================

export const marbleBlob1: BackgroundPattern = {
  id: 'marble-blob-1',
  name: 'Marble Blob 1',
  type: 'svg-path',
  render: ({ size, colors, seed, filterUrl }) => {
    const color = getRandomColor(seed + 1, colors, colors.length);
    const transform = calculateTransform(seed, size, 1);
    
    return (
      <path
        d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
        filter={filterUrl}
        style={{ fill: color }}
        transform={transform}
      />
    );
  }
};

export const marbleBlob2: BackgroundPattern = {
  id: 'marble-blob-2',
  name: 'Marble Blob 2',
  type: 'svg-path',
  render: ({ size, colors, seed, filterUrl }) => {
    const color = getRandomColor(seed + 2, colors, colors.length);
    const transform = calculateTransform(seed, size, 2);
    
    return (
      <path
        d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
        filter={filterUrl}
        style={{ 
          fill: color,
          mixBlendMode: 'overlay' as any
        }}
        transform={transform}
      />
    );
  }
};

export const cloudShape: BackgroundPattern = {
  id: 'cloud-shape',
  name: 'Cloud Shape',
  type: 'svg-path',
  render: ({ size, colors, seed, filterUrl }) => {
    const color = getRandomColor(seed + 3, colors, colors.length);
    const transform = calculateTransform(seed, size, 3);
    
    return (
      <path
        d="M20 60 Q30 40 50 45 T80 50 Q85 55 80 65 Q70 75 50 70 Q35 68 25 75 Q15 70 20 60"
        filter={filterUrl}
        style={{ fill: color, opacity: 0.7 }}
        transform={transform}
      />
    );
  }
};

export const waveShape: BackgroundPattern = {
  id: 'wave-shape',
  name: 'Wave Shape',
  type: 'svg-path',
  render: ({ size, colors, seed, filterUrl }) => {
    const color = getRandomColor(seed + 4, colors, colors.length);
    const transform = calculateTransform(seed, size, 4);
    
    return (
      <path
        d="M0 40 Q20 20 40 40 T80 40 L80 80 L0 80 Z"
        filter={filterUrl}
        style={{ fill: color, opacity: 0.6 }}
        transform={transform}
      />
    );
  }
};

// ===========================================
// GEOMETRIC PATTERNS (from Pepe variant + new)
// ===========================================

export const stripesVertical: BackgroundPattern = {
  id: 'stripes-vertical',
  name: 'Vertical Stripes',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    
    return (
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={size * 0.2}
        height={size}
      >
        <rect width={size * 0.1} height={size} style={{ fill: color1 }} />
        <rect x={size * 0.1} width={size * 0.1} height={size} style={{ fill: color2 }} />
      </pattern>
    );
  }
};

export const stripesHorizontal: BackgroundPattern = {
  id: 'stripes-horizontal',
  name: 'Horizontal Stripes',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    
    return (
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={size}
        height={size * 0.2}
      >
        <rect width={size} height={size * 0.1} style={{ fill: color1 }} />
        <rect y={size * 0.1} width={size} height={size * 0.1} style={{ fill: color2 }} />
      </pattern>
    );
  }
};

export const stripesDiagonal: BackgroundPattern = {
  id: 'stripes-diagonal',
  name: 'Diagonal Stripes',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    
    return (
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={size * 0.2}
        height={size * 0.2}
      >
        <rect width={size * 0.2} height={size * 0.2} style={{ fill: color1 }} />
        <path
          d={`M0,${size * 0.2} L${size * 0.2},0 M0,0 L${size * 0.2},${size * 0.2}`}
          style={{
            stroke: color2,
            strokeWidth: size * 0.08,
            strokeLinecap: 'square' as any
          }}
        />
      </pattern>
    );
  }
};

export const polkaDots: BackgroundPattern = {
  id: 'polka-dots',
  name: 'Polka Dots',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const bgColor = getRandomColor(seed, colors, colors.length);
    const dotColor = getRandomColor(seed + 1, colors, colors.length);
    const dotSize = size * 0.06;
    
    return (
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={size * 0.25}
        height={size * 0.25}
      >
        <rect width={size * 0.25} height={size * 0.25} style={{ fill: bgColor }} />
        <circle cx={size * 0.125} cy={size * 0.125} r={dotSize} style={{ fill: dotColor }} />
        <circle cx={0} cy={0} r={dotSize} style={{ fill: dotColor }} />
        <circle cx={size * 0.25} cy={0} r={dotSize} style={{ fill: dotColor }} />
        <circle cx={0} cy={size * 0.25} r={dotSize} style={{ fill: dotColor }} />
        <circle cx={size * 0.25} cy={size * 0.25} r={dotSize} style={{ fill: dotColor }} />
      </pattern>
    );
  }
};

export const checkerboard: BackgroundPattern = {
  id: 'checkerboard',
  name: 'Checkerboard',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const squareSize = size * 0.1;
    
    return (
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={squareSize * 2}
        height={squareSize * 2}
      >
        <rect width={squareSize} height={squareSize} style={{ fill: color1 }} />
        <rect x={squareSize} y={squareSize} width={squareSize} height={squareSize} style={{ fill: color1 }} />
        <rect x={squareSize} width={squareSize} height={squareSize} style={{ fill: color2 }} />
        <rect y={squareSize} width={squareSize} height={squareSize} style={{ fill: color2 }} />
      </pattern>
    );
  }
};

export const triangles: BackgroundPattern = {
  id: 'triangles',
  name: 'Triangles',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const triSize = size * 0.15;
    
    return (
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={triSize}
        height={triSize}
      >
        <polygon 
          points={`0,${triSize} ${triSize/2},0 ${triSize},${triSize}`}
          style={{ fill: color1 }} 
        />
        <polygon 
          points={`0,0 ${triSize/2},0 0,${triSize}`}
          style={{ fill: color2 }} 
        />
        <polygon 
          points={`${triSize},0 ${triSize},${triSize} ${triSize/2},0`}
          style={{ fill: color2 }} 
        />
      </pattern>
    );
  }
};

export const hexagons: BackgroundPattern = {
  id: 'hexagons',
  name: 'Hexagons',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const hexSize = size * 0.1;
    
    return (
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={hexSize * 3}
        height={hexSize * 2.6}
      >
        <polygon 
          points={`${hexSize},0 ${hexSize*2},0 ${hexSize*2.5},${hexSize*0.87} ${hexSize*2},${hexSize*1.73} ${hexSize},${hexSize*1.73} ${hexSize*0.5},${hexSize*0.87}`}
          style={{ fill: color1, stroke: color2, strokeWidth: 1 }} 
        />
      </pattern>
    );
  }
};

export const zigzag: BackgroundPattern = {
  id: 'zigzag',
  name: 'Zigzag',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const zSize = size * 0.2;
    
    return (
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={zSize}
        height={zSize}
      >
        <rect width={zSize} height={zSize} style={{ fill: color1 }} />
        <path
          d={`M0,${zSize/2} L${zSize/4},0 L${zSize/2},${zSize/2} L${zSize*3/4},0 L${zSize},${zSize/2}`}
          style={{ stroke: color2, strokeWidth: zSize * 0.15, fill: 'none' }}
        />
      </pattern>
    );
  }
};

// Liquid Cheese pattern
export const liquidCheese: BackgroundPattern = {
  id: 'liquid-cheese',
  name: 'Liquid Cheese',
  type: 'svg-path',
  render: ({ size, colors, seed }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const color3 = getRandomColor(seed + 2, colors, colors.length);
    
    return (
      <>
        <rect width={size} height={size} style={{ fill: color1 }} />
        <path
          d={`M0 ${size*0.3}Q${size*0.2} ${size*0.1} ${size*0.4} ${size*0.2}T${size*0.8} ${size*0.3}T${size} ${size*0.5}V${size}H0Z`}
          style={{ fill: color2, opacity: 0.8 }}
        />
        <path
          d={`M0 ${size*0.6}Q${size*0.3} ${size*0.4} ${size*0.5} ${size*0.5}T${size} ${size*0.6}V${size}H0Z`}
          style={{ fill: color3, opacity: 0.6 }}
        />
      </>
    );
  }
};

// Wavey Fingerprint pattern
export const waveyFingerprint: BackgroundPattern = {
  id: 'wavey-fingerprint',
  name: 'Wavey Fingerprint',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    
    return (
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={size * 0.4}
        height={size * 0.2}
      >
        <rect width={size * 0.4} height={size * 0.2} style={{ fill: color1 }} />
        {[0, 0.05, 0.1, 0.15].map((offset, i) => (
          <path
            key={i}
            d={`M0,${size * (0.1 + offset)} Q${size*0.1},${size*(0.05+offset)} ${size*0.2},${size*(0.1+offset)} T${size*0.4},${size*(0.1+offset)}`}
            style={{ stroke: color2, strokeWidth: size * 0.01, fill: 'none', opacity: 1 - i * 0.2 }}
          />
        ))}
      </pattern>
    );
  }
};

// Dragon Scales pattern
export const dragonScales: BackgroundPattern = {
  id: 'dragon-scales',
  name: 'Dragon Scales',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const scaleSize = size * 0.15;
    
    return (
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={scaleSize}
        height={scaleSize}
      >
        <rect width={scaleSize} height={scaleSize} style={{ fill: color1 }} />
        <path
          d={`M0,${scaleSize} Q${scaleSize/2},${scaleSize*0.7} ${scaleSize},${scaleSize} L${scaleSize},0 Q${scaleSize/2},${scaleSize*0.3} 0,0 Z`}
          style={{ fill: color2, stroke: color1, strokeWidth: 1 }}
        />
      </pattern>
    );
  }
};

// Confetti Doodles pattern
export const confettiDoodles: BackgroundPattern = {
  id: 'confetti-doodles',
  name: 'Confetti Doodles',
  type: 'svg-path',
  render: ({ size, colors, seed }) => {
    const shapes = [];
    for (let i = 0; i < 20; i++) {
      const x = getUnit(seed + i * 2, size);
      const y = getUnit(seed + i * 3, size);
      const shapeSize = getUnit(seed + i * 5, size / 15, 1) + size / 30;
      const color = getRandomColor(seed + i, colors, colors.length);
      const rotation = getUnit(seed + i * 7, 360);
      
      if (i % 3 === 0) {
        // Rectangle confetti
        shapes.push(
          <rect
            key={i}
            x={x}
            y={y}
            width={shapeSize}
            height={shapeSize / 2}
            style={{ fill: color }}
            transform={`rotate(${rotation} ${x + shapeSize/2} ${y + shapeSize/4})`}
          />
        );
      } else if (i % 3 === 1) {
        // Circle confetti
        shapes.push(
          <circle
            key={i}
            cx={x}
            cy={y}
            r={shapeSize / 2}
            style={{ fill: color }}
          />
        );
      } else {
        // Triangle confetti
        shapes.push(
          <polygon
            key={i}
            points={`${x},${y} ${x+shapeSize},${y} ${x+shapeSize/2},${y-shapeSize}`}
            style={{ fill: color }}
            transform={`rotate(${rotation} ${x + shapeSize/2} ${y})`}
          />
        );
      }
    }
    
    return (
      <>
        <rect width={size} height={size} style={{ fill: getRandomColor(seed, colors, colors.length) }} />
        {shapes}
      </>
    );
  }
};

// Protruding Squares pattern
export const protrudingSquares: BackgroundPattern = {
  id: 'protruding-squares',
  name: 'Protruding Squares',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const color3 = getRandomColor(seed + 2, colors, colors.length);
    const squareSize = size * 0.2;
    
    return (
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={squareSize}
        height={squareSize}
      >
        <rect width={squareSize} height={squareSize} style={{ fill: color1 }} />
        <rect 
          x={squareSize * 0.1} 
          y={squareSize * 0.1} 
          width={squareSize * 0.4} 
          height={squareSize * 0.4} 
          style={{ fill: color2 }}
        />
        <rect 
          x={squareSize * 0.5} 
          y={squareSize * 0.5} 
          width={squareSize * 0.4} 
          height={squareSize * 0.4} 
          style={{ fill: color3 }}
        />
      </pattern>
    );
  }
};

// Diagonal Stripes (different from our existing one - more like the SVG backgrounds version)
export const diagonalLines: BackgroundPattern = {
  id: 'diagonal-lines',
  name: 'Diagonal Lines',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    
    return (
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={size * 0.1}
        height={size * 0.1}
        patternTransform={`rotate(45)`}
      >
        <rect width={size * 0.1} height={size * 0.1} style={{ fill: color1 }} />
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={size * 0.1}
          style={{ stroke: color2, strokeWidth: size * 0.03 }}
        />
      </pattern>
    );
  }
};

// Endless Constellation pattern
export const endlessConstellation: BackgroundPattern = {
  id: 'endless-constellation',
  name: 'Endless Constellation',
  type: 'svg-path',
  render: ({ size, colors, seed }) => {
    const bgColor = getRandomColor(seed, colors, colors.length);
    const starColor = getRandomColor(seed + 1, colors, colors.length);
    const lineColor = getRandomColor(seed + 2, colors, colors.length);
    
    const stars = [];
    const connections = [];
    const points = [];
    
    // Generate star points
    for (let i = 0; i < 15; i++) {
      const x = getUnit(seed + i * 2, size);
      const y = getUnit(seed + i * 3, size);
      points.push({ x, y });
      
      // Add star
      const starSize = getUnit(seed + i * 5, 3, 1) + 1;
      stars.push(
        <circle
          key={`star-${i}`}
          cx={x}
          cy={y}
          r={starSize}
          style={{ fill: starColor }}
        />
      );
    }
    
    // Connect some stars
    for (let i = 0; i < points.length - 1; i++) {
      if (getUnit(seed + i * 7, 10) > 5) {
        const next = (i + 1 + getUnit(seed + i * 11, 3)) % points.length;
        connections.push(
          <line
            key={`line-${i}`}
            x1={points[i].x}
            y1={points[i].y}
            x2={points[next].x}
            y2={points[next].y}
            style={{ stroke: lineColor, strokeWidth: 0.5, opacity: 0.3 }}
          />
        );
      }
    }
    
    return (
      <>
        <rect width={size} height={size} style={{ fill: bgColor }} />
        {connections}
        {stars}
      </>
    );
  }
};

// ===========================================
// GRADIENT PATTERNS
// ===========================================

export const radialGradient: BackgroundPattern = {
  id: 'radial-gradient',
  name: 'Radial Gradient',
  type: 'gradient',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    
    return (
      <radialGradient id={patternId}>
        <stop offset="0%" style={{ stopColor: color1 }} />
        <stop offset="100%" style={{ stopColor: color2 }} />
      </radialGradient>
    );
  }
};

// Barcode pattern - variable width vertical stripes
export const barcodeStripes: BackgroundPattern = {
  id: 'barcode-stripes',
  name: 'Barcode Stripes',
  type: 'svg-path',
  render: ({ size, colors, seed }: BackgroundProps) => {
    const stripes: React.ReactElement[] = [];
    let currentX = 0;
    let stripeIndex = 0;
    const MIN_WIDTH = 1;
    const MAX_WIDTH = 8;
    
    // Generate deterministic stripes
    while (currentX < size) {
      const widthSeed = seed + (stripeIndex * 997);
      const colorSeed = seed + (stripeIndex * 1009);
      
      // Calculate stripe width
      let stripeWidth;
      if (stripeIndex % 3 === 0) {
        // Every third stripe can be wider
        stripeWidth = MIN_WIDTH + (Math.abs(widthSeed) % (MAX_WIDTH * 2 - MIN_WIDTH));
      } else {
        stripeWidth = MIN_WIDTH + (Math.abs(widthSeed) % (MAX_WIDTH - MIN_WIDTH));
      }
      
      // Don't exceed boundary
      const finalWidth = Math.min(stripeWidth, size - currentX);
      
      // Select color
      const colorIndex = Math.abs(colorSeed) % colors.length;
      const color = colors[colorIndex];
      
      stripes.push(
        <rect
          key={stripeIndex}
          x={currentX}
          y={0}
          width={finalWidth}
          height={size}
          fill={color}
        />
      );
      
      currentX += finalWidth;
      stripeIndex++;
    }
    
    return <>{stripes}</>;
  },
};

// Subtle dot grid pattern
export const dotGrid: BackgroundPattern = {
  id: 'dot-grid',
  name: 'Dot Grid',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }: BackgroundProps) => {
    const spacing = 15 + (seed % 10);
    const dotSize = 1.5 + (seed % 3) * 0.5;
    const color = getRandomColor(seed, colors, colors.length);
    
    return (
      <pattern id={patternId} patternUnits="userSpaceOnUse" width={spacing} height={spacing}>
        <circle cx={spacing/2} cy={spacing/2} r={dotSize} fill={color} opacity="0.3" />
      </pattern>
    );
  },
};

// Cross hatch pattern
export const crossHatch: BackgroundPattern = {
  id: 'cross-hatch',
  name: 'Cross Hatch',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }: BackgroundProps) => {
    const spacing = 8 + (seed % 12);
    const strokeWidth = 0.5 + (seed % 10) * 0.1;
    const color = getRandomColor(seed, colors, colors.length);
    
    return (
      <pattern id={patternId} patternUnits="userSpaceOnUse" width={spacing} height={spacing}>
        <path d={`M0,${spacing} L${spacing},0 M0,0 L${spacing},${spacing}`} 
              stroke={color} strokeWidth={strokeWidth} opacity="0.2" />
      </pattern>
    );
  },
};

// Soft circles/bubbles pattern
export const softCircles: BackgroundPattern = {
  id: 'soft-circles',
  name: 'Soft Circles',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }: BackgroundProps) => {
    const patternSize = 40 + (seed % 30);
    const circleSize = patternSize * 0.35;
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    
    return (
      <pattern id={patternId} patternUnits="userSpaceOnUse" width={patternSize} height={patternSize}>
        <circle cx={patternSize/2} cy={patternSize/2} r={circleSize} 
                fill={color1} opacity="0.15" />
        <circle cx={0} cy={0} r={circleSize * 0.7} 
                fill={color2} opacity="0.1" />
        <circle cx={patternSize} cy={0} r={circleSize * 0.7} 
                fill={color2} opacity="0.1" />
        <circle cx={0} cy={patternSize} r={circleSize * 0.7} 
                fill={color2} opacity="0.1" />
        <circle cx={patternSize} cy={patternSize} r={circleSize * 0.7} 
                fill={color2} opacity="0.1" />
      </pattern>
    );
  },
};

// Overlapping circles pattern
export const overlappingCircles: BackgroundPattern = {
  id: 'overlapping-circles',
  name: 'Overlapping Circles',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }: BackgroundProps) => {
    const patternSize = 35 + (seed % 25);
    const radius = patternSize * 0.4;
    const color = getRandomColor(seed, colors, colors.length);
    
    return (
      <pattern id={patternId} patternUnits="userSpaceOnUse" width={patternSize} height={patternSize}>
        <circle cx={patternSize/2} cy={0} r={radius} fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <circle cx={0} cy={patternSize/2} r={radius} fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <circle cx={patternSize} cy={patternSize/2} r={radius} fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <circle cx={patternSize/2} cy={patternSize} r={radius} fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
      </pattern>
    );
  },
};

// Plus signs pattern
export const plusPattern: BackgroundPattern = {
  id: 'plus-pattern',
  name: 'Plus Pattern',
  type: 'pattern',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }: BackgroundProps) => {
    const patternSize = 20 + (seed % 15);
    const plusSize = patternSize * 0.4;
    const strokeWidth = 1 + (seed % 10) * 0.2;
    const color = getRandomColor(seed, colors, colors.length);
    
    return (
      <pattern id={patternId} patternUnits="userSpaceOnUse" width={patternSize} height={patternSize}>
        <path d={`M${patternSize/2},${(patternSize-plusSize)/2} v${plusSize} M${(patternSize-plusSize)/2},${patternSize/2} h${plusSize}`}
              stroke={color} strokeWidth={strokeWidth} opacity="0.25" strokeLinecap="round" />
      </pattern>
    );
  },
};

export const linearGradient: BackgroundPattern = {
  id: 'linear-gradient',
  name: 'Linear Gradient',
  type: 'gradient',
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const angle = getUnit(seed, 360);
    
    return (
      <linearGradient 
        id={patternId}
        x1="0%" y1="0%" 
        x2={`${Math.cos(angle * Math.PI / 180) * 100}%`}
        y2={`${Math.sin(angle * Math.PI / 180) * 100}%`}
      >
        <stop offset="0%" style={{ stopColor: color1 }} />
        <stop offset="100%" style={{ stopColor: color2 }} />
      </linearGradient>
    );
  }
};

// ===========================================
// COLLECTIONS
// ===========================================

export const ORGANIC_PATTERNS: BackgroundPattern[] = [
  marbleBlob1,
  marbleBlob2,
  cloudShape,
  waveShape,
  liquidCheese,
];

export const GEOMETRIC_PATTERNS: BackgroundPattern[] = [
  stripesVertical,
  stripesHorizontal,
  stripesDiagonal,
  diagonalLines,
  polkaDots,
  checkerboard,
  triangles,
  hexagons,
  zigzag,
  protrudingSquares,
  waveyFingerprint,
  dragonScales,
  barcodeStripes,
  dotGrid,
  crossHatch,
  softCircles,
  overlappingCircles,
  plusPattern,
];

export const GRADIENT_PATTERNS: BackgroundPattern[] = [
  radialGradient,
  linearGradient,
];

export const DECORATIVE_PATTERNS: BackgroundPattern[] = [
  confettiDoodles,
  endlessConstellation,
];

export const ALL_PATTERNS: BackgroundPattern[] = [
  ...ORGANIC_PATTERNS,
  ...GEOMETRIC_PATTERNS,
  ...GRADIENT_PATTERNS,
  ...DECORATIVE_PATTERNS,
];

// ===========================================
// PATTERN REGISTRY
// ===========================================

// Map of all available patterns by ID for easy lookup
export const PATTERN_REGISTRY: Record<string, BackgroundPattern> = {
  // Organic
  'marble-blob-1': marbleBlob1,
  'marble-blob-2': marbleBlob2,
  'cloud-shape': cloudShape,
  'wave-shape': waveShape,
  'liquid-cheese': liquidCheese,
  // Geometric
  'stripes-vertical': stripesVertical,
  'stripes-horizontal': stripesHorizontal,
  'stripes-diagonal': stripesDiagonal,
  'diagonal-lines': diagonalLines,
  'polka-dots': polkaDots,
  'checkerboard': checkerboard,
  'triangles': triangles,
  'hexagons': hexagons,
  'zigzag': zigzag,
  'protruding-squares': protrudingSquares,
  'wavey-fingerprint': waveyFingerprint,
  'dragon-scales': dragonScales,
  // Gradients
  'radial-gradient': radialGradient,
  'linear-gradient': linearGradient,
  // Decorative
  'confetti-doodles': confettiDoodles,
  'endless-constellation': endlessConstellation,
  'barcode-stripes': barcodeStripes,
  'dot-grid': dotGrid,
  'cross-hatch': crossHatch,
  'soft-circles': softCircles,
  'overlapping-circles': overlappingCircles,
  'plus-pattern': plusPattern,
};

// List of all pattern names for documentation
export const PATTERN_NAMES = Object.keys(PATTERN_REGISTRY);

// Pattern categories for UI organization
export const PATTERN_CATEGORIES = {
  organic: ['marble-blob-1', 'marble-blob-2', 'cloud-shape', 'wave-shape', 'liquid-cheese'],
  geometric: [
    'stripes-vertical', 'stripes-horizontal', 'stripes-diagonal', 'diagonal-lines',
    'polka-dots', 'checkerboard', 'triangles', 'hexagons', 'zigzag',
    'protruding-squares', 'wavey-fingerprint', 'dragon-scales'
  ],
  gradient: ['radial-gradient', 'linear-gradient'],
  decorative: ['confetti-doodles', 'endless-constellation'],
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

export function selectPattern(
  seed: number, 
  patterns: BackgroundPattern[] = ALL_PATTERNS
): BackgroundPattern | null {
  if (patterns.length === 0) return null;
  return patterns[Math.abs(seed) % patterns.length];
}

// Get pattern by name
export function getPatternByName(name: string): BackgroundPattern | null {
  return PATTERN_REGISTRY[name] || null;
}

export function renderBackground(
  pattern: BackgroundPattern | null,
  props: BackgroundProps
): React.ReactNode {
  if (!pattern) return null;
  
  if (pattern.needsDefs) {
    // Pattern needs to be in defs, return a rect that references it
    return (
      <>
        <defs>{pattern.render(props)}</defs>
        <rect 
          width={props.size} 
          height={props.size} 
          fill={`url(#${props.patternId})`} 
        />
      </>
    );
  }
  
  // Direct render (SVG paths, etc.)
  return pattern.render(props);
}

// Specific marble background renderer used by marble and mage
export function renderMarbleBackground(
  props: BackgroundProps & { filterUrl?: string }
): React.ReactNode {
  const { size, colors, seed } = props;
  const color1 = getRandomColor(seed, colors, colors.length);
  
  return (
    <>
      <rect
        height={size}
        width={size}
        style={{ fill: color1 }}
      />
      {marbleBlob1.render(props)}
      {marbleBlob2.render(props)}
    </>
  );
}