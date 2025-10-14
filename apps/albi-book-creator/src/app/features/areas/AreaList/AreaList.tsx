import { db, ImageObject } from '@abc/storage';
import { Button, Space, App } from 'antd';
import { useSelectedArea } from '../SelectedAreaContext';
import { EditOutlined, DeleteOutlined, SoundOutlined } from '@ant-design/icons';

type Props = {
  areas: ImageObject[];
  onClick: (area: ImageObject) => void;
};

export const AreaList = ({ areas, onClick }: Props) => {
  const { setSelectedArea } = useSelectedArea();
  const { modal } = App.useApp();

  const handleDelete = (area: ImageObject, e: React.MouseEvent) => {
    e.stopPropagation();
    modal.confirm({
      title: 'Delete Area',
      content: `Are you sure you want to delete "${area.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        await db.imageObjects.delete(area.id);
      },
    });
  };

  const handleEdit = (area: ImageObject, e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(area);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      {areas.map((area) => (
        <div
          key={area.id}
          onMouseOver={() => setSelectedArea(area.id)}
          onMouseOut={() => setSelectedArea(null)}
          style={{
            display: 'flex',
            gap: '12px',
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #d9d9d9',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#1890ff';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#d9d9d9';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Preview Placeholder */}
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#999',
              flexShrink: 0,
            }}
          >
            {area.sound && <SoundOutlined />}
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>{area.name}</div>
            <Space size="small">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => handleEdit(area, e)}
              >
                Edit
              </Button>
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => handleDelete(area, e)}
              >
                Clear
              </Button>
            </Space>
          </div>
        </div>
      ))}
    </Space>
  );
};
