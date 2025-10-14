import { ImageObject } from '@abc/storage';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import { downloadBnl } from '../../utils/downloadBnl';
import { downloadOids } from '../../utils/downloadOids';

type Props = {
  onClose: () => void;
  areas: ImageObject[];
};

export const ExportModal = ({ onClose, areas }: Props) => {
  return (
    <Modal
      title="Export Data"
      centered
      open
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <p>Choose what you want to export:</p>
        <Space style={{ width: '100%', justifyContent: 'center' }}>
          <Button
            onClick={() => downloadOids(areas)}
            icon={<DownloadOutlined />}
            size="large"
          >
            OIDs PNG
          </Button>
          <Button
            onClick={() => downloadBnl(areas)}
            icon={<DownloadOutlined />}
            size="large"
          >
            BNL
          </Button>
        </Space>
      </Space>
    </Modal>
  );
}; 