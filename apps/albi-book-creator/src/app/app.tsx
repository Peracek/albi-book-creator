import { db, Point } from '@abc/storage';
import { Button, Space } from 'antd';
import { changeDpiDataUrl } from 'changedpi';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRef, useState } from 'react';
import { BackupAndRestore } from './BackupAndRestore';
import { Freehand } from './Freehand';
import { generateOids, scale } from './generateOids';
import { ImageObjectTable } from './ImageObjectTable';
import { oidTable } from './oidTable';
import { showNameModal } from './showNameModal';
import { getSvgPathFromStroke } from './utils';

// stop tlacitko (interni kod)
const STOP_BUTTON_CODE = 0x0006;

export const BookCreator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [focusedArea, setFocusedArea] = useState<string | null>(null);

  const areas = useLiveQuery(() => db.imageObjects.toArray()) ?? [];

  const download = () => {
    const factor = 9924 / (210 * 2);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';

    areas
      .map((area) => {
        const boundingPolygon = area.stroke.map(scale(factor)) as Point[];
        const rawOidCode = oidTable[area.oid];
        const oids = generateOids(rawOidCode, boundingPolygon);
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

  return (
    <Space size="middle" align="start">
      {/* <ImageCanvas /> */}
      <Freehand
        onStrokeEnd={async (stroke) => {
          const name = await showNameModal();
          await db.imageObjects.add({ stroke, name, oid: STOP_BUTTON_CODE });
        }}
      >
        {areas.map((area) => {
          const pathData = getSvgPathFromStroke(area.stroke as Point[]);
          const isFocused = focusedArea === area.name;
          return (
            <path
              key={area.id}
              d={pathData}
              id={area.name}
              style={{
                fill: isFocused ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              }}
            />
          );
        })}
      </Freehand>

      <div>
        <Space direction="vertical" size="middle">
          <ImageObjectTable data={areas} />
          <Button onClick={download}>Download OIDs PNG</Button>
          <BackupAndRestore />
        </Space>
      </div>
      <canvas
        ref={canvasRef}
        id="myCanvas"
        width="14028"
        height="9924"
        style={{ border: '1px solid black', display: 'none' }}
      ></canvas>
    </Space>
  );
};

export default BookCreator;
