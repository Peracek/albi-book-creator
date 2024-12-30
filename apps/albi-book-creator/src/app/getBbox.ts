import { Point } from "./types";

export const getBbox = (
  points: Point[]
): [minX: number, minY: number, maxX: number, maxY: number] => {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  return [minX, minY, maxX, maxY];
};
