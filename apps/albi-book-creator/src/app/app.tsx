import { db } from '@abc/storage';
import { Button, Flex, Space } from 'antd';
import { changeDpiDataUrl } from 'changedpi';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRef, useState } from 'react';
import { BackupAndRestore } from './BackupAndRestore';
import { a4Points } from './constants';
import { Freehand } from './Freehand';
import { generateOids } from './generateOids';
import { ImageObjectTable } from './ImageObjectTable';
import { oidTable } from './oidTable';
import { showNameModal } from './showNameModal';
import { Drawboard } from './Drawboard';
import './app.module.css';

// stop tlacitko (interni kod)
const STOP_BUTTON_CODE = 0x0006;

export const BookCreator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [focusedArea, setFocusedArea] = useState<string | null>(null);

  const areas = useLiveQuery(() => db.imageObjects.toArray()) ?? [];

  const download = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';

    areas
      .map((area) => {
        const boundingPolygon = area.stroke;
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
    <div style={{ height: '100vh', width: '100vw' }}>
      <Drawboard>
        {(drawing) => (
          <Freehand
            drawing={drawing}
            areas={areas}
            onStrokeEnd={async (stroke) => {
              const name = await showNameModal();
              await db.imageObjects.add({
                stroke,
                name,
                oid: STOP_BUTTON_CODE,
              });
            }}
          />
        )}
      </Drawboard>
    </div>
  );

  return (
    <Flex vertical justify="stretch" gap="middle">
      <Flex gap="middle">
        <ImageObjectTable data={areas} />
      </Flex>
      <div>
        <Space direction="vertical" size="middle">
          <Button onClick={download}>Download OIDs PNG</Button>
          <BackupAndRestore />
        </Space>
      </div>
      <canvas
        ref={canvasRef}
        id="myCanvas"
        width={a4Points.h}
        height={a4Points.v}
        style={{ border: '1px solid black', display: 'none' }}
      ></canvas>
    </Flex>
  );
};

export default BookCreator;
