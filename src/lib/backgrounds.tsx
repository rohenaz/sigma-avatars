import type * as React from "react";
import { getRandomColor, getUnit } from "./utilities";

export interface BackgroundProps {
  colors: string[];
  filterUrl?: string; // Optional filter reference
  maskId?: string; // Mask ID for clipping
  patternId: string; // Unique ID for defs
  seed: number; // From hashCode
  size: number;
}

export interface BackgroundPattern {
  id: string;
  name: string;
  needsDefs?: boolean; // Whether pattern needs to be in <defs>
  render: (props: BackgroundProps) => React.ReactNode;
  type: "svg-path" | "pattern" | "gradient" | "solid";
}

// Helper to calculate transform for organic shapes
function calculateTransform(seed: number, size: number, index = 0): string {
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
  id: "marble-blob-1",
  name: "Marble Blob 1",
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
  },
  type: "svg-path",
};

export const marbleBlob2: BackgroundPattern = {
  id: "marble-blob-2",
  name: "Marble Blob 2",
  render: ({ size, colors, seed, filterUrl }) => {
    const color = getRandomColor(seed + 2, colors, colors.length);
    const transform = calculateTransform(seed, size, 2);

    return (
      <path
        d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
        filter={filterUrl}
        style={{
          fill: color,
          mixBlendMode: "overlay",
        }}
        transform={transform}
      />
    );
  },
  type: "svg-path",
};

export const cloudShape: BackgroundPattern = {
  id: "cloud-shape",
  name: "Cloud Shape",
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
  },
  type: "svg-path",
};

export const waveShape: BackgroundPattern = {
  id: "wave-shape",
  name: "Wave Shape",
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
  },
  type: "svg-path",
};

// ===========================================
// GEOMETRIC PATTERNS (from Pepe variant + new)
// ===========================================

export const stripesVertical: BackgroundPattern = {
  id: "stripes-vertical",
  name: "Vertical Stripes",
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);

    return (
      <pattern
        height={size}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={size * 0.2}
      >
        <rect height={size} style={{ fill: color1 }} width={size * 0.1} />
        <rect
          height={size}
          style={{ fill: color2 }}
          width={size * 0.1}
          x={size * 0.1}
        />
      </pattern>
    );
  },
  type: "pattern",
};

export const stripesHorizontal: BackgroundPattern = {
  id: "stripes-horizontal",
  name: "Horizontal Stripes",
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);

    return (
      <pattern
        height={size * 0.2}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={size}
      >
        <rect height={size * 0.1} style={{ fill: color1 }} width={size} />
        <rect
          height={size * 0.1}
          style={{ fill: color2 }}
          width={size}
          y={size * 0.1}
        />
      </pattern>
    );
  },
  type: "pattern",
};

export const stripesDiagonal: BackgroundPattern = {
  id: "stripes-diagonal",
  name: "Diagonal Stripes",
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);

    return (
      <pattern
        height={size * 0.2}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={size * 0.2}
      >
        <rect height={size * 0.2} style={{ fill: color1 }} width={size * 0.2} />
        <path
          d={`M0,${size * 0.2} L${size * 0.2},0 M0,0 L${size * 0.2},${size * 0.2}`}
          style={{
            stroke: color2,
            strokeLinecap: "square",
            strokeWidth: size * 0.08,
          }}
        />
      </pattern>
    );
  },
  type: "pattern",
};

export const polkaDots: BackgroundPattern = {
  id: "polka-dots",
  name: "Polka Dots",
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const bgColor = getRandomColor(seed, colors, colors.length);
    const dotColor = getRandomColor(seed + 1, colors, colors.length);
    const dotSize = size * 0.06;

    return (
      <pattern
        height={size * 0.25}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={size * 0.25}
      >
        <rect
          height={size * 0.25}
          style={{ fill: bgColor }}
          width={size * 0.25}
        />
        <circle
          cx={size * 0.125}
          cy={size * 0.125}
          r={dotSize}
          style={{ fill: dotColor }}
        />
        <circle cx={0} cy={0} r={dotSize} style={{ fill: dotColor }} />
        <circle
          cx={size * 0.25}
          cy={0}
          r={dotSize}
          style={{ fill: dotColor }}
        />
        <circle
          cx={0}
          cy={size * 0.25}
          r={dotSize}
          style={{ fill: dotColor }}
        />
        <circle
          cx={size * 0.25}
          cy={size * 0.25}
          r={dotSize}
          style={{ fill: dotColor }}
        />
      </pattern>
    );
  },
  type: "pattern",
};

export const checkerboard: BackgroundPattern = {
  id: "checkerboard",
  name: "Checkerboard",
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const squareSize = size * 0.1;

    return (
      <pattern
        height={squareSize * 2}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={squareSize * 2}
      >
        <rect height={squareSize} style={{ fill: color1 }} width={squareSize} />
        <rect
          height={squareSize}
          style={{ fill: color1 }}
          width={squareSize}
          x={squareSize}
          y={squareSize}
        />
        <rect
          height={squareSize}
          style={{ fill: color2 }}
          width={squareSize}
          x={squareSize}
        />
        <rect
          height={squareSize}
          style={{ fill: color2 }}
          width={squareSize}
          y={squareSize}
        />
      </pattern>
    );
  },
  type: "pattern",
};

export const triangles: BackgroundPattern = {
  id: "triangles",
  name: "Triangles",
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const triSize = size * 0.15;

    return (
      <pattern
        height={triSize}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={triSize}
      >
        <polygon
          points={`0,${triSize} ${triSize / 2},0 ${triSize},${triSize}`}
          style={{ fill: color1 }}
        />
        <polygon
          points={`0,0 ${triSize / 2},0 0,${triSize}`}
          style={{ fill: color2 }}
        />
        <polygon
          points={`${triSize},0 ${triSize},${triSize} ${triSize / 2},0`}
          style={{ fill: color2 }}
        />
      </pattern>
    );
  },
  type: "pattern",
};

export const hexagons: BackgroundPattern = {
  id: "hexagons",
  name: "Hexagons",
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const hexSize = size * 0.1;

    return (
      <pattern
        height={hexSize * 2.6}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={hexSize * 3}
      >
        <polygon
          points={`${hexSize},0 ${hexSize * 2},0 ${hexSize * 2.5},${hexSize * 0.87} ${hexSize * 2},${hexSize * 1.73} ${hexSize},${hexSize * 1.73} ${hexSize * 0.5},${hexSize * 0.87}`}
          style={{ fill: color1, stroke: color2, strokeWidth: 1 }}
        />
      </pattern>
    );
  },
  type: "pattern",
};

export const zigzag: BackgroundPattern = {
  id: "zigzag",
  name: "Zigzag",
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const zSize = size * 0.2;

    return (
      <pattern
        height={zSize}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={zSize}
      >
        <rect height={zSize} style={{ fill: color1 }} width={zSize} />
        <path
          d={`M0,${zSize / 2} L${zSize / 4},0 L${zSize / 2},${zSize / 2} L${(zSize * 3) / 4},0 L${zSize},${zSize / 2}`}
          style={{ fill: "none", stroke: color2, strokeWidth: zSize * 0.15 }}
        />
      </pattern>
    );
  },
  type: "pattern",
};

// Liquid Cheese pattern
export const liquidCheese: BackgroundPattern = {
  id: "liquid-cheese",
  name: "Liquid Cheese",
  render: ({ size, colors, seed }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const color3 = getRandomColor(seed + 2, colors, colors.length);

    return (
      <>
        <rect height={size} style={{ fill: color1 }} width={size} />
        <path
          d={`M0 ${size * 0.3}Q${size * 0.2} ${size * 0.1} ${size * 0.4} ${size * 0.2}T${size * 0.8} ${size * 0.3}T${size} ${size * 0.5}V${size}H0Z`}
          style={{ fill: color2, opacity: 0.8 }}
        />
        <path
          d={`M0 ${size * 0.6}Q${size * 0.3} ${size * 0.4} ${size * 0.5} ${size * 0.5}T${size} ${size * 0.6}V${size}H0Z`}
          style={{ fill: color3, opacity: 0.6 }}
        />
      </>
    );
  },
  type: "svg-path",
};

