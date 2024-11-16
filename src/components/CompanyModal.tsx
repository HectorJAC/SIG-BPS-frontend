import { FC, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { CustomAsterisk } from "./CustomAsterisk";
import { CompanyProps } from "../interfaces/companyInteface";
import { sigbpsApi } from "../api/baseApi";

interface CompanyModalProps {
  showModal: boolean;
  setShowModal: (value?: boolean) => void;
  idEmpresa?: number;
}

export const CompanyModal:FC<CompanyModalProps> = ({
  showModal, 
  setShowModal, 
  idEmpresa
}) => {
  const [companyData, setCompanyData] = useState<CompanyProps>({} as CompanyProps);

  useEffect(() => {
    if (idEmpresa && showModal) {
      sigbpsApi.get('/empresas/getCompanyById', {
        params: {
          id_empresa: idEmpresa
        }
      })
        .then((response) => {
          setCompanyData(response.data);
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
        });
    }
  }, [idEmpresa, showModal]);

  const handleCreateCompany = () => {
    if (companyData.nombre_empresa === '') {
      toast.error('Todos los campos son obligatorios');
      return;
    } else {
      sigbpsApi.post('/empresas/createCompany', {
        nombre_empresa: companyData.nombre_empresa,
        estado: 'A'
      })
        .then((response) => {
          toast.success(`${response.data.message}`);
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
        });
    
      // Limpiar los campos del formulario
      setCompanyData({} as CompanyProps);
    
      // Cerrar el modal
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCompanyData({} as CompanyProps);
  };

  const handleUpdateNote = () => {
    sigbpsApi.put('/empresas/updateCompany', {
      id_empresa: companyData.id_empresa,
      nombre_empresa: companyData.nombre_empresa,
    })
      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });

    // Limpiar los campos del formulario
    setCompanyData({} as CompanyProps);

    // Cerrar el modal
    setShowModal(false);
  };

  return (
    <Modal show={showModal} onHide={setShowModal}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nueva Empresa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label><CustomAsterisk /> ID</Form.Label>
            <Form.Control 
              type="number" 
              value={companyData?.id_empresa}
              disabled
              className="mb-2"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><CustomAsterisk /> Nombre de la Empresa</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Ingrese el nombre de la empresa"
              value={companyData?.nombre_empresa}
              onChange={(e) => setCompanyData({...companyData, nombre_empresa: e.target.value})}
              className="mb-2"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><CustomAsterisk /> Estado</Form.Label>
            <Form.Control 
              type="text" 
              value={companyData?.estado}
              disabled
              className="mb-2"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cerrar
        </Button>
        <Button 
          variant="success" 
          type="submit" 
          onClick={
            !idEmpresa 
              ? handleCreateCompany 
              : handleUpdateNote
          }
        >
          {!idEmpresa ? 'Crear Empresa' : 'Actualizar Empresa'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};