import { FC, useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Spinner, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { sigbpsApi } from "../api/baseApi";
import { DashboardKibanaProps } from "../interfaces/dashboardUserDataInterface";
import { getAllDashboards } from "../api/dashboards/getAllDashboards";
import { formatterDate, formatterDateToBackend } from "../utils/formatters";
import { AddIcon } from "../utils/iconButtons";
import { CustomButton } from "./CustomButton";
import { useUserDashboardStore } from "../store/userDashboardStore";
import { useUserStore } from "../store/userStore";

interface AddUserDashboardModalProps {
  showModal: boolean;
  setShowModal: (value?: boolean) => void;
}

export const AddUserDashboardModal:FC<AddUserDashboardModalProps> = ({
  showModal, 
  setShowModal,
}) => {
  const [dashboards, setDashboards] = useState<DashboardKibanaProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchDashboard, setSearchDashboard] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { user } = useUserStore();
  const { id_user_dashboard } = useUserDashboardStore();

  const allDashboards = useCallback((pageNumber = 1) => {
    setIsLoading(true);
    getAllDashboards(
      pageNumber,
      5
    )
      .then((response) => {
        setDashboards(response);
        setCurrentPage(pageNumber);
        setTotalPages(response.totalPages);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    allDashboards();
  }, [allDashboards]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      allDashboards(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      allDashboards(currentPage + 1);
    }
  };

  const handleSearchDashboard = () => {
    setIsLoading(true);
    if (searchDashboard === '') {
      allDashboards();
      setIsLoading(false);  
    } else {
      sigbpsApi.get('/dashboard_kibana/searchDashboard', {
        params: {
          search: searchDashboard,
          estado: 'A'
        }
      })
        .then((response) => {
          setDashboards(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
          setIsLoading(false);
      })
    };
  };

  const handleAddUserDashboard = (id_dashboard_kibana: number, id_user_dashboard: number) => {
    sigbpsApi.post('/dashboard_kibana/addUserDashboard', {
      id_usuario: id_user_dashboard,
      id_dashboard_kibana, 
      usuario_insercion: user.id_usuario,
      fecha_insercion: formatterDateToBackend(new Date().toString())
    })
      .then((response) => {
        toast.success(response.data.message);
        setShowModal(false);
      })
      .catch((error) => {
        toast.error(`${error.response.data.message}`);
        setShowModal(false);
      });
  };

  return (
    <Modal show={showModal} onHide={setShowModal} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Dashboard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          isLoading 
            ? (
              <Container>
                <Spinner />
              </Container>
            )
            : (
              <Container>
                <Row>
                  <Col>
                    <div className="input-group">
                      <Form.Control 
                        type="text" 
                        placeholder="Buscar Dashboard" 
                        value={searchDashboard}
                        onChange={(e) => setSearchDashboard(e.target.value)}
                      />
                      <Button 
                        variant="success" 
                        onClick={handleSearchDashboard}
                      >
                        Buscar
                      </Button>
                    </div>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre Dashboard</th>
                          <th>Empresa</th>
                          <th>Usuario Inserción</th>
                          <th>Fecha Inserción</th>
                          <th>Usuario Actualización</th>
                          <th>Fecha Actualización</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          dashboards?.dashboards?.map((dash) => (
                            <tr key={dash?.id_dashboard_kibana}>
                              <td>{dash?.id_dashboard_kibana}</td>
                              <td>{dash?.nombre_dashboard}</td>
                              <td>{dash?.nombre_empresa}</td>
                              <td>{dash?.usuario_insercion}</td>
                              <td>
                                {
                                  dash?.fecha_insercion
                                    ? formatterDate(dash?.fecha_insercion)
                                    : null
                                }
                              </td>
                              <td>{dash?.usuario_actualizacion}</td>
                              <td>
                                {
                                  dash?.fecha_actualizacion
                                    ? formatterDate(dash?.fecha_actualizacion)
                                    : null
                                }
                              </td>
                              <td>{dash?.estado}</td>
                              <td>
                                <CustomButton
                                  text='Agregar'
                                  placement='top'
                                  icon={<AddIcon />}
                                  color="success"
                                  onclick={() => handleAddUserDashboard(dash.id_dashboard_kibana!, id_user_dashboard)}
                                />
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                
                <Row>
                  <Col className="d-flex justify-content-between align-items-center">
                    <Button 
                      variant="secondary" 
                      onClick={handlePreviousPage} 
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <Button 
                      variant="secondary" 
                      onClick={handleNextPage} 
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </Col>
                </Row>
              </Container>
            )
        }
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={() => setShowModal(false)}
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};