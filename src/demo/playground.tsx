import { useEffect, useRef, useState, memo, useMemo } from 'react';
import styled from 'styled-components';
import { SegmentGroup, Segment, Button, BaseStyles, ColorDot } from './ui-system';
import colors from 'nice-color-palettes/1000.json';
import { exampleNames } from './example-names';
import Avatar from '../lib';

const paletteColors = colors;

const Header = styled.header`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto auto;
  padding: var(--pagePadding);
  align-items: center;
  grid-gap: var(--sp-s);
`;

const ColorsSection = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(5, 1fr);
  max-width: max-content;
  grid-gap: var(--sp-xs);
`;

const Banner = styled.div`
  background: var(--c-body);
  color: var(--c-background);
  padding: var(--sp-l);
`;

const AvatarsGrid = styled.div`
  display: grid;
  grid-gap: var(--sp-l) var(--sp-s);
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  padding: var(--pagePadding);
`;

const AvatarContainer = styled.div`
  display: grid;
  grid-gap: var(--sp-s);
  padding: 0 var(--sp-m);
  font-size: 0.8rem;
`;

const AvatarSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  padding: 0.3rem 0.5rem;
  font-size: 0.75rem;
  color: inherit;
  border: 1px solid transparent;
  transition: 0.5s;
  width: 100%;
  text-align: center;
  border-radius: 100rem;
  background: transparent;

  &:hover {
    border-color: var(--c-fieldHover);
    transition: 0.2s;
  }

  &:focus {
    border-color: var(--c-fieldFocus);
    outline: none;
  }
`;

interface AvatarWrapperProps {
  name: string;
  playgroundColors: string[];
  size: number;
  square: boolean;
  variant: 'beam' | 'bauhaus' | 'ring' | 'sunset' | 'pixel' | 'marble' | 'fractal';
}

// Memoized Avatar component to prevent unnecessary re-renders
const MemoizedAvatar = memo(Avatar);

const AvatarWrapper = memo(({ name, playgroundColors, size, square, variant }: AvatarWrapperProps) => {
  const [avatarName, setAvatarName] = useState<string>(name);
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();
  const ref = useRef<HTMLDivElement>(null);
  const [copyValue, setCopyValue] = useState<string>(name);

  useEffect(() => {
    if (ref.current) {
      const svgNode = ref.current.innerHTML;
      const svgStart = svgNode.indexOf('<svg');
      const svgEnd = svgNode.indexOf('</svg>') + 6;
      const svgResult = svgNode.substring(svgStart, svgEnd).toString();

      setCopyValue(svgResult);
    }
  }, [copyValue, variant, playgroundColors]);

  return (
    <AvatarContainer>
      <AvatarSection className="Avatar" ref={ref}>
        <MemoizedAvatar
          name={avatarName}
          colors={playgroundColors}
          size={size}
          variant={variant}
          square={square}
        />
      </AvatarSection>
      <Input
        value={avatarName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvatarName(e.target.value)}
        onFocus={handleFocus}
      />
    </AvatarContainer>
  );
});

const getRandomPaletteIndex = (): number => Math.floor(Math.random() * paletteColors.length);

const avatarSizes: Record<string, number> = {
  small: 40,
  medium: 80,
  large: 128,
};

const SizeDotWrapper = styled(Button)<{ isSelected: boolean }>`
  ${(p) => (p.isSelected ? `background-color: var(--c-background)` : null)};
  ${(p) => !p.isSelected && `color: var(--c-fade)`};

  &:hover {
    ${(p) => p.isSelected && `background-color: var(--c-background)`};
  }
`;

const Dot = styled.div<{ size: number }>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  background-color: currentColor;
  border-radius: 10rem;
`;

const SizeDot = ({
  size,
  isSelected,
  onClick,
}: {
  size: number;
  isSelected: boolean;
  onClick?: () => void;
}) => {
  const getSize = () => {
    switch (size) {
      case avatarSizes.small:
        return 8;
      case avatarSizes.medium:
        return 14;
      case avatarSizes.large:
        return 20;
      default:
        return 0;
    }
  };
  return <SizeDotWrapper isSelected={isSelected} icon={<Dot size={getSize()} />} onClick={onClick} />;
};

export const Playground = () => {
  const defaultPlaygroundColors = paletteColors[493];
  const [playgroundColors, setPlaygroundColors] = useState(defaultPlaygroundColors);

  const [dotColor0, setDotColor0] = useState(playgroundColors[0]);
  const [dotColor1, setDotColor1] = useState(playgroundColors[1]);
  const [dotColor2, setDotColor2] = useState(playgroundColors[2]);
  const [dotColor3, setDotColor3] = useState(playgroundColors[3]);
  const [dotColor4, setDotColor4] = useState(playgroundColors[4]);

  const filteredColors = [dotColor0, dotColor1, dotColor2, dotColor3, dotColor4];

  const handleRandomColors = () => {
    setPlaygroundColors(paletteColors[getRandomPaletteIndex()]);
  };

  useEffect(() => {
    setDotColor0(playgroundColors[0]);
    setDotColor1(playgroundColors[1]);
    setDotColor2(playgroundColors[2]);
    setDotColor3(playgroundColors[3]);
    setDotColor4(playgroundColors[4]);
  }, [playgroundColors]);

  const [avatarSize, setAvatarSize] = useState(avatarSizes.medium);
  const [variant, setVariant] = useState<AvatarWrapperProps['variant']>('beam');
  const [isSquare, setSquare] = useState(false);

  return (
    <>
      <BaseStyles />
      <Header>
        <SegmentGroup>
          {(['beam', 'bauhaus', 'ring', 'sunset', 'pixel', 'marble', 'fractal'] as const).map(
            (variantItem, i) => (
              <Segment
                key={i}
                onClick={() => setVariant(variantItem)}
                isSelected={variantItem === variant}
              >
                {variantItem}
              </Segment>
            ),
          )}
        </SegmentGroup>
        <ColorsSection>
          <ColorDot value={dotColor0} onChange={(color) => setDotColor0(color)} />
          <ColorDot value={dotColor1} onChange={(color) => setDotColor1(color)} />
          <ColorDot value={dotColor2} onChange={(color) => setDotColor2(color)} />
          <ColorDot value={dotColor3} onChange={(color) => setDotColor3(color)} />
          <ColorDot value={dotColor4} onChange={(color) => setDotColor4(color)} />
        </ColorsSection>

        <Button onClick={() => handleRandomColors()}>Random palette</Button>
        <Button onClick={() => setSquare(!isSquare)}>{isSquare ? 'Round' : 'Square'}</Button>
        <SegmentGroup>
          {Object.entries(avatarSizes).map(([, value], index) => (
            <SizeDot
              key={index}
              onClick={() => setAvatarSize(value)}
              isSelected={value === avatarSize}
              size={value}
            />
          ))}
        </SegmentGroup>
      </Header>
      <AvatarsGrid>
        {useMemo(() => 
          exampleNames.map((exampleName, index) => (
            <AvatarWrapper
              key={`${variant}-${index}`}
              size={avatarSize}
              square={isSquare}
              name={exampleName}
              playgroundColors={filteredColors}
              variant={variant}
            />
          )), [avatarSize, isSquare, filteredColors, variant]
        )}
      </AvatarsGrid>
    </>
  );
};
