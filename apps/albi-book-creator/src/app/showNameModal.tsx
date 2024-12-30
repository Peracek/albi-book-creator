import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Modal, Input, InputRef } from "antd";

export const showNameModal = (): Promise<string> => {
  return new Promise((resolve) => {
    const modalRef = { close: () => {} }; // Reference to close modal

    const handleOk = (value: string) => {
      modalRef.close();
      resolve(value);
    };

    const ModalContent = () => {
      const [name, setName] = useState<string>("");
      const inputRef = useRef<InputRef>(null);

      React.useEffect(() => {
        inputRef.current?.focus();
      }, []);

      const handleEnter = () => {
        handleOk(name);
      };

      return (
        <Modal
          open
          onOk={() => handleOk(name)}
          onCancel={() => modalRef.close()}
          okText="Submit"
        >
          <Input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onPressEnter={handleEnter}
            placeholder="Enter your name"
          />
        </Modal>
      );
    };

    const container = document.createElement("div");
    document.body.appendChild(container);

    const closeModal = () => {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    };

    modalRef.close = closeModal;
    ReactDOM.render(<ModalContent />, container);
  });
};

export default showNameModal;
