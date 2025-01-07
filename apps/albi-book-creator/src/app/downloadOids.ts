import { generateOids } from '@abc/oid-generator';
import { ImageObject } from '@abc/storage';
import { changeDpiDataUrl } from 'changedpi';

export const downloadOids = (areas: ImageObject[]) => {
  const canvas = document.getElementById('oidCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';

  areas
    .map((area) => {
      const boundingPolygon = area.stroke;

      const oids = generateOids(area.oid, boundingPolygon);
      return oids;
    })
    .flat()
    .forEach(([x, y]) => {
      ctx.fillRect(x, y, 2, 2);
    });

  const dataURL = canvas.toDataURL('image/png');
  const dataUrl1200DPI = changeDpiDataUrl(dataURL, 1200);
  const link = document.createElement('a');
  link.download = 'canvas.png';
  link.href = dataUrl1200DPI;
  link.click();
};
