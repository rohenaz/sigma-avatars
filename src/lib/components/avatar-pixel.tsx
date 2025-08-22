import * as React from 'react';
import { getRandomColor, hashCode } from '../utilities';
import type { AvatarProps } from './types';

const ELEMENTS = 64;
const SIZE = 80;

function generateColors(name: string, colors: string[]) {
  const numFromName = hashCode(name);
  const range = colors && colors.length;

  const colorList = Array.from({ length: ELEMENTS }, (_, i) =>
    getRandomColor(numFromName % (i + 1), colors, range)
  );

  return colorList;
}

const AvatarPixel = ({
  name,
  colors,
  title,
  square,
  size,
  ...otherProps
}: AvatarProps) => {
  const pixelColors = generateColors(name, colors);
  const maskID = React.useId();

  return (
    <svg
      fill="none"
      height={size}
      role="img"
      shapeRendering="crispEdges"
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
        <rect fill="#FFFFFF" height={SIZE} width={SIZE} />
      </mask>
      <g mask={`url(#${maskID})`}>
        <rect height={10} style={{ fill: pixelColors[0] }} width={10} />
        <rect height={10} style={{ fill: pixelColors[1] }} width={10} x={20} />
        <rect height={10} style={{ fill: pixelColors[2] }} width={10} x={40} />
        <rect height={10} style={{ fill: pixelColors[3] }} width={10} x={60} />
        <rect height={10} style={{ fill: pixelColors[4] }} width={10} x={10} />
        <rect height={10} style={{ fill: pixelColors[5] }} width={10} x={30} />
        <rect height={10} style={{ fill: pixelColors[6] }} width={10} x={50} />
        <rect height={10} style={{ fill: pixelColors[7] }} width={10} x={70} />
        <rect height={10} style={{ fill: pixelColors[8] }} width={10} y={10} />
        <rect height={10} style={{ fill: pixelColors[9] }} width={10} y={20} />
        <rect height={10} style={{ fill: pixelColors[10] }} width={10} y={30} />
        <rect height={10} style={{ fill: pixelColors[11] }} width={10} y={40} />
        <rect height={10} style={{ fill: pixelColors[12] }} width={10} y={50} />
        <rect height={10} style={{ fill: pixelColors[13] }} width={10} y={60} />
        <rect height={10} style={{ fill: pixelColors[14] }} width={10} y={70} />
        <rect
          height={10}
          style={{ fill: pixelColors[15] }}
          width={10}
          x={20}
          y={10}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[16] }}
          width={10}
          x={20}
          y={20}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[17] }}
          width={10}
          x={20}
          y={30}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[18] }}
          width={10}
          x={20}
          y={40}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[19] }}
          width={10}
          x={20}
          y={50}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[20] }}
          width={10}
          x={20}
          y={60}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[21] }}
          width={10}
          x={20}
          y={70}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[22] }}
          width={10}
          x={40}
          y={10}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[23] }}
          width={10}
          x={40}
          y={20}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[24] }}
          width={10}
          x={40}
          y={30}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[25] }}
          width={10}
          x={40}
          y={40}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[26] }}
          width={10}
          x={40}
          y={50}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[27] }}
          width={10}
          x={40}
          y={60}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[28] }}
          width={10}
          x={40}
          y={70}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[29] }}
          width={10}
          x={60}
          y={10}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[30] }}
          width={10}
          x={60}
          y={20}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[31] }}
          width={10}
          x={60}
          y={30}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[32] }}
          width={10}
          x={60}
          y={40}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[33] }}
          width={10}
          x={60}
          y={50}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[34] }}
          width={10}
          x={60}
          y={60}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[35] }}
          width={10}
          x={60}
          y={70}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[36] }}
          width={10}
          x={10}
          y={10}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[37] }}
          width={10}
          x={10}
          y={20}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[38] }}
          width={10}
          x={10}
          y={30}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[39] }}
          width={10}
          x={10}
          y={40}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[40] }}
          width={10}
          x={10}
          y={50}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[41] }}
          width={10}
          x={10}
          y={60}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[42] }}
          width={10}
          x={10}
          y={70}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[43] }}
          width={10}
          x={30}
          y={10}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[44] }}
          width={10}
          x={30}
          y={20}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[45] }}
          width={10}
          x={30}
          y={30}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[46] }}
          width={10}
          x={30}
          y={40}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[47] }}
          width={10}
          x={30}
          y={50}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[48] }}
          width={10}
          x={30}
          y={60}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[49] }}
          width={10}
          x={30}
          y={70}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[50] }}
          width={10}
          x={50}
          y={10}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[51] }}
          width={10}
          x={50}
          y={20}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[52] }}
          width={10}
          x={50}
          y={30}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[53] }}
          width={10}
          x={50}
          y={40}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[54] }}
          width={10}
          x={50}
          y={50}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[55] }}
          width={10}
          x={50}
          y={60}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[56] }}
          width={10}
          x={50}
          y={70}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[57] }}
          width={10}
          x={70}
          y={10}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[58] }}
          width={10}
          x={70}
          y={20}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[59] }}
          width={10}
          x={70}
          y={30}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[60] }}
          width={10}
          x={70}
          y={40}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[61] }}
          width={10}
          x={70}
          y={50}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[62] }}
          width={10}
          x={70}
          y={60}
        />
        <rect
          height={10}
          style={{ fill: pixelColors[63] }}
          width={10}
          x={70}
          y={70}
        />
      </g>
    </svg>
  );
};

export default AvatarPixel;
