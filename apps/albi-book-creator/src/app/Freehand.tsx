import { getStroke } from 'perfect-freehand';
import * as React from 'react';

import { getSvgPathFromStroke, scale } from './utils';
import { ImageObject, Point } from '@abc/storage';
import { a4Points } from './constants';

const options = {
  size: 5,
  thinning: 0,
  smoothing: 0.5,
  streamline: 0.5,
};

type Props = React.PropsWithChildren<{
  onStrokeEnd: (points: Point[]) => void;
  areas: ImageObject[];
}>;

const width = 297 * 2;
const height = 210 * 2;

export const Freehand = (props: Props) => {
  const [points, setPoints] = React.useState<Point[]>([]);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const getSvgDimensions = () => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }
    return { width, height };
  };

  const handlePointerDown: React.PointerEventHandler<SVGSVGElement> = (e) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    setPoints([[e.clientX - rect.left, e.clientY - rect.top]]);
  };

  const handlePointerMove: React.PointerEventHandler<SVGSVGElement> = (e) => {
    if (e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPoints([...points, [e.clientX - rect.left, e.clientY - rect.top]]);
  };

  const handlePointerUp = () => {
    const { width: actualWidth } = getSvgDimensions();
    const factor = a4Points.h / actualWidth;
    const scaledUpPoints = points.map(scale(factor));
    props.onStrokeEnd(scaledUpPoints);
    setPoints([]);
  };

  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke as Point[]);

  return (
    <svg
      ref={svgRef}
      id="drawboard"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        touchAction: 'none',
        border: '1px solid #ddd',
        aspectRatio: 297 / 210,
      }}
    >
      {points && <path d={pathData} />}
      {props.areas.map((area) => {
        const { width: actualWidth } = getSvgDimensions();
        const factor = actualWidth / a4Points.h;
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
