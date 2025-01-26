import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { getAllDashboards } from '../api/dashboards/getAllDashboards';
import { DashboardKibanaProps } from "../interfaces/dashboardUserDataInterface";
import { sigbpsApi } from "../api/baseApi";
import { AddIcon } from "../utils/iconButtons";
import { formatterDate } from "../utils/formatters";
import { CustomButton } from "../components/CustomButton";
import { Layout } from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import { useDashboardKibanaStore } from "../store/dashboardKibanaStore";

export const QueryDashboardPage = () => {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<DashboardKibanaProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchDashboard, setSearchDashboard] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { onAddDashboardKibana } = useDashboardKibanaStore();

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

  const hanndleGoToQueryDashboard = (idDashboard: number) => {
    navigate('/add_query_to_dashboard');
    onAddDashboardKibana(idDashboard);
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
                      Relación Consultas-Dashboards
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
                                  text='Agregar Consulta'
                                  placement='top'
                                  icon={<AddIcon />}
                                  color="success"
                                  onclick={() => {
                                    hanndleGoToQueryDashboard(dash.id_dashboard_kibana!);
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
              </Container>
            </Layout>
          )
      }
      <ToastContainer />
    </>
  );
};
