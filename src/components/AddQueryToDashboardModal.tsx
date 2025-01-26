import { FC, useCallback, useEffect, useState } from "react";
import { sigbpsApi } from "../api/baseApi";
import { ConsultExtractionDataProps, ConsultExtractionProps } from "../interfaces/consultExtractionInterface";
import { Button, Col, Container, Form, Modal, ModalHeader, Row, Table } from "react-bootstrap";
import { CustomButton } from "./CustomButton";
import { AddIcon, ViewIcon } from "../utils/iconButtons";
import { CustomTooltip } from "./CustomTooltip";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { formatterDateToBackend } from "../utils/formatters";
import { useUserStore } from "../store/userStore";
import { useDashboardKibanaStore } from "../store/dashboardKibanaStore";
import { toast } from "react-toastify";

interface AddQueryToDashboardModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export const AddQueryToDashboardModal:FC<AddQueryToDashboardModalProps> = ({
  showModal,
  setShowModal
}) => {
  const [consultas, setConsultas] = useState<ConsultExtractionProps>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConsultQueryModal, setShowConsultQueryModal] = useState(false);
  const [consultExtractionModal, setConsultExtractionModal] = 
    useState<ConsultExtractionDataProps>({} as ConsultExtractionDataProps);
  const [idQueryExtraction, setIdQueryExtraction] = useState<number>();

  const { user } = useUserStore();
  const { id_dashboard_kibana } = useDashboardKibanaStore();

  const getAllConsultas = useCallback((pageNumber = 1) => {
    if (showModal) {
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
          return;
        })
        .catch(() => {});
      }
  }, [showModal]);

  useEffect(() => {
    getAllConsultas();
  }, [getAllConsultas]);

  useEffect(() => {
    if (showConsultQueryModal) {
      sigbpsApi.get('consulta_extraccion/getConsultaExtraccionById', {
        params: {
          id_consulta_extraccion: idQueryExtraction
        }
      })
      .then((response) => {
        setConsultExtractionModal(response.data);
      })
      .catch(() => {});
    }
  }, [idQueryExtraction, showConsultQueryModal]);

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

  const handleShowConsultQueryModal = (idConsultaExtraccion: number) => {
    setIdQueryExtraction(idConsultaExtraccion);
    setShowConsultQueryModal(true);
  };

  const handleAddQuery = (id_consulta_extraccion: number) => {
    sigbpsApi.post('/consulta_dashboard/addConsultDashboard', {
      id_dashboard_kibana: id_dashboard_kibana, 
      id_consulta_extraccion: id_consulta_extraccion,
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
    <Container>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Consulta al Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                            onclick={() => handleShowConsultQueryModal(consulta.id_consulta_extraccion!)}
                          />
                          <CustomButton
                            text='Agregar'
                            placement='top'
                            icon={<AddIcon />}
                            color="success"
                            style={{marginRight: '10px', marginBottom: '10px'}}
                            onclick={() => handleAddQuery(consulta.id_consulta_extraccion!)}
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

      <Modal show={showConsultQueryModal} onHide={() => setShowConsultQueryModal(false)} size="xl">
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
        <Button variant="secondary" onClick={() => setShowConsultQueryModal(false)}>
          Cerrar
        </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
