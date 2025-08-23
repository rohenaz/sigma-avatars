import * as React from 'react';
import {
  getBoolean,
  getContrastSafe,
  getRandomColor,
  getUnit,
  hashCode,
  generateId,
} from '../utilities';
import type { AvatarProps } from './types';

const SIZE = 36;

function generateData(name: string, colors: string[]) {
  const numFromName = hashCode(name);
  const range = colors && colors.length;
  const wrapperColor = getRandomColor(numFromName, colors, range);
  const preTranslateX = getUnit(numFromName, 10, 1);
  const wrapperTranslateX =
    preTranslateX < 5 ? preTranslateX + SIZE / 9 : preTranslateX;
  const preTranslateY = getUnit(numFromName, 10, 2);
  const wrapperTranslateY =
    preTranslateY < 5 ? preTranslateY + SIZE / 9 : preTranslateY;

  const data = {
    wrapperColor,
    faceColor: getContrastSafe(wrapperColor, '#000000'),
    backgroundColor: getRandomColor(numFromName + 13, colors, range),
    wrapperTranslateX,
    wrapperTranslateY,
    wrapperRotate: getUnit(numFromName, 360),
    wrapperScale: 1 + getUnit(numFromName, SIZE / 12) / 10,
    isMouthOpen: getBoolean(numFromName, 2),
    isCircle: getBoolean(numFromName, 1),
    eyeSpread: getUnit(numFromName, 5),
    mouthSpread: getUnit(numFromName, 3),
    faceRotate: getUnit(numFromName, 10, 3),
    faceTranslateX:
      wrapperTranslateX > SIZE / 6
        ? wrapperTranslateX / 2
        : getUnit(numFromName, 8, 1),
    faceTranslateY:
      wrapperTranslateY > SIZE / 6
        ? wrapperTranslateY / 2
        : getUnit(numFromName, 7, 2),
  };

  return data;
}

const AvatarBeam = ({
  name,
  colors,
  title,
  size,
  ...otherProps
}: AvatarProps) => {
  const data = generateData(name, colors);
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
        <rect
          height={SIZE}
          style={{ fill: data.backgroundColor }}
          width={SIZE}
        />
        <rect
          height={SIZE}
          rx={data.isCircle ? SIZE : SIZE / 6}
          style={{ 
            fill: data.wrapperColor,
            transformOrigin: `${SIZE / 2}px ${SIZE / 2}px`
          }}
          transform={
            'translate(' +
            data.wrapperTranslateX +
            ' ' +
            data.wrapperTranslateY +
            ') rotate(' +
            data.wrapperRotate +
            ') scale(' +
            data.wrapperScale +
            ')'
          }
          width={SIZE}
          x="0"
          y="0"
        />
        <g
          style={{
            transformOrigin: `${SIZE / 2}px ${SIZE / 2}px`
          }}
          transform={
            'translate(' +
            data.faceTranslateX +
            ' ' +
            data.faceTranslateY +
            ') rotate(' +
            data.faceRotate +
            ')'
          }
        >
          {data.isMouthOpen ? (
            <path
              d={'M15 ' + (19 + data.mouthSpread) + 'c2 1 4 1 6 0'}
              fill="none"
              strokeLinecap="round"
              style={{ stroke: data.faceColor }}
            />
          ) : (
            <path
              d={'M13,' + (19 + data.mouthSpread) + ' a1,0.75 0 0,0 10,0'}
              style={{ fill: data.faceColor }}
            />
          )}
          <rect
            height={2}
            rx={1}
            stroke="none"
            style={{ fill: data.faceColor }}
            width={1.5}
            x={14 - data.eyeSpread}
            y={14}
          />
          <rect
            height={2}
            rx={1}
            stroke="none"
            style={{ fill: data.faceColor }}
            width={1.5}
            x={20 + data.eyeSpread}
            y={14}
          />
        </g>
      </g>
    </svg>
  );
};

export default AvatarBeam;
