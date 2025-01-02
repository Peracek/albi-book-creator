import { db, ImageObject } from '@abc/storage';
import { SignatureOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, FloatButton, Upload } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRef, useState, useEffect } from 'react';
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';
import { Freehand } from './Freehand';
import showNameModal from './showNameModal';
import { Strokes } from './Strokes';
import { A4, A4Ref } from './A4';
import { Controls } from './Controls';

// stop tlacitko (interni kod)
const STOP_BUTTON_CODE = 0x0006;

type Props = {
  imageObjects: ImageObject[];
};

export const Drawboard = (props: Props) => {
  const a4Ref = useRef<A4Ref>(null);
  const zoomPanRef = useRef<ReactZoomPanPinchRef>(null);
  const [drawing, setDrawing] = useState(false);
  const [img] = useLiveQuery(() => db.pageImage.toArray()) ?? [];
  const customRequest: UploadProps['customRequest'] = ({ file }) => {
    db.pageImage.add({ image: file as File });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'I' || e.key === 'i') {
        setDrawing((isOn) => !isOn);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'rgb(240, 242, 245)',
      }}
    >
      {img ? (
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
                  src={URL.createObjectURL(img.image)}
                />
                <Strokes a4Ref={a4Ref} areas={props.imageObjects} />
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
            areas={props.imageObjects}
            onStrokeEnd={async (stroke) => {
              const name = await showNameModal();
              await db.imageObjects.add({
                stroke,
                name,
                oid: STOP_BUTTON_CODE,
              });
              setDrawing(false);
            }}
          />
        </div>
      ) : (
        <Upload
          name="image"
          listType="picture"
          showUploadList={false}
          customRequest={customRequest}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      )}
    </div>
  );
};
