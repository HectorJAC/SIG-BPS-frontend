import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { CustomButton } from "../components/CustomButton";
import axios from "axios";
import { Spinner } from "../components/Spinner";
import { GerentesProps } from "../interfaces/gerenteInterface";
import { ViewIcon } from "../utils/iconButtons";
import { DepartmentsProps } from "../interfaces/departmentInterface";
import { GerentesModal } from "../components/GerentesModal";
import { useCompanyStore } from "../store/companyStore";
import { planificaTechApi } from "../api/baseApi";

export const GerentesPage = () => {
  const [gerentes, setGerentes] = useState<GerentesProps>();
  const [searchGerente, setSearchGerente] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<DepartmentsProps>();
  const [selectedGerenteId, setSelectedGerenteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { company } = useCompanyStore();

  const getAllDepartments = useCallback(() => {
    if (company.id_empresa === undefined) {
      return;
    } else {
      setIsLoading(true);
      axios.get(`${import.meta.env.VITE_API_URL}/departamentos/getDepartamentos`, {
        params: {
          id_empresa: company.id_empresa,
          estado: 'ACTIVO'
        }
      })
        .then((response) => {
          setDepartments(response.data);
          setIsLoading(false);
          return;
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [company.id_empresa]);

  useEffect(getAllDepartments, [getAllDepartments]);

  const getAllGerentes = useCallback((pageNumber = 1) => {
    setIsLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/gerentes/getGerentesByCompany`, {
      params: {
        id_empresa: company.id_empresa,
        page: pageNumber,
        limit: 7
      }
    })
      .then((response) => {
        setGerentes(response.data);
        setCurrentPage(pageNumber);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [company.id_empresa]);

  useEffect(() => {
    getAllGerentes(1)
  }, [getAllGerentes]);

  const handleShowModal = (id_gerente: number) => {
    setSelectedGerenteId(id_gerente);
    setShowModal(true);
  };

  const handleSearchGerente = () => {
    setIsLoading(true);
    if (searchGerente === '') {
      getAllGerentes();
    } else {
      planificaTechApi.get(`/gerentes/searchGerentes`, {
        params: {
          search: searchGerente,
          id_empresa: company.id_empresa
        }
      })
        .then((response) => {
          setGerentes(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          setIsLoading(false);
        })
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllGerentes(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllGerentes(currentPage + 1);
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
                    Listado de Gerentes
                  </h1>
                </Col>
              </Row>

              <Row
                className="mb-3"
              >
                <Col md={10}>
                  <div className="input-group">
                    <Form.Control 
                      type="text" 
                      placeholder="Buscar por Nombre del Gerente" 
                      value={searchGerente}
                      onChange={(e) => setSearchGerente(e.target.value)}
                    />
                    <Button 
                      variant="primary" 
                      onClick={handleSearchGerente}
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
                        <th>Cedula</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Número Telefonico</th>
                        <th>Departamento Asignado</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        gerentes?.managers.map((gerente) => (
                          <tr key={gerente.id_gerente}>
                            <td>{gerente.cedula}</td>
                            <td>{gerente.nombres} {gerente.apellidos}</td>
                            <td>{gerente.correo}</td>
                            <td>{gerente.numero_telefonico}</td>
                            {
                              departments?.departments.map((department) => {
                                if (gerente.id_gerente === department.id_gerente) {
                                  return (
                                    <td key={department.id_gerente}>
                                      {department.nombre_departamento}
                                    </td>
                                  );
                                }
                              })
                            }
                            <td>{gerente.estado}</td>
                            <td>
                              <CustomButton 
                                text='Ver'
                                placement='top'
                                icon={<ViewIcon />}
                                onclick={() => handleShowModal(gerente.id_gerente!)}
                                color="primary"    
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

              <GerentesModal 
                showModal={showModal}
                setShowModal={setShowModal}
                idGerente={selectedGerenteId?.toString() || ''}
              />

            </Container>
          )
      }
      <ToastContainer />
    </Layout>
  );
};