import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomButton } from "../components/CustomButton";
import { ActivateIcon, EditIcon, InactiveIcon } from "../utils/iconButtons";
import { sigbpsApi } from "../api/baseApi";
import { useNavigate } from "react-router-dom";
import { CustomTitle } from "../components/CustomTitle";
import { ConsultExtractionProps } from "../interfaces/consultExtractionInterface";
import { useConsultaExtraccionStore } from "../store/consultaExtractionStore";

export const ConsultExtractionPage = () => {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState<ConsultExtractionProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { onAddConsultaExtraccion } = useConsultaExtraccionStore();

  const getAllConsultas = useCallback((pageNumber = 1) => {
    setIsLoading(true);
    sigbpsApi.get('/consulta_extraccion/getAllConsultaExtraccion', {
      params: {
        page: pageNumber,
        limit: 5
      }
    })
      .then((response) => {
        setConsultas(response.data);
        setCurrentPage(pageNumber);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
        return;
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getAllConsultas();
  }, [getAllConsultas]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllConsultas(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllConsultas(currentPage + 1);
    }
  };

  const handleEditConexion = (id_conexion_extraccion:number) => {
    onAddConsultaExtraccion(id_conexion_extraccion);
    navigate('/create_consult_extraction');
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
                <Col>
                  <CustomTitle 
                    title="Consultas de Extracción"
                  />
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
                    onClick={() => navigate('/create_consult_extraction')}
                  >
                    Nueva Consulta
                  </Button>
                </Col>

                <Col md={9}>
                  <div className="input-group">
                    <Form.Control 
                      type="text" 
                      placeholder="Buscar Consulta de Extraccion" 
                    />
                    <Button 
                      variant="success" 
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
                        <th>Empresa</th>
                        <th>Nombre Tabla</th>
                        <th>Index Data</th>
                        <th>IP Elastic</th>
                        <th>Usuario Insercion</th>
                        <th>Fecha Insercion</th>
                        <th>Usuario Actualizacion</th>
                        <th>Fecha Actualizacion</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        consultas?.consultas.map((consulta) => (
                          <tr key={consulta.id_consulta_extraccion}>
                            <td>{consulta.id_consulta_extraccion}</td>
                            <td>{consulta.nombre_empresa}</td>
                            <td>{consulta.type}</td>
                            <td>{consulta.index_data}</td>
                            <td>{consulta.hosts_elastic}</td>
                            <td>{consulta.usuario_insercion}</td>
                            <td>{consulta.fecha_insercion}</td>
                            <td>{consulta.usuario_actualizacion}</td>
                            <td>{consulta.fecha_actualizacion}</td>
                            <td>{consulta.estado}</td>
                            <td>
                              <CustomButton
                                text='Editar'
                                placement='top'
                                icon={<EditIcon />}
                                color="success"
                                style={{marginRight: '10px', marginBottom: '10px'}}
                                onclick={() => handleEditConexion(consulta.id_consulta_extraccion!)}
                              />
                              {
                                consulta.estado === 'A'
                                  ? (
                                    <CustomButton 
                                      text='Inactivar'
                                      placement='top'
                                      icon={<InactiveIcon />}
                                      color="danger"
                                    />
                                  )
                                  : (
                                    <CustomButton 
                                      text='Activar'
                                      placement='top'
                                      icon={<ActivateIcon />}
                                      color="danger"
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
            </Container>
          )
      }
      <ToastContainer />
    </Layout>
  );
};
