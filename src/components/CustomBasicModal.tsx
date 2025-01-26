import { FC } from "react";
import { Button, Modal } from "react-bootstrap"

interface CustomBasicModalProps {
  showModal: boolean;
  setShowModal: () => void;
  title: string;
  body: string;
  secondaryButton: string;
  primaryButton: string;
  onClick: () => void;
}

export const CustomBasicModal:FC<CustomBasicModalProps> = ({
  title,
  body,
  showModal,
  setShowModal,
  secondaryButton,
  primaryButton,
  onClick
}) => {
  return (
    <Modal show={showModal} onHide={setShowModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={setShowModal}>
          {secondaryButton}
        </Button>
        <Button variant="success" type="submit" onClick={onClick}>
          {primaryButton}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
