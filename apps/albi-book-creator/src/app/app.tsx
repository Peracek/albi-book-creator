import { db } from '@abc/storage';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRef, useState } from 'react';
import './app.module.css';
import { a4Points } from './constants';
import { Drawboard } from './Drawboard';
import { Welcome } from './Welcome';

import { AreaDetailModal } from './AreaDetail';
import { ExportModal } from './ExportModal';
import { Sidebar } from './Sidebar';

export const BookCreator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modalAreaId, setModalAreaId] = useState<number | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

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
      <Sidebar
        areas={areas}
        onExportClick={() => setExportModalOpen(true)}
        onAreaClick={(area) => setModalAreaId(area.id)}
      />

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
      {exportModalOpen && (
        <ExportModal
          areas={areas}
          onClose={() => setExportModalOpen(false)}
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
