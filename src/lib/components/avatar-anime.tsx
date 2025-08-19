import * as React from 'react';
import { hashCode, getRandomColor, getUnit, getBoolean, getContrastSafe } from '../utilities';
import type { AvatarProps } from './types';

const SIZE = 80;

/* Helper to build quadratic-curve paths */
const q = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) =>
  `M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

export default function AvatarAnime({
  name,
  colors,
  title,
  square,
  size,
  ...otherProps
}: AvatarProps) {
  // deterministic seed
  const n = hashCode(name);
  const range = colors.length;

  // base colors (CSS variables/OKLCH/hex all supported). Use CSS style props so tokens resolve.
  const faceColor = getRandomColor(n + 3, colors, range);
  const features = getContrastSafe(faceColor, 'var(--color-foreground)'); // eyes/mouth stroke/fill
  const accent = getRandomColor(n + 11, colors, range);                   // blush / sparkle

  // feature picks
  const eyeStyle = Math.abs(getUnit(n + 5, 4));     // 0 round, 1 closed, 2 diamond, 3 wink
  const mouthStyle = Math.abs(getUnit(n + 7, 5));   // 0 v, 1 smile, 2 w, 3 o, 4 O
  const showBlush = getBoolean(n + 9, 1);
  
  // Feature spread randomization - from normal (1.0) to spread out (1.4)
  const featureSpread = 1.0 + (Math.abs(getUnit(n + 17, 40)) / 100); // 1.0 to 1.4

  // geometry - face fills canvas properly
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const rFace = SIZE * 0.45; // Good size to fill canvas without clipping

  // Better proportions based on the reference SVG
  const eyeY = cy - SIZE * 0.12 * featureSpread; // Eyes higher up
  const eyeLx = cx - SIZE * 0.15 * featureSpread; // Better eye spacing
  const eyeRx = cx + SIZE * 0.15 * featureSpread;
  const eyeR = SIZE * (0.08 + (Math.abs(getUnit(n + 13, 5)) / 100)); // 0.08..0.13 - bigger eyes

  const mouthY = cy + SIZE * 0.15 * featureSpread; // Mouth lower
  const mouthW = SIZE * 0.20; // Slightly wider mouth
  const mouthH = SIZE * 0.08; // Slightly taller mouth

  const maskID = React.useId();

  // eyes
  const EyeRound = (x: number) => (
    <>
      <circle cx={x} cy={eyeY} r={eyeR} style={{ fill: String(features) }} />
      <circle cx={x - eyeR * 0.3} cy={eyeY + eyeR * 0.35} r={eyeR * 0.35} style={{ fill: 'white' }} />
    </>
  );

  const EyeClosed = (x1: number, x2: number) => (
    <path
      d={q(x1, eyeY, (x1 + x2) / 2, eyeY + eyeR * 0.7, x2, eyeY)}
      style={{ stroke: String(features), strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }}
    />
  );

  const EyeDiamond = (x: number) => {
    const w = eyeR * 0.85;
    const h = eyeR * 1.05;
    return (
      <polygon
        points={`${x},${eyeY + h} ${x + w},${eyeY} ${x},${eyeY - h} ${x - w},${eyeY}`}
        style={{ fill: String(features) }}
      />
    );
  };

  // mouth - fixed: curves now point correct direction
  const MouthV = () => (
    <path
      d={q(cx - mouthW / 2, mouthY, cx, mouthY + mouthH, cx + mouthW / 2, mouthY)}
      style={{ stroke: String(features), strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }}
    />
  );

  const MouthSmile = () => (
    <path
      d={q(cx - mouthW, mouthY, cx, mouthY + mouthH * 1.2, cx + mouthW, mouthY)}
      style={{ stroke: String(features), strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }}
    />
  );

  const MouthW = () => {
    const x1 = cx - mouthW * 0.7;
    const x2 = cx + mouthW * 0.7;
    const s = (x2 - x1) / 2;
    // MOVETO -> two CURVE3 segments (w-shape)
    return (
      <path
        d={`M${x1} ${mouthY} Q ${x1 + s * 0.5} ${mouthY + mouthH * 0.9} ${x1 + s} ${mouthY}
           Q ${x1 + s * 1.5} ${mouthY + mouthH * 0.9} ${x2} ${mouthY}`}
        style={{ stroke: String(features), strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }}
      />
    );
  };

  const MouthO = ({ filled }: { filled?: boolean }) => (
    <ellipse
      cx={cx}
      cy={mouthY}
      rx={mouthW * 0.35}
      ry={mouthH * 0.9}
      style={{ fill: filled ? String(features) : 'none', stroke: String(features), strokeWidth: 2 }}
    />
  );

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={size}
      height={size}
      role="img"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      {title && <title>{name}</title>}

      <mask id={maskID}>
        <rect width={SIZE} height={SIZE} rx={square ? undefined : SIZE * 2} fill="#fff" />
      </mask>

      <g mask={`url(#${maskID})`}>
        {/* outer stroke circle for a clean anime outline */}
        <circle cx={cx} cy={cy} r={rFace} style={{ fill: String(faceColor), stroke: String(getContrastSafe(faceColor, '#111')), strokeWidth: 2 }} />

        {/* eyes */}
        {eyeStyle === 0 && (
          <>
            {EyeRound(eyeLx)}
            {EyeRound(eyeRx)}
          </>
        )}
        {eyeStyle === 1 && (
          <>
            {EyeClosed(eyeLx - eyeR, eyeLx + eyeR)}
            {EyeClosed(eyeRx - eyeR, eyeRx + eyeR)}
          </>
        )}
        {eyeStyle === 2 && (
          <>
            {EyeDiamond(eyeLx)}
            {EyeDiamond(eyeRx)}
          </>
        )}
        {eyeStyle === 3 && (
          <>
            {EyeClosed(eyeLx - eyeR, eyeLx + eyeR)}
            {EyeRound(eyeRx)}
          </>
        )}

        {/* mouth */}
        {mouthStyle === 0 && <MouthV />}
        {mouthStyle === 1 && <MouthSmile />}
        {mouthStyle === 2 && <MouthW />}
        {mouthStyle === 3 && <MouthO />}
        {mouthStyle === 4 && <MouthO filled />}

        {/* blush - positioned on cheeks, affected by feature spread */}
        {showBlush && (
          <>
            <circle cx={cx - SIZE * 0.22 * featureSpread} cy={cy} r={SIZE * 0.05} style={{ fill: String(accent), opacity: 0.5 }} />
            <circle cx={cx + SIZE * 0.22 * featureSpread} cy={cy} r={SIZE * 0.05} style={{ fill: String(accent), opacity: 0.5 }} />
          </>
        )}
      </g>
    </svg>
  );
}