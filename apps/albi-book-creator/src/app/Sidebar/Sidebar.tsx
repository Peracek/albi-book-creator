import { ImageObject } from '@abc/storage';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Flex, Divider } from 'antd';
import { AreaList } from '../AreaList';
import { BackupAndRestore } from '../BackupAndRestore';

type Props = {
  areas: ImageObject[];
  onExportClick: () => void;
  onAreaClick: (area: ImageObject) => void;
};

export const Sidebar = ({ areas, onExportClick, onAreaClick }: Props) => {
  return (
    <div
      style={{
        width: '300px',
        height: '100%',
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #d9d9d9',
        padding: '16px',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0' }}>Tools & Controls</h3>
      <Flex vertical gap="middle">
        {/* Export Section */}
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Export</h4>
          <Button
            onClick={onExportClick}
            icon={<DownloadOutlined />}
            block
            type="primary"
          >
            Export
          </Button>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* Backup & Restore Section */}
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Data Management</h4>
          <BackupAndRestore />
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* Areas Section */}
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Areas</h4>
          <AreaList areas={areas} onClick={onAreaClick} />
        </div>
      </Flex>
    </div>
  );
}; 