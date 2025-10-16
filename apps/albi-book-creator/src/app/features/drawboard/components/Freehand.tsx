import { getStroke } from 'perfect-freehand';
import { type PointerEventHandler, type RefObject, useState } from 'react';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { ImageObject } from '@abc/storage';
import { type Point, scale } from '@abc/shared';
import { A4Ref } from './A4';
import { getSvgPathFromStroke } from '../utils/getSvgPathFromStroke';
import { a4Points } from '../../../constants';

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
    // Get points relative to the SVG (viewport-relative)
    const rect = e.currentTarget.getBoundingClientRect();
    setPoints([[e.clientX - rect.left, e.clientY - rect.top]]);
  };

  const handlePointerMove: PointerEventHandler<SVGSVGElement> = (e) => {
    if (e.buttons !== 1) return;
    // Get points relative to the SVG (viewport-relative)
    const rect = e.currentTarget.getBoundingClientRect();
    setPoints([...points, [e.clientX - rect.left, e.clientY - rect.top]]);
  };

  const handlePointerUp = () => {
    const factor = 1 / a4Ref.current!.initialScale;
    const a4Element = a4Ref.current!.element;

    if (!a4Element) {
      console.error('A4 element not found');
      setPoints([]);
      return;
    }

    const {
      scale: zoomFactor,
    } = zoomPanRef.current!.instance.getContext().state;

    // Get the A4 element's position on screen
    const a4Rect = a4Element.getBoundingClientRect();
    const svgRect = document.getElementById('drawboard')!.getBoundingClientRect();

    console.log('Transform state:', { zoomFactor, factor });
    console.log('A4 rect:', a4Rect);
    console.log('SVG rect:', svgRect);
    console.log('Raw points (first):', points[0]);

    // Transform points from SVG coordinates to A4 coordinates
    const scaledUpPoints = points
      .map(([x, y]) => {
        // Convert from SVG-relative to A4-relative (both in screen pixels at current zoom)
        const a4X = x - (a4Rect.left - svgRect.left);
        const a4Y = y - (a4Rect.top - svgRect.top);
        // The A4 rect is already at the zoomed size, so we need to unzoom it
        // The base (unzoomed) size would be a4Rect.width / zoomFactor
        // So to convert to A4 1200dpi coords, we scale by: a4Points.h / (a4Rect.width / zoomFactor)
        return [a4X / a4Rect.width * a4Points.h, a4Y / a4Rect.height * a4Points.v] as Point;
      })
      .map(([x, y]) => [Math.floor(x), Math.floor(y)] as Point);

    console.log('Scaled points (first):', scaledUpPoints[0]);

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
