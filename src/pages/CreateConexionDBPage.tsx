import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { sigbpsApi } from "../api/baseApi";
import { ConexionDBCompanyProps } from "../interfaces/conexionDBInterface";
import { CustomAsterisk } from "../components/CustomAsterisk";
import { FaAngleLeft } from "react-icons/fa";
import { useConexionDBStore } from "../store/conexionDBStore";
import { useNavigate } from "react-router-dom";

interface EmpresaProps {
  id_empresa: number;
  nombre_empresa: string;
}

export const CreateConexionDBPage = () => {
  const navigate = useNavigate();
  const [conexion, setConexion] = useState<ConexionDBCompanyProps>({} as ConexionDBCompanyProps);
  const [isLoading, setIsLoading] = useState(false);
  const [empresas, setEmpresas] = useState<EmpresaProps[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number | null>(null);

  const { id_conexion_db, onResetConexionDB } = useConexionDBStore();

  useEffect(() => {
    sigbpsApi.get('/empresas/findAllCompanyWithoutPagination')
      .then((response) => {
        setEmpresas(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    sigbpsApi.get('conexion_db/getConexionDbById', {
      params: {
        id_conexion_db: id_conexion_db
      }
    })
      .then((response) => {
        setConexion(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [id_conexion_db]);

  const handleSelectEmpresa = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    setEmpresaSeleccionada(selectedId || null);
  };

  const handleCreateConexionDB = () => {
    if (
      !conexion.conexion_driver_library ||
      !conexion.conexion_driver_class ||
      !conexion.conexion_password ||
      !conexion.conexion_string ||
      !conexion.conexion_user ||
      !empresaSeleccionada
    ) {
      toast.error('Completar todos los campos');
    } else {
      sigbpsApi.post('/conexion_db/createConexionDb', {
        conexion_driver_library: conexion.conexion_driver_library,
        conexion_driver_class: conexion.conexion_driver_class,
        conexion_password: conexion.conexion_password,
        conexion_string: conexion.conexion_string,
        conexion_user: conexion.conexion_user,
        id_empresa: empresaSeleccionada,
        estado: 'A'
      })
      .then((response) => {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/register_company_connection');
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    };
  };

  const handleUpdateConexionDB = () => {
    if (
      !conexion.conexion_driver_library ||
      !conexion.conexion_driver_class ||
      !conexion.conexion_password ||
      !conexion.conexion_string ||
      !conexion.conexion_user ||
      !empresaSeleccionada
    ) {
      toast.error('Completar todos los campos');
    } else {
      sigbpsApi.post('/conexion_db/updateConexionDb', {
        conexion_driver_library: conexion.conexion_driver_library,
        conexion_driver_class: conexion.conexion_driver_class,
        conexion_password: conexion.conexion_password,
        conexion_string: conexion.conexion_string,
        conexion_user: conexion.conexion_user,
        id_empresa: empresaSeleccionada,
        estado: 'A'
      })
      .then((response) => {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/register_company_connection');
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    };
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
                    Crear Nueva Conexion a Base de Datos
                  </h1>
                </Col>
              </Row>

              <Row>
                <Col md={4} className='mb-3'>
                  <Form.Text
                    className='text-success'
                    style={{ cursor: 'pointer', fontSize: '1.3rem'}}
                    onClick={() => {
                      window.history.back();
                      onResetConexionDB();
                    }}
                  >
                    <FaAngleLeft/> Volver
                  </Form.Text>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> ID Conexion DB</Form.Label>
                    <Form.Control 
                      type='number'
                      disabled
                      value={conexion?.id_conexion_db}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Conexion Driver Library</Form.Label>
                    <Form.Control 
                      type='text'
                      value={conexion?.conexion_driver_library}
                      onChange={(e) => setConexion({...conexion, conexion_driver_library: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Conexion Driver Class</Form.Label>
                    <Form.Control 
                      type='text'
                      value={conexion?.conexion_driver_class}
                      onChange={(e) => setConexion({...conexion, conexion_driver_class: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Password DB</Form.Label>
                    <Form.Control 
                      type='text'
                      value={conexion?.conexion_password}
                      onChange={(e) => setConexion({...conexion, conexion_password: e.target.value})}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Empresa</Form.Label>
                    <Form.Select
                      onChange={handleSelectEmpresa}
                      value={empresaSeleccionada || conexion?.id_empresa}
                    >
                      <option value="">--Seleccione la empresa--</option>
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
                                    
                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Conexion String</Form.Label>
                    <Form.Control 
                      type='text'
                      value={conexion?.conexion_string}
                      onChange={(e) => setConexion({...conexion, conexion_string: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Usuario DB</Form.Label>
                    <Form.Control 
                      type='text'
                      value={conexion?.conexion_user}
                      onChange={(e) => setConexion({...conexion, conexion_user: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Estado</Form.Label>
                    <Form.Control 
                      type='text'
                      disabled
                      value={conexion?.estado}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button 
                size='lg' 
                className="mb-2 w-100" 
                variant='success'
                onClick={id_conexion_db ? handleUpdateConexionDB : handleCreateConexionDB}
              >
                { id_conexion_db ? 'Actualizar Conexion' : 'Crear Nueva Conexion' }
              </Button>
            </Container>
          )
      }
      <ToastContainer />
    </Layout>
  );
};
