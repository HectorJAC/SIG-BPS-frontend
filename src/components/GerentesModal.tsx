import { FC, useCallback, useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { GerenteProps } from "../interfaces/gerenteInterface";
import axios from "axios";
import { DepartmentsProps } from "../interfaces/departmentInterface";
import { formatterDate } from "../utils/formatters";
import { useCompanyStore } from "../store/companyStore";

interface GerentesModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  idGerente: string;
}

export const GerentesModal:FC<GerentesModalProps> = ({showModal, setShowModal, idGerente}) => {
  const [gerenteData, setGerenteData] = useState<GerenteProps>({} as GerenteProps);
  const [departments, setDepartments] = useState<DepartmentsProps>();

  const { company } = useCompanyStore();

  const getAllDepartments = useCallback(() => {
    if (company.id_empresa === undefined) {
      return;
    } else {
      axios.get(`${import.meta.env.VITE_API_URL}/departamentos/getDepartamentos`, {
        params: {
          id_empresa: company.id_empresa,
          estado: 'ACTIVO'
        }
      })
        .then((response) => {
          setDepartments(response.data);
        })
        .catch(() => {
        });
    }
  }, [company.id_empresa]);

  useEffect(getAllDepartments, [getAllDepartments]);

  useEffect(() => {
    showModal &&
      axios.get(`${import.meta.env.VITE_API_URL}/gerentes/getGerenteById`, {
        params: {
          id_gerente: idGerente
        }
      })
        .then((response) => {
          setGerenteData(response.data);
        })
  }, [idGerente, showModal]);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Gerente: {gerenteData.nombres} {gerenteData.apellidos}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={6}>
            <strong>Cedula:</strong>
            <p>{gerenteData.cedula}</p>
          </Col>
          <Col md={6}>
            <strong>Departamento</strong>
            <p>{
              departments?.departments.map((department) => {
                if (gerenteData.id_gerente === department.id_gerente) {
                  return (
                    <td key={department.id_gerente}>
                      {department.nombre_departamento}
                    </td>
                  );
                }
              })
            }</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <strong>Sexo:</strong>
            <p>{gerenteData.sexo}</p>
          </Col>
          <Col md={6}>
            <strong>Fecha de nacimiento:</strong>
            <p>{formatterDate(gerenteData.fecha_nacimiento)}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <strong>Lugar de Nacimiento:</strong>
            <p>{gerenteData.lugar_nacimiento}</p>
          </Col>
          <Col md={6}>
            <strong>Dirección de Residencia:</strong>
            <p>{gerenteData.direccion_residencia}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <strong>Estado Civil:</strong>
            <p>{gerenteData.estado_civil}</p>
          </Col>
          <Col md={6}>
            <strong>Correo:</strong>
            <p>{gerenteData.correo}</p>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <strong>Teléfono:</strong>
            <p>{gerenteData.numero_telefonico}</p>
          </Col>
          <Col md={6}>
            <strong>Fecha de Ingreso a la Empresa:</strong>
            <p>{formatterDate(gerenteData.fecha_ingreso_empresa)}</p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};