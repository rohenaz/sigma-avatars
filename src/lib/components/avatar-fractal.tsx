import * as React from 'react';
import { hashCode } from '../utilities';
import type { AvatarProps } from './types';

const SIZE = 80;
const MAX_ITER = 256; // Higher iterations for more detail

// Julia set parameters that guarantee interesting fractals
const JULIA_SETS = [
  { c_real: -0.4, c_imag: 0.6 },        // Classic Julia
  { c_real: 0.285, c_imag: 0.01 },      // Spiral
  { c_real: -0.7269, c_imag: 0.1889 },  // Swirls
  { c_real: -0.8, c_imag: 0.156 },      // Dendrite
  { c_real: -0.74543, c_imag: 0.11301 }, // Seahorse
  { c_real: 0.355, c_imag: 0.355 },     // Dragon
  { c_real: -0.54, c_imag: 0.54 },      // Cauliflower
  { c_real: -0.624, c_imag: 0.435 },    // Sun
];

const AvatarFractal = ({ name, colors, title, square, size, ...otherProps }: AvatarProps) => {
  const maskID = React.useId();
  const num = hashCode(name);
  
  // Pick a Julia set that guarantees interesting patterns
  const juliaIndex = num % JULIA_SETS.length;
  const julia = JULIA_SETS[juliaIndex];
  
  // Zoom and offset based on hash
  const zoom = 1.5 + (num % 20) / 10; // 1.5 to 3.5
  const offsetX = ((num % 100) - 50) / 200;
  const offsetY = ((num % 77) - 38) / 200;
  
  // Generate Julia set
  const pixels = [];
  const resolution = 80; // Full resolution
  
  for (let py = 0; py < resolution; py++) {
    for (let px = 0; px < resolution; px++) {
      // Map to complex plane
      let zx = (px - resolution / 2) / (resolution / 4) / zoom + offsetX;
      let zy = (py - resolution / 2) / (resolution / 4) / zoom + offsetY;
      
      let iter = 0;
      // Julia set iteration: z = z² + c
      while (zx * zx + zy * zy < 4 && iter < MAX_ITER) {
        const tmp = zx * zx - zy * zy + julia.c_real;
        zy = 2 * zx * zy + julia.c_imag;
        zx = tmp;
        iter++;
      }
      
      // Color mapping - ensure no solid blocks
      let colorIndex;
      if (iter === MAX_ITER) {
        // Inside set - use orbit trap coloring
        const trap = Math.abs(zx) + Math.abs(zy);
        colorIndex = Math.floor(trap * 3) % colors.length;
      } else {
        // Outside - smooth coloring
        const smooth = iter + 1 - Math.log(Math.log(Math.sqrt(zx * zx + zy * zy))) / Math.log(2);
        colorIndex = Math.floor(smooth / 3) % colors.length;
      }
      
      pixels.push(
        <rect
          key={`${px}-${py}`}
          x={px}
          y={py}
          width={1}
          height={1}
          style={{ fill: colors[Math.abs(colorIndex) % colors.length] }}
        />
      );
    }
  }
  
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={size}
      height={size}
      role="img"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      {...otherProps}
    >
      {title && <title>{name}</title>}
      <mask id={maskID} maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
        <rect width={SIZE} height={SIZE} rx={square ? undefined : SIZE * 2} fill="#FFFFFF" />
      </mask>
      <g mask={`url(#${maskID})`}>
        {pixels}
      </g>
    </svg>
  );
};

export default AvatarFractal;