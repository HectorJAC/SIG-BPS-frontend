import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomButton } from "../components/CustomButton";
import { DeleteIcon, EditIcon } from "../utils/iconButtons";
import { formatterDate, formatterDateToBackend } from "../utils/formatters";
import { sigbpsApi } from "../api/baseApi";
import { ConexionElasticProps } from "../interfaces/conexionElasticInterface";
import { CustomAsterisk } from "../components/CustomAsterisk";
import { useUserStore } from "../store/userStore";
import { CustomBasicModal } from "../components/CustomBasicModal";

export const ConexionElasticPage = () => {
  const [conexionElastic, setConexionElastic] = useState<ConexionElasticProps[]>();
  const [conexionElasticModalData, setConexionElasticModalData] = 
    useState<ConexionElasticProps>({} as ConexionElasticProps);
  const [isLoading, setIsLoading] = useState(false);
  const [idConexionElastic, setIdConexionElastic] = useState<number>();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useUserStore();

  const getElasticConnection = useCallback(() => {
    setIsLoading(true);
    sigbpsApi.get('/conexion_elastic/getAllElasticConnections')
      .then((response) => {
        setConexionElastic(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setConexionElastic(undefined);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getElasticConnection();
  }, [getElasticConnection]);

  useEffect(() => {
    showModal &&
      sigbpsApi.get('/conexion_elastic/getElasticConnectionById', {
        params: {
          id_conexion_elastic: idConexionElastic
        }
      })
        .then((response) => {
          setConexionElasticModalData(response.data);
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
        });

  }, [idConexionElastic, showModal]);

  const handleCloseModal = () => {
    setShowModal(false);
    setIdConexionElastic(undefined);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setIdConexionElastic(undefined);
  };

  const handleCreateConexionElastic = () => {
    if (conexionElasticModalData.hosts_elastic === '') {
      toast.error('Debe ingresar la direccion ip');
      return;
    } else {
      sigbpsApi.post('/conexion_elastic/createElasticConnection', {
        hosts_elastic: conexionElasticModalData.hosts_elastic,
        usuario_insercion: user?.id_usuario,
        fecha_insercion: formatterDateToBackend(new Date().toString()),
        estado: 'A'
      })
        .then((response) => {
          toast.success(`${response.data.message}`);
          setShowModal(false);
          setConexionElasticModalData({} as ConexionElasticProps);
          getElasticConnection();
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
          setShowModal(false);
          getElasticConnection();
      })
    }
  };

  const handleUpdateConexionElastic = () => {
    if (conexionElasticModalData.hosts_elastic === '') {
      toast.error('Debe ingresar la direccion ip');
      return;
    } else {
      sigbpsApi.put('/conexion_elastic/updateElasticConnection', {
        id_conexion_elastic: conexionElasticModalData.id_conexion_elastic,
        hosts_elastic: conexionElasticModalData.hosts_elastic,
        usuario_actualizacion: user?.id_usuario,
        fecha_actualizacion: formatterDateToBackend(new Date().toString())
      })
        .then((response) => {
          toast.success(`${response.data.message}`);
          setShowModal(false);
          setConexionElasticModalData({} as ConexionElasticProps);
          getElasticConnection();
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
          setShowModal(false);
          getElasticConnection();
      })
    }
  };

  const handleDeleteConexionElastic = (id_conexion_elastic: number) => {
    sigbpsApi.put('/conexion_elastic/deleteElasticConnection', {
      id_conexion_elastic,
      usuario_actualizacion: user?.id_usuario,
      fecha_actualizacion: formatterDateToBackend(new Date().toString())
    })
      .then((response) => {
        toast.success(response.data.message);
        setShowDeleteModal(false);
        setConexionElastic(undefined);
        getElasticConnection();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setShowDeleteModal(false);
        getElasticConnection();
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
                  <h1 className="mt-3 mb-4">
                    Conexión de Elastic Search
                  </h1>
                </Col>
              </Row>

              {
                conexionElastic === undefined 
                ? (
                  <Row>
                    <Col md={3}>
                      <Button 
                        variant="success" 
                        style={{
                          marginBottom: '20px',
                          marginLeft: '20px'
                        }}
                        onClick={() => setShowModal(true)}
                      >
                        Registrar Conexion ElasticSearch
                      </Button>
                    </Col>
                  </Row>
                )
                : null
              }

              <Row className="mt-3">
                <Col>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Conexion IP</th>
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
                        conexionElastic?.map((els) => (
                          <tr key={els?.id_conexion_elastic}>
                            <td>{els?.hosts_elastic}</td>
                            <td>{els?.usuario_insercion}</td>
                            <td>
                              {
                                els?.fecha_insercion
                                  ? formatterDate(els?.fecha_insercion)
                                  : null
                              }
                            </td>
                            <td>{els?.usuario_actualizacion}</td>
                            <td>
                              {
                                els?.fecha_actualizacion
                                  ? formatterDate(els?.fecha_actualizacion)
                                  : null
                              }
                            </td>
                            <td>{els?.estado}</td>
                            <td>
                              <CustomButton
                                text='Editar Conexion'
                                placement='top'
                                icon={<EditIcon />}
                                color="success"
                                style={{ marginRight: '10px' }}
                                onclick={() => {
                                  setIdConexionElastic(els.id_conexion_elastic);
                                  setShowModal(true);
                                }}
                              />
                              <CustomButton
                                text='Eliminar Conexion'
                                placement='top'
                                icon={<DeleteIcon />}
                                color="danger"
                                onclick={() => {
                                  setIdConexionElastic(els.id_conexion_elastic);
                                  setShowDeleteModal(true);
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

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {
                      idConexionElastic 
                      ? 'Editar Conexion de Elastic Search'
                      : 'Crear Nueva Conexion de Elastic Search'
                    }
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group>
                      <Form.Label><CustomAsterisk /> ID</Form.Label>
                      <Form.Control 
                        type="number" 
                        value={conexionElasticModalData?.id_conexion_elastic}
                        disabled
                        className="mb-2"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label><CustomAsterisk /> Conexion IP de Elastic Search</Form.Label>
                      <Form.Control 
                        type="text"
                        placeholder="Ingrese la direccion IP"
                        value={conexionElasticModalData?.hosts_elastic}
                        onChange={(e) => setConexionElasticModalData({...conexionElasticModalData, hosts_elastic: e.target.value})}
                        className="mb-2"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label><CustomAsterisk /> Estado</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={conexionElasticModalData?.estado}
                        disabled
                        className="mb-2"
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cerrar
                  </Button>
                  <Button 
                    variant="success" 
                    type="submit" 
                    onClick={
                      !idConexionElastic 
                        ? handleCreateConexionElastic 
                        : handleUpdateConexionElastic
                    }
                  >
                    {!idConexionElastic ? 'Crear Conexion' : 'Actualizar Conexion'}
                  </Button>
                </Modal.Footer>
              </Modal>

              <CustomBasicModal 
                title="Eliminar Conexión de ElasticSearch"
                body="¿Esta seguro que desea eliminar la conexión? Tenga en cuenta que no podrá extraer data sin esta conexión. Es preferible editar la conexión."
                secondaryButton="Cancelar"
                primaryButton="Aceptar"
                showModal={showDeleteModal}
                setShowModal={handleCloseDeleteModal}
                onClick={() => handleDeleteConexionElastic(idConexionElastic!)}
              />

            </Container>
          )
      }
      <ToastContainer />
    </Layout>
  );
};

