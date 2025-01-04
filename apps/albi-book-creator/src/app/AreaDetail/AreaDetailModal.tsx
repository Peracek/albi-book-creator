import { db } from '@abc/storage';
import { Modal } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { AudioRecorder, UploadSound } from '../AudioRecorder';

type Props = {
  areaId: number;
  onClose: () => void;
};

export const AreaDetailModal = ({ areaId, onClose }: Props) => {
  const area = useLiveQuery(() => db.imageObjects.get(areaId));
  if (!area) return null;

  return (
    <Modal
      title="Modal 1000px width"
      centered
      open
      onOk={onClose}
      onCancel={onClose}
    >
      <p>{area.name}</p>
      <p>{area.oid}</p>
      <AudioRecorder imageObject={area} />
      <UploadSound imageObject={area} />
    </Modal>
  );
};
