import { useRef, useState } from 'react';
import './app.module.css';
import { a4Points } from './constants';
import { Drawboard } from './features/drawboard';
import { Welcome } from './features/welcome/Welcome';

import { ExportModal } from './features/export/ExportModal';
import { Sidebar } from './components/Sidebar';
import { useAreas, usePageImage } from './hooks';

export const BookCreator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [drawing, setDrawing] = useState(false);

  const img = usePageImage();
  const areas = useAreas();

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
        pageImage={img.image}
        onExportClick={() => setExportModalOpen(true)}
        onAddArea={() => setDrawing(true)}
        drawing={drawing}
      />

      {/* Main content area with Drawboard */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Drawboard imageObjects={areas} img={img.image} drawing={drawing} setDrawing={setDrawing} />
      </div>

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
