import { getStroke } from 'perfect-freehand';
import {
  type PointerEventHandler,
  type PropsWithChildren,
  type RefObject,
  useState,
} from 'react';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import { getSvgPathFromStroke, scale, translate } from './utils';
import { ImageObject, Point } from '@abc/storage';
import { a4Points } from './constants';
import { A4Ref } from './A4';

const options = {
  size: 5,
  thinning: 0,
  smoothing: 0.5,
  streamline: 0.5,
};

type Props = PropsWithChildren<{
  onStrokeEnd: (points: Point[]) => void;
  areas: ImageObject[];
  drawing: boolean;
  a4Ref: RefObject<A4Ref>;
  zoomPanRef: RefObject<ReactZoomPanPinchRef>;
}>;

export const Freehand = (props: Props) => {
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
    const a4BoundingBox = props.a4Ref.current!.getInitialBoundingBox()!;
    const factor = a4Points.h / a4BoundingBox.width;

    const {
      positionX,
      positionY,
      scale: zoomFactor,
      // } = props.zoomPanRef.current!.state;
    } = props.zoomPanRef.current!.instance.getContext().state;
    const scaledUpPoints = points
      // .map(translate(-a4BoundingBox.left, -a4BoundingBox.top))

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
