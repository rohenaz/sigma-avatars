import * as React from 'react';
import { hashCode, generateId } from '../utilities';
import { barcodeStripes, renderBackground } from '../backgrounds';
import type { AvatarProps } from './types';

const SIZE = 80;

const AvatarBarcode = ({
  name,
  colors,
  title,
  size,
  ...otherProps
}: AvatarProps) => {
  const numFromName = hashCode(name);
  const maskID = generateId(name, 'mask');
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
        {/* Use the barcode pattern from backgrounds */}
        {renderBackground(
          barcodeStripes,
          {
            size: SIZE,
            colors: colors,
            seed: numFromName,
            patternId: patternID
          }
        )}
      </g>
    </svg>
  );
};

export default AvatarBarcode;