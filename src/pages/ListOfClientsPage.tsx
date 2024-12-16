import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomButton } from "../components/CustomButton";
import { ViewIcon } from "../utils/iconButtons";
import { sigbpsApi } from "../api/baseApi";
import { UsersPaginatedProps } from "../interfaces/userInterface";
import { ConsultUserModal } from "../components/ConsultUserModal";

interface EmpresaProps {
  id_empresa: number;
  nombre_empresa: string;
}

export const ListOfClientsPage = () => {
  const [users, setUsers] = useState<UsersPaginatedProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [empresas, setEmpresas] = useState<EmpresaProps[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number | null>(null);
  const [searchUser, setSearchUser] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [idUserModal, setIdUserModal] = useState<number>();

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

  const handleSearchUser = (searchUser?: string) => {
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

  const handleSelectEmpresa = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    setEmpresaSeleccionada(selectedId || null);
    empresas.filter((empresa) => {
      if (empresa.id_empresa === selectedId) {
        handleSearchUser(empresa.nombre_empresa);
      } else {
        getAllUsers();
      };
    });
  };

  const handleShowConsultUserModal = (idUsuario: number) => {
    setShowModal(true);
    setIdUserModal(idUsuario);
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
                      placeholder="Buscar Usuario" 
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                    <Button 
                      variant="success" 
                      onClick={() => handleSearchUser()}
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
                            <td>{usuario.estado}</td>
                            <td>
                              {
                                <CustomButton 
                                  text='Consultar'
                                  placement='top'
                                  icon={<ViewIcon />}
                                  color="success"
                                  onclick={() => 
                                    handleShowConsultUserModal(usuario.id_usuario!)
                                  }
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

              <ConsultUserModal 
                showModal={showModal}
                setShowModal={setShowModal}
                idUsuario={idUserModal!}               
              />
            </Container>
          )
      }
      <ToastContainer />
    </Layout>
  );
};
