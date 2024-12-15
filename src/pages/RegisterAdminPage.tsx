import { useState } from 'react';
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
import { RegisterUserProps } from '../interfaces/registerUserInterface';
import { formatterDateToBackend } from '../utils/formatters';


export const RegisterAdminPage = () => {
  const [registerUser, setRegisterUser] = useState<RegisterUserProps>();
  const navigate = useNavigate();

  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerUser?.password !== registerUser?.repeatPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    };

    sigbpsApi.post('/usuarios/createUserClient', {
      username: registerUser?.username,
      password: registerUser?.password,
      id_rol: 1,
      nombres: registerUser?.nombres,
      apellidos: registerUser?.apellidos,
      cedula: registerUser?.cedula,
      numero_telefono: registerUser?.numero_telefono,
      email: registerUser?.email,
      fecha_insercion: formatterDateToBackend(new Date().toString()),
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
                Crear Administrador
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
                Crear Administrador
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </Form>
      <ToastContainer />
    </Background>
  );
}
