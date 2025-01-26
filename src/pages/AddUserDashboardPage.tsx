import { Container, Spinner, Row, Col, Button, Table, Form, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { CustomButton } from "../components/CustomButton";
import { Layout } from "../layout/Layout";
import { FC, useCallback, useEffect, useState } from "react";
import { useUserDashboardStore } from "../store/userDashboardStore";
import { UserProps } from "../interfaces/userInterface";
import { InactiveIcon, ViewIcon } from "../utils/iconButtons";
import { sigbpsApi } from "../api/baseApi";
import { FaAngleLeft } from "react-icons/fa";
import { DashboardUserDataProps, UserDashboardsProps } from "../interfaces/dashboardUserDataInterface";
import { getAllUserDashboards } from "../api/dashboards/getAllUserDashboards";
import { CustomBasicModal } from "../components/CustomBasicModal";
import { useUserStore } from "../store/userStore";
import { formatterDateToBackend } from "../utils/formatters";
import { AddUserDashboardModal } from "../components/AddUserDashboardModal";

export const AddUserDashboardPage:FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserProps>({} as UserProps);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dashboards, setDashboards] = useState<UserDashboardsProps>();
  const [dashboardInModal, setDashboardInModal] = useState<DashboardUserDataProps>();
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idDeleteUserDashboard, setIdDeleteUserDashboard] = useState<number>();
  const [searchDashboard, setSearchDashboard] = useState<string>('');

  const { user } = useUserStore();
  const { id_user_dashboard, onResetUserDashboard } = useUserDashboardStore();

  const allUserDashboards = useCallback((pageNumber = 1, estado = 'A') => {
    setIsLoading(true);
    getAllUserDashboards(
      pageNumber,
      5,
      id_user_dashboard,
      estado
    )
      .then((response) => {
        setDashboards(response);
        setCurrentPage(pageNumber);
        setTotalPages(response.totalPages);
        setIsLoading(false);
        return;
      })
      .catch(() => {
        setDashboards(undefined);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    allUserDashboards();
  }, [allUserDashboards]);

  useEffect(() => {
    if (!showAddModal) {
      allUserDashboards();
    }
  }, [showAddModal]);
  
  useEffect(() => {
    setIsLoading(true);
    sigbpsApi.get('/usuarios/getUser', {
      params: {
        id_usuario: id_user_dashboard
      }
    })
      .then((response) => {
        setUserData(response.data);
        setIsLoading(false);
    })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      allUserDashboards(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      allUserDashboards(currentPage + 1);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setIdDeleteUserDashboard(undefined);
  };

  const handleDeleteDashboard = (id_usuario_dashboard: number) => {
    sigbpsApi.put('/dashboard_kibana/inactivateUserDashboard', {
      id_usuario_dashboard,
      usuario_actualizacion: user.id_usuario,
      fecha_actualizacion: formatterDateToBackend(new Date().toString())
    })
      .then((response) => {
        toast.success(response.data.message);
        allUserDashboards();
        setShowDeleteModal(false);
        setIdDeleteUserDashboard(undefined);
      })
      .catch((error) => {
        toast.error(`${error.response.data.message}`);
        allUserDashboards();
        setShowDeleteModal(false);
        setIdDeleteUserDashboard(undefined);
    });
  };

  const handleSearchDashboard = (searchDashboardParameter?: string) => {
    setIsLoading(true);
    if (searchDashboard === '' || searchDashboardParameter === '') {
      allUserDashboards();
      setIsLoading(false);  
    } else {
      sigbpsApi.get('/dashboard_kibana/searchDashboardUser', {
        params: {
          search: searchDashboard || searchDashboardParameter,
          id_usuario: id_user_dashboard,
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

  return (
    <Layout>
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
                <Col className='mt-3 mb-4' md={2}>
                  <Form.Text
                    className='text-success'
                    style={{ cursor: 'pointer', fontSize: '1.3rem'}}
                    onClick={() => {
                      window.history.back();
                      onResetUserDashboard();
                    }}
                  >
                    <FaAngleLeft/> Volver
                  </Form.Text>
                </Col>

                <Col md={10}>
                  <h1 className="mt-3 mb-4 fw-bold text-black my-3">
                    {userData.id_usuario} - {userData.nombres} {userData.apellidos}
                  </h1>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <Button 
                    variant="success" 
                    style={{
                      marginBottom: '20px',
                      marginLeft: '20px'
                    }}
                    onClick={() => setShowAddModal(true)}
                  >
                    Agregar Nuevo Dashboard
                  </Button>
                </Col>

                <Col md={9}>
                  <div className="input-group">
                    <Form.Control 
                      type="text" 
                      placeholder="Buscar Dashboard" 
                      value={searchDashboard}
                      onChange={(e) => setSearchDashboard(e.target.value)}
                    />
                    <Button 
                      variant="success"
                      onClick={() => handleSearchDashboard()} 
                    >
                      Buscar
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre Dashboard</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        dashboards?.dashboardsUsuario?.map((dash) => (
                          <tr key={dash?.id_dashboard_kibana}>
                            <td>{dash?.id_dashboard_kibana}</td>
                            <td>{dash?.nombre_dashboard}</td>
                            <td>{dash?.estado}</td>
                            <td>
                              <CustomButton
                                text='Consultar'
                                placement='top'
                                icon={<ViewIcon />}
                                color="success"
                                style={{ marginRight: '10px' }}
                                onclick={() => {
                                  setDashboardInModal(dash);
                                  setShowModal(true);
                                }}
                              />
                                <CustomButton 
                                  text='Eliminar'
                                  placement='top'
                                  icon={<InactiveIcon />}
                                  color="danger"
                                  onclick={() => {
                                    setShowDeleteModal(true)
                                    setIdDeleteUserDashboard(dash.id_usuario_dashboard!);
                                  }}
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
                <Modal 
                  show={showModal} 
                  onHide={() => setShowModal(false)} 
                  size="xl"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>{dashboardInModal?.nombre_dashboard}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      <iframe
                        src={dashboardInModal?.dashboard_source}
                        height={700}
                        width={1100}
                      ></iframe>
                    </div>
                  </Modal.Body>
                </Modal>
            </Container>
          )
      }
      <AddUserDashboardModal 
        showModal={showAddModal}
        setShowModal={() => setShowAddModal(false)}
      />

      <CustomBasicModal 
        title="Eliminar Dashboard"
        body="¿Desea eliminar este dashboard al usuario?"
        secondaryButton="Cancelar"
        primaryButton="Aceptar"
        showModal={showDeleteModal}
        setShowModal={handleCloseDeleteModal}
        onClick={() => handleDeleteDashboard(idDeleteUserDashboard!)}
      />
      <ToastContainer />
    </Layout>
  );
}