// Wavey Fingerprint pattern
export const waveyFingerprint: BackgroundPattern = {
  id: "wavey-fingerprint",
  name: "Wavey Fingerprint",
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);

    return (
      <pattern
        height={size * 0.2}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={size * 0.4}
      >
        <rect height={size * 0.2} style={{ fill: color1 }} width={size * 0.4} />
        {[0, 0.05, 0.1, 0.15].map((offset, i) => (
          <path
            d={`M0,${size * (0.1 + offset)} Q${size * 0.1},${size * (0.05 + offset)} ${size * 0.2},${size * (0.1 + offset)} T${size * 0.4},${size * (0.1 + offset)}`}
            key={offset}
            style={{
              fill: "none",
              opacity: 1 - i * 0.2,
              stroke: color2,
              strokeWidth: size * 0.01,
            }}
          />
        ))}
      </pattern>
    );
  },
  type: "pattern",
};

// Dragon Scales pattern
export const dragonScales: BackgroundPattern = {
  id: "dragon-scales",
  name: "Dragon Scales",
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const scaleSize = size * 0.15;

    return (
      <pattern
        height={scaleSize}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={scaleSize}
      >
        <rect height={scaleSize} style={{ fill: color1 }} width={scaleSize} />
        <path
          d={`M0,${scaleSize} Q${scaleSize / 2},${scaleSize * 0.7} ${scaleSize},${scaleSize} L${scaleSize},0 Q${scaleSize / 2},${scaleSize * 0.3} 0,0 Z`}
          style={{ fill: color2, stroke: color1, strokeWidth: 1 }}
        />
      </pattern>
    );
  },
  type: "pattern",
};

// Confetti Doodles pattern
export const confettiDoodles: BackgroundPattern = {
  id: "confetti-doodles",
  name: "Confetti Doodles",
  render: ({ size, colors, seed }) => {
    const shapes: React.ReactElement[] = [];
    for (let i = 0; i < 20; i += 1) {
      const x = getUnit(seed + i * 2, size);
      const y = getUnit(seed + i * 3, size);
      const shapeSize = getUnit(seed + i * 5, size / 15, 1) + size / 30;
      const color = getRandomColor(seed + i, colors, colors.length);
      const rotation = getUnit(seed + i * 7, 360);

      if (i % 3 === 0) {
        // Rectangle confetti
        shapes.push(
          <rect
            height={shapeSize / 2}
            key={i}
            style={{ fill: color }}
            transform={`rotate(${rotation} ${x + shapeSize / 2} ${y + shapeSize / 4})`}
            width={shapeSize}
            x={x}
            y={y}
          />
        );
      } else if (i % 3 === 1) {
        // Circle confetti
        shapes.push(
          <circle
            cx={x}
            cy={y}
            key={i}
            r={shapeSize / 2}
            style={{ fill: color }}
          />
        );
      } else {
        // Triangle confetti
        shapes.push(
          <polygon
            key={i}
            points={`${x},${y} ${x + shapeSize},${y} ${x + shapeSize / 2},${y - shapeSize}`}
            style={{ fill: color }}
            transform={`rotate(${rotation} ${x + shapeSize / 2} ${y})`}
          />
        );
      }
    }

    return (
      <>
        <rect
          height={size}
          style={{ fill: getRandomColor(seed, colors, colors.length) }}
          width={size}
        />
        {shapes}
      </>
    );
  },
  type: "svg-path",
};

// Protruding Squares pattern
export const protrudingSquares: BackgroundPattern = {
  id: "protruding-squares",
  name: "Protruding Squares",
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const color3 = getRandomColor(seed + 2, colors, colors.length);
    const squareSize = size * 0.2;

    return (
      <pattern
        height={squareSize}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={squareSize}
      >
        <rect height={squareSize} style={{ fill: color1 }} width={squareSize} />
        <rect
          height={squareSize * 0.4}
          style={{ fill: color2 }}
          width={squareSize * 0.4}
          x={squareSize * 0.1}
          y={squareSize * 0.1}
        />
        <rect
          height={squareSize * 0.4}
          style={{ fill: color3 }}
          width={squareSize * 0.4}
          x={squareSize * 0.5}
          y={squareSize * 0.5}
        />
      </pattern>
    );
  },
  type: "pattern",
};

