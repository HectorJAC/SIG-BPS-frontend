import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomButton } from "../components/CustomButton";
import { ActivateIcon, EditIcon, InactiveIcon, ViewIcon } from "../utils/iconButtons";
import { sigbpsApi } from "../api/baseApi";
import { ConexionDBProps } from "../interfaces/conexionDBInterface";
import { useNavigate } from "react-router-dom";
import { ConexionDBModal } from "../components/ConexionDBModal";
import { useConexionDBStore } from "../store/conexionDBStore";

export const ConexionDBPage = () => {
  const navigate = useNavigate();
  const [conexions, setConexions] = useState<ConexionDBProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConexionModal, setShowConexionModal] = useState(false);
  const [selectedConexionDBId, setSelectedConexionDBId] = useState<number | null>(null);

  const { onAddConexionDB } = useConexionDBStore();

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
