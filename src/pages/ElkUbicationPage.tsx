import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomButton } from "../components/CustomButton";
import { EditIcon } from "../utils/iconButtons";
import { ElkUbicationProps } from "../interfaces/elkUbicationInterface";
import { getAllElkUbicacion } from "../api/elk_ubicacion/findAllElkUbicacion";
import { formatterDate } from "../utils/formatters";
import { ElkUbicationModal } from "../components/ElkUbicationModal";
import { sigbpsApi } from "../api/baseApi";
import { useUbicationElkStore } from "../store/ubicationElk";

export const ElkUbicationPage = () => {
  const [elkUbication, setElkUbication] = useState<ElkUbicationProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchElkUbicacion, setSearchElkUbicacion] = useState<string>('');
  const [idElkUbication, setIdElkUbication] = useState<number>();
  const [showModal, setShowModal] = useState(false);
  const { editUbicationElkSuccess, resetEditUbicationElkSuccess } = useUbicationElkStore();

  const getAllElk = useCallback((pageNumber = 1) => {
    setIsLoading(true);
    getAllElkUbicacion(
      pageNumber, 
      5
    )
      .then((response) => {
        setElkUbication(response);
        setCurrentPage(pageNumber);
        setTotalPages(response.totalPages);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getAllElk();
  }, [getAllElk]);

  useEffect(() => {
    if (editUbicationElkSuccess) {
      getAllElk();
    }
  }, [editUbicationElkSuccess, getAllElk]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllElk(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllElk(currentPage + 1);
    }
  };

  const handleSearchElkUbicacion = () => {
    setIsLoading(true);
    if (searchElkUbicacion === '') {
      getAllElk();
      setIsLoading(false);  
    } else {
      sigbpsApi.get('/ubicacion_elk/searchElkUbication', {
        params: {
          search: searchElkUbicacion,
        }
      })
        .then((response) => {
          setElkUbication(response.data);
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
    setIdElkUbication(undefined);
    resetEditUbicationElkSuccess();
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
                  <h1 className="mt-3 mb-4">
                    Ubicación de las Herramientas ELK Stack
                  </h1>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="input-group">
                    <Form.Control 
                      type="text" 
                      placeholder="Buscar Herramienta ELK"
                      value={searchElkUbicacion}
                      onChange={(e) => setSearchElkUbicacion(e.target.value)} 
                    />
                    <Button 
                      variant="success" 
                      onClick={handleSearchElkUbicacion}
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
                        <th>Herramienta</th>
                        <th>Ubicación</th>
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
                        elkUbication?.elkUbicacion?.map((elk) => (
                          <tr key={elk?.id_elk_ubicacion}>
                            <td>{elk?.id_elk_ubicacion}</td>
                            <td>{elk?.nombre_elk}</td>
                            <td>{elk?.ubicacion_elk}</td>
                            <td>{elk?.usuario_insercion}</td>
                            <td>
                              {
                                elk?.fecha_insercion
                                  ? formatterDate(elk?.fecha_insercion)
                                  : null
                              }
                            </td>
                            <td>{elk?.usuario_actualizacion}</td>
                            <td>
                              {
                                elk?.fecha_actualizacion
                                  ? formatterDate(elk?.fecha_actualizacion)
                                  : null
                              }
                            </td>
                            <td>{elk?.estado}</td>
                            <td>
                              <CustomButton
                                text='Editar'
                                placement='top'
                                icon={<EditIcon />}
                                color="success"
                                onclick={() => {
                                  setIdElkUbication(elk.id_elk_ubicacion);
                                  setShowModal(true);
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

              <ElkUbicationModal 
                showModal={showModal} 
                setShowModal={handleCloseModal}
                idElkUbicacion={idElkUbication}
              />

            </Container>
          )
      }
      <ToastContainer />
    </Layout>
  );
};
