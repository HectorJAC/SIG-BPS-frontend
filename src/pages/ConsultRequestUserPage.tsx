import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomButton } from "../components/CustomButton";
import { DeleteIcon } from "../utils/iconButtons";
import { sigbpsApi } from "../api/baseApi";
import { RequestPaginatedProps } from "../interfaces/requestInterface";
import { formatterDate } from "../utils/formatters";
import { CustomBasicModal } from "../components/CustomBasicModal";
import { showRequestState } from "../utils/showRequestState";

export const ConsultRequestUserPage = () => {
  const [requests, setRequests] = useState<RequestPaginatedProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [requestId, setRequestId] = useState<number>(0);

  const getAllPedidosUser = useCallback((pageNumber = 1) => {
    setIsLoading(true);
    sigbpsApi.get('/pedidos/getAllPedidosByUser', {
      params: {
        page: pageNumber,
        limit: 6,
        id_usuario: localStorage.getItem('id_usuario'),
        estado: 'A'
      }
    })
      .then((response) => {
        setRequests(response.data);
        setCurrentPage(pageNumber);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
        return;
      })
      .catch(() => {
        setIsLoading(false);
        setRequests({} as RequestPaginatedProps);
      });
  }, []);

  useEffect(() => {
    getAllPedidosUser();
  }, [getAllPedidosUser]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllPedidosUser(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllPedidosUser(currentPage + 1);
    }
  };

  const deletePedido = (id_usuario_pedido: number) => {
    sigbpsApi.put('/pedidos/deletePedido', {
      id_usuario_pedido
    })
      .then((response) => {
        toast.success(response.data.message);
        getAllPedidosUser();
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
                  <h1 className="mt-3 mb-4">
                    Lista de Solicitudes de Gráficas Creadas
                  </h1>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={9}>
                  <div className="input-group">
                    <Form.Control 
                      type="text" 
                      placeholder="Buscar Solicitud" 
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
                        <th>Descripcion Solicitud</th>
                        <th>Fecha Solicitud</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        requests?.pedidosUser?.map((pedido) => (
                          <tr key={pedido.id_usuario_pedido}>
                            <td>{pedido.id_usuario_pedido}</td>
                            <td>{pedido.descripcion_pedido}</td>
                            <td>{formatterDate(pedido.fecha_pedido)}</td>
                            <td>{showRequestState(pedido.estado_pedido)}</td>
                            <td>
                              <CustomButton
                                text='Eliminar'
                                disabled={pedido.estado_pedido !== 'P'}
                                placement='top'
                                icon={<DeleteIcon />}
                                color="danger"
                                style={{marginRight: '10px'}}
                                onclick={() => {
                                  setShowModal(true);
                                  setRequestId(pedido.id_usuario_pedido!);
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
          )
      }
      <CustomBasicModal
        title="Eliminar Solicitud"
        body="¿Desea eliminar esta solicitud?"
        secondaryButton="Cancelar"
        primaryButton="Aceptar"
        showModal={showModal}
        setShowModal={() => setShowModal(false)}
        onClick={() => {
          deletePedido(requestId)
          setShowModal(false)
        }}
      />
      <ToastContainer />
    </Layout>
  );
};
