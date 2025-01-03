import { ImageObject } from '@abc/storage';
import { Table, TableProps, Tag } from 'antd';
import { UploadSound } from './AudioRecorder';
import { AudioRecorder } from './AudioRecorder';

const columns: TableProps<ImageObject>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'OID',
    dataIndex: 'oid',
    key: 'oid',
    render: (oid: number) => <Tag>0x{oid.toString(16).padStart(4, '0')}</Tag>,
  },
  {
    title: 'Sound',
    dataIndex: 'sound',
    key: 'sound',
    render: (_, imageObject) => (
      <>
        <UploadSound imageObject={imageObject} />
        <AudioRecorder imageObject={imageObject} />
      </>
    ),
  },
];

type Props = {
  data: ImageObject[];
};

export const ImageObjectTable = ({ data }: Props) => {
  return (
    <Table<ImageObject>
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey="id"
      style={{ width: '300px' }}
    />
  );
};
