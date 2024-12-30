import { getStroke } from "perfect-freehand";
import * as React from "react";

import { getSvgPathFromStroke } from "./utils";
import { Point } from "./types";

const options = {
  size: 5,
  thinning: 0,
  smoothing: 0.5,
  streamline: 0.5,
};

type Props = React.PropsWithChildren<{
  onStrokeEnd: (points: Point[]) => void;
}>;

export const Freehand = (props: Props) => {
  const [points, setPoints] = React.useState<Point[]>([]);

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

  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke as Point[]);

  return (
    <svg
      id="drawboard"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => {
        props.onStrokeEnd(points);
        setPoints([]);
      }}
      style={{
        touchAction: "none",
        width: `${2 * 297}px`,
        height: `${2 * 210}px`,
        border: "1px solid #ddd",
      }}
    >
      {points && <path d={pathData} />}
      {props.children}
    </svg>
  );
};
