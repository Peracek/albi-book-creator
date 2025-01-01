// Turn the points returned from perfect-freehand into SVG path data.

import { Point } from '@abc/storage';

export function getSvgPathFromStroke(stroke: Point[]) {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
}

export const scale =
  (factor: number) =>
  <T extends number[]>(coors: T) =>
    coors.map((coor) => coor * factor) as T;

export const translate =
  (dx: number, dy: number) =>
  ([x, y]: Point) =>
    [x + dx, y + dy] as Point;
