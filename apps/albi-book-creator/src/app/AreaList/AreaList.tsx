import { ImageObject } from '@abc/storage';
import { List } from 'antd';
import { useSelectedArea } from '../SelectedAreaContext';
import { on } from 'events';

type Props = {
  areas: ImageObject[];
  onClick: (area: ImageObject) => void;
};
export const AreaList = ({ areas, onClick }: Props) => {
  const { setSelectedArea } = useSelectedArea();
  return (
    <List
      size="small"
      bordered
      dataSource={areas}
      renderItem={(area) => (
        <List.Item
          onClick={() => onClick(area)}
          onMouseOver={() => setSelectedArea(area.id)}
          onMouseOut={() => setSelectedArea(null)}
        >
          {area.name}
        </List.Item>
      )}
      style={{ backgroundColor: 'white' }}
    />
  );
};
