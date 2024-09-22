import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomButton } from "../components/CustomButton";
import { ActivateIcon, EditIcon, InactiveIcon } from "../utils/iconButtons";
import { sigbpsApi } from "../api/baseApi";
import { CompanyPaginatedProps } from "../interfaces/companyInteface";

export const CreateCompanyPage = () => {
  const [companies, setCompanies] = useState<CompanyPaginatedProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getAllCompanies = useCallback((pageNumber = 1) => {
    setIsLoading(true);
    sigbpsApi.get('/empresas/findAllCompany', {
      params: {
        estado: 'A',
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
                  >
                    Nueva Empresa
                  </Button>
                </Col>

                <Col md={9}>
                  <div className="input-group">
                    <Form.Control 
                      type="text" 
                      placeholder="Buscar Empresa" 
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
                        <th>Nombre Empresa</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        companies?.empresas.map((empresa) => (
                          <tr key={empresa.id_empresa}>
                            <td>{empresa.id_empresa}</td>
                            <td>{empresa.nombre_empresa}</td>
                            <td>{empresa.estado}</td>
                            <td>
                              <CustomButton
                                text='Editar'
                                placement='top'
                                icon={<EditIcon />}
                                color="success"
                                style={{marginRight: '10px'}}
                              />
                              {
                                empresa.estado === 'A'
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
