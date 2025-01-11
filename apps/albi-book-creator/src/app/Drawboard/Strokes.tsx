import { type Point, scale } from '@abc/shared';
import { ImageObject } from '@abc/storage';
import { getSvgPathFromStroke } from './getSvgPathFromStroke';

type Props = {
  areas: ImageObject[];
  initialScale: number;
};

export const Strokes = ({ initialScale, areas }: Props) => {
  return (
    <svg
      id="strokes"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        touchAction: 'none',
        aspectRatio: 297 / 210,
      }}
    >
      {areas.map((area) => {
        const factor = initialScale;
        const scaledDownPoints = area.stroke.map(scale(factor));
        const pathData = getSvgPathFromStroke(scaledDownPoints as Point[]);
        return (
          <path
            key={area.id}
            d={pathData}
            id={area.name}
            style={{
              fill: 'rgba(0, 0, 0, 0.1)',
              // fill: isFocused ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            }}
          />
        );
      })}
    </svg>
  );
};
