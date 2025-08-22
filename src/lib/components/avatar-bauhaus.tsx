import * as React from 'react';
import { getBoolean, getRandomColor, getUnit, hashCode } from '../utilities';
import type { AvatarProps } from './types';

const ELEMENTS = 4;
const SIZE = 80;

function generateColors(name: string, colors: string[]) {
  const numFromName = hashCode(name);
  const range = colors && colors.length;

  const elementsProperties = Array.from({ length: ELEMENTS }, (_, i) => ({
    color: getRandomColor(numFromName + i, colors, range),
    translateX: getUnit(numFromName * (i + 1), SIZE / 2 - (i + 17), 1),
    translateY: getUnit(numFromName * (i + 1), SIZE / 2 - (i + 17), 2),
    rotate: getUnit(numFromName * (i + 1), 360),
    isSquare: getBoolean(numFromName, 2),
  }));

  return elementsProperties;
}

const AvatarBauhaus = ({
  name,
  colors,
  title,
  square,
  size,
  ...otherProps
}: AvatarProps) => {
  const properties = generateColors(name, colors);
  const maskID = React.useId();

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
          rx={square ? undefined : SIZE * 2}
          width={SIZE}
        />
      </mask>
      <g mask={`url(#${maskID})`}>
        <rect
          height={SIZE}
          style={{ fill: properties[0].color }}
          width={SIZE}
        />
        <rect
          height={properties[1].isSquare ? SIZE : SIZE / 8}
          style={{ fill: properties[1].color }}
          transform={
            'translate(' +
            properties[1].translateX +
            ' ' +
            properties[1].translateY +
            ') rotate(' +
            properties[1].rotate +
            ' ' +
            SIZE / 2 +
            ' ' +
            SIZE / 2 +
            ')'
          }
          width={SIZE}
          x={(SIZE - 60) / 2}
          y={(SIZE - 20) / 2}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={SIZE / 5}
          style={{ fill: properties[2].color }}
          transform={
            'translate(' +
            properties[2].translateX +
            ' ' +
            properties[2].translateY +
            ')'
          }
        />
        <line
          strokeWidth={2}
          style={{ stroke: properties[3].color }}
          transform={
            'translate(' +
            properties[3].translateX +
            ' ' +
            properties[3].translateY +
            ') rotate(' +
            properties[3].rotate +
            ' ' +
            SIZE / 2 +
            ' ' +
            SIZE / 2 +
            ')'
          }
          x1={0}
          x2={SIZE}
          y1={SIZE / 2}
          y2={SIZE / 2}
        />
      </g>
    </svg>
  );
};

export default AvatarBauhaus;
