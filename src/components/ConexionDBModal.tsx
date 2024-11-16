import { FC, useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { ConexionDBCompanyProps } from "../interfaces/conexionDBInterface";
import { sigbpsApi } from "../api/baseApi";
interface ConexionDBModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  idConexionDB: string;
}

export const ConexionDBModal:FC<ConexionDBModalProps> = ({showModal, setShowModal, idConexionDB}) => {
  const [conexionDB, setConexionDB] = useState<ConexionDBCompanyProps>({} as ConexionDBCompanyProps);

  useEffect(() => {
    showModal && 
      sigbpsApi.get('conexion_db/getConexionDbById', {
        params: {
          id_conexion_db: idConexionDB
        }
      })
        .then((response) => {
          setConexionDB(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [idConexionDB, showModal]);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Empresa: {conexionDB.nombre_empresa}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={6}>
            <strong>Conexion Driver Library:</strong>
            <p>{conexionDB.conexion_driver_library}</p>
          </Col>
          <Col md={6}>
            <strong>Conexion Driver Class</strong>
            <p>{conexionDB.conexion_driver_class}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <strong>Conexion String:</strong>
            <p>{conexionDB.conexion_string}</p>
          </Col>
          <Col md={6}>
            <strong>Conexion User:</strong>
            <p>{conexionDB.conexion_user}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <strong>Conexion Password:</strong>
            <p>{conexionDB.conexion_password}</p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};