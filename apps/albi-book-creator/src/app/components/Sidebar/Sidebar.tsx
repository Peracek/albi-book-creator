import { ImageObject } from '@abc/storage';
import {
  DownloadOutlined,
  DeleteOutlined,
  UploadOutlined,
  SaveOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Space, App, Flex, Empty } from 'antd';
import { useState } from 'react';
import { AreaList } from '../../features/areas/AreaList';
import { AreaDetail } from '../../features/areas/AreaDetail';
import { db } from '@abc/storage';
import { exportDB, importInto } from 'dexie-export-import';
import { saveAs } from 'file-saver';

type Props = {
  areas: ImageObject[];
  onExportClick: () => void;
  onAddArea: () => void;
  drawing: boolean;
};

export const Sidebar = ({ areas, onExportClick, onAddArea, drawing }: Props) => {
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const { modal } = App.useApp();

  const handleAreaClick = (area: ImageObject) => {
    setSelectedAreaId(area.id);
  };

  const handleBack = () => {
    setSelectedAreaId(null);
  };

  const handleBackup = async () => {
    const blob = await exportDB(db);
    saveAs(blob, `abc-${new Date().toISOString()}.json`);
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        modal.confirm({
          title: 'Restore DB',
          content: 'Are you sure you want to restore the database?',
          onOk: async () => {
            await importInto(db, file, {
              clearTablesBeforeImport: true,
            });
          },
        });
      }
    };
    input.click();
  };

  const handleClear = () => {
    modal.confirm({
      title: 'Clear DB',
      content: 'Are you sure you want to clear the database?',
      onOk: () => {
        db.imageObjects.clear();
        db.pageImage.clear();
      },
    });
  };

  return (
    <div
      style={{
        width: '300px',
        height: '100%',
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #d9d9d9',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {selectedAreaId ? (
        // Detail View
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <AreaDetail areaId={selectedAreaId} onBack={handleBack} />
        </div>
      ) : (
        // List View
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Areas ({areas.length})</h3>
              <Button
                type={drawing ? 'default' : 'primary'}
                shape="circle"
                icon={<PlusOutlined />}
                onClick={onAddArea}
                size="small"
                title="Draw new area"
              />
            </Flex>
            {areas.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: '#999' }}>
                    No areas yet<br />
                    Click <PlusOutlined /> to draw one
                  </span>
                }
              />
            ) : (
              <AreaList areas={areas} onClick={handleAreaClick} />
            )}
          </div>

          {/* Bottom Toolbar */}
          <div
            style={{
              borderTop: '1px solid #d9d9d9',
              padding: '12px 16px',
              backgroundColor: '#fff',
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={onExportClick}
                block
                style={{ textAlign: 'left' }}
              >
                Export
              </Button>
              <Button
                type="text"
                icon={<SaveOutlined />}
                onClick={handleBackup}
                block
                style={{ textAlign: 'left' }}
              >
                Backup
              </Button>
              <Button
                type="text"
                icon={<UploadOutlined />}
                onClick={handleRestore}
                block
                style={{ textAlign: 'left' }}
              >
                Restore
              </Button>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={handleClear}
                danger
                block
                style={{ textAlign: 'left' }}
              >
                Clear All
              </Button>
            </Space>
          </div>
        </>
      )}
    </div>
  );
}; 