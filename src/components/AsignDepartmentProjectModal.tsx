import { Button, Col, Container, Form, Modal, Row, Spinner, Table } from "react-bootstrap";
import { CustomButton } from "../components/CustomButton";
import { EditIcon } from "../utils/iconButtons";
import { FC, useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useProjectStore, useEmployeeOrDepartmentSuccessStore } from "../store/projectStore";
import { planificaTechApi } from "../api/baseApi";
import { DepartmentsProps } from "../interfaces/departmentInterface";
import { useCompanyStore } from "../store/companyStore";
import { GerentesProps } from "../interfaces/gerenteInterface";
import { addDepartmentToProject } from "../api/proyectos/addDepartmentToProject";

interface AsignDepartmentProjectModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  onHide?: () => void;
}

export const AsignDepartmentProjectModal:FC<AsignDepartmentProjectModalProps> = ({
  showModal,
  setShowModal,
  onHide
}) => {
  const [departments, setDepartments] = useState<DepartmentsProps>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchDepartment, setSearchDepartment] = useState('');
  const [gerentes, setGerentes] = useState<GerentesProps>();

  const { id_proyecto } = useProjectStore();
  const { onAddingEmployeeDepartmentSuccess } = useEmployeeOrDepartmentSuccessStore();
  const { company } = useCompanyStore();

  const getAllDepartments = useCallback((pageNumber = 1) => {
    if (company.id_empresa === undefined) {
      return;
    } else {
      setIsLoading(true);
      planificaTechApi.get('/departamentos/getDepartamentos', {
        params: {
          id_empresa: company.id_empresa,
          estado: 'ACTIVO',
          page: pageNumber,
          limit: 7
        }
      })
        .then((response) => {
          setDepartments(response.data);
          setCurrentPage(pageNumber);
          setTotalPages(response.data.totalPages);
          setIsLoading(false);
          return;
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [company.id_empresa]);

  useEffect(() => {
    getAllDepartments(1)
  }, [getAllDepartments]);

  useEffect(() => {
    planificaTechApi.get('/gerentes/getGerentesByCompany', {
      params: {
        id_empresa: company.id_empresa
      }
    })
      .then((response) => {
        setGerentes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [showModal, company.id_empresa]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getAllDepartments(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getAllDepartments(currentPage + 1);
    }
  };

  const addDepartmentProject = (id_departamento: number, id_proyecto:number) => {
    addDepartmentToProject(id_proyecto, id_departamento)
      .then((response) => {
        toast.success(response.message);
        onAddingEmployeeDepartmentSuccess();
        setShowModal(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleSearchDepartment = () => {
    setIsLoading(true);
    if (searchDepartment === '') {
      getAllDepartments();
    } else {
      planificaTechApi.get(`/departamentos/searchDepartment`, {
        params: {
          search: searchDepartment,
          id_empresa: company.id_empresa,
          estado: 'ACTIVO'
        }
      })
        .then((response) => {
          setDepartments(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          setIsLoading(false);
        })
    }
  };

  return (
    <Modal show={showModal} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        Buscar Departamento
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={10} className="mb-5">
            <div className="input-group">
              <Form.Control 
                type="text" 
                placeholder="Buscar Departamento" 
                value={searchDepartment}
                onChange={(e) => setSearchDepartment(e.target.value)}
              />
              <Button 
                variant="primary" 
                onClick={handleSearchDepartment}
              >
                Buscar
              </Button>
            </div>
          </Col>
        </Row>

        {
          isLoading && 
            <Container>
              <Spinner />
            </Container>
        }

        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Departamento</th>
                  <th>Descripción</th>
                  <th>Presupuesto</th>
                  <th>Gerente</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  departments?.departments.map((department) => (
                    <tr key={department.id_departamento}>
                      <td>{department.id_departamento}</td>
                      <td>{department.nombre_departamento}</td>
                      <td>{department.descripcion_departamento}</td>
                      <td>{department.presupuesto_asignado}</td>
                      <td>
                        {
                          gerentes?.managers.map((gerente) => (
                            department.id_gerente === gerente.id_gerente ? (
                              gerente.nombres + ' ' + gerente.apellidos
                            ) : null
                          ))
                        }
                      </td>
                      <td>{department.estado}</td>
                      <td>
                        <CustomButton
                          text='Asignar a Proyecto'
                          placement='top' 
                          icon={<EditIcon />}
                          color="primary"
                          style={{marginRight: '10px'}}
                          onclick={() => addDepartmentProject(department.id_departamento!, id_proyecto)}
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

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  )
};