import { Button, Col, Container, Form, Modal, ModalHeader, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomButton } from "../components/CustomButton";
import { ExtractDataIcon, ViewIcon } from "../utils/iconButtons";
import { sigbpsApi } from "../api/baseApi";
import { useNavigate } from "react-router-dom";
import { CustomTitle } from "../components/CustomTitle";
import { ConsultExtractionDataProps, ConsultExtractionProps } from "../interfaces/consultExtractionInterface";
import { useConsultaExtraccionStore } from "../store/consultaExtractionStore";
import { CustomTooltip } from "../components/CustomTooltip";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { ElkUbicationNoPaginatedProps } from "../interfaces/elkUbicationInterface";

export const ExtractDataPage = () => {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState<ConsultExtractionProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModalExtractData, setShowModalExtractData] = useState(false);
  const [consultExtractionModal, setConsultExtractionModal] = 
    useState<ConsultExtractionDataProps>({} as ConsultExtractionDataProps);
  const [idQueryExtraction, setIdQueryExtraction] = useState<number>();
  const [elkData, setElkData] = 
    useState<ElkUbicationNoPaginatedProps>({} as ElkUbicationNoPaginatedProps);

  const { onAddConsultaExtraccion } = useConsultaExtraccionStore();

  useEffect(() => {
    sigbpsApi.get('/ubicacion_elk/getElkById', {
      params: {
        id_elk_ubicacion: 1
      }
    })
      .then((response) => {
        setElkData(response.data);
      })
      .catch((error) => {
        toast.error(`${error.response.data.message}`);
      });
  }, []);

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

  useEffect(() => {
    if (showModalExtractData) {
      setIsLoading(true);
    sigbpsApi.get('consulta_extraccion/getConsultaExtraccionById', {
      params: {
        id_consulta_extraccion: idQueryExtraction
      }
    })
      .then((response) => {
        setConsultExtractionModal(response.data);
        setIsLoading(false); 
      })
      .catch(() => {
        setIsLoading(false);
      });
    }
  }, [idQueryExtraction, showModalExtractData]);

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

  const handleShowModalExtractData = (id_conexion_extraccion:number) => {
    setShowModalExtractData(true);
    setIdQueryExtraction(id_conexion_extraccion);
  };

  const handleExtractData = () => {
    sigbpsApi.post('/consulta_extraccion/generateLogstashConfig', {
      path_logstash_config: elkData?.ubicacion_elk,
      name_logstash_config: 'logstash.conf',
      conexion_driver_class: consultExtractionModal?.conexion_driver_class,
      conexion_driver_library: consultExtractionModal?.conexion_driver_library,
      conexion_password: consultExtractionModal?.conexion_password,
      conexion_string: consultExtractionModal?.conexion_string,
      conexion_user: consultExtractionModal?.conexion_user,
      consulta_data: consultExtractionModal?.consulta_data,
      transformacion_data: consultExtractionModal?.transformacion_data,
      index_data: consultExtractionModal?.index_data,
      data_stream: consultExtractionModal?.data_stream,
      use_columns_value: consultExtractionModal?.use_columns_value,
      tracking_columns: consultExtractionModal?.tracking_columns,
      type: consultExtractionModal?.type,
      hosts_elastic: consultExtractionModal?.hosts_elastic
    })
      .then((response) => {
        toast.success(`${response.data.message}`);
        toast.success(`${response.data.path}`);
        setShowModalExtractData(false);
      })
      .catch((error) => {
        toast.error(`${error.response.data.message}`);
      });
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
                    title="Extraer Data"
                  />
                </Col>
              </Row>

              <Row>
                <Col md={9} style={{marginBottom: '20px',}}>
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
                                text='Consultar'
                                placement='top'
                                icon={<ViewIcon />}
                                color="success"
                                style={{marginRight: '10px', marginBottom: '10px'}}
                                onclick={() => handleEditConexion(consulta.id_consulta_extraccion!)}
                              />
                              <CustomButton
                                text='Extraer Data'
                                placement='top'
                                icon={<ExtractDataIcon />}
                                color="success"
                                style={{marginRight: '10px', marginBottom: '10px'}}
                                onclick={() => handleShowModalExtractData(consulta.id_consulta_extraccion!)}
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
                show={showModalExtractData} 
                onHide={() => setShowModalExtractData(false)}
                size="xl"
              >
                <ModalHeader closeButton>
                  <Modal.Title>
                    Consulta y Transformación
                  </Modal.Title>
                </ModalHeader>
                <Modal.Body>
                  <Form>
                    <Row>
                      <Col md={12}>
                        <Form.Group className='mb-4'>
                          <Form.Label>
                            <CustomTooltip
                              text="Ubicación de Logstash en el equipo"
                              placement="top"
                              isButton={false}
                            >
                              Ubicación Logstash <FaRegCircleQuestion />
                            </CustomTooltip>
                          </Form.Label>
                          <Form.Control 
                            type='text'
                            disabled
                            defaultValue={elkData?.ubicacion_elk}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group className='mb-4'>
                          <Form.Label>
                            <CustomTooltip
                              text="Nombre del archivo de configuracion de Logstash"
                              placement="top"
                              isButton={false}
                            >
                              Nombre del archivo <FaRegCircleQuestion />
                            </CustomTooltip>
                          </Form.Label>
                          <Form.Control 
                            type='text'
                            defaultValue={'logstash.conf'}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Modal.Body>
                <Modal.Body>
                  <Form>
                    <Row>
                      <Col md={12}>
                        <Form.Group className='mb-4'>
                          <Form.Label>
                            <CustomTooltip
                              text="Consulta SQL de extracción de datos"
                              placement="top"
                              isButton={false}
                            >
                              Consulta SQL <FaRegCircleQuestion />
                            </CustomTooltip>
                          </Form.Label>
                          <textarea 
                            className='form-control' 
                            rows={10}
                            disabled 
                            value={consultExtractionModal?.consulta_data}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group className='mb-4'>
                          <Form.Label>
                            <CustomTooltip
                              text="Transformación de los datos a extraer"
                              placement="top"
                              isButton={false}
                            >
                              Transformacion Data <FaRegCircleQuestion />
                            </CustomTooltip>
                          </Form.Label>
                          <textarea 
                            className='form-control' 
                            disabled
                            rows={10} 
                            value={consultExtractionModal?.transformacion_data}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModalExtractData(false)}>
                    Cerrar
                  </Button>
                  <Button 
                    variant="success" 
                    type="submit" 
                    onClick={handleExtractData}
                  >
                    Extraer Data
                  </Button>
                </Modal.Footer>
              </Modal>
            </Container>
          )
      }
      <ToastContainer />
    </Layout>
  );
};
