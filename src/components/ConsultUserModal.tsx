import { FC, useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { sigbpsApi } from "../api/baseApi";
import { UserProps } from "../interfaces/userInterface";
import { formatterDate } from "../utils/formatters";

interface ConsultUserModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  idUsuario: number;
}

export const ConsultUserModal:FC<ConsultUserModalProps> = ({
  showModal, 
  setShowModal, 
  idUsuario
}) => {
  const [userData, setUserData] = useState<UserProps>({} as UserProps);

  useEffect(() => {
    showModal &&
      sigbpsApi.get(`/usuarios/getUser`, {
        params: {
          id_usuario: idUsuario
        }
      })
        .then((response) => {
          setUserData(response.data);
        })
  }, [idUsuario, showModal]);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Usuario: {userData.nombres} {userData.apellidos}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={6}>
            <strong>Nombre de Usuario:</strong>
            <p>{userData.username}</p>
          </Col>
          <Col md={6}>
            <strong>Cedula:</strong>
            <p>{userData.cedula}</p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <strong>Rol:</strong>
            <p>
              {
                userData.id_rol === 1
                  ? 'Administrador'
                  : 'Gerente'
              }
            </p>
          </Col>
          <Col md={6}>
            <strong>Nombre Empresa:</strong>
            <p>{userData.nombre_empresa}</p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <strong>Email:</strong>
            <p>{userData.email}</p>
          </Col>
          <Col md={6}>
            <strong>Numero Telefonico:</strong>
            <p>{userData.numero_telefono}</p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <strong>Estado:</strong>
            <p>{userData.estado}</p>
          </Col>
          <Col md={6}>
            <strong>Fecha Insercion:</strong>
            <p>{formatterDate(userData.fecha_insercion)}</p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <strong>Fecha Actualizacion:</strong>
            <p>
              {
                userData.fecha_actualizacion
                  ? formatterDate(userData.fecha_actualizacion)
                  : null
              }
            </p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};