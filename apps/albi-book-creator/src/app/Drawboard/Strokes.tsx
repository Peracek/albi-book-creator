import { type Point, scale } from '@abc/shared';
import { ImageObject } from '@abc/storage';
import { getSvgPathFromStroke } from './getSvgPathFromStroke';
import { useSelectedArea } from '../SelectedAreaContext';

type Props = {
  areas: ImageObject[];
  initialScale: number;
};

export const Strokes = ({ initialScale, areas }: Props) => {
  const { selectedArea, setSelectedArea } = useSelectedArea();

  return (
    <svg
      id="strokes"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // pointerEvents: 'none',
        touchAction: 'none',
        aspectRatio: 297 / 210,
      }}
    >
      {areas.map((area) => {
        const isFocused = selectedArea === area.id;
        const factor = initialScale;
        const scaledDownPoints = area.stroke.map(scale(factor));
        const pathData = getSvgPathFromStroke(scaledDownPoints as Point[]);
        return (
          <path
            onMouseEnter={() => setSelectedArea(area.id)}
            onMouseLeave={() => setSelectedArea(null)}
            key={area.id}
            d={pathData}
            id={area.name}
            style={{
              fill: isFocused ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              stroke: isFocused ? 'black' : 'rgba(0, 0, 0, 0.1)',
            }}
          />
        );
      })}
    </svg>
  );
};