// Diagonal Stripes (different from our existing one - more like the SVG backgrounds version)
export const diagonalLines: BackgroundPattern = {
  id: "diagonal-lines",
  name: "Diagonal Lines",
  needsDefs: true,
  render: ({ size, colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);

    return (
      <pattern
        height={size * 0.1}
        id={patternId}
        patternTransform={"rotate(45)"}
        patternUnits="userSpaceOnUse"
        width={size * 0.1}
      >
        <rect height={size * 0.1} style={{ fill: color1 }} width={size * 0.1} />
        <line
          style={{ stroke: color2, strokeWidth: size * 0.03 }}
          x1={0}
          x2={0}
          y1={0}
          y2={size * 0.1}
        />
      </pattern>
    );
  },
  type: "pattern",
};

// Endless Constellation pattern
export const endlessConstellation: BackgroundPattern = {
  id: "endless-constellation",
  name: "Endless Constellation",
  render: ({ size, colors, seed }) => {
    const bgColor = getRandomColor(seed, colors, colors.length);
    const starColor = getRandomColor(seed + 1, colors, colors.length);
    const lineColor = getRandomColor(seed + 2, colors, colors.length);

    const stars: React.ReactElement[] = [];
    const connections: React.ReactElement[] = [];
    const points: { x: number; y: number }[] = [];

    // Generate star points
    for (let i = 0; i < 15; i += 1) {
      const x = getUnit(seed + i * 2, size);
      const y = getUnit(seed + i * 3, size);
      points.push({ x, y });

      // Add star
      const starSize = getUnit(seed + i * 5, 3, 1) + 1;
      stars.push(
        <circle
          cx={x}
          cy={y}
          key={`star-${i}`}
          r={starSize}
          style={{ fill: starColor }}
        />
      );
    }

    // Connect some stars
    for (let i = 0; i < points.length - 1; i += 1) {
      if (getUnit(seed + i * 7, 10) > 5) {
        const next = (i + 1 + getUnit(seed + i * 11, 3)) % points.length;
        connections.push(
          <line
            key={`line-${i}`}
            style={{ opacity: 0.3, stroke: lineColor, strokeWidth: 0.5 }}
            x1={points[i].x}
            x2={points[next].x}
            y1={points[i].y}
            y2={points[next].y}
          />
        );
      }
    }

    return (
      <>
        <rect height={size} style={{ fill: bgColor }} width={size} />
        {connections}
        {stars}
      </>
    );
  },
  type: "svg-path",
};

// ===========================================
// GRADIENT PATTERNS
// ===========================================

export const radialGradient: BackgroundPattern = {
  id: "radial-gradient",
  name: "Radial Gradient",
  needsDefs: true,
  render: ({ colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);

    return (
      <radialGradient id={patternId}>
        <stop offset="0%" style={{ stopColor: color1 }} />
        <stop offset="100%" style={{ stopColor: color2 }} />
      </radialGradient>
    );
  },
  type: "gradient",
};

// Barcode pattern - variable width vertical stripes
export const barcodeStripes: BackgroundPattern = {
  id: "barcode-stripes",
  name: "Barcode Stripes",
  render: ({ size, colors, seed }: BackgroundProps) => {
    const stripes: React.ReactElement[] = [];
    let currentX = 0;
    let stripeIndex = 0;
    const MIN_WIDTH = 1;
    const MAX_WIDTH = 8;

    // Generate deterministic stripes
    while (currentX < size) {
      const widthSeed = seed + stripeIndex * 997;
      const colorSeed = seed + stripeIndex * 1009;

      // Calculate stripe width
      let stripeWidth: number;
      if (stripeIndex % 3 === 0) {
        // Every third stripe can be wider
        stripeWidth =
          MIN_WIDTH + (Math.abs(widthSeed) % (MAX_WIDTH * 2 - MIN_WIDTH));
      } else {
        stripeWidth =
          MIN_WIDTH + (Math.abs(widthSeed) % (MAX_WIDTH - MIN_WIDTH));
      }

      // Don't exceed boundary
      const finalWidth = Math.min(stripeWidth, size - currentX);

      // Select color
      const colorIndex = Math.abs(colorSeed) % colors.length;
      const color = colors[colorIndex];

      stripes.push(
        <rect
          fill={color}
          height={size}
          key={stripeIndex}
          width={finalWidth}
          x={currentX}
          y={0}
        />
      );

      currentX += finalWidth;
      stripeIndex += 1;
    }

    return <>{stripes}</>;
  },
  type: "svg-path",
};

