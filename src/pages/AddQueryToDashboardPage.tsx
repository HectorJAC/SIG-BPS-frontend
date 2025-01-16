import { Button, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useDashboardKibanaStore } from "../store/dashboardKibanaStore";
import { useCallback, useEffect, useState } from "react";
import { ConsultaDashboardRePaginatedProps } from "../interfaces/consultaDashboardInterface";
import { FaAngleLeft } from "react-icons/fa";
import { OneDashboardUserDataProps } from "../interfaces/dashboardUserDataInterface";
import { sigbpsApi } from "../api/baseApi";
import { toast } from "react-toastify";
import { formatterDate, formatterDateToBackend } from "../utils/formatters";
import { CustomButton } from "../components/CustomButton";
import { InactiveIcon, ViewIcon } from "../utils/iconButtons";
import { useNavigate } from "react-router-dom";
import { useConsultaExtraccionStore } from "../store/consultaExtractionStore";
import { useUserStore } from "../store/userStore";
import { CustomBasicModal } from "../components/CustomBasicModal";
import { AddQueryToDashboardModal } from "../components/AddQueryToDashboardModal";

export const AddQueryToDashboardPage = () => {
  const navigate = useNavigate();
  const [consultaDashboard, setConsultaDashboard] = useState<ConsultaDashboardRePaginatedProps>();
  const [dashboardKibana, setDashboardKibana] = 
    useState<OneDashboardUserDataProps>({} as OneDashboardUserDataProps);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idConsultaDashboard, setIdConsultaDashboard] = useState(0);
  const [showAddQueryModal, setShowAddQueryModal] = useState(false);
  const [searchConsultaExtraccion, seatSearchConsultaExtraccion] = useState<string>('');
  
  const { id_dashboard_kibana, onResetDashboardKibana } = useDashboardKibanaStore();
  const { onAddConsultaExtraccion, onChangeEditPage, onResetEditPage } = useConsultaExtraccionStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (id_dashboard_kibana !== 0) {
      setIsLoading(true);
      sigbpsApi.get('/dashboard_kibana/getDashboard', {
        params: {
          id_dashboard_kibana: id_dashboard_kibana
        }
      })
      .then((response) => {
        setDashboardKibana(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(`${error.response.data.message}`);
        setIsLoading(false);
      });
    }
  }, [id_dashboard_kibana]);

  const getAllQueryByDashboard = useCallback((pageNumber = 1) => {
    if (id_dashboard_kibana !== 0) {
      setIsLoading(true);
      sigbpsApi.get('/consulta_dashboard/getAllConsultDashboardByDashboard', {
        params: {
          id_dashboard_kibana: id_dashboard_kibana,
          estado: 'A',
          pageNumber,
          pageSize: 5
        }
      })
      .then((response) => {
        setConsultaDashboard(response.data);
        setCurrentPage(pageNumber);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(`${error.response.data.message}`);
        setConsultaDashboard({} as ConsultaDashboardRePaginatedProps);
        setIsLoading(false);
      });
    }
  }, [id_dashboard_kibana]);

  useEffect(() => {
    getAllQueryByDashboard();
  }, [getAllQueryByDashboard]);

  useEffect(() => {
    if (!showAddQueryModal) {
      getAllQueryByDashboard();
    }
  }, [showAddQueryModal]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllQueryByDashboard(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllQueryByDashboard(currentPage + 1);
    }
  };

  const handleEditConexion = (id_conexion_extraccion:number) => {
    onAddConsultaExtraccion(id_conexion_extraccion);
    onChangeEditPage(false);
    navigate('/create_consult_extraction');
  };

  const handleGoToBack = () => {
    window.history.back();
    onResetDashboardKibana();
    onResetEditPage();
  };

  const handleDeleteQuery = (id_consulta_dashboard: number) => {
    sigbpsApi.put('/consulta_dashboard/deleteConsultDashboard', {
      id_consulta_dashboard: id_consulta_dashboard,
      fecha_actualizacion: formatterDateToBackend(new Date().toString()),
      usuario_actualizacion: user?.id_usuario
    })
    .then((response) => {
      toast.success(`${response.data.message}`);
      setShowDeleteModal(false);
      getAllQueryByDashboard();
    })
    .catch((error) => {
      toast.error(`${error.response.data.message}`);
      setShowDeleteModal(false);
    });
  };

  const handleShowDeleteModal = (id_consulta_dashboard: number) => {
    setIdConsultaDashboard(id_consulta_dashboard);
    setShowDeleteModal(true);
  };

  const handleSearchConsultaExtraccion = (searchConsultaExtraccionParameter?: string) => {
    setIsLoading(true);
    if (searchConsultaExtraccion === '' && searchConsultaExtraccionParameter === undefined) {
      getAllQueryByDashboard();
      setIsLoading(false);  
    } else {
      sigbpsApi.get('/consulta_dashboard/searchConsultaExtraccionDashboard', {
        params: {
          search: searchConsultaExtraccion || searchConsultaExtraccionParameter,
          id_dashboard_kibana: id_dashboard_kibana,
          estado: 'A'
        }
      })
        .then((response) => {
          setConsultaDashboard(response.data);
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
                  onClick={handleGoToBack}
                >
                  <FaAngleLeft/> Volver
                </Form.Text>
              </Col>

              <Col md={10}>
                <h1 className="mt-3 mb-4 fw-bold text-black my-3">
                  Consultas asignadas al {dashboardKibana.nombre_dashboard}
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
                  onClick={() => setShowAddQueryModal(true)}
                >
                  Agregar Nueva Consulta
                </Button>
              </Col>

              <Col md={9}>
                <div className="input-group">
                  <Form.Control 
                    type="text" 
                    placeholder="Buscar Consulta" 
                    value={searchConsultaExtraccion}
                    onChange={(e) => seatSearchConsultaExtraccion(e.target.value)}
                  />
                  <Button 
                    variant="success" 
                    onClick={() => handleSearchConsultaExtraccion()}
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
                          <th>ID Consulta Extraccion</th>
                          <th>Nombre Tabla</th>
                          <th>Index Data</th>
                          <th>IP Elastic</th>
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
                          consultaDashboard?.consultaDashboardByDashboard?.map((queryDash) => (
                            <tr key={queryDash?.id_consulta_dashboard}>
                              <td>{queryDash?.id_consulta_dashboard}</td>
                              <td>{queryDash?.id_consulta_extraccion}</td>
                              <td>{queryDash?.type}</td>
                              <td>{queryDash?.index_data}</td>
                              <td>{queryDash?.hosts_elastic}</td>
                              <td>{queryDash?.usuario_insercion}</td>
                              <td>
                                {
                                  queryDash?.fecha_insercion
                                    ? formatterDate(queryDash?.fecha_insercion)
                                    : null
                                }
                              </td>
                              <td>{queryDash?.usuario_actualizacion}</td>
                              <td>
                                {
                                  queryDash?.fecha_actualizacion
                                    ? formatterDate(queryDash?.fecha_actualizacion)
                                    : null
                                }
                              </td>
                              <td>{queryDash?.estado}</td>
                              <td>
                                <CustomButton
                                  text='Ver Consulta'
                                  placement='top'
                                  icon={<ViewIcon />}
                                  color="success"
                                  onclick={() => handleEditConexion(queryDash.id_consulta_extraccion!)}
                                  style={{ 
                                    marginRight: '10px' ,
                                    marginBottom: '10px'
                                  }}
                                />
                                {
                                  queryDash.estado === 'A'
                                    ? (
                                      <CustomButton 
                                        text='Eliminar'
                                        placement='top'
                                        icon={<InactiveIcon />}
                                        color="danger"
                                        onclick={() => handleShowDeleteModal(queryDash.id_consulta_dashboard!)}
                                      />
                                    )
                                    : null
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

                <AddQueryToDashboardModal 
                  showModal={showAddQueryModal}
                  setShowModal={setShowAddQueryModal}
                />

                <CustomBasicModal 
                  title="Eliminar Consulta Extraccion"
                  body="¿Esta seguro que desea eliminar la consulta de extraccion?"
                  secondaryButton="Cancelar"
                  primaryButton="Aceptar"
                  showModal={showDeleteModal}
                  setShowModal={() => setShowDeleteModal(false)}
                  onClick={() => handleDeleteQuery(idConsultaDashboard)}
                />
          </Container>
        )
      }
    </Layout>
  )
}
