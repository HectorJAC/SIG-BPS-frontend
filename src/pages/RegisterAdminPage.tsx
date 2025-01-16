import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { CustomAsterisk } from '../components/CustomAsterisk';
import "react-toastify/dist/ReactToastify.css";
import { sigbpsApi } from '../api/baseApi';
import { RegisterUserProps } from '../interfaces/registerUserInterface';
import { formatterDateToBackend } from '../utils/formatters';
import { Layout } from '../layout/Layout';

export const RegisterAdminPage = () => {
  const [registerUser, setRegisterUser] = useState<RegisterUserProps>({} as RegisterUserProps);

  console.log(registerUser);

  const handleCreateUser = () => {
    if (registerUser?.password !== registerUser?.repeatPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(registerUser.email!)) { 
      toast.error('El correo electrónico no es válido'); 
      return;
    };

    sigbpsApi.post('/usuarios/createUserAdmin', {
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
      .then((response) => {
        toast.success(`${response.data.message}`);
        setRegisterUser({
          username: '',
          password: '',
          repeatPassword: '',
          nombres: '',
          apellidos: '',
          cedula: 0,
          numero_telefono: 0,
          email: ''
        });
      })
      .catch((error) => {
        toast.error(error.response.data.message);
    });
  };

  return (
    <Layout>
        <Container>
          <Row>
            <Col>
              <h1 className="mt-3 mb-4">
                Crear Administrador
              </h1>
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
                  type='email'
                  value={registerUser?.email}
                  onChange={(e) => setRegisterUser({...registerUser, email: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button 
            size='lg' 
            className="mb-2 w-100" 
            variant='success'
            onClick={handleCreateUser}
          >
            Crear Administrador
          </Button>
        </Container>
      <ToastContainer />
    </Layout>
  );
}
