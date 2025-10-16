import { type Point } from '@abc/shared';
import { ImageObject } from '@abc/storage';
import { getSvgPathFromStroke } from '../utils/getSvgPathFromStroke';
import { useSelectedArea } from '../../areas/SelectedAreaContext';
import { a4Points } from '../../../constants';

type Props = {
  areas: ImageObject[];
  initialScale: number;
};

export const Strokes = ({ initialScale, areas }: Props) => {
  const { selectedArea, setSelectedArea } = useSelectedArea();

  return (
    <svg
      id="strokes"
      viewBox={`0 0 ${a4Points.h} ${a4Points.v}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // pointerEvents: 'none',
        touchAction: 'none',
      }}
    >
      {areas.map((area) => {
        const isFocused = selectedArea === area.id;
        const pathData = getSvgPathFromStroke(area.stroke as Point[]);
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
