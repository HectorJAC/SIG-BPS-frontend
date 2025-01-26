import { FC, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { CustomAsterisk } from "./CustomAsterisk";
import { sigbpsApi } from "../api/baseApi";
import { OneDashboardUserDataProps } from "../interfaces/dashboardUserDataInterface";
import { useUserStore } from "../store/userStore";
import { formatterDateToBackend } from "../utils/formatters";

interface CreateDashboardModalProps {
  showModal: boolean;
  setShowModal: (value?: boolean) => void;
  idDashboardKibana?: number;
}

interface EmpresaProps {
  id_empresa: number;
  nombre_empresa: string;
}

export const CreateDashboardModal:FC<CreateDashboardModalProps> = ({
  showModal, 
  setShowModal, 
  idDashboardKibana
}) => {
  const [dashboardData, setDashboardData] = useState<OneDashboardUserDataProps>({} as OneDashboardUserDataProps);
  const [empresas, setEmpresas] = useState<EmpresaProps[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number | null>(null);
  const { user } = useUserStore();

  useEffect(() => {
    if (showModal) {
      sigbpsApi.get('/empresas/findAllCompanyWithoutPagination')
      .then((response) => {
        setEmpresas(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    }
  }, [showModal]);

  useEffect(() => {
    if (idDashboardKibana && showModal) {
      sigbpsApi.get('/dashboard_kibana/getDashboard', {
        params: {
          id_dashboard_kibana: idDashboardKibana
        }
      })
        .then((response) => {
          setDashboardData(response.data);
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
        });
    }
  }, [idDashboardKibana, showModal]);

  const handleCreateDashboard = () => {
    if (
        dashboardData.nombre_dashboard === '' ||
        dashboardData.dashboard_source === '' ||
        empresaSeleccionada === null
    ) {
      toast.error('Todos los campos son obligatorios');
      return;
    } else {
      sigbpsApi.post('/dashboard_kibana/createDashboard', {
        nombre_dashboard: dashboardData.nombre_dashboard,
        dashboard_source: dashboardData.dashboard_source,
        id_empresa: empresaSeleccionada === null ? dashboardData?.id_empresa : empresaSeleccionada,
        usuario_insercion: user.id_usuario,
        fecha_insercion: formatterDateToBackend(new Date().toString()),
        estado: 'A'
      })
        .then((response) => {
          toast.success(`${response.data.message}`);
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
        });
    
      // Limpiar los campos del formulario
      setDashboardData({} as OneDashboardUserDataProps);
    
      // Cerrar el modal
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDashboardData({} as OneDashboardUserDataProps);
  };


  const handleUpdateDashboard = () => {
    sigbpsApi.put('/dashboard_kibana/updateDashboard', {
      id_dashboard_kibana: dashboardData.id_dashboard_kibana,
      nombre_dashboard: dashboardData.nombre_dashboard,
      dashboard_source: dashboardData.dashboard_source,
      id_empresa: empresaSeleccionada === null ? dashboardData?.id_empresa : empresaSeleccionada,
      usuario_actualizacion: user.id_usuario,
      fecha_actualizacion: formatterDateToBackend(new Date().toString()),
      estado: 'A'
    })
      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });

    // Limpiar los campos del formulario
    setDashboardData({} as OneDashboardUserDataProps);

    // Cerrar el modal
    setShowModal(false);
  };

  const handleSelectEmpresa = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    setEmpresaSeleccionada(selectedId || null);
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nuevo Dashboard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label><CustomAsterisk /> ID</Form.Label>
            <Form.Control 
              type="number" 
              value={dashboardData?.id_dashboard_kibana}
              disabled
              className="mb-2"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><CustomAsterisk /> Nombre del Dashboard</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Ingrese el nombre del dashboard"
              value={dashboardData?.nombre_dashboard}
              onChange={(e) => setDashboardData({...dashboardData, nombre_dashboard: e.target.value})}
              className="mb-2"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><CustomAsterisk /> Source Dashboard</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Ingrese el source del dashboard"
              value={dashboardData?.dashboard_source}
              onChange={(e) => setDashboardData({...dashboardData, dashboard_source: e.target.value})}
              className="mb-2"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><CustomAsterisk /> Empresa</Form.Label>
            <Form.Select
              onChange={handleSelectEmpresa}
              value={empresaSeleccionada || dashboardData?.id_empresa} 
            >
              <option value="">--Seleccione la empresa--</option>
              {
                empresas?.map((empresa) => (
                  <option 
                    key={empresa.id_empresa} 
                    value={empresa.id_empresa}
                  >
                    {empresa.nombre_empresa}
                  </option>
                ))
              }
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label><CustomAsterisk /> Estado</Form.Label>
            <Form.Control 
              type="text" 
              value={dashboardData?.estado}
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
            !idDashboardKibana 
              ? handleCreateDashboard 
              : handleUpdateDashboard
          }
        >
          {!idDashboardKibana ? 'Guardar Dashboard' : 'Actualizar Dashboard'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};