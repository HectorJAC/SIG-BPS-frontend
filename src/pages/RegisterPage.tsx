import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { 
  Container,
  Row, 
  Col, 
  Card, 
  Form, 
  Button
} from 'react-bootstrap';
import { FaAngleLeft } from "react-icons/fa6";
import { Background } from '../components/Background';
import { CustomAsterisk } from '../components/CustomAsterisk';
import "react-toastify/dist/ReactToastify.css";
import { sigbpsApi } from '../api/baseApi';
import { CustomTooltip } from '../components/CustomTooltip';
import { RegisterUserProps } from '../interfaces/registerUserInterface';
import { FaRegCircleQuestion } from "react-icons/fa6";

interface EmpresaProps {
  id_empresa: number;
  nombre_empresa: string;
}

export const RegisterPage = () => {
  const [registerUser, setRegisterUser] = useState<RegisterUserProps>();
  const [empresas, setEmpresas] = useState<EmpresaProps[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    sigbpsApi.get('/empresas/findAllCompanyWithoutPagination')
      .then((response) => {
        setEmpresas(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []);

  const handleSelectEmpresa = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    setEmpresaSeleccionada(selectedId || null);
  };

  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerUser?.password !== registerUser?.repeatPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    };

    if (!empresaSeleccionada) {
      toast.error('Seleccione una empresa');
      return;
    };

    console.log(registerUser);

    sigbpsApi.post('/usuarios/createUserClient', {
      username: registerUser?.username,
      password: registerUser?.password,
      id_rol: 2,
      nombres: registerUser?.nombres,
      apellidos: registerUser?.apellidos,
      cedula: registerUser?.cedula,
      numero_telefono: registerUser?.numero_telefono,
      email: registerUser?.email,
      id_empresa: empresaSeleccionada,
      estado: 'A'
    })
      .then(() => {
        toast.success('Usuario creado con exito');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
    });
  };

  const gotoLogin = () => {
    navigate('/login');
  };

  return (
    <Background> 
      <Form onSubmit={handleCreateUser}>
        <Container fluid>
          <Card className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '1000px' }}>
            <Card.Body className='p-5 d-flex flex-column'>
              <h1 className='text-center mb-4'>
                Crear Usuario
              </h1>

              <Col md={4} className='mb-3'>
                <Form.Text
                  className='text-success'
                  style={{ cursor: 'pointer', fontSize: '1.3rem'}}
                  onClick={gotoLogin}
                >
                  <FaAngleLeft/> Volver
                </Form.Text>
              </Col>

              <Row>
                <Col md={12}>
                  <Form.Group className='mb-4'>
                      <CustomTooltip 
                        text='Si no se muestra su empresa contacte con el administrador' 
                        placement='top'
                        isButton={false}
                      >
                        <Form.Label>
                          <CustomAsterisk/> Empresa <FaRegCircleQuestion />
                        </Form.Label>
                      </CustomTooltip>
                    <Form.Select
                      onChange={handleSelectEmpresa}
                      value={empresaSeleccionada || ''}
                    >
                      <option value="">--Seleccione su empresa--</option>
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
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Usuario</Form.Label>
                    <Form.Control 
                      type='text'
                      value={registerUser?.username}
                      onChange={(e) => setRegisterUser({...registerUser, username: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Repita la Contraseña</Form.Label>
                    <Form.Control 
                      type='password'
                      value={registerUser?.repeatPassword}
                      onChange={(e) => setRegisterUser({...registerUser, repeatPassword: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Nombres</Form.Label>
                    <Form.Control 
                      type='text'
                      value={registerUser?.nombres}
                      onChange={(e) => setRegisterUser({...registerUser, nombres: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label>Numero Telefonico</Form.Label>
                    <Form.Control 
                      type='number'
                      value={registerUser?.numero_telefono}
                      onChange={(e) => setRegisterUser({...registerUser, numero_telefono: Number(e.target.value)})}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Contraseña</Form.Label>
                    <Form.Control 
                      type='password'
                      value={registerUser?.password}
                      onChange={(e) => setRegisterUser({...registerUser, password: e.target.value})}
                    />
                  </Form.Group>
                                    
                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Cedula</Form.Label>
                    <Form.Control 
                      type='number'
                      value={registerUser?.cedula}
                      onChange={(e) => setRegisterUser({...registerUser, cedula: Number(e.target.value)})} 
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Apellidos</Form.Label>
                    <Form.Control 
                      type='text'
                      value={registerUser?.apellidos}
                      onChange={(e) => setRegisterUser({...registerUser, apellidos: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Correo Electronico</Form.Label>
                    <Form.Control 
                      type='text'
                      value={registerUser?.email}
                      onChange={(e) => setRegisterUser({...registerUser, email: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button size='lg' className="mb-2 w-100" type='submit' variant='success'>
                Crear Usuario
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </Form>
      <ToastContainer />
    </Background>
  );
}
