import { ImageObject } from '@abc/storage';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import { downloadBnl } from './downloadBnl';
import { downloadOids } from './downloadOids';
import { BackupAndRestore } from './BackupAndRestore';

type Props = {
  onClose: () => void;
  areas: ImageObject[];
};

export const ControlPanelModal = ({ onClose, areas }: Props) => {
  return (
    <Modal
      title={'Control panel'}
      centered
      open
      onOk={onClose}
      onCancel={onClose}
    >
      <Space direction="vertical">
        <Space>
          <Button
            onClick={() => downloadOids(areas)}
            icon={<DownloadOutlined />}
          >
            OIDs PNG
          </Button>
          <Button
            onClick={() => downloadBnl(areas)}
            icon={<DownloadOutlined />}
          >
            BNL
          </Button>
        </Space>
        <BackupAndRestore />
      </Space>
    </Modal>
  );
};
