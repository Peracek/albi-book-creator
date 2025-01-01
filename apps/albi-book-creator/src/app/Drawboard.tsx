import { db } from '@abc/storage';
import { SignatureOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, FloatButton, Upload } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { PropsWithChildren, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

type Props = {
  children: (drawing: boolean) => React.ReactNode;
};

export const Drawboard = (props: Props) => {
  const [drawing, setDrawing] = useState(false);
  const [img] = useLiveQuery(() => db.pageImage.toArray()) ?? [];
  const customRequest: UploadProps['customRequest'] = ({ file }) => {
    db.pageImage.add({ image: file as File });
  };

  return (
    <div>
      {img ? (
        <div>
          <TransformWrapper
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
              contentStyle={{ width: '100%', height: '100%' }}
            >
              <img
                style={{ width: '100%' }}
                src={URL.createObjectURL(img.image)}
              />
              {props.children(drawing)}
            </TransformComponent>

            <FloatButton
              type={drawing ? 'primary' : 'default'}
              icon={<SignatureOutlined />}
              onClick={() => setDrawing((isOn) => !isOn)}
            />
          </TransformWrapper>
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
