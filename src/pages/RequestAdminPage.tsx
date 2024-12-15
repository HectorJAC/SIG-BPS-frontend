import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { CustomButton } from "../components/CustomButton";
import { formatterDate, formatterDateToBackend } from "../utils/formatters";
import { Spinner } from "../components/Spinner";
import { InactiveIcon, ViewIcon } from "../utils/iconButtons";
import { getAllRequest } from "../api/pedidos/getAllRequest";
import { RequestProps } from "../interfaces/requestInterface";
import { getCantRequestByStatus } from "../api/pedidos/getCantRequestByStatus";
import { updateRequestStatus } from "../api/pedidos/updateRequestStatus";
import { sigbpsApi } from "../api/baseApi";
import { UserProps } from "../interfaces/userInterface";
import { updateRequestUser } from "../api/pedidos/updateRequestUser";

export const RequestAdminPage = () => {
  const [requests, setRequests] = useState<RequestProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  const [searchRequest, setSearchRequest] = useState('');
  const [cantRequestTrabajando, setCantRequestTrabajando] = useState<any>();
  const [cantRequestPendiente, setCantRequestPendiente] = useState<any>();
  const [cantRequestCompletado, setCantRequestCompletado] = useState<any>();
  const [admins, setAdmins] = useState<UserProps[]>([]);

  const allRequests = useCallback(() => {
    setIsLoading(true);
    getAllRequest()
      .then((response) => {
        setRequests(response); 
        setIsLoading(false);
      })
      .catch(() => {
        toast.info('No hay solicitudes de gráficas');
        setIsLoading(false);
      }); 
  }, []);

  useEffect(allRequests, [allRequests]);

  const getCantRequestTrabajando = useCallback(() => {
    getCantRequestByStatus('T')
      .then((response) => {
        setCantRequestTrabajando(response);
      })
      .catch(() => {
        setCantRequestTrabajando(0);
      });
  }, []);

  const getCantRequestPendiente = useCallback(() => {
    getCantRequestByStatus('P')
      .then((response) => {
        setCantRequestPendiente(response);
      })
      .catch(() => {
        setCantRequestPendiente(0);
      });
  }, []);

  const getCantRequestCompletado = useCallback(() => {
    getCantRequestByStatus('C')
      .then((response) => {
        setCantRequestCompletado(response);
      })
      .catch(() => {
        setCantRequestCompletado(0);
      });
  }, []);

  useEffect(getCantRequestTrabajando, [getCantRequestTrabajando]);
  useEffect(getCantRequestPendiente, [getCantRequestPendiente]);
  useEffect(getCantRequestCompletado, [getCantRequestCompletado]);

  const getCantRequests = () => {
    getCantRequestTrabajando();
    getCantRequestPendiente();
    getCantRequestCompletado();
  };

  useEffect(() => {
    sigbpsApi.get('/usuarios/getAllAdmins')
      .then((response) => {
        setAdmins(response.data);
      })
      .catch(() => {
        toast.error('Error al obtener los administradores');
      });
  }, [])

  const handleUpdateRequestStatus = (id_pedido:number, estado_pedido:string) => {
    setIsLoading(true);
    updateRequestStatus(
      id_pedido, 
      estado_pedido, 
      formatterDateToBackend(new Date().toString())
    )
      .then((response) => {
        toast.success(response.message);
        allRequests();
        getCantRequests();
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setIsLoading(false);
      });
  }

  const handleUpdateUser = (id_pedido:number, id_usuario:number) => {
    setIsLoading(true);
    updateRequestUser(
      id_pedido, 
      id_usuario, 
      formatterDateToBackend(new Date().toString())
    )
      .then((response) => {
        toast.success(response.message);
        allRequests();
        getCantRequests();
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setIsLoading(false);
      });
  };

  // const handleShowModal = (id_gerente: number) => {
  //   setSelectedProjectId(id_gerente);
  //   setShowModal(true);
  // };

  // const handleSearchProject = () => {
  //   setIsLoading(true);
  //   if (searchProject === '') {
  //     allProyects();
  //   } else {
  //     planificaTechApi.get('/proyectos/searchProject', {
  //       params: {
  //         search: searchProject
  //       }
  //     })
  //       .then((response) => {
  //         setProyects(response.data);
  //         setIsLoading(false);
  //       })
  //       .catch((error) => {
  //         toast.error(error.response.data.message);
  //         setIsLoading(false);
  //       })
  //   }
  // };

  const renderRequestByStatus = (status:string) => {
    return requests!
      .filter((request) => request.estado_pedido === status)
      .map((request) => (
        <Card key={request.id_usuario_pedido} className="mb-4">
          <Card.Body>
            <Card.Title>
              Solicitud: {request.id_usuario_pedido} - Gerente: {request.nombres_usuario + ' ' + request.apellidos_usuario}
            </Card.Title>
            <Card.Text>Empresa del Gerente: {request.nombre_empresa}</Card.Text>
            <Card.Text>Pedido: {request.descripcion_pedido}</Card.Text>
            <Card.Text>
              Fecha Pedido: {
                request.fecha_pedido === null
                  ? 'Sin Fecha'
                  : formatterDate(request.fecha_pedido)
              }
            </Card.Text>
            <Card.Text>Estado Solicitud</Card.Text>
            <Card.Text>
              <Form.Select
                className="mt-2"
                value={request.estado_pedido}
                onChange={(e) => handleUpdateRequestStatus(
                  request.id_usuario_pedido!, 
                  e.target.value
                )}
              >
                <option value="P">Pendiente</option>
                <option value="T">Trabajando</option>
                <option value="C">Completado</option>
              </Form.Select>
            </Card.Text>
            <Card.Text>Usuario asignado</Card.Text>
            <Card.Text>
              <Form.Select
                className="mt-2"
                value={request.id_usuario_asignado === null ? '' : request.id_usuario_asignado}
                onChange={(e) => handleUpdateUser(
                  request.id_usuario_pedido!, 
                  Number(e.target.value)
                )}
              >
                <option value="">Sin Asignar</option>
                {
                  admins?.map((admin) => (
                    <option key={admin.id_usuario} value={admin.id_usuario}>
                      {admin.nombres + ' ' + admin.apellidos}
                    </option>
                  ))
                }
              </Form.Select>
            </Card.Text>
            <Card.Text>
              Fecha Actualizacion: {
                request.fecha_actualizacion === null
                  ? 'Sin Fecha'
                  : formatterDate(request.fecha_actualizacion)
              }
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <CustomButton 
              placement="top"
              text="Consultar Solicitud Completa"
              icon={<ViewIcon />}
              color="success"
              style={{ 
                marginLeft: '10px',
                marginRight: '250px' 
              }}
            />
            <CustomButton 
              placement="top"
              text="Inactivar"
              icon={<InactiveIcon />}
              color="danger"
            />
          </Card.Footer>
        </Card>
      ));
  };

  return (
    <Layout>
      {isLoading ? (
        <Container>
          <Spinner />
        </Container>
      ) : (
        <Container>
          <Row>
            <Col>
              <h1 className="mt-3 mb-4">Solicitudes de Gráficas</h1>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={10}>
              <div className="input-group">
                <Form.Control
                  type="text"
                  placeholder="Buscar por ID de la solicitud, ID o nombre del gerente y por descripcion del pedido"
                  value={searchRequest}
                  onChange={(e) => setSearchRequest(e.target.value)}
                />
                <Button 
                  variant="success" 
                  // onClick={handleSearchProject}
                >
                  Buscar
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <h3>Pendientes ({cantRequestPendiente})</h3>
              <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {renderRequestByStatus("P")}
              </div>
            </Col>
            <Col md={4}>
              <h3>Trabajando ({cantRequestTrabajando})</h3>
              <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {renderRequestByStatus("T")}
              </div>
            </Col>
            <Col md={4}>
              <h3>Completados ({cantRequestCompletado})</h3>
              <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {renderRequestByStatus("C")}
              </div>
            </Col>
          </Row>
        </Container>
      )}
      <ToastContainer />
    </Layout>
  );
};
