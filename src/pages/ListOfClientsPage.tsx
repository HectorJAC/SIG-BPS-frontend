import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomButton } from "../components/CustomButton";
import { ActivateIcon, InactiveIcon } from "../utils/iconButtons";
import { sigbpsApi } from "../api/baseApi";
import { UsersPaginatedProps } from "../interfaces/userInterface";

export const ListOfClientsPage = () => {
  const [users, setUsers] = useState<UsersPaginatedProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getAllUsers = useCallback((pageNumber = 1) => {
    setIsLoading(true);
    sigbpsApi.get('/usuarios/getAllUsers', {
      params: {
        estado: 'A',
        page: pageNumber,
        limit: 5
      }
    })
      .then((response) => {
        setUsers(response.data);
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
    getAllUsers();
  }, [getAllUsers]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllUsers(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllUsers(currentPage + 1);
    }
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
                    Listado de Clientes
                  </h1>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={9}>
                  <div className="input-group">
                    <Form.Control 
                      type="text" 
                      placeholder="Buscar Cliente" 
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
                <Col md={4}>
                  <div className="input-group mb-3">
                    <Form.Select>
                      <option value="0">Seleccione una Empresa</option>
                    </Form.Select>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Cedula</th>
                        <th>Nombre</th>
                        <th>Rol</th>
                        <th>Empresa</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        users?.usuarios?.map((usuario) => (
                          <tr key={usuario.id_usuario}>
                            <td>{usuario.id_usuario}</td>
                            <td>{usuario.username}</td>
                            <td>{usuario.cedula}</td>
                            <td>{usuario.nombres} {usuario.apellidos}</td>
                            <td>{usuario.rol}</td>
                            <td>{usuario.nombre_empresa}</td>
                            <td>{usuario.estado}</td>
                            <td>
                              {
                                usuario.estado === 'A'
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
