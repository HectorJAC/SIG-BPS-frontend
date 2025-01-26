import { FC, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { CustomAsterisk } from "./CustomAsterisk";
import { sigbpsApi } from "../api/baseApi";
import { ElkUbicationNoPaginatedProps } from "../interfaces/elkUbicationInterface";
import { useUserStore } from "../store/userStore";
import { useUbicationElkStore } from "../store/ubicationElk";
import { formatterDateToBackend } from "../utils/formatters";

interface ElkUbicationModalProps {
  showModal: boolean;
  setShowModal: (value?: boolean) => void;
  idElkUbicacion?: number;
}

export const ElkUbicationModal:FC<ElkUbicationModalProps> = ({
  showModal, 
  setShowModal, 
  idElkUbicacion
}) => {
  const [elkData, setElkData] = useState<ElkUbicationNoPaginatedProps>({} as ElkUbicationNoPaginatedProps);
  const { user } = useUserStore();
  const { onEditUbicationElkSuccess, resetEditUbicationElkSuccess } = useUbicationElkStore();

  useEffect(() => {
    if (idElkUbicacion && showModal) {
      sigbpsApi.get('/ubicacion_elk/getElkById', {
        params: {
          id_elk_ubicacion: idElkUbicacion
        }
      })
        .then((response) => {
          setElkData(response.data);
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
        });
    }
  }, [idElkUbicacion, showModal]);

  const handleCloseModal = () => {
    setShowModal(false);
    setElkData({} as ElkUbicationNoPaginatedProps);
    resetEditUbicationElkSuccess();
  };

  const handleUpdateElkUbication = () => {
    if (elkData.ubicacion_elk === '' || elkData.ubicacion_elk === null) {
      toast.error('Debe completar los campos obligatorios');
      return;
    } else {
      sigbpsApi.put('/ubicacion_elk/updateElk', {
        id_elk_ubicacion: elkData.id_elk_ubicacion,
        ubicacion_elk: elkData.ubicacion_elk,
        usuario_actualizacion: user?.id_usuario,
        fecha_actualizacion: formatterDateToBackend(new Date().toString())
      })
        .then((response) => {
          toast.success(response.data.message);
          onEditUbicationElkSuccess();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
  
      // Limpiar los campos del formulario
      setElkData({} as ElkUbicationNoPaginatedProps);
  
      // Cerrar el modal
      setShowModal(false);
      resetEditUbicationElkSuccess();
    }
  };

  return (
    <Modal show={showModal} onHide={setShowModal}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Ubicacion de {elkData?.nombre_elk}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label><CustomAsterisk /> ID</Form.Label>
            <Form.Control 
              type="number" 
              value={elkData?.id_elk_ubicacion}
              disabled
              className="mb-2"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><CustomAsterisk /> Ubicacion de la Herramienta ELK</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Ingrese la ubicación en el equipo de la herramienta ELK"
              value={elkData?.ubicacion_elk}
              onChange={(e) => setElkData({...elkData, ubicacion_elk: e.target.value})}
              className="mb-2"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><CustomAsterisk /> Estado</Form.Label>
            <Form.Control 
              type="text" 
              value={elkData?.estado === 'A' ? 'ACTIVO' : 'INACTIVO'}
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
          onClick={handleUpdateElkUbication}
        >
          Actualizar Ubicación
        </Button>
      </Modal.Footer>
    </Modal>
  );
};