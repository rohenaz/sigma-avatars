import React from 'react';
import { getRandomColor, hashCode, generateId } from '../utilities';
import type { AvatarProps } from './types';

const ELEMENTS = 4;
const SIZE = 80;

function generateColors(name: string, colors: string[]) {
  const numFromName = hashCode(name);
  const range = colors?.length;

  const colorsList = Array.from({ length: ELEMENTS }, (_, i) =>
    getRandomColor(numFromName + i, colors, range)
  );

  return colorsList;
}

const AvatarSunset = ({
  name,
  colors,
  title,
  size,
  ...otherProps
}: AvatarProps) => {
  const sunsetColors = generateColors(name, colors);
  const nameWithoutSpace = name.replace(/\s/g, '');
  const maskID = generateId(name, 'mask');

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: title is available when provided
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
        <path
          d="M0 0h80v40H0z"
          fill={`url(#gradient_paint0_linear_${nameWithoutSpace})`}
        />
        <path
          d="M0 40h80v40H0z"
          fill={`url(#gradient_paint1_linear_${nameWithoutSpace})`}
        />
      </g>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={`gradient_paint0_linear_${nameWithoutSpace}`}
          x1={SIZE / 2}
          x2={SIZE / 2}
          y1={0}
          y2={SIZE / 2}
        >
          <stop style={{ stopColor: sunsetColors[0] }} />
          <stop offset={1} style={{ stopColor: sunsetColors[1] }} />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={`gradient_paint1_linear_${nameWithoutSpace}`}
          x1={SIZE / 2}
          x2={SIZE / 2}
          y1={SIZE / 2}
          y2={SIZE}
        >
          <stop style={{ stopColor: sunsetColors[2] }} />
          <stop offset={1} style={{ stopColor: sunsetColors[3] }} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AvatarSunset;
