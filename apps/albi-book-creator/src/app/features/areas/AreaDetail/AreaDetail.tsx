import { db, ImageObject } from '@abc/storage';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Form, FormProps, Input, Upload, Space } from 'antd';
import { useEffect, useState } from 'react';
import { AudioRecorder } from '../../../components/AudioRecorder';
import { useArea, useObjectUrl } from '../../../hooks';

type Props = {
  areaId: number;
  onBack: () => void;
};

export const AreaDetail = ({ areaId, onBack }: Props) => {
  const area = useArea(areaId);
  const [recording, setRecording] = useState<File | undefined>();
  const recordingUrl = useObjectUrl(recording);

  useEffect(() => {
    if (area) {
      setRecording(area.sound);
    }
  }, [area]);

  if (!area) return null;

  const onFinish: FormProps<ImageObject>['onFinish'] = (values) => {
    db.imageObjects.update(areaId, {
      name: values.name,
      oid: values.oid,
      sound: recording,
    });
    onBack();
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        type="text"
        style={{ marginBottom: '16px' }}
      >
        Back to Areas
      </Button>

      <h3 style={{ margin: '0 0 16px 0' }}>{area.name ?? 'Area'}</h3>

      <Form
        name="areaDetail"
        layout="vertical"
        initialValues={area}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<ImageObject> label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item<ImageObject> label="OID" name="oid">
          <Input type="number" />
        </Form.Item>
        <Form.Item<ImageObject> label="Sound" name="sound">
          <Space direction="vertical" style={{ width: '100%' }}>
            <AudioRecorder onRecorded={setRecording} />
            <Upload accept=".mp3" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />} block>
                Upload MP3
              </Button>
            </Upload>
          </Space>
        </Form.Item>
        {recording && recordingUrl && (
          <audio controls src={recordingUrl} style={{ width: '100%', marginBottom: '16px' }}></audio>
        )}
        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onBack}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
