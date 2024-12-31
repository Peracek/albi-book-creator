import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Upload } from 'antd';
import { db, ImageObject } from '@abc/storage';
import { saveAs } from 'file-saver';

type Props = {
  imageObject: ImageObject;
};
export const UploadSound = ({ imageObject }: Props) => {
  //   const onChange: UploadProps['onChange'] = ({ file, fileList }) => {
  //     if (file.status !== 'uploading') {
  //       console.log(file, fileList);
  //       if (file.status === 'done') {
  //         const reader = new FileReader();
  //         reader.onload = function (event) {
  //           const blob = new Blob([event.target!.result as ArrayBuffer], {
  //             type: file.type,
  //           });
  //           db.imageObjects.update(imageObject.id, { sound: blob });
  //         };
  //         reader.readAsArrayBuffer(file.originFileObj as Blob);
  //       }
  //     }
  //   };

  const customRequest: UploadProps['customRequest'] = ({ file }) => {
    db.imageObjects.update(imageObject.id, { sound: file as Blob });
  };

  return (
    <Upload
      maxCount={1}
      accept=".mp3"
      fileList={
        imageObject.sound
          ? [
              {
                uid: '1',
                name: imageObject.sound.name,
                url: 'dummy just to display it as a link',
              },
            ]
          : []
      }
      onPreview={(file) => {
        if (imageObject.sound) {
          saveAs(imageObject.sound, imageObject.sound.name);
        }
      }}
      customRequest={customRequest}
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
};
