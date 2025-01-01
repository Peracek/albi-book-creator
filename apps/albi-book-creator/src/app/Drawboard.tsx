import { db, ImageObject } from '@abc/storage';
import { SignatureOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, FloatButton, Upload } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRef, useState } from 'react';
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';
import { Freehand } from './Freehand';
import showNameModal from './showNameModal';
import { Strokes } from './Strokes';
import { A4 } from './A4';

// stop tlacitko (interni kod)
const STOP_BUTTON_CODE = 0x0006;

type Props = {
  imageObjects: ImageObject[];
};

export const Drawboard = (props: Props) => {
  const zoomPanRef = useRef<ReactZoomPanPinchRef>(null);
  const [drawing, setDrawing] = useState(false);
  const [img] = useLiveQuery(() => db.pageImage.toArray()) ?? [];
  const customRequest: UploadProps['customRequest'] = ({ file }) => {
    db.pageImage.add({ image: file as File });
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background:
          'repeating-linear-gradient(45deg, lightgrey, lightgrey 10px, white 10px, white 20px)',
      }}
    >
      {img ? (
        <div style={{ width: '100%', height: '100%' }}>
          <TransformWrapper
            ref={zoomPanRef}
            initialScale={1}
            centerOnInit
            disablePadding={drawing}
          >
            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              <A4>
                <img
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  src={URL.createObjectURL(img.image)}
                />
                <Strokes areas={props.imageObjects} />
              </A4>
            </TransformComponent>

            <FloatButton
              type={drawing ? 'primary' : 'default'}
              icon={<SignatureOutlined />}
              onClick={() => setDrawing((isOn) => !isOn)}
            />
          </TransformWrapper>
          <Freehand
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
