import { ImageObject } from '@abc/storage';
import { List } from 'antd';

type Props = {
  areas: ImageObject[];
  onClick: (area: ImageObject) => void;
};
export const AreaList = ({ areas, onClick }: Props) => {
  return (
    <List
      size="small"
      header={<div>Areas</div>}
      bordered
      dataSource={areas}
      renderItem={(area) => (
        <List.Item onClick={() => onClick(area)}>{area.name}</List.Item>
      )}
      style={{ backgroundColor: 'white' }}
    />
  );
};
