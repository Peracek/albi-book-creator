import { db, ImageObject } from '@abc/storage';
import { Button, Space, App, Modal } from 'antd';
import { useSelectedArea } from '../SelectedAreaContext';
import { EditOutlined, DeleteOutlined, SoundOutlined } from '@ant-design/icons';
import { AreaPreview } from './AreaPreview';
import { AreaDetail } from '../AreaDetail';
import { useState } from 'react';
import { usePageImage } from '../../../hooks';

type Props = {
  areas: ImageObject[];
};

export const AreaList = ({ areas }: Props) => {
  const pageImage = usePageImage();
  const { setSelectedArea } = useSelectedArea();
  const { modal } = App.useApp();
  const [editingAreaId, setEditingAreaId] = useState<number | null>(null);

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
    setEditingAreaId(area.id);
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
          {/* Preview */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '4px',
              overflow: 'hidden',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {pageImage && <AreaPreview pageImage={pageImage.image} stroke={area.stroke} size={64} />}
            {area.sound && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#1890ff',
                }}
              >
                <SoundOutlined />
              </div>
            )}
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
      <Modal
        title="Edit Area"
        open={editingAreaId !== null}
        onCancel={() => setEditingAreaId(null)}
        footer={null}
        width={600}
        destroyOnClose
      >
        {editingAreaId !== null && (
          <AreaDetail areaId={editingAreaId} onBack={() => setEditingAreaId(null)} />
        )}
      </Modal>
    </Space>
  );
};
