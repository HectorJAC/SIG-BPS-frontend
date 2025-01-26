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

export const ForgetPasswordPage = () => {
    
  const [username, setUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');

  const navigate = useNavigate();

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === '' || newPassword === '' || repeatPassword === '') {
      toast.error('Todos los campos son requeridos');
    } else if (newPassword !== repeatPassword) {
      toast.error('Las contraseñas no coinciden');
    } else {
      sigbpsApi.put('forget_password', {
        username: username,
        password: newPassword
      })
        .then((response) => {
          if (response.data.usuario.estado === 'I') {
            toast.error(response.data.message);
            return;
          };

          if (response.data.usuario.estado === 'A') {
            toast.success(`${response.data.message}`);
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          };
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
        });
    } 
  };       
    
  const gotoLogin = () => {
    navigate('/login');
  };

  return (
    <Background> 
      <form onSubmit={handleChangePassword}>
        <Container fluid>
          <Row className='d-flex justify-content-center align-items-center'>
            <Col col='12'>
              <Card className='bg-white my-3 mx-auto' style={{ borderRadius: '1rem', maxWidth: '480px' }}>
                <Card.Body className='p-5 w-100 d-flex flex-column'>
                  <img 
                    src="/logo.png" 
                    alt="SIG-BPS" 
                    className="img-fluid" 
                    style={{ height: '250px', width: '400px' }}
                  />

                  <Form.Text
                    className='text-success mb-4'
                    style={{ cursor: 'pointer' }}
                    onClick={gotoLogin}
                  >
                    <FaAngleLeft/> Volver
                  </Form.Text>

                  <Form.Group className='mb-4 w-100'>
                    <Form.Label><CustomAsterisk/> Ingrese su Usuario</Form.Label>
                    <Form.Control 
                      type='text' 
                      size="lg" 
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4 w-100'>
                    <Form.Label><CustomAsterisk/> Ingrese la Nueva Contraseña</Form.Label>
                    <Form.Control 
                      type='password' 
                      size="lg" 
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4 w-100'>
                    <Form.Label><CustomAsterisk/> Repita la Nueva Contraseña</Form.Label>
                    <Form.Control 
                      type='password' 
                      size="lg" 
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Button size='lg' className="mb-2 w-100" type='submit' variant='success'>
                    Cambiar Contraseña
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </form>
      <ToastContainer />
    </Background>
  );
}
