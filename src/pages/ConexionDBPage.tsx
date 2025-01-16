import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomButton } from "../components/CustomButton";
import { ActivateIcon, EditIcon, InactiveIcon, ViewIcon } from "../utils/iconButtons";
import { sigbpsApi } from "../api/baseApi";
import { ConexionDBProps } from "../interfaces/conexionDBInterface";
import { useNavigate } from "react-router-dom";
import { ConexionDBModal } from "../components/ConexionDBModal";
import { useConexionDBStore } from "../store/conexionDBStore";

interface EmpresaProps {
  id_empresa: number;
  nombre_empresa: string;
}

export const ConexionDBPage = () => {
  const navigate = useNavigate();
  const [conexions, setConexions] = useState<ConexionDBProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConexionModal, setShowConexionModal] = useState(false);
  const [selectedConexionDBId, setSelectedConexionDBId] = useState<number | null>(null);
  const [searchConexion, seatSearchConexion] = useState<string>('');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number | null>(null);
  const [empresas, setEmpresas] = useState<EmpresaProps[]>([]);

  const { onAddConexionDB } = useConexionDBStore();

  useEffect(() => {
    sigbpsApi.get('/empresas/findAllCompanyWithoutPagination')
      .then((response) => {
        setEmpresas(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []);

  const getAllConexions = useCallback((pageNumber = 1) => {
    setIsLoading(true);
    sigbpsApi.get('/conexion_db/getAllConexionDb', {
      params: {
        page: pageNumber,
        limit: 5
      }
    })
      .then((response) => {
        setConexions(response.data);
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
    getAllConexions();
  }, [getAllConexions]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllConexions(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllConexions(currentPage + 1);
    }
  };

  const handleShowConexionModal = (id_conexion_db:number) => {
    setSelectedConexionDBId(id_conexion_db);
    setShowConexionModal(true);
  };

  const handleEditConexion = (id_conexion_db:number) => {
    onAddConexionDB(id_conexion_db);
    navigate('/create_connection_db');
  };

  const handleSearchConexion = (searchConexionParameter?: string) => {
    setIsLoading(true);
    if (searchConexion === '' && searchConexionParameter === undefined) {
      getAllConexions();
      setIsLoading(false);  
    } else {
      sigbpsApi.get('/conexion_db/searchConexionDb', {
        params: {
          search: searchConexion || searchConexionParameter,
          estado: 'A'
        }
      })
        .then((response) => {
          setConexions(response.data);
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
  
    const empresaSeleccionada = empresas.find(
      (empresa) => empresa.id_empresa === selectedId
    );
  
    if (empresaSeleccionada) {
      handleSearchConexion(empresaSeleccionada.nombre_empresa);
    } else {
      getAllConexions();
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
                    Conexiones a Base de Datos de Clientes
                  </h1>
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
                    onClick={() => navigate('/create_connection_db')}
                  >
                    Nueva Conexion
                  </Button>
                </Col>

                <Col md={9}>
                  <div className="input-group">
                    <Form.Control 
                      type="text" 
                      placeholder="Buscar Conexion a Base de Datos" 
                      value={searchConexion}
                      onChange={(e) => seatSearchConexion(e.target.value)}
                    />
                    <Button 
                      variant="success" 
                      onClick={() => handleSearchConexion()}
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
                        <th>Nombre Conexion</th>
                        <th>Empresa</th>
                        <th>Usuario DB</th>
                        <th>Password DB</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        conexions?.conexions.map((conexion) => (
                          <tr key={conexion.id_conexion_db}>
                            <td>{conexion.id_conexion_db}</td>
                            <td>{conexion.nombre_conexion_db}</td>
                            <td>{conexion.nombre_empresa}</td>
                            <td>{conexion.conexion_user}</td>
                            <td>{conexion.conexion_password}</td>
                            <td>{conexion.estado}</td>
                            <td>
                              <CustomButton
                                text='Consultar'
                                placement='top'
                                icon={<ViewIcon />}
                                color="success"
                                style={{marginRight: '10px'}}
                                onclick={() => handleShowConexionModal(conexion.id_conexion_db!)}
                              />
                              <CustomButton
                                text='Editar'
                                placement='top'
                                icon={<EditIcon />}
                                color="success"
                                style={{marginRight: '10px'}}
                                onclick={() => handleEditConexion(conexion.id_conexion_db!)}
                              />
                              {
                                conexion.estado === 'A'
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

              <ConexionDBModal 
                showModal={showConexionModal}
                setShowModal={setShowConexionModal}
                idConexionDB={selectedConexionDBId?.toString() || ''}
              />
            </Container>
          )
      }
      <ToastContainer />
    </Layout>
  );
};
