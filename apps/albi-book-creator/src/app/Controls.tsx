import {
  SignatureOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { FloatButton } from 'antd';

type Props = {
  drawing: boolean;
  setDrawing: (isOn: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

export const Controls = ({ drawing, setDrawing, zoomIn, zoomOut }: Props) => {
  return (
    <>
      <FloatButton.Group style={{ insetInlineEnd: 24 }}>
        <FloatButton icon={<ZoomInOutlined />} onClick={zoomIn} />
        <FloatButton icon={<ZoomOutOutlined />} onClick={zoomOut} />
      </FloatButton.Group>
      <FloatButton.Group style={{ insetInlineEnd: 92 }}>
        <FloatButton
          type={drawing ? 'primary' : 'default'}
          icon={<SignatureOutlined />}
          onClick={() => setDrawing(!drawing)}
        />
      </FloatButton.Group>
    </>
  );
};
