import { ImageObject } from '@abc/storage';
import { Table, TableProps, Tag } from 'antd';

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
];

type Props = {
  data: ImageObject[];
};

export const ImageObjectTable = ({ data }: Props) => {
  return <Table<ImageObject> columns={columns} dataSource={data} />;
};
