import { ImageObject } from '@abc/storage';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Flex, Divider } from 'antd';
import { useState } from 'react';
import { AreaList } from '../../features/areas/AreaList';
import { AreaDetail } from '../../features/areas/AreaDetail';
import { BackupAndRestore } from '../../features/export/BackupAndRestore';

type Props = {
  areas: ImageObject[];
  onExportClick: () => void;
};

export const Sidebar = ({ areas, onExportClick }: Props) => {
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);

  const handleAreaClick = (area: ImageObject) => {
    setSelectedAreaId(area.id);
  };

  const handleBack = () => {
    setSelectedAreaId(null);
  };

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
      {selectedAreaId ? (
        // Detail View
        <AreaDetail areaId={selectedAreaId} onBack={handleBack} />
      ) : (
        // List View
        <>
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
              <AreaList areas={areas} onClick={handleAreaClick} />
            </div>
          </Flex>
        </>
      )}
    </div>
  );
}; 