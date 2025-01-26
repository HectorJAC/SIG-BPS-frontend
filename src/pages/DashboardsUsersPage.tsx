import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { getAllDashboards } from '../api/dashboards/getAllDashboards';
import { DashboardKibanaProps } from "../interfaces/dashboardUserDataInterface";
import { sigbpsApi } from "../api/baseApi";
import { ViewIcon } from "../utils/iconButtons";
import { formatterDate } from "../utils/formatters";
import { CustomButton } from "../components/CustomButton";
import { Layout } from "../layout/Layout";
import { UserProps } from "../interfaces/userInterface";

export const DashboardsUsersPage = () => {
  const [dashboards, setDashboards] = useState<DashboardKibanaProps>();
  const [usersInDashboard, setUsersInDashboards] = useState<UserProps[]>([]);
  const [idDashboardKibana, setIdDashboardKibana] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchDashboard, setSearchDashboard] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    if (idDashboardKibana !== undefined || showModal) {
      sigbpsApi.get('/dashboard_kibana/getAllUsersWithDashboard', {
        params: {
          id_dashboard_kibana: idDashboardKibana
        }
      })
        .then((response) => {
          setUsersInDashboards(response.data);
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
        });
    }
  }, [idDashboardKibana, showModal]);

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

  const handleCloseModal = () => {
    setShowModal(false);
    setIdDashboardKibana(undefined);
  };

  return (
    <>
      {
        isLoading 
          ? (
            <Container>
              <Spinner />
            </Container>
          )
          : (
            <Layout>
              <Container>
                <Row>
                  <Col>
                    <h1 className="mt-3 mb-4">
                      Listado de Dashboards
                    </h1>
                  </Col>
                </Row>

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
                          <th>Cantidad de Usuarios</th>
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
                              <td>{dash?.cantidad_usuarios}</td>
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
                                {
                                  dash.cantidad_usuarios! > 0 && (
                                    <CustomButton
                                      text='Ver Usuarios'
                                      placement='top'
                                      icon={<ViewIcon />}
                                      color="success"
                                      onclick={() => {
                                        setIdDashboardKibana(dash.id_dashboard_kibana!);
                                        setShowModal(true);
                                      }}
                                    />
                                  )
                                }
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

                <Modal 
                  show={showModal} 
                  onHide={handleCloseModal} 
                  size="lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>
                      Usuarios con el dashboard asignado
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {
                      usersInDashboard?.map((user) => (
                        <div key={user.id_usuario}>
                          <p><strong>ID:</strong> {user.id_usuario}</p>
                          <p><strong>Nombre:</strong> {user.nombres} {user.apellidos}</p>
                          <p><strong>Cédula:</strong> {user.cedula}</p>
                          <p><strong>Nombre Empresa:</strong> {user.nombre_empresa}</p>
                          <hr />
                        </div>
                      ))
                    }
                  </Modal.Body>
                </Modal>
              </Container>
            </Layout>
          )
      }
      <ToastContainer />
    </>
  );
};
