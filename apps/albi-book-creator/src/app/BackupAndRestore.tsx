import { db } from '@abc/storage';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { App, Button, Space, Upload } from 'antd';
import { exportDB, importInto } from 'dexie-export-import';
import { saveAs } from 'file-saver';

export const BackupAndRestore = () => {
  const { modal } = App.useApp();

  return (
    <Space>
      <Button
        onClick={async () => {
          const blob = await exportDB(db);
          saveAs(blob, `abc-${new Date().toISOString()}.json`);
        }}
        icon={<DownloadOutlined />}
      >
        Backup database
      </Button>
      <Upload
        fileList={[]}
        accept=".json"
        customRequest={async ({ file }) => {
          modal.confirm({
            title: 'Restore DB',
            content: 'Are you sure you want to restore the database?',
            onOk: async () => {
              await importInto(db, file as File, {
                clearTablesBeforeImport: true,
              });
            },
          });
        }}
      >
        <Button icon={<UploadOutlined />}>Restore database</Button>
      </Upload>
      <Button
        danger
        onClick={() =>
          modal.confirm({
            title: 'Clear DB',
            content: 'Are you sure you want to clear the database?',
            onOk: () => db.imageObjects.clear(),
          })
        }
      >
        Clear
      </Button>
    </Space>
  );
};
