import { renderMarbleBackground } from "../backgrounds";
import { generateId, hashCode } from "../utilities";
import type { AvatarProps } from "./types";

const SIZE = 80;

const AvatarMarble = ({
  name,
  colors,
  title,
  size,
  ...otherProps
}: AvatarProps) => {
  const seed = hashCode(name);
  const maskID = generateId(name, "marble-mask");
  const filterID = generateId(name, "marble-filter");
  const patternID = generateId(name, "marble-pattern");

  return (
    <svg
      fill="none"
      height={size}
      role="img"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      {title ? <title>{name}</title> : null}
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
        {renderMarbleBackground({
          colors: colors || [
            "#92A1C6",
            "#146A7C",
            "#F0AB3D",
            "#C271B4",
            "#C20D90",
          ],
          filterUrl: `url(#${filterID})`,
          patternId: patternID,
          seed,
          size: SIZE,
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
