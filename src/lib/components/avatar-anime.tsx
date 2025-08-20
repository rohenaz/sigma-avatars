import * as React from 'react';
import { hashCode, getRandomColor, getUnit, getBoolean, getContrastSafe } from '../utilities';
import type { AvatarProps } from './types';

type AnimeFlavor = 'classic' | 'kodama';
type AnimeProps = AvatarProps & { flavor?: AnimeFlavor };

const SIZE = 80;

/* tiny helper for quadratic curve paths */
const q = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) =>
  `M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

export default function AvatarAnime({
  name,
  colors,
  title,
  square,
  size,
  flavor, // optional override: 'classic' | 'kodama'
  ...otherProps
}: AnimeProps) {
  const maskID = React.useId();
  const num = hashCode(name);
  const range = colors.length;

  // Background is now a full-rect fill; the container shape comes ONLY from the mask.
  const bg = getRandomColor(num + 3, colors, range);

  // Feature colors
  const features = getContrastSafe(bg, 'var(--color-foreground)');
  const accent = getRandomColor(num + 11, colors, range);

  // Deterministic flavor; can be overridden via prop
  // Make Kodama actually RARE - only ~10% chance
  const isKodama = flavor ? flavor === 'kodama' : (getUnit(num + 99, 100) < 10);

  // Global pose/tilt; keep small so elements never clip masks
  const tilt = (getUnit(num + 21, 15) - 7); // -7..+7 deg
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  // Eye/mouth picks - Kodama can use dots, kodama asymmetric, or closed eyes for variety
  const kodamaEyeOptions = [1, 4, 5]; // closed, kodama asymmetric, dots
  const kodamaMouthOptions = [3, 5, 6]; // small o, none, tiny kodama circle
  
  const eyeStyle = isKodama 
    ? kodamaEyeOptions[Math.abs(getUnit(num + 5, kodamaEyeOptions.length))]
    : Math.abs(getUnit(num + 5, 6));     // 0 round,1 closed,2 diamond,3 wink,4 kodama,5 dots
  
  const mouthStyle = isKodama 
    ? kodamaMouthOptions[Math.abs(getUnit(num + 7, kodamaMouthOptions.length))]
    : Math.abs(getUnit(num + 7, 6));   // 0 v,1 smile,2 w,3 o,4 O,5 none,6 kodama
  const showBlush = !isKodama && getBoolean(num + 9, 1);
  const showBrows = !isKodama && getBoolean(num + 23, 1);
  const sparkle = !isKodama && getBoolean(num + 31, 1);

  // Layout - FIXED: eyes above center, mouth below center
  const eyeY = cy - SIZE * 0.12;  // Eyes ABOVE center
  const eyeLx = cx - SIZE * 0.15; // Better spacing
  const eyeRx = cx + SIZE * 0.15;
  const eyeR = SIZE * (0.08 + Math.abs(getUnit(num + 13, 5)) / 100); // 0.08..0.13 - bigger eyes

  const mouthY = cy + SIZE * 0.15;  // Mouth BELOW center
  const mouthW = SIZE * 0.20;  // Wider mouth
  const mouthH = SIZE * 0.08;

  // Kodama offsets (more variation in asymmetry)
  const kdx = (isKodama ? (getUnit(num + 41, 11) - 5) : 0) / 100 * SIZE; // ±5% width
  const kdy = (isKodama ? (getUnit(num + 43, 11) - 5) : 0) / 100 * SIZE; // ±5% height
  const lShrink = isKodama ? (0.7 + getUnit(num + 83, 30) / 100) : 1; // 0.7 to 1.0
  const rGrow = isKodama ? (1.1 + getUnit(num + 89, 40) / 100) : 1;   // 1.1 to 1.5

  // --- primitives ---
  const EyeRound = (x: number) => (
    <>
      <circle cx={x} cy={eyeY} r={eyeR} style={{ fill: String(features) }} />
      {sparkle && <circle cx={x - eyeR * 0.3} cy={eyeY + eyeR * 0.35} r={eyeR * 0.35} style={{ fill: 'white' }} />}
    </>
  );

  const EyeClosed = (x1: number, x2: number) => (
    <path d={q(x1, eyeY, (x1 + x2) / 2, eyeY + eyeR * 0.7, x2, eyeY)}
          style={{ stroke: String(features), strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }} />
  );

  const EyeDiamond = (x: number) => {
    const w = eyeR * 0.85, h = eyeR * 1.05;
    return <polygon points={`${x},${eyeY + h} ${x + w},${eyeY} ${x},${eyeY - h} ${x - w},${eyeY}`}
                    style={{ fill: String(features) }} />;
  };

  const EyeKodama = () => {
    // Create wavy, hand-drawn circles using path with slight irregularities
    const leftCx = eyeLx + kdx;
    const leftCy = eyeY + kdy;
    const leftR = eyeR * lShrink;
    
    const rightCx = eyeRx + kdx * 0.5;
    const rightCy = eyeY + kdy * 0.5;
    const rightR = eyeR * rGrow;
    
    // Add waviness - different for each eye based on seed
    const leftWave1 = 1 + (getUnit(num + 101, 20) - 10) / 100; // 0.9 to 1.1
    const leftWave2 = 1 + (getUnit(num + 103, 20) - 10) / 100;
    const leftWave3 = 1 + (getUnit(num + 105, 20) - 10) / 100;
    const leftWave4 = 1 + (getUnit(num + 107, 20) - 10) / 100;
    
    const rightWave1 = 1 + (getUnit(num + 111, 20) - 10) / 100;
    const rightWave2 = 1 + (getUnit(num + 113, 20) - 10) / 100;
    const rightWave3 = 1 + (getUnit(num + 115, 20) - 10) / 100;
    const rightWave4 = 1 + (getUnit(num + 117, 20) - 10) / 100;
    
    // Hand-drawn wavy circles using cubic bezier curves
    const leftPath = `
      M ${leftCx - leftR * leftWave1} ${leftCy}
      C ${leftCx - leftR * leftWave1} ${leftCy - leftR * 0.6 * leftWave2},
        ${leftCx - leftR * 0.6 * leftWave3} ${leftCy - leftR * leftWave4},
        ${leftCx} ${leftCy - leftR * leftWave4}
      C ${leftCx + leftR * 0.6 * leftWave1} ${leftCy - leftR * leftWave2},
        ${leftCx + leftR * leftWave3} ${leftCy - leftR * 0.6 * leftWave4},
        ${leftCx + leftR * leftWave3} ${leftCy}
      C ${leftCx + leftR * leftWave1} ${leftCy + leftR * 0.6 * leftWave2},
        ${leftCx + leftR * 0.6 * leftWave3} ${leftCy + leftR * leftWave4},
        ${leftCx} ${leftCy + leftR * leftWave4}
      C ${leftCx - leftR * 0.6 * leftWave1} ${leftCy + leftR * leftWave2},
        ${leftCx - leftR * leftWave3} ${leftCy + leftR * 0.6 * leftWave4},
        ${leftCx - leftR * leftWave1} ${leftCy}
      Z
    `;
    
    const rightPath = `
      M ${rightCx - rightR * rightWave1} ${rightCy}
      C ${rightCx - rightR * rightWave1} ${rightCy - rightR * 0.6 * rightWave2},
        ${rightCx - rightR * 0.6 * rightWave3} ${rightCy - rightR * rightWave4},
        ${rightCx} ${rightCy - rightR * rightWave4}
      C ${rightCx + rightR * 0.6 * rightWave1} ${rightCy - rightR * rightWave2},
        ${rightCx + rightR * rightWave3} ${rightCy - rightR * 0.6 * rightWave4},
        ${rightCx + rightR * rightWave3} ${rightCy}
      C ${rightCx + rightR * rightWave1} ${rightCy + rightR * 0.6 * rightWave2},
        ${rightCx + rightR * 0.6 * rightWave3} ${rightCy + rightR * rightWave4},
        ${rightCx} ${rightCy + rightR * rightWave4}
      C ${rightCx - rightR * 0.6 * rightWave1} ${rightCy + rightR * rightWave2},
        ${rightCx - rightR * rightWave3} ${rightCy + rightR * 0.6 * rightWave4},
        ${rightCx - rightR * rightWave1} ${rightCy}
      Z
    `;
    
    return (
      <>
        <path d={leftPath} style={{ fill: String(features) }} />
        <path d={rightPath} style={{ fill: String(features) }} />
      </>
    );
  };

  const EyeDots = () => (
    <>
      <circle cx={eyeLx} cy={eyeY} r={eyeR * 0.3} style={{ fill: String(features) }} />
      <circle cx={eyeRx} cy={eyeY} r={eyeR * 0.3} style={{ fill: String(features) }} />
    </>
  );

  const Brows = () => (
    <>
      <path d={q(eyeLx - eyeR, eyeY - eyeR * 1.5, eyeLx, eyeY - eyeR * 2.0, eyeLx + eyeR, eyeY - eyeR * 1.5)}
            style={{ stroke: String(features), strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round' }} />
      <path d={q(eyeRx - eyeR, eyeY - eyeR * 1.5, eyeRx, eyeY - eyeR * 2.0, eyeRx + eyeR, eyeY - eyeR * 1.5)}
            style={{ stroke: String(features), strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round' }} />
    </>
  );

  const MouthV = () => (
    <path d={q(cx - mouthW / 2, mouthY, cx, mouthY + mouthH, cx + mouthW / 2, mouthY)}
          style={{ stroke: String(features), strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }} />
  );

  const MouthSmile = () => (
    <path d={q(cx - mouthW, mouthY, cx, mouthY + mouthH * 1.2, cx + mouthW, mouthY)}
          style={{ stroke: String(features), strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }} />
  );

  const MouthW = () => {
    const x1 = cx - mouthW * 0.7, x2 = cx + mouthW * 0.7, s = (x2 - x1) / 2;
    return (
      <path
        d={`M${x1} ${mouthY} Q ${x1 + s * 0.5} ${mouthY + mouthH * 0.9} ${x1 + s} ${mouthY}
           Q ${x1 + s * 1.5} ${mouthY + mouthH * 0.9} ${x2} ${mouthY}`}
        style={{ stroke: String(features), strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }}
      />
    );
  };

  const MouthO = ({ filled }: { filled?: boolean }) => (
    <ellipse cx={cx} cy={mouthY} rx={mouthW * 0.35} ry={mouthH * 0.9}
             style={{ fill: filled ? String(features) : 'none', stroke: String(features), strokeWidth: 2 }} />
  );

  const MouthKodama = () => {
    // Hand-drawn wavy circle for mouth
    const mouthR = mouthW * 0.18;
    const wave1 = 1 + (getUnit(num + 121, 16) - 8) / 100; // 0.92 to 1.08
    const wave2 = 1 + (getUnit(num + 123, 16) - 8) / 100;
    const wave3 = 1 + (getUnit(num + 125, 16) - 8) / 100;
    const wave4 = 1 + (getUnit(num + 127, 16) - 8) / 100;
    
    const mouthPath = `
      M ${cx - mouthR * wave1} ${mouthY}
      C ${cx - mouthR * wave1} ${mouthY - mouthR * 0.55 * wave2},
        ${cx - mouthR * 0.55 * wave3} ${mouthY - mouthR * wave4},
        ${cx} ${mouthY - mouthR * wave4}
      C ${cx + mouthR * 0.55 * wave1} ${mouthY - mouthR * wave2},
        ${cx + mouthR * wave3} ${mouthY - mouthR * 0.55 * wave4},
        ${cx + mouthR * wave3} ${mouthY}
      C ${cx + mouthR * wave1} ${mouthY + mouthR * 0.55 * wave2},
        ${cx + mouthR * 0.55 * wave3} ${mouthY + mouthR * wave4},
        ${cx} ${mouthY + mouthR * wave4}
      C ${cx - mouthR * 0.55 * wave1} ${mouthY + mouthR * wave2},
        ${cx - mouthR * wave3} ${mouthY + mouthR * 0.55 * wave4},
        ${cx - mouthR * wave1} ${mouthY}
      Z
    `;
    
    return <path d={mouthPath} style={{ fill: String(features) }} />;
  };

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={size} height={size} role="img" fill="none" xmlns="http://www.w3.org/2000/svg" {...otherProps}>
      {title && <title>{name}</title>}

      {/* container shape ONLY via mask; fixes square mode */}
      <mask id={maskID}>
        <rect width={SIZE} height={SIZE} rx={square ? 0 : SIZE * 2} fill="#fff" />
      </mask>

      <g mask={`url(#${maskID})`}>
        {/* background fill (no rotation to ensure full canvas coverage) */}
        <rect width={SIZE} height={SIZE} style={{ fill: String(bg) }} />

        {/* optional subtle inner vignette for anime pop (kept inside, never outlines container) */}
        <radialGradient id={`g-${maskID}`} cx="50%" cy="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.08" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </radialGradient>
        <rect width={SIZE} height={SIZE} fill={`url(#g-${maskID})`} />
        
        {/* Apply rotation only to features, not background */}
        <g transform={`rotate(${tilt} ${cx} ${cy})`}>

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
        {eyeStyle === 4 && <EyeKodama />}
        {eyeStyle === 5 && <EyeDots />}

        {/* eyebrows (classic only) */}
        {showBrows && !isKodama && <Brows />}

        {/* mouth */}
        {mouthStyle === 0 && <MouthV />}
        {mouthStyle === 1 && <MouthSmile />}
        {mouthStyle === 2 && <MouthW />}
        {mouthStyle === 3 && <MouthO />}
        {mouthStyle === 4 && <MouthO filled />}
        {mouthStyle === 5 && null}
        {mouthStyle === 6 && <MouthKodama />}

        {/* blush (classic only) - on cheeks below eyes */}
        {showBlush && !isKodama && (
          <>
            <circle cx={cx - SIZE * 0.22} cy={cy} r={SIZE * 0.05} style={{ fill: String(accent), opacity: 0.5 }} />
            <circle cx={cx + SIZE * 0.22} cy={cy} r={SIZE * 0.05} style={{ fill: String(accent), opacity: 0.5 }} />
          </>
        )}
        </g> {/* Close features transform group */}
      </g> {/* Close mask group */}
    </svg>
  );
}