import { db, ImageObject } from '@abc/storage';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, FormProps, Input, Modal, Upload } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { AudioRecorder } from '../AudioRecorder';

type Props = {
  areaId: number;
  onClose: () => void;
};

export const AreaDetailModal = ({ areaId, onClose }: Props) => {
  const area = useLiveQuery(() => db.imageObjects.get(areaId));
  const [recording, setRecording] = useState<File | null>(null);
  if (!area) return null;

  const onFinish: FormProps<ImageObject>['onFinish'] = (values) => {
    db.imageObjects.update(areaId, {
      name: values.name,
      oid: values.oid,
      sound: recording ?? values.sound,
    });
  };

  return (
    <Modal
      title={area.name ?? 'Area'}
      centered
      open
      onOk={onClose}
      onCancel={onClose}
    >
      <Form
        name="basic"
        layout="vertical"
        initialValues={area}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<ImageObject> label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item<ImageObject> label="OID" name="oid">
          <Input />
        </Form.Item>
        <Form.Item<ImageObject> label="Sound" name="sound">
          <Upload accept=".mp3" beforeUpload={() => false}>
            <AudioRecorder onRecorded={setRecording} />
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <div>
          recording
          {recording && (
            <audio controls src={URL.createObjectURL(recording)}></audio>
          )}
        </div>
        <div>
          original sound
          {area.sound && (
            <audio controls>
              <source
                src={URL.createObjectURL(area.sound)}
                type="audio/mp3"
              ></source>
            </audio>
          )}
        </div>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  );
};