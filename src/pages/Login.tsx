import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { 
  Container,
  Row, 
  Col, 
  Card, 
  Form, 
  Button,
  Image
} from 'react-bootstrap';
import { Background } from '../components/Background';
import { CustomAsterisk } from '../components/CustomAsterisk';
import "react-toastify/dist/ReactToastify.css";
import { sigbpsApi } from '../api/baseApi';
import { useCompanyStore } from '../store/companyStore';

export const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { onSetCompany } = useCompanyStore();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === '' || password === '') {
      toast.error('Todos los campos son requeridos');
    } else {
      sigbpsApi.post('/login', {
        username: username,
        password: password
      })
        .then((response) => {
          localStorage.setItem('accesToken', response.data.accessToken);
          localStorage.setItem('username', response.data.usuario.username);
          localStorage.setItem('id_usuario', response.data.usuario.id_usuario);

          if (response.data.usuario.id_rol === 2) {
            toast.success(`Bienvenido a ${response.data.empresa.nombre_empresa}`);
            setTimeout(() => {
              navigate('/');
            }, 2000);
            onSetCompany({ ...response.data.empresa });
          } else {
            toast.success('Bienvenido a SIG-BPS');
            setTimeout(() => {
              navigate('/');
            }, 2000);
          }
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
        });
    }
  };  
    
  const gotoForgetPassword = () => {
    navigate('/forget_password');
  };

  const gotoRegisterUser = () => {
    navigate('/register');
  };

  return (
    <Background> 
      <form onSubmit={handleLogin}>
        <Container fluid>
          <Row className='d-flex justify-content-center align-items-center'>
            <Col col='12'>
              <Card className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '480px' }}>
                <Card.Body className='p-5 w-100 d-flex flex-column'>
                  <Image 
                    src="/logo.jpg" 
                    alt="SIG-BPS" 
                    className="img-fluid" 
                    style={{ height: '250px', width: '250px' }}
                  />

                  <Form.Group className='mb-4 w-100'>
                    <Form.Label><CustomAsterisk/> Usuario</Form.Label>
                    <Form.Control 
                      type='text' 
                      size="lg"  
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4 w-100'>
                    <Form.Label><CustomAsterisk/> Contraseña</Form.Label>
                    <Form.Control 
                      type='password' 
                      size="lg"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Button 
                    size='lg' 
                    className="mb-2 w-100" 
                    type='submit'
                    variant='success'
                  >
                    Iniciar Sesión
                  </Button>

                  <Form.Text
                    className='text-center text-success mb-3'
                    style={{ cursor: 'pointer' }}
                    onClick={gotoForgetPassword}
                  >
                    ¿Ha olvidado su contraseña?
                  </Form.Text>

                  <Form.Text
                    className='text-center text-success'
                    style={{ cursor: 'pointer' }}
                    onClick={gotoRegisterUser}
                  >
                    ¿No tienes un usuario?, Crea uno
                  </Form.Text>
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
