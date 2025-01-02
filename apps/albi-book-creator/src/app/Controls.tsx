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
    <FloatButton.Group shape="circle">
      <FloatButton icon={<ZoomInOutlined />} onClick={zoomIn} />
      <FloatButton icon={<ZoomOutOutlined />} onClick={zoomOut} />
      <FloatButton
        type={drawing ? 'primary' : 'default'}
        icon={<SignatureOutlined />}
        onClick={() => setDrawing(!drawing)}
      />
    </FloatButton.Group>
  );
};