// Subtle dot grid pattern
export const dotGrid: BackgroundPattern = {
  id: "dot-grid",
  name: "Dot Grid",
  needsDefs: true,
  render: ({ colors, seed, patternId }: BackgroundProps) => {
    const spacing = 15 + (seed % 10);
    const dotSize = 1.5 + (seed % 3) * 0.5;
    const color = getRandomColor(seed, colors, colors.length);

    return (
      <pattern
        height={spacing}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={spacing}
      >
        <circle
          cx={spacing / 2}
          cy={spacing / 2}
          fill={color}
          opacity="0.3"
          r={dotSize}
        />
      </pattern>
    );
  },
  type: "pattern",
};

// Cross hatch pattern
export const crossHatch: BackgroundPattern = {
  id: "cross-hatch",
  name: "Cross Hatch",
  needsDefs: true,
  render: ({ colors, seed, patternId }: BackgroundProps) => {
    const spacing = 8 + (seed % 12);
    const strokeWidth = 0.5 + (seed % 10) * 0.1;
    const color = getRandomColor(seed, colors, colors.length);

    return (
      <pattern
        height={spacing}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={spacing}
      >
        <path
          d={`M0,${spacing} L${spacing},0 M0,0 L${spacing},${spacing}`}
          opacity="0.2"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </pattern>
    );
  },
  type: "pattern",
};

// Soft circles/bubbles pattern
export const softCircles: BackgroundPattern = {
  id: "soft-circles",
  name: "Soft Circles",
  needsDefs: true,
  render: ({ colors, seed, patternId }: BackgroundProps) => {
    const patternSize = 40 + (seed % 30);
    const circleSize = patternSize * 0.35;
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);

    return (
      <pattern
        height={patternSize}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={patternSize}
      >
        <circle
          cx={patternSize / 2}
          cy={patternSize / 2}
          fill={color1}
          opacity="0.15"
          r={circleSize}
        />
        <circle
          cx={0}
          cy={0}
          fill={color2}
          opacity="0.1"
          r={circleSize * 0.7}
        />
        <circle
          cx={patternSize}
          cy={0}
          fill={color2}
          opacity="0.1"
          r={circleSize * 0.7}
        />
        <circle
          cx={0}
          cy={patternSize}
          fill={color2}
          opacity="0.1"
          r={circleSize * 0.7}
        />
        <circle
          cx={patternSize}
          cy={patternSize}
          fill={color2}
          opacity="0.1"
          r={circleSize * 0.7}
        />
      </pattern>
    );
  },
  type: "pattern",
};

// Overlapping circles pattern
export const overlappingCircles: BackgroundPattern = {
  id: "overlapping-circles",
  name: "Overlapping Circles",
  needsDefs: true,
  render: ({ colors, seed, patternId }: BackgroundProps) => {
    const patternSize = 35 + (seed % 25);
    const radius = patternSize * 0.4;
    const color = getRandomColor(seed, colors, colors.length);

    return (
      <pattern
        height={patternSize}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={patternSize}
      >
        <circle
          cx={patternSize / 2}
          cy={0}
          fill="none"
          opacity="0.3"
          r={radius}
          stroke={color}
          strokeWidth="0.5"
        />
        <circle
          cx={0}
          cy={patternSize / 2}
          fill="none"
          opacity="0.3"
          r={radius}
          stroke={color}
          strokeWidth="0.5"
        />
        <circle
          cx={patternSize}
          cy={patternSize / 2}
          fill="none"
          opacity="0.3"
          r={radius}
          stroke={color}
          strokeWidth="0.5"
        />
        <circle
          cx={patternSize / 2}
          cy={patternSize}
          fill="none"
          opacity="0.3"
          r={radius}
          stroke={color}
          strokeWidth="0.5"
        />
      </pattern>
    );
  },
  type: "pattern",
};

