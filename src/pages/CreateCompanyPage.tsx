import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomButton } from "../components/CustomButton";
import { ActivateIcon, EditIcon, InactiveIcon } from "../utils/iconButtons";
import { sigbpsApi } from "../api/baseApi";
import { CompanyPaginatedProps } from "../interfaces/companyInteface";
import { CompanyModal } from "../components/CompanyModal";
import { CustomBasicModal } from "../components/CustomBasicModal";
import { formatterDate, formatterDateToBackend } from "../utils/formatters";
import { useUserStore } from "../store/userStore";
import { useCompanyStore } from "../store/companyStore";

export const CreateCompanyPage = () => {
  const [companies, setCompanies] = useState<CompanyPaginatedProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [idEmpresa, setIdEmpresa] = useState<number>();
  const [showAIModal, setShowAIModal] = useState(false);
  const [stateCompany, setStateCompany] = useState<string>('');
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [searchCompany, setSearchCompany] = useState<string>('');
  const { user } = useUserStore();
  const { createCompanySuccess } = useCompanyStore();

  const stateComplete = 
    stateCompany === 'A' 
      ? 'Activar' 
      : 'Inactivar';

  const getAllCompanies = useCallback((pageNumber = 1, estado = 'A') => {
    setIsLoading(true);
    sigbpsApi.get('/empresas/findAllCompany', {
      params: {
        estado,
        page: pageNumber,
        limit: 5
      }
    })
      .then((response) => {
        setCompanies(response.data);
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
    getAllCompanies();
  }, [getAllCompanies]);

  useEffect(() => {
    if (createCompanySuccess === true) {
      getAllCompanies();
    }
  }, [createCompanySuccess]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllCompanies(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllCompanies(currentPage + 1);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIdEmpresa(undefined);
  };

  const handleCloseAIModal = () => {
    setShowAIModal(false);
    setIdEmpresa(undefined);
  };

  const handleChangeStateCompany = (idEmpresa: number, estado: string) => {
    sigbpsApi.put('/empresas/changeStateCompany', {
      id_empresa: idEmpresa,
      usuario_actualizacion: user.id_usuario,
      fecha_actualizacion: formatterDateToBackend(new Date().toString()),
      estado
    })
      .then((response) => {
        toast.success(response.data.message);
        getAllCompanies();
        setShowAIModal(false);
        setIdEmpresa(undefined);
        setIsCheckboxChecked(false);
      })
      .catch((error) => {
        toast.error(`${error.response.data.message}`);
        getAllCompanies();
        setShowAIModal(false);
        setIdEmpresa(undefined);
        setIsCheckboxChecked(false);
      });
  };

  const handleInactiveCompanies = () => {
    getAllCompanies(1, isCheckboxChecked ? 'A' : 'I');
  };

  const handleSearchCompany = () => {
    setIsLoading(true);
    if (searchCompany === '') {
      getAllCompanies();
      setIsLoading(false);  
    } else {
      sigbpsApi.get('/empresas/searchCompany', {
        params: {
          search: searchCompany,
          estado: isCheckboxChecked ? 'I' : 'A'
        }
      })
        .then((response) => {
          setCompanies(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
          setIsLoading(false);
      })
    };
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
                    Crear Empresas
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
                    onClick={() => setShowModal(true)}
                  >
                    Nueva Empresa
                  </Button>
                </Col>

                <Col md={9}>
                  <div className="input-group">
                    <Form.Control 
                      type="text" 
                      placeholder="Buscar Empresa" 
                      value={searchCompany}
                      onChange={(e) => setSearchCompany(e.target.value)}
                    />
                    <Button 
                      variant="success" 
                      onClick={handleSearchCompany}
                    >
                      Buscar
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form>
                    <Form.Group controlId="formBasicCheckbox">
                      <Form.Check 
                        type="checkbox" 
                        label="Empresas Inactivas"
                        checked={isCheckboxChecked}
                        onChange={
                          () => {
                            setIsCheckboxChecked(!isCheckboxChecked);
                            handleInactiveCompanies();
                          }
                        }
                      />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>RNC</th>
                        <th>Nombre Empresa</th>
                        <th>Telefono</th>
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
                        companies?.empresas.map((empresa) => (
                          <tr key={empresa.id_empresa}>
                            <td>{empresa.id_empresa}</td>
                            <td>{empresa.rnc_empresa}</td>
                            <td>{empresa.nombre_empresa}</td>
                            <td>{empresa.telefono_empresa}</td>
                            <td>{empresa.usuario_insercion}</td>
                            <td>
                              {
                                empresa.fecha_insercion
                                  ? formatterDate(empresa?.fecha_insercion)
                                  : null
                              }
                            </td>
                            <td>{empresa.usuario_actualizacion}</td>
                            <td>
                              {
                                empresa.fecha_actualizacion
                                  ? formatterDate(empresa?.fecha_actualizacion)
                                  : null
                              }
                            </td>
                            <td>{empresa.estado}</td>
                            <td>
                              <CustomButton
                                text='Editar'
                                placement='top'
                                icon={<EditIcon />}
                                color="success"
                                style={{marginRight: '10px'}}
                                onclick={() => {
                                  setIdEmpresa(empresa.id_empresa);
                                  setShowModal(true);
                                }}
                              />
                              {
                                empresa.estado === 'A'
                                  ? (
                                    <CustomButton 
                                      text='Inactivar'
                                      placement='top'
                                      icon={<InactiveIcon />}
                                      color="danger"
                                      onclick={() => {
                                        setIdEmpresa(empresa.id_empresa);
                                        setStateCompany('I');
                                        setShowAIModal(true);
                                      }}
                                    />
                                  )
                                  : (
                                    <CustomButton 
                                      text='Activar'
                                      placement='top'
                                      icon={<ActivateIcon />}
                                      color="primary"
                                      onclick={() => {
                                        setIdEmpresa(empresa.id_empresa);
                                        setStateCompany('A');
                                        setShowAIModal(true);
                                      }}
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

              <CompanyModal 
                showModal={showModal} 
                setShowModal={handleCloseModal}
                idEmpresa={idEmpresa}
              />

              <CustomBasicModal 
                title={`${stateComplete} Empresa`}
                body={
                  `¿Está seguro que desea ${stateComplete} esta empresa?`
                }
                secondaryButton="Cancelar"
                primaryButton="Aceptar"
                showModal={showAIModal}
                setShowModal={handleCloseAIModal}
                onClick={() => handleChangeStateCompany(idEmpresa!, stateCompany)}
              />
            </Container>
          )
      }
      <ToastContainer />
    </Layout>
  );
};
