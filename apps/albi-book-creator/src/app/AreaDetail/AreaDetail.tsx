import { ImageObject } from '@abc/storage';
import { Modal } from 'antd';

type Props = {
  area: ImageObject;
  onClose: () => void;
};

export const AreaDetail = ({ area, onClose }: Props) => {
  return (
    <Modal
      title="Modal 1000px width"
      centered
      open
      onOk={onClose}
      onCancel={onClose}
      width={1000}
    >
      <p>{area.name}</p>
      <p>{area.oid}</p>
      <p>sound modes...</p>
    </Modal>
  );
};