// Plus signs pattern
export const plusPattern: BackgroundPattern = {
  id: "plus-pattern",
  name: "Plus Pattern",
  needsDefs: true,
  render: ({ colors, seed, patternId }: BackgroundProps) => {
    const patternSize = 20 + (seed % 15);
    const plusSize = patternSize * 0.4;
    const strokeWidth = 1 + (seed % 10) * 0.2;
    const color = getRandomColor(seed, colors, colors.length);

    return (
      <pattern
        height={patternSize}
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={patternSize}
      >
        <path
          d={`M${patternSize / 2},${(patternSize - plusSize) / 2} v${plusSize} M${(patternSize - plusSize) / 2},${patternSize / 2} h${plusSize}`}
          opacity="0.25"
          stroke={color}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </pattern>
    );
  },
  type: "pattern",
};

export const linearGradient: BackgroundPattern = {
  id: "linear-gradient",
  name: "Linear Gradient",
  needsDefs: true,
  render: ({ colors, seed, patternId }) => {
    const color1 = getRandomColor(seed, colors, colors.length);
    const color2 = getRandomColor(seed + 1, colors, colors.length);
    const angle = getUnit(seed, 360);

    return (
      <linearGradient
        id={patternId}
        x1="0%"
        x2={`${Math.cos((angle * Math.PI) / 180) * 100}%`}
        y1="0%"
        y2={`${Math.sin((angle * Math.PI) / 180) * 100}%`}
      >
        <stop offset="0%" style={{ stopColor: color1 }} />
        <stop offset="100%" style={{ stopColor: color2 }} />
      </linearGradient>
    );
  },
  type: "gradient",
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
  "barcode-stripes": barcodeStripes,
  checkerboard,
  "cloud-shape": cloudShape,
  // Decorative
  "confetti-doodles": confettiDoodles,
  "cross-hatch": crossHatch,
  "diagonal-lines": diagonalLines,
  "dot-grid": dotGrid,
  "dragon-scales": dragonScales,
  "endless-constellation": endlessConstellation,
  hexagons,
  "linear-gradient": linearGradient,
  "liquid-cheese": liquidCheese,
  // Organic
  "marble-blob-1": marbleBlob1,
  "marble-blob-2": marbleBlob2,
  "overlapping-circles": overlappingCircles,
  "plus-pattern": plusPattern,
  "polka-dots": polkaDots,
  "protruding-squares": protrudingSquares,
  // Gradients
  "radial-gradient": radialGradient,
  "soft-circles": softCircles,
  "stripes-diagonal": stripesDiagonal,
  "stripes-horizontal": stripesHorizontal,
  // Geometric
  "stripes-vertical": stripesVertical,
  triangles,
  "wave-shape": waveShape,
  "wavey-fingerprint": waveyFingerprint,
  zigzag,
};

// List of all pattern names for documentation
export const PATTERN_NAMES = Object.keys(PATTERN_REGISTRY);

// Pattern categories for UI organization
export const PATTERN_CATEGORIES = {
  decorative: ["confetti-doodles", "endless-constellation"],
  geometric: [
    "stripes-vertical",
    "stripes-horizontal",
    "stripes-diagonal",
    "diagonal-lines",
    "polka-dots",
    "checkerboard",
    "triangles",
    "hexagons",
    "zigzag",
    "protruding-squares",
    "wavey-fingerprint",
    "dragon-scales",
  ],
  gradient: ["radial-gradient", "linear-gradient"],
  organic: [
    "marble-blob-1",
    "marble-blob-2",
    "cloud-shape",
    "wave-shape",
    "liquid-cheese",
  ],
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

export function selectPattern(
  seed: number,
  patterns: BackgroundPattern[] = ALL_PATTERNS
): BackgroundPattern | null {
  if (patterns.length === 0) {
    return null;
  }
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
  if (!pattern) {
    return null;
  }

  if (pattern.needsDefs) {
    // Pattern needs to be in defs, return a rect that references it
    return (
      <>
        <defs>{pattern.render(props)}</defs>
        <rect
          fill={`url(#${props.patternId})`}
          height={props.size}
          width={props.size}
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
      <rect height={size} style={{ fill: color1 }} width={size} />
      {marbleBlob1.render(props)}
      {marbleBlob2.render(props)}
    </>
  );
}
