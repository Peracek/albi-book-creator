import { db } from '@abc/storage';
import { UploadOutlined } from '@ant-design/icons';
import { App, Button, Upload } from 'antd';
import { importInto } from 'dexie-export-import';

export const RestoreDb = () => {
  const { modal } = App.useApp();

  return (
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
  );
};
