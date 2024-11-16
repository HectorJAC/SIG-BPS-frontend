import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { CustomAsterisk } from "../components/CustomAsterisk";
import { useNavigate } from "react-router-dom";
import { CustomBasicModal } from "../components/CustomBasicModal";
import { DepartmentsProps } from "../interfaces/departmentInterface";
import axios from "axios";
import { PuestoProps } from "../interfaces/puestosInterface";
import { EmployeeProps } from "../interfaces/employeeInterface";
import { planificaTechApi } from "../api/baseApi";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getIdUser } from "../utils/getLocalStorageData";
import { useEmployeesStore } from "../store/conexionDBStore";
import { useCompanyStore } from "../store/companyStore";
import { getUserById } from "../api/usuarios/getUserById";
import { UserProps } from "../interfaces/userInterface";
import { GerenteProps } from "../interfaces/gerenteInterface";

export const CreateEmployeePage = () => {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [departments, setDepartments] = useState<DepartmentsProps>();
  const [puestos, setPuestos] = useState<PuestoProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({} as EmployeeProps);
  const [employeeIsCreated, setEmployeeIsCreated] = useState(false);
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const [gerente, setGerente] = useState<GerenteProps>({} as GerenteProps);

  const { id_empleado, onResetEmployee } = useEmployeesStore();
  const { company } = useCompanyStore();

  useEffect(() => {
    getUserById()
      .then((response) => {
        setUser(response);
      })
  }, []);

  useEffect(() => {
    planificaTechApi.get('/gerentes/getGerenteByUserId', {
      params: {
        id_usuario: getIdUser()
      }
    })
      .then((response) => {
        setGerente(response.data);
      })
  }, []);

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

  useEffect(() => {
    if (id_empleado) {
      planificaTechApi.get('/empleados/getEmployeeById', {
        params: {
          id_empleado: id_empleado
        }
      })
        .then((response) => {
          setEmployeeData(response.data);
        })
    }
  }, [id_empleado]);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/puestos/getPuestos`)
      .then((response) => {
        setPuestos(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  const goBack = () => {
    onResetEmployee();
    navigate('/list_employees');
  };

  const handleDateEnterChange = (date:any) => {
    if (date !== null) {
      setEmployeeData(prevState => ({
        ...prevState,
        fecha_ingreso_empresa: date
      }));
    } else {
      toast.info('Ingrese una fecha')
    }
  };

  const handleBirthDateChange = (date:any) => {
    if (date !== null) {
      setEmployeeData(prevState => ({
        ...prevState,
        fecha_nacimiento: date
      }));
    } else {
      toast.info('Ingrese una fecha')
    }
  };

  const handleCreateEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    planificaTechApi.post('/empleados/createEmployee', {
      nombres: employeeData.nombres,
      apellidos: employeeData.apellidos,
      cedula: employeeData.cedula,
      fecha_ingreso_empresa: employeeData.fecha_ingreso_empresa,
      sexo: employeeData.sexo,
      fecha_nacimiento: employeeData.fecha_nacimiento,
      lugar_nacimiento: employeeData.lugar_nacimiento,
      direccion_residencia: employeeData.direccion_residencia,
      estado_civil: employeeData.estado_civil,
      numero_telefonico: employeeData.numero_telefonico,
      nivel_academico: employeeData.nivel_academico,
      correo: employeeData.correo,
      salario: employeeData.salario,
      id_departamento: employeeData.id_departamento,
      id_puesto: employeeData.id_puesto,
      id_empresa: company.id_empresa,
      id_usuario_creacion: Number(getIdUser()),
      estado: 'ACTIVO',
    })
      .then(() => {
        toast.success('Empleado creado exitosamente');
        setEmployeeIsCreated(true);
        setTimeout(() => {
          navigate('/list_employees');
        }, 2000)
      })
      .catch(() => {
        toast.error('Error al crear el empleado');
      });
  };

  const handleUpdateEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    planificaTechApi.put('/empleados/updateEmployee', {
      id_empleado: employeeData.id_empleado,
      nombres: employeeData.nombres,
      apellidos: employeeData.apellidos,
      cedula: employeeData.cedula,
      fecha_ingreso_empresa: employeeData.fecha_ingreso_empresa,
      sexo: employeeData.sexo,
      fecha_nacimiento: employeeData.fecha_nacimiento,
      lugar_nacimiento: employeeData.lugar_nacimiento,
      direccion_residencia: employeeData.direccion_residencia,
      estado_civil: employeeData.estado_civil,
      numero_telefonico: employeeData.numero_telefonico,
      nivel_academico: employeeData.nivel_academico,
      correo: employeeData.correo,
      salario: employeeData.salario,
      id_departamento: employeeData.id_departamento,
      id_puesto: employeeData.id_puesto,
      id_empresa: company.id_empresa,
      id_usuario_actualizacion: Number(getIdUser()),
      estado: 'ACTIVO',
    })
      .then(() => {
        toast.success('Empleado actualizado exitosamente');
        setEmployeeIsCreated(true);
        setTimeout(() => {
          navigate('/list_employees');
        }, 2000)
      })
      .catch(() => {
        toast.error('Error al actualizar el empleado');
      });
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
            <Form onSubmit={
              employeeData.id_empleado
                ? handleUpdateEmployee
                : handleCreateEmployee
            } style={{width: '100%'}}>
              <Container fluid>
                <Row>
                  <Col>
                    <h1 className="mt-3 mb-4">
                      {
                        employeeData.id_empleado
                          ? `Editar Empleado: ${employeeData.nombres} ${employeeData.apellidos}`
                          : 'Crear Empleado'
                      }
                    </h1>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className='mb-4'>
                      <Form.Label><CustomAsterisk/> Id Empleado</Form.Label>
                      <Form.Control 
                        type='text'
                        disabled
                        value={employeeData.id_empleado}
                      />
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label><CustomAsterisk/> Nombres</Form.Label>
                      <Form.Control 
                        type='text'
                        value={employeeData.nombres}
                        onChange={(e) => setEmployeeData(prevState => ({ ...prevState, nombres: e.target.value }))} 
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label><CustomAsterisk/> Fecha de Nacimiento</Form.Label>
                      <br />
                      <DatePicker
                        selected={
                          employeeData.fecha_nacimiento 
                            ? new Date(employeeData.fecha_nacimiento)
                            : null
                        }
                        required
                        onChange={handleBirthDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="dd/mm/yyyy"
                        customInput={
                          <Form.Control 
                            type="text"
                            required
                            value={employeeData.fecha_nacimiento}
                            onChange={handleBirthDateChange}
                          />
                        }
                      />
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label><CustomAsterisk/> Correo</Form.Label>
                      <Form.Control 
                        type='email'
                        required
                        value={employeeData.correo}
                        onChange={(e) => setEmployeeData(prevState => ({ ...prevState, correo: e.target.value }))}
                      />
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label> Nivel Academico</Form.Label>
                      <Form.Select
                        value={employeeData.nivel_academico}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setEmployeeData(prevState => ({ ...prevState, nivel_academico: e.target.value }))}
                      >
                        <option value="">--Seleccione una opcion--</option>
                        <option value="Primario">Primario</option>
                        <option value="Secundario">Secundario(Bachillerato)</option>
                        <option value="Universitario">Universitario</option>
                        <option value="Profesional">Profesional</option>
                        <option value="Diplomado">Diplomado</option>
                        <option value="Certificacion">Certificación</option>
                        <option value="Maestria">Maestría</option>
                        <option value="Doctorado">Doctorado</option>
                        <option value="Postgrado">Postgrado</option>
                        <option value="Tecnico">Técnico</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label><CustomAsterisk/> Salario</Form.Label>
                      <Form.Control 
                        type='number'
                        required
                        value={employeeData.salario}
                        onChange={(e) => setEmployeeData(prevState => ({ ...prevState, salario: e.target.value }))}
                      />
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label>Estado</Form.Label>
                      <Form.Control 
                        type='text'
                        disabled
                        value={employeeData.estado}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className='mb-4'>
                      <Form.Label><CustomAsterisk/> Cedula</Form.Label>
                      <Form.Control 
                        type='number'
                        required
                        value={employeeData.cedula}
                        onChange={(e) => setEmployeeData(prevState => ({ ...prevState, cedula: Number(e.target.value) }))}
                      />
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label><CustomAsterisk/> Apellidos</Form.Label>
                      <Form.Control 
                        type='text'
                        required
                        value={employeeData.apellidos}
                        onChange={(e) => setEmployeeData(prevState => ({ ...prevState, apellidos: e.target.value }))}
                      />
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label><CustomAsterisk/> Lugar de Nacimiento</Form.Label>
                      <Form.Control 
                        type='text'
                        required
                        value={employeeData.lugar_nacimiento}
                        onChange={(e) => setEmployeeData(prevState => ({ ...prevState, lugar_nacimiento: e.target.value }))}
                      />
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label><CustomAsterisk/> Numero Telefonico</Form.Label>
                      <Form.Control 
                        type='number'
                        required
                        value={employeeData.numero_telefonico}
                        onChange={(e) => setEmployeeData(prevState => ({ ...prevState, numero_telefonico: e.target.value }))}
                      />
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label> Departamento</Form.Label>
                      <Form.Select
                        value={employeeData.id_departamento}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setEmployeeData(prevState => ({ ...prevState, id_departamento: Number(e.target.value) }))}
                      >
                        <option value="">--Seleccione una opcion--</option>
                        {
                          user.tipo_usuario === '1'
                            ? (
                              departments?.departments?.map((department) => (
                                <option key={department.id_departamento} value={department.id_departamento}>
                                  {department.nombre_departamento}
                                </option>
                              ))
                            )
                            : (
                              departments?.departments?.filter((department) => department.id_gerente === gerente.id_gerente)
                                .map((department) => (
                                  <option key={department.id_departamento} value={department.id_departamento}>
                                    {department.nombre_departamento}
                                  </option>
                                ))
                            )
                        }
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label>Usuario Creacion</Form.Label>
                      <Form.Control 
                        type='text'
                        disabled
                        value={employeeData.usuario_creacion}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-4">
                      <Form.Label><CustomAsterisk/> Fecha Entrada Empresa</Form.Label>
                      <br />
                      <DatePicker
                        selected={
                          employeeData.fecha_ingreso_empresa 
                            ? new Date(employeeData.fecha_ingreso_empresa)
                            : null
                        }
                        required
                        onChange={handleDateEnterChange}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="dd/mm/yyyy"
                        customInput={
                          <Form.Control 
                            type="text"
                            required
                            value={employeeData.fecha_ingreso_empresa}
                            onChange={handleDateEnterChange}
                          />
                        }
                      />
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label><CustomAsterisk/> Sexo</Form.Label>
                      <Form.Select
                        required
                        value={employeeData.sexo}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setEmployeeData(prevState => ({ ...prevState, sexo: e.target.value }))}
                      >
                        <option value="">--Seleccione una opcion--</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label><CustomAsterisk/> Direccion Residencia</Form.Label>
                      <Form.Control 
                        required
                        type='text'
                        value={employeeData.direccion_residencia}
                        onChange={(e) => setEmployeeData(prevState => ({ ...prevState, direccion_residencia: e.target.value }))}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Estado Civil</Form.Label>
                      <Form.Select 
                        value={employeeData.estado_civil}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setEmployeeData(prevState => ({ ...prevState, estado_civil: e.target.value }))}
                      >
                        <option value="">--Seleccione una opcion--</option>
                        <option value="Soltero(a)">Soltero(a)</option>
                        <option value="Casado(a)">Casado(a)</option>
                        <option value="Viudo(a)">Viudo(a)</option>
                        <option value="Union Libre">Unión Libre</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label><CustomAsterisk/> Puesto</Form.Label>
                      <Form.Select
                        required
                        value={employeeData.id_puesto}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setEmployeeData(prevState => ({ ...prevState, id_puesto: Number(e.target.value) }))}
                      >
                        <option value="">--Seleccione una opcion--</option>
                        {
                          puestos.map((puesto) => (
                            <option key={puesto.id_puesto} value={puesto.id_puesto}>
                              {puesto.nombre_puesto}
                            </option>
                          ))
                        }
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className='mb-4'>
                      <Form.Label>Usuario Actualizacion</Form.Label>
                      <Form.Control 
                        type='text'
                        disabled
                        value={employeeData.usuario_actualizacion}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-5">
                  <Col md={4}>
                    <Button
                      variant="danger"
                      onClick={() => setShowCancelModal(true)}
                      disabled={employeeIsCreated}
                    >
                    Cancelar
                    </Button>
                  </Col>

                  <Col md={4}/>

                  <Col md={4}>
                    <Button 
                      type="submit"
                      variant="primary"
                      disabled={employeeIsCreated}
                    >
                      {employeeData.id_empleado ? 'Actualizar' : 'Crear'}
                    </Button>
                  </Col>
                </Row>

                <CustomBasicModal 
                  title="Cancelar Operación"
                  body="¿Desea volver atras? Se perderán los datos ingresados."
                  secondaryButton="Cancelar"
                  primaryButton="Aceptar"
                  showModal={showCancelModal}
                  setShowModal={() => setShowCancelModal(false)}
                  onClick={goBack}
                />
              </Container>
            </Form>
          )
      }
      <ToastContainer />
    </Layout>
  );
};