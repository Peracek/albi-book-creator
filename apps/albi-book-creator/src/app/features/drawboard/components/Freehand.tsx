import { getStroke } from 'perfect-freehand';
import { type PointerEventHandler, type RefObject, useState } from 'react';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { ImageObject } from '@abc/storage';
import { type Point, scale } from '@abc/shared';
import { A4Ref } from './A4';
import { getSvgPathFromStroke } from '../utils/getSvgPathFromStroke';

const options = {
  size: 5,
  thinning: 0,
  smoothing: 0.5,
  streamline: 0.5,
};

type Props = {
  onStrokeEnd: (points: Point[]) => void;
  areas: ImageObject[];
  drawing: boolean;
  a4Ref: RefObject<A4Ref>;
  zoomPanRef: RefObject<ReactZoomPanPinchRef>;
};

export const Freehand = ({
  a4Ref,
  zoomPanRef,
  areas,
  drawing,
  onStrokeEnd,
}: Props) => {
  const [points, setPoints] = useState<Point[]>([]);

  const handlePointerDown: PointerEventHandler<SVGSVGElement> = (e) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    setPoints([[e.clientX - rect.left, e.clientY - rect.top]]);
  };

  const handlePointerMove: PointerEventHandler<SVGSVGElement> = (e) => {
    if (e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPoints([...points, [e.clientX - rect.left, e.clientY - rect.top]]);
  };

  const handlePointerUp = () => {
    const factor = 1 / a4Ref.current!.initialScale;

    const {
      positionX,
      positionY,
      scale: zoomFactor,
    } = zoomPanRef.current!.instance.getContext().state;
    const scaledUpPoints = points
      // .map(translate(-a4BoundingBox.left, -a4BoundingBox.top))

      // FIXME: make translate function
      .map(([x, y]) => [x - positionX, y - positionY] as Point)
      .map(scale(factor / zoomFactor))
      .map(([x, y]) => [Math.floor(x), Math.floor(y)] as Point);

    onStrokeEnd(scaledUpPoints);
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
        pointerEvents: drawing ? 'auto' : 'none',
        touchAction: 'none',
      }}
    >
      {points && <path d={pathData} />}
    </svg>
  );
};
