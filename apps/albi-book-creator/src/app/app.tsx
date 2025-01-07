import { db } from '@abc/storage';
import { Button, Card, Flex } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRef, useState } from 'react';
import './app.module.css';
import { a4Points } from './constants';
import { Drawboard } from './Drawboard';
import { Welcome } from './Welcome';

import { AreaDetailModal } from './AreaDetail';
import { AreaList } from './AreaList';
import { ControlPanelModal } from './ControlPanelModal';

export const BookCreator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [controlPanelOpen, setControlPanelOpen] = useState(false);
  const [modalAreaId, setModalAreaId] = useState<number | null>(null);

  const [img] = useLiveQuery(() => db.pageImage.toArray()) ?? [];
  const areas = useLiveQuery(() => db.imageObjects.toArray()) ?? [];

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
      <Card
        size="small"
        bordered
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}
      >
        <Flex
          vertical
          gap="middle"
          style={{
            maxHeight: '60vh',
          }}
        >
          <Button
            type="primary"
            style={{ flexShrink: 0 }}
            onClick={() => setControlPanelOpen(true)}
          >
            Open control panel
          </Button>
          <div
            style={{
              overflowY: 'scroll',
            }}
          >
            <AreaList
              areas={areas}
              onClick={(area) => setModalAreaId(area.id)}
            />
          </div>
        </Flex>
      </Card>
      {modalAreaId && (
        <AreaDetailModal
          areaId={modalAreaId}
          onClose={() => setModalAreaId(null)}
        />
      )}
      {controlPanelOpen && (
        <ControlPanelModal
          onClose={() => setControlPanelOpen(false)}
          areas={areas}
        />
      )}
      <canvas
        ref={canvasRef}
        id="oidCanvas"
        width={a4Points.h}
        height={a4Points.v}
        style={{ border: '1px solid black', display: 'none' }}
      ></canvas>
    </div>
  );
};

export default BookCreator;
