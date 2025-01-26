import { FC, useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { sigbpsApi } from "../api/baseApi";
import { RequestProps } from "../interfaces/requestInterface";
import { showRequestState } from "../utils/showRequestState";

interface ConsultRequestModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  idUsuarioPedido: number;
}

export const ConsultRequestModal:FC<ConsultRequestModalProps> = ({
  showModal, 
  setShowModal, 
  idUsuarioPedido
}) => {
  const [requests, setRequests] = useState<RequestProps>({} as RequestProps);

  useEffect(() => {
    showModal &&
      sigbpsApi.get('/pedidos/getRequestById', {
        params: {
          id_usuario_pedido: idUsuarioPedido
        }
      })
        .then((response) => {
          setRequests(response.data);
        })
  }, [idUsuarioPedido, showModal]);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>ID: {requests.id_usuario_pedido}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={6}>
            <strong>Gerente Solicitante:</strong>
            <p>{requests.nombres_usuario} {requests.apellidos_usuario}</p>
          </Col>
          <Col md={6}>
            <strong>Empresa del gerente:</strong>
            <p>{requests.nombre_empresa}</p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <strong>Descripcion:</strong>
            <p>{requests.descripcion_pedido}</p>
          </Col>
          <Col md={6}>
            <strong>Estado de la Solicitud:</strong>
            <p>{showRequestState(requests.estado_pedido)}</p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <strong>Fecha de la Solicitud:</strong>
            <p>{requests.fecha_pedido}</p>
          </Col>
          <Col md={6}>
            <strong>Fecha Actualizacion:</strong>
            <p>{requests.fecha_actualizacion}</p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <strong>Administrador Asignado:</strong>
            <p>{requests.usuario_asignado}</p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};