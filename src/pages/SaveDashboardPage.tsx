import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { getAllDashboards } from '../api/dashboards/getAllDashboards';
import { DashboardKibanaProps, DashboardUserDataProps } from "../interfaces/dashboardUserDataInterface";
import { sigbpsApi } from "../api/baseApi";
import { EditIcon, ViewIcon } from "../utils/iconButtons";
import { CustomButton } from "../components/CustomButton";
import { formatterDate } from "../utils/formatters";
import { Layout } from "../layout/Layout";
import { CreateDashboardModal } from "../components/CreateDashboardModal";

interface EmpresaProps {
  id_empresa: number;
  nombre_empresa: string;
}

export const SaveDashboardPage = () => {
  const [dashboards, setDashboards] = useState<DashboardKibanaProps>();
  const [dashboardInModal, setDashboardInModal] = useState<DashboardUserDataProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchDashboard, setSearchDashboard] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [empresas, setEmpresas] = useState<EmpresaProps[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number | null>(null);
  const [idDashboardKibana, setIdDashboardKibana] = useState<number>();

  useEffect(() => {
    sigbpsApi.get('/empresas/findAllCompanyWithoutPagination')
      .then((response) => {
        setEmpresas(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []);

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

  const handleSelectEmpresa = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    setEmpresaSeleccionada(selectedId || null);
  };
  
  const handleCloseModal = () => {
    setShowEditModal(false);
    setIdDashboardKibana(undefined);
  };

  useEffect(() => {
    if (!showEditModal) {
      allDashboards();
    }
  }, [showEditModal]);

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
                <Col>
                  <h1 className="mt-3 mb-4">
                    Guardar Dashboards Creados
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
                    onClick={() => setShowEditModal(true)}
                  >
                    Nuevo Dashboard
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
                      onClick={handleSearchDashboard}
                    >
                      Buscar
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <div className="input-group mb-3">
                  <Form.Select
                      onChange={handleSelectEmpresa}
                      value={empresaSeleccionada || ''} 
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
                        dashboards?.dashboards.map((dash) => (
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
                                text='Consultar'
                                placement='top'
                                icon={<ViewIcon />}
                                color="success"
                                onclick={() => {
                                  setDashboardInModal(dash);
                                  setShowModal(true);
                                }}
                                style={{ marginRight: '5px' }}
                              />
                              <CustomButton
                                text='Editar'
                                placement='top'
                                icon={<EditIcon />}
                                color="success"
                                onclick={() => {
                                  setIdDashboardKibana(dash.id_dashboard_kibana);
                                  setShowEditModal(true);
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

              <CreateDashboardModal 
                showModal={showEditModal} 
                setShowModal={handleCloseModal}
                idDashboardKibana={idDashboardKibana}
              />
            </Container>
          )
      }
      <ToastContainer />
    </Layout>
  );
};
