import React from 'react';
import { generateId, getRandomColor, hashCode } from '../utilities';
import type { AvatarProps } from './types';

const SIZE = 90;
const COLORS = 5;

function generateColors(name: string, colors: string[]) {
  const numFromName = hashCode(name);
  const range = colors && colors.length;
  const colorsShuffle = Array.from({ length: COLORS }, (_, i) =>
    getRandomColor(numFromName + i, colors, range)
  );
  const colorsList = [];
  colorsList[0] = colorsShuffle[0];
  colorsList[1] = colorsShuffle[1];
  colorsList[2] = colorsShuffle[1];
  colorsList[3] = colorsShuffle[2];
  colorsList[4] = colorsShuffle[2];
  colorsList[5] = colorsShuffle[3];
  colorsList[6] = colorsShuffle[3];
  colorsList[7] = colorsShuffle[0];
  colorsList[8] = colorsShuffle[4];

  return colorsList;
}

const AvatarRing = ({
  name,
  colors,
  title,
  size,
  ...otherProps
}: AvatarProps) => {
  const ringColors = generateColors(name, colors);
  const maskID = generateId(name, 'mask');

  return (
    <svg
      fill="none"
      height={size}
      role="img"
      viewBox={'0 0 ' + SIZE + ' ' + SIZE}
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
        <path d="M0 0h90v45H0z" style={{ fill: ringColors[0] }} />
        <path d="M0 45h90v45H0z" style={{ fill: ringColors[1] }} />
        <path d="M83 45a38 38 0 00-76 0h76z" style={{ fill: ringColors[2] }} />
        <path d="M83 45a38 38 0 01-76 0h76z" style={{ fill: ringColors[3] }} />
        <path d="M77 45a32 32 0 10-64 0h64z" style={{ fill: ringColors[4] }} />
        <path d="M77 45a32 32 0 11-64 0h64z" style={{ fill: ringColors[5] }} />
        <path d="M71 45a26 26 0 00-52 0h52z" style={{ fill: ringColors[6] }} />
        <path d="M71 45a26 26 0 01-52 0h52z" style={{ fill: ringColors[7] }} />
        <circle cx={45} cy={45} r={23} style={{ fill: ringColors[8] }} />
      </g>
    </svg>
  );
};

export default AvatarRing;
