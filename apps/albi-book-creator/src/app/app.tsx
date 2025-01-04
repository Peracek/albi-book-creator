import { db, ImageObject } from '@abc/storage';
import { Button, Card, Flex, Space } from 'antd';
import { changeDpiDataUrl } from 'changedpi';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRef, useState } from 'react';
import './app.module.css';
import { BackupAndRestore } from './BackupAndRestore';
import { a4Points } from './constants';
import { Drawboard } from './Drawboard';
import { ImageObjectTable } from './ImageObjectTable';
import { Welcome } from './Welcome';
import { DownloadOutlined } from '@ant-design/icons';
import { appBnlCreate, OidsSpec } from '@abc/bnl-creator';
import { saveAs } from 'file-saver';
import { fromPairs } from 'lodash';
import { generateOids } from '@abc/oid-generator';
import { AreaDetailModal } from './AreaDetail';
import { AreaList } from './AreaList';

export const BookCreator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [focusedArea, setFocusedArea] = useState<string | null>(null);
  const [modalAreaId, setModalAreaId] = useState<number | null>(null);

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

  const downloadBnl = async () => {
    const defaultSoundFileNames = [
      'kniha_vitej1.mp3',
      'kniha_vitej2.mp3',
      'mod_vice_inf.mp3',
      'mod_zakladni.mp3',
    ];

    const defaultSoundsPairs = await Promise.all(
      defaultSoundFileNames.map(async (fileName) => {
        const response = await fetch(`default-mp3/${fileName}`);
        return [fileName, await response.blob()];
      })
    );
    // FIXME: Object.fromEntries produceses any
    const defaultSounds = fromPairs(defaultSoundsPairs);

    const oidsSpec: OidsSpec = Object.fromEntries(
      areas.map((area) => [
        `oid_${area.oid}`,
        { mode_0: [area.sound?.name ?? ''], mode_1: [area.sound?.name ?? ''] },
      ])
    );

    const sounds = fromPairs(
      areas
        .map((area) => (area.sound ? [area.sound.name, area.sound] : undefined))
        .filter((x) => x !== undefined)
    );

    const bnlBlob = await appBnlCreate(oidsSpec, {
      ...sounds,
      ...defaultSounds,
    });
    saveAs(bnlBlob, 'test.bnl');
  };

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
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          height: '60vh',
          overflowY: 'scroll',
        }}
      >
        <AreaList areas={areas} onClick={(area) => setModalAreaId(area.id)} />
      </div>

      {/* <Card style={{ position: 'absolute', top: 10, right: 10 }}>
        <Flex vertical justify="stretch" gap="middle">
          <Flex gap="middle" onClick={() => setModalArea(areas[0])}>
            <AreaList areas={areas} onClick={(area) => setModalArea(area)} />
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
      </Card> */}
      {modalAreaId && (
        <AreaDetailModal
          areaId={modalAreaId}
          onClose={() => setModalAreaId(null)}
        />
      )}
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
