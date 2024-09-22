import { FC, useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { formatterDate } from "../utils/formatters";
import { EmployeeProps } from "../interfaces/employeeInterface";

interface EmployeeModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  idEmpleado: string;
}

export const EmployeesModal:FC<EmployeeModalProps> = ({showModal, setShowModal, idEmpleado}) => {
  const [employeeData, setEmployeeData] = useState<EmployeeProps>({} as EmployeeProps);

  useEffect(() => {
    showModal &&
      axios.get(`${import.meta.env.VITE_API_URL}/empleados/getEmployeeById`, {
        params: {
          id_empleado: idEmpleado
        }
      })
        .then((response) => {
          setEmployeeData(response.data);
        })
  }, [idEmpleado, showModal]);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Empleado: {employeeData.nombres} {employeeData.apellidos}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={4}>
            <strong>Cedula:</strong>
            <p>{employeeData.cedula}</p>
          </Col>
          <Col md={4}>
            <strong>Departamento:</strong>
            <p>{employeeData.nombre_departamento}</p>
          </Col>
          <Col md={4}>
            <strong>Fecha de Ingreso a la Empresa:</strong>
            <p>{formatterDate(employeeData.fecha_ingreso_empresa)}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <strong>Sexo:</strong>
            <p>{employeeData.sexo}</p>
          </Col>
          <Col md={4}>
            <strong>Fecha de nacimiento:</strong>
            <p>{formatterDate(employeeData.fecha_nacimiento)}</p>
          </Col>
          <Col md={4}>
            <strong>Correo:</strong>
            <p>{employeeData.correo}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <strong>Numero Telefonico:</strong>
            <p>{employeeData.numero_telefonico}</p>
          </Col>
          <Col md={4}>
            <strong>Lugar de Nacimiento:</strong>
            <p>{employeeData.lugar_nacimiento}</p>
          </Col>
          <Col md={4}>
            <strong>Dirección de Residencia:</strong>
            <p>{employeeData.direccion_residencia}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <strong>Estado Civil:</strong>
            <p>{employeeData.estado_civil}</p>
          </Col>
          <Col md={4}>
            <strong>Nivel Academico:</strong>
            <p>{employeeData.nivel_academico}</p>
          </Col>
          <Col md={4}>
            <strong>Puesto:</strong>
            <p>{employeeData.nombre_puesto}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <strong>Salario:</strong>
            <p>{employeeData.salario}</p>
          </Col>
          <Col md={4}>
            <strong>Usuario Creacion:</strong>
            <p>{employeeData.usuario_creacion}</p>
          </Col>
          <Col md={4}>
            <strong>Usuario Actualizacion:</strong>
            <p>{employeeData.usuario_actualizacion}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <strong>Estado:</strong>
            <p>{employeeData.estado}</p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};