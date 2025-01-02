import { db } from '@abc/storage';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';

const { Dragger } = Upload;

export const Dropzone = () => {
  const customRequest: UploadProps['customRequest'] = ({ file }) => {
    db.pageImage.add({ image: file as File });
  };

  return (
    <Dragger
      name="image"
      listType="picture"
      showUploadList={false}
      customRequest={customRequest}
      style={{ width: '100%', height: '100%' }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Nahrajte obrázek klepnutím nebo přetažením souboru sem
      </p>
      {/* <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p> */}
    </Dragger>
  );
};
