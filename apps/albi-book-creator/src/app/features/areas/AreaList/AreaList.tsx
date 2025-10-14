import { ImageObject } from '@abc/storage';
import { Flex, List } from 'antd';
import { useSelectedArea } from '../SelectedAreaContext';
import { SoundOutlined } from '@ant-design/icons';

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
          <Flex justify="space-between" style={{ width: '100%' }}>
            <span>{area.name}</span>
            {area.sound && <SoundOutlined />}
          </Flex>
        </List.Item>
      )}
      style={{ backgroundColor: 'white' }}
    />
  );
};
