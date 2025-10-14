import { Alert } from 'antd';
import { EditOutlined } from '@ant-design/icons';

type Props = {
  onCancel: () => void;
};

export const DrawingModeAlert = ({ onCancel }: Props) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <Alert
        message={
          <span>
            <EditOutlined style={{ marginRight: '8px' }} />
            Drawing Mode - Click and drag to draw an area
          </span>
        }
        type="info"
        showIcon={false}
        closable
        onClose={onCancel}
        style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}
      />
    </div>
  );
};
