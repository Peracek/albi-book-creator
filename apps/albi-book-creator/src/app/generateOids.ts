import { Point } from '@abc/storage';
import { calcChecksum } from './calcChecksum';
import { getBbox } from './getBbox';
import pointInPolygon from 'point-in-polygon';
import { scale } from './utils';

// rester size
const size = 32 * 2;
const spacing = size / 4;
const offset = size / 32;

const oidFrame = (
  [
    [0, 0],
    [8, 0],
    [16, 0],
    [24, 0],
    [0, 8],
    [1, 16],
    [0, 24],
  ] as Point[]
).map(scale(2));

const generateOid = (value: number): Point[] => {
  const checksum = calcChecksum(value);
  const base4Value = value.toString(4).padStart(8, '0');
  const base4ValueWithChecksum = checksum + base4Value;

  const dots: Point[] = base4ValueWithChecksum
    .split('')

    .map((char, index) => {
      const x = index % 3;
      const y = Math.floor(index / 3);
      let cx = (x + 1) * spacing;
      let cy = (y + 1) * spacing;

      if (char === '0') {
        cx += offset;
        cy += offset;
      }
      if (char === '1') {
        cx -= offset;
        cy += offset;
      }
      if (char === '2') {
        cx -= offset;
        cy -= offset;
      }
      if (char === '3') {
        cx += offset;
        cy -= offset;
      }

      return [cx, cy];
    });

  return [...oidFrame, ...dots];
};

export const generateOids = (value: number, boundingPolygon: Point[]) => {
  const bbox = getBbox(boundingPolygon);
  const alignedBbox = [
    Math.floor(bbox[0] / size) * size,
    Math.floor(bbox[1] / size) * size,
    Math.ceil(bbox[2] / size) * size,
    Math.ceil(bbox[3] / size) * size,
  ];

  const repeatX = Math.ceil((alignedBbox[2] - alignedBbox[0]) / size);
  const repeatY = Math.ceil((alignedBbox[3] - alignedBbox[1]) / size);

  const oids: Point[] = [];
  for (let x = 0; x < repeatX; x++) {
    for (let y = 0; y < repeatY; y++) {
      const offsetx = x * size;
      const offsety = y * size;
      const oid = generateOid(value);
      oids.push(
        ...oid.map(
          ([x, y]) =>
            [
              x + offsetx + alignedBbox[0],
              y + offsety + alignedBbox[1],
            ] as Point
        )
      );
    }
  }

  return oids.filter((point) => pointInPolygon(point, boundingPolygon));
};
