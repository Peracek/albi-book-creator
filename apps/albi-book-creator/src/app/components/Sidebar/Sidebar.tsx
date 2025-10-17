import { ImageObject } from '@abc/storage';
import {
  DownloadOutlined,
  DeleteOutlined,
  UploadOutlined,
  SaveOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Space, App } from 'antd';
import { AreaList } from '../../features/areas/AreaList';
import { db } from '@abc/storage';
import { exportDB, importInto } from 'dexie-export-import';
import { saveAs } from 'file-saver';

type Props = {
  areas: ImageObject[];
  pageImage: Blob;
  onExportClick: () => void;
  onAddArea: () => void;
  drawing: boolean;
};

export const Sidebar = ({ areas, pageImage, onExportClick, onAddArea, drawing }: Props) => {
  const { modal } = App.useApp();

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
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <h3 style={{ margin: 0, marginBottom: '16px' }}>Areas ({areas.length})</h3>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* Add New Area Card */}
          <div
            onClick={onAddArea}
            style={{
              display: 'flex',
              gap: '12px',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: drawing ? '2px dashed #1890ff' : '2px dashed #d9d9d9',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1890ff';
              e.currentTarget.style.backgroundColor = '#f0f7ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = drawing ? '#1890ff' : '#d9d9d9';
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            {/* Plus Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                color: '#1890ff',
                flexShrink: 0,
              }}
            >
              <PlusOutlined />
            </div>

            {/* Text */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: 500,
                color: '#1890ff',
              }}
            >
              Add new area
            </div>
          </div>

          {/* Existing Areas */}
          <AreaList areas={areas} pageImage={pageImage} />
        </Space>
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
    </div>
  );
}; 