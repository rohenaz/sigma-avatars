import * as React from 'react';
import { hashCode, generateId } from '../utilities';
import { renderMarbleBackground } from '../backgrounds';
import type { AvatarProps } from './types';

const SIZE = 80;

const AvatarMarble = ({
  name,
  colors,
  title,
  size,
  ...otherProps
}: AvatarProps) => {
  const seed = hashCode(name);
  const maskID = generateId(name, 'mask');
  const filterID = generateId(name, 'filter');
  const patternID = generateId(name, 'pattern');

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
        {renderMarbleBackground({
          size: SIZE,
          colors: colors || ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
          seed,
          patternId: patternID,
          filterUrl: `url(#${filterID})`
        })}
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          id={filterID}
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur" stdDeviation={7} />
        </filter>
      </defs>
    </svg>
  );
};

export default AvatarMarble;
