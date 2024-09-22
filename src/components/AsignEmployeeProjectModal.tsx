import { Button, Col, Container, Form, Modal, Row, Spinner, Table } from "react-bootstrap";
import { CustomButton } from "../components/CustomButton";
import { EditIcon } from "../utils/iconButtons";
import { formatterDate } from "../utils/formatters";
import { getEmployees } from "../api/empleados/getAllEmployee";
import { EmployeesProps } from "../interfaces/employeeInterface";
import { handleDataNull } from "../utils/handleDataNull";
import { FC, useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useProjectStore, useEmployeeOrDepartmentSuccessStore } from "../store/projectStore";
import { addEmployeeToProject } from "../api/proyectos/addEmployeeToProject";
import { planificaTechApi } from "../api/baseApi";
import { useCompanyStore } from "../store/companyStore";

interface AsignEmployeeProjectModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  onHide?: () => void;
}

export const AsignEmployeeProjectModal:FC<AsignEmployeeProjectModalProps> = ({
  showModal,
  setShowModal,
  onHide
}) => {
  const [employees, setEmployees] = useState<EmployeesProps>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchEmployee, setSearchEmployee] = useState('');

  const { company} = useCompanyStore();
  const { id_proyecto } = useProjectStore();
  const { onAddingEmployeeDepartmentSuccess } = useEmployeeOrDepartmentSuccessStore();

  const allEmployee = useCallback((pageNumber = 1) => {
    setIsLoading(true);
    getEmployees(pageNumber, 7, company.id_empresa!)
      .then((response) => {
        setEmployees(response);
        setCurrentPage(pageNumber);
        setTotalPages(response.totalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [company.id_empresa]);

  useEffect(() => {
    allEmployee(1);
  }, [allEmployee]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      allEmployee(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      allEmployee(currentPage + 1);
    }
  };

  const addEmployeeProject = (id_empleado: number, id_proyecto:number) => {
    addEmployeeToProject(id_proyecto, id_empleado)
      .then((response) => {
        toast.success(response.message);
        onAddingEmployeeDepartmentSuccess();
        setShowModal(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleSearchEmployee = () => {
    setIsLoading(true);
    if (searchEmployee === '') {
      allEmployee(1);
    } else {
      planificaTechApi.get(`/empleados/searchEmployee`, {
        params: { search: searchEmployee }
      })
        .then((response) => {
          setEmployees(response.data);
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
        Buscar Empleado
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={10} className="mb-5">
            <div className="input-group">
              <Form.Control 
                type="text" 
                placeholder="Buscar por Cedula o Nombre del Empleado" 
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
              />
              <Button 
                variant="primary" 
                onClick={handleSearchEmployee}
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
                  <th>Cedula</th>
                  <th>Nombre</th>
                  <th>Departamento</th>
                  <th>Fecha Entrada Empresa</th>
                  <th>Usuario Creacion</th>
                  <th>Usuario Actualizacion</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {employees?.employees.map((employee) => (
                  <tr key={employee.id_empleado}>
                    <td>{employee.cedula}</td>
                    <td>{employee.nombres} {employee.apellidos}</td>
                    <td>{employee.nombre_departamento}</td>
                    <td>{formatterDate(employee.fecha_ingreso_empresa)}</td>
                    <td>{employee.usuario_creacion}</td>
                    <td>{handleDataNull(employee.usuario_actualizacion)}</td>
                    <td>{employee.estado}</td>
                    <td style={{display: 'flex'}}>
                      <CustomButton
                        text='Asignar a Proyecto'
                        placement='top' 
                        icon={<EditIcon />}
                        color="primary"
                        style={{marginRight: '10px'}}
                        onclick={() => addEmployeeProject(employee.id_empleado!, id_proyecto)}
                      />
                    </td>
                  </tr>
                ))}
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