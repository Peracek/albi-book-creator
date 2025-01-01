import { getStroke } from 'perfect-freehand';
import * as React from 'react';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { getSvgPathFromStroke, scale } from './utils';
import { ImageObject, Point } from '@abc/storage';
import { a4Points } from './constants';
import { useViewportSize } from './useViewportSize';

const options = {
  size: 5,
  thinning: 0,
  smoothing: 0.5,
  streamline: 0.5,
};

type Props = React.PropsWithChildren<{
  onStrokeEnd: (points: Point[]) => void;
  areas: ImageObject[];
  drawing: boolean;
  zoomPanRef: React.RefObject<ReactZoomPanPinchRef>;
}>;

export const Freehand = (props: Props) => {
  const [points, setPoints] = React.useState<Point[]>([]);
  const viewportSize = useViewportSize();

  const getSvgDimensions = () => {
    return { width: viewportSize.width, height: viewportSize.height };
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

    const {
      positionX,
      positionY,
      scale: zoomFactor,
      // } = props.zoomPanRef.current!.state;
    } = props.zoomPanRef.current!.instance.getContext().state;
    // debugger;
    const scaledUpPoints = points
      // FIXME: make translate function
      .map(([x, y]) => [x - positionX, y - positionY] as Point)
      .map(scale(factor / zoomFactor))
      .map(([x, y]) => [Math.floor(x), Math.floor(y)] as Point);

    props.onStrokeEnd(scaledUpPoints);
    setPoints([]);
  };

  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke as Point[]);

  return (
    <svg
      id="drawboard"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: props.drawing ? 'auto' : 'none',
        touchAction: 'none',
        border: '1px solid #ddd',
        aspectRatio: 297 / 210,
      }}
    >
      {points && <path d={pathData} />}
    </svg>
  );
};
