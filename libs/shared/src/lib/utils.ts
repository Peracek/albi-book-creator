import { Point } from './typings';

export const scale =
  (factor: number) =>
  <T extends number[]>(coors: T) =>
    coors.map((coor) => coor * factor) as T;

export const translate =
  (dx: number, dy: number) =>
  ([x, y]: Point) =>
    [x + dx, y + dy] as Point;
