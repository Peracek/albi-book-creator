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
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="28" result="coloredBlur" />
          <feComponentTransfer result="intensifiedBlur" in="coloredBlur">
            <feFuncA type="linear" slope="3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="intensifiedBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
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
              fill: 'none',
              stroke: '#1890ff',
              strokeWidth: isFocused ? 15 : 0,
              filter: isFocused ? 'url(#glow)' : 'none',
            }}
          />
        );
      })}
    </svg>
  );
};
