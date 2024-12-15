import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { FC, useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomButton } from "../components/CustomButton";
import { EditIcon } from "../utils/iconButtons";
import { sigbpsApi } from "../api/baseApi";
import { UsersPaginatedProps } from "../interfaces/userInterface";
import { useNavigate } from "react-router-dom";
import { useUserDashboardStore } from "../store/userDashboardStore";

interface EmpresaProps {
  id_empresa: number;
  nombre_empresa: string;
}

export const AsignDashboardPage:FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UsersPaginatedProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [empresas, setEmpresas] = useState<EmpresaProps[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number | null>(null);
  const [searchUser, setSearchUser] = useState<string>('');
  const { onAddUserDashboard } = useUserDashboardStore();

  useEffect(() => {
    sigbpsApi.get('/empresas/findAllCompanyWithoutPagination')
      .then((response) => {
        setEmpresas(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []);

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

  const handleSelectEmpresa = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    setEmpresaSeleccionada(selectedId || null);
  };

  const handleSearchUser = () => {
    setIsLoading(true);
    if (searchUser === '') {
      getAllUsers();
      setIsLoading(false);  
    } else {
      sigbpsApi.get('/usuarios/searchUser', {
        params: {
          search: searchUser,
          estado: 'A'
        }
      })
        .then((response) => {
          setUsers(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
          setIsLoading(false);
      })
    };
  };

  const handleAsignDashboards = (id_user_dash:number) => {
    onAddUserDashboard(id_user_dash);
    navigate('/list_dashboards_users');
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
                    Asignar Dashboards a Gerentes
                  </h1>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={9}>
                  <div className="input-group">
                    <Form.Control 
                      type="text" 
                      placeholder="Buscar Usuario" 
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                    <Button 
                      variant="success" 
                      onClick={handleSearchUser}
                    >
                      Buscar
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <div className="input-group mb-3">
                  <Form.Select
                      onChange={handleSelectEmpresa}
                      value={empresaSeleccionada || ''} 
                    >
                      <option value="">--Seleccione la empresa--</option>
                      {
                        empresas?.map((empresa) => (
                          <option 
                            key={empresa.id_empresa} 
                            value={empresa.id_empresa}
                          >
                            {empresa.nombre_empresa}
                          </option>
                        ))
                      }
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
                        <th>Cantidad de Dashboards</th>
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
                            <td>
                              {
                                usuario.id_rol === 1
                                  ? 'Administrador'
                                  : 'Gerente'
                              }
                            </td>
                            <td>{usuario.nombre_empresa}</td>
                            <td>{usuario.cantidad_dashboards}</td>
                            <td>{usuario.estado}</td>
                            <td>
                              {
                                <CustomButton 
                                  text='Asignar Dashboard'
                                  placement='top'
                                  icon={<EditIcon />}
                                  color="success"
                                  onclick={() => handleAsignDashboards(usuario.id_usuario!)}
                                />
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
