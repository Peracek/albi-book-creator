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
    <div style={{ height: '100vh', width: '100vw', display: 'flex', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '300px',
          height: '100%',
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #d9d9d9',
          padding: '16px',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0' }}>Tools & Areas</h3>
        <Flex vertical gap="middle">
          <Button
            type="primary"
            onClick={() => setControlPanelOpen(true)}
            block
          >
            Open control panel
          </Button>
          <div>
            <h4 style={{ margin: '0 0 8px 0' }}>Areas</h4>
            <AreaList
              areas={areas}
              onClick={(area) => setModalAreaId(area.id)}
            />
          </div>
        </Flex>
      </div>

      {/* Main content area with Drawboard */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Drawboard imageObjects={areas} img={img.image} />
      </div>

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
