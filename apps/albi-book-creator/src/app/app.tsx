import { db } from '@abc/storage';
import { Button, Card, Flex, Space } from 'antd';
import { changeDpiDataUrl } from 'changedpi';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRef, useState } from 'react';
import './app.module.css';
import { BackupAndRestore } from './BackupAndRestore';
import { a4Points } from './constants';
import { Drawboard } from './Drawboard';
import { generateOids } from './generateOids';
import { ImageObjectTable } from './ImageObjectTable';
import { oidTable } from './oidTable';
import { Welcome } from './Welcome';
import { DownloadOutlined } from '@ant-design/icons';

export const BookCreator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [focusedArea, setFocusedArea] = useState<string | null>(null);

  const [img] = useLiveQuery(() => db.pageImage.toArray()) ?? [];
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

  const downloadBnl = () => {};

  if (!img) {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Welcome />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Drawboard imageObjects={areas} img={img.image} />
      <Card style={{ position: 'absolute', top: 10, right: 10 }}>
        <Flex vertical justify="stretch" gap="middle">
          <Flex gap="middle">
            <ImageObjectTable data={areas} />
          </Flex>
          <div>
            <Space direction="vertical" size="middle">
              <Space>
                <Button onClick={download} icon={<DownloadOutlined />}>
                  OIDs PNG
                </Button>
                <Button onClick={downloadBnl} icon={<DownloadOutlined />}>
                  BNL
                </Button>
              </Space>
              <BackupAndRestore />
            </Space>
          </div>
        </Flex>
      </Card>
      <canvas
        ref={canvasRef}
        id="myCanvas"
        width={a4Points.h}
        height={a4Points.v}
        style={{ border: '1px solid black', display: 'none' }}
      ></canvas>
    </div>
  );
};

export default BookCreator;
