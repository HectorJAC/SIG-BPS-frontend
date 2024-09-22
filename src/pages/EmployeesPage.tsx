import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { CustomButton } from "../components/CustomButton";
import { formatterDate } from "../utils/formatters";
import { Spinner } from "../components/Spinner";
import { EditIcon, ViewIcon } from "../utils/iconButtons";
import { getEmployees } from "../api/empleados/getAllEmployee";
import { EmployeesProps } from "../interfaces/employeeInterface";
import { useNavigate } from "react-router-dom";
import { EmployeesModal } from "../components/EmployeesModal";
import { planificaTechApi } from "../api/baseApi";
import { handleDataNull } from "../utils/handleDataNull";
import { useEmployeesStore } from "../store/employeesStore";
import { useCompanyStore } from "../store/companyStore";

export const EmployeesPage = () => {
  const navigate = useNavigate();
  const [searchEmployee, setSearchEmployee] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<EmployeesProps>();
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { company } = useCompanyStore();
  const { onAddEmployee } = useEmployeesStore();

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

  const handleShowModal = (id_empleado: number) => {
    setSelectedEmployeeId(id_empleado);
    setShowModal(true);
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

  return (
    <Layout>
      {isLoading ? (
        <Container><Spinner /></Container>
      ) : (
        <Container>
          <Row>
            <Col><h1 className="mt-3 mb-4">Todos los Empleados</h1></Col>
          </Row>
          <Row>
            <Col md={2}>
              <Button 
                variant="primary" 
                style={{ marginBottom: '20px', marginLeft: '20px' }}
                onClick={() => navigate('/create_employee')}
              >
                Crear Empleado
              </Button>
            </Col>
            <Col md={10}>
              <div className="input-group">
                <Form.Control 
                  type="text" 
                  placeholder="Buscar por Cedula o Nombre del Empleado" 
                  value={searchEmployee}
                  onChange={(e) => setSearchEmployee(e.target.value)}
                />
                <Button variant="primary" onClick={handleSearchEmployee}>Buscar</Button>
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
                          text='Editar'
                          placement='top' 
                          onclick={() => {
                            navigate('/create_employee')
                            onAddEmployee(employee.id_empleado!)
                          }}
                          icon={<EditIcon />}
                          color="primary"
                          style={{marginRight: '10px'}}
                        />
                        <CustomButton
                          text='Consultar'
                          placement='top' 
                          onclick={() => handleShowModal(employee.id_empleado!)}
                          icon={<ViewIcon />}
                          color="primary"
                          style={{marginRight: '10px'}}
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
          <EmployeesModal 
            showModal={showModal}
            setShowModal={setShowModal}
            idEmpleado={selectedEmployeeId?.toString() || ''}
          />
        </Container>
      )}
      <ToastContainer />
    </Layout>
  );
};
