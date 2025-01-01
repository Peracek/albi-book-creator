import { ImageObject, Point } from '@abc/storage';
import { RefObject, useEffect, useRef, useState } from 'react';
import { a4Points } from './constants';
import { getSvgPathFromStroke, scale } from './utils';
import { useViewportSize } from './useViewportSize';
import { A4Ref } from './A4';

type Props = React.PropsWithChildren<{
  areas: ImageObject[];
  a4Ref: RefObject<A4Ref>;
}>;

export const Strokes = (props: Props) => {
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
      {props.areas.map((area) => {
        const factor =
          props.a4Ref.current!.getInitialBoundingBox()!.width / a4Points.h;
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
