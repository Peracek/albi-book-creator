import { db, getNextOid, ImageObject } from '@abc/storage';
import { useEffect, useRef, useState } from 'react';
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';
import { useKeyboardShortcut, useObjectUrl } from '../hooks';
import { A4, A4Ref } from './A4';
import { Controls } from './Controls';
import { Freehand } from './Freehand';
import showNameModal from './showNameModal';
import { Strokes } from './Strokes';

type Props = {
  imageObjects: ImageObject[];
  img: Blob;
};

export const Drawboard = ({ imageObjects, img }: Props) => {
  const a4Ref = useRef<A4Ref>(null);
  const zoomPanRef = useRef<ReactZoomPanPinchRef>(null);
  const [drawing, setDrawing] = useState(false);
  const [initialScale, setInitialScale] = useState<number>();
  const imageUrl = useObjectUrl(img);

  useEffect(() => {
    if (a4Ref.current) {
      setInitialScale(a4Ref.current.initialScale);
    }
  }, [a4Ref.current]);

  useKeyboardShortcut('i', () => setDrawing((isOn) => !isOn));

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'rgb(240, 242, 245)',
      }}
    >
      <div style={{ width: '100%', height: '100%' }}>
        <TransformWrapper
          ref={zoomPanRef}
          initialScale={0.8}
          centerOnInit
          disablePadding={drawing}
          // limitToBounds={false}
          minScale={0.8}
        >
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            <A4 ref={a4Ref}>
              <img
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                src={imageUrl}
                alt="Book page"
              />
              {initialScale && (
                <Strokes initialScale={initialScale} areas={imageObjects} />
              )}
            </A4>
          </TransformComponent>
          <Controls
            drawing={drawing}
            setDrawing={setDrawing}
            zoomIn={() => zoomPanRef.current?.zoomIn()}
            zoomOut={() => zoomPanRef.current?.zoomOut()}
          />
        </TransformWrapper>
        <Freehand
          a4Ref={a4Ref}
          zoomPanRef={zoomPanRef}
          drawing={drawing}
          areas={imageObjects}
          onStrokeEnd={async (stroke) => {
            const name = await showNameModal();
            await db.imageObjects.add({
              stroke,
              name,
              oid: await getNextOid(),
            });
            setDrawing(false);
          }}
        />
      </div>
    </div>
  );
};
