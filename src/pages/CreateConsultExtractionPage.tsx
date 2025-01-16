import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { sigbpsApi } from "../api/baseApi";
import { CustomAsterisk } from "../components/CustomAsterisk";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CustomTitle } from "../components/CustomTitle";
import { useConsultaExtraccionStore } from "../store/consultaExtractionStore";
import { ConsultExtractionDataProps } from "../interfaces/consultExtractionInterface";
import { ConexionElasticProps } from "../interfaces/conexionElasticInterface";
import { CustomTooltip } from "../components/CustomTooltip";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { formatterDateToBackend } from "../utils/formatters";
import { useUserStore } from "../store/userStore";
import { showState } from "../utils/showState";

interface ConexionDBProps {
  id_conexion_db: number;
  nombre_conexion_db: string;
}

export const CreateConsultExtractionPage = () => {
  const navigate = useNavigate();
  const [consulta, setConsulta] = useState<ConsultExtractionDataProps>({} as ConsultExtractionDataProps);
  const [isLoading, setIsLoading] = useState(false);
  const [conexionDB, setConexionDB] = useState<ConexionDBProps[]>([]);
  const [conexionDBSeleccionada, setConexionDBSeleccionada] = useState<number | null>(null);
  const [conexionElastic, setConexionElastic] = useState<ConexionElasticProps[]>([]);
  const [conexionElasticSeleccionada, setConexionElasticSeleccionada] = useState<number | null>(null);

  const { id_consulta_extraccion, onResetConsultaExtraccion, editPage, onResetEditPage } = useConsultaExtraccionStore();
  const { user } = useUserStore();

  const titlePage = () => {
    if (id_consulta_extraccion !== 0 && editPage === false) {
      return 'Consultar Query Extraccion';
    };
    if (id_consulta_extraccion !== 0 && editPage === true) {
      return 'Editar Consulta Extraccion';
    };
    if (id_consulta_extraccion === 0 && editPage === true) {
      return 'Crear Nueva Consulta de Extracción';
    };
  }

  useEffect(() => {
    sigbpsApi.get('/conexion_db/getConexionDBData')
      .then((response) => {
        setConexionDB(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []);

  useEffect(() => {
    sigbpsApi.get('/conexion_elastic/getAllElasticConnections')
      .then((response) => {
        setConexionElastic(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    sigbpsApi.get('consulta_extraccion/getConsultaExtraccionById', {
      params: {
        id_consulta_extraccion: id_consulta_extraccion
      }
    })
      .then((response) => {
        setConsulta(response.data);
        setIsLoading(false); 
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [id_consulta_extraccion]);

  const handleSelectConexionDB = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    setConexionDBSeleccionada(selectedId || null);
  };

  const handleSelectConexionElastic = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    setConexionElasticSeleccionada(selectedId || null);
  };

  const handleCreateConsultaExtraction = () => {
    console.log('data_stream', consulta?.data_stream);
    console.log('use_columns_value', consulta?.use_columns_value);
    if (
      !conexionDBSeleccionada ||
      !consulta?.consulta_data ||
      !consulta?.transformacion_data ||
      !consulta?.index_data ||
      !consulta?.type ||
      !consulta?.tracking_columns ||
      !conexionElasticSeleccionada
    ) {
      toast.error('Completar todos los campos');
    } else {
      sigbpsApi.post('/consulta_extraccion/createConsultaExtraction', {
        id_conexion_db: conexionDBSeleccionada,
        consulta_data: consulta.consulta_data,
        transformacion_data: consulta.transformacion_data,
        index_data: consulta.index_data,
        data_stream: 'false',
        use_columns_value: 'true',
        type: consulta.type,
        tracking_columns: consulta.tracking_columns,
        id_conexion_elastic: conexionElasticSeleccionada,
        usuario_insercion: user.id_usuario,
        fecha_insercion: formatterDateToBackend(new Date().toString()),
        estado: 'A'
      })
      .then((response) => {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/consult_extraction');
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    };
  };

  const handleUpdateConsultaExtraction = () => {
    if (
      !consulta?.id_conexion_db ||
      !consulta?.consulta_data ||
      !consulta?.transformacion_data ||
      !consulta?.index_data ||
      !consulta?.type ||
      !consulta?.tracking_columns ||
      !consulta?.id_conexion_elastic ||
      !consulta?.usuario_insercion ||
      !consulta?.fecha_insercion
    ) {
      toast.error('Completar todos los campos');
    } else {
      sigbpsApi.put('/consulta_extraccion/updateConsultaExtraction', {
        id_consulta_extraccion: consulta.id_consulta_extraccion,
        id_conexion_db: conexionDBSeleccionada || consulta.id_conexion_db,
        consulta_data: consulta.consulta_data,
        transformacion_data: consulta.transformacion_data,
        index_data: consulta.index_data,
        data_stream: 'false',
        use_columns_value: 'true',
        type: consulta.type,
        tracking_columns: consulta.tracking_columns,
        id_conexion_elastic: conexionElasticSeleccionada || consulta.id_conexion_elastic,
        usuario_actualizacion: user.id_usuario,
        fecha_actualizacion: formatterDateToBackend(new Date().toString()),
        estado: 'A'
      })
      .then((response) => {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/consult_extraction');
        }, 2000);
        onResetConsultaExtraccion();
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
                  <CustomTitle 
                    title={titlePage() as string}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={4} className='mb-3'>
                  <Form.Text
                    className='text-success'
                    style={{ cursor: 'pointer', fontSize: '1.3rem'}}
                    onClick={() => {
                      window.history.back();
                      onResetConsultaExtraccion();
                      onResetEditPage();
                    }}
                  >
                    <FaAngleLeft/> Volver
                  </Form.Text>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> ID</Form.Label>
                    <Form.Control 
                      type='number'
                      disabled
                      value={consulta?.id_consulta_extraccion}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label>
                      <CustomTooltip
                        text="Conexión de la Base de Datos de Origen"
                        placement="top"
                        isButton={false}
                      >
                        <CustomAsterisk/> Conexion DB <FaRegCircleQuestion />
                      </CustomTooltip>
                    </Form.Label>
                    <Form.Select
                      onChange={handleSelectConexionDB}
                      value={conexionDBSeleccionada || consulta?.id_conexion_db}
                      disabled={editPage === false}
                    >
                      <option value="">--Seleccione la empresa--</option>
                      {
                        conexionDB?.map((cdb) => (
                          <option 
                            key={cdb.id_conexion_db} 
                            value={cdb.id_conexion_db}
                          >
                            {cdb.nombre_conexion_db}
                          </option>
                        ))
                      }
                    </Form.Select>
                  </Form.Group>     
                </Col>

                <Col md={12}>
                  <Form.Group className='mb-4'>
                    <Form.Label>
                      <CustomTooltip
                        text="Consulta SQL de extracción de datos"
                        placement="top"
                        isButton={false}
                      >
                        <CustomAsterisk/> Consulta SQL <FaRegCircleQuestion />
                      </CustomTooltip>
                    </Form.Label>
                    <textarea 
                      className='form-control' 
                      rows={10} 
                      value={consulta?.consulta_data}
                      onChange={(e) => setConsulta({ ...consulta, consulta_data: e.target.value })}
                      disabled={editPage === false}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className='mb-4'>
                    <Form.Label>
                      <CustomTooltip
                        text="Transformación de los datos a extraer"
                        placement="top"
                        isButton={false}
                      >
                        <CustomAsterisk/> Transformacion Data <FaRegCircleQuestion />
                      </CustomTooltip>
                    </Form.Label>
                    <textarea 
                      className='form-control' 
                      rows={10} 
                      value={consulta?.transformacion_data}
                      onChange={(e) => setConsulta({ ...consulta, transformacion_data: e.target.value })}
                      disabled={editPage === false}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label>
                      <CustomTooltip
                        text="Id del indice de datos en Elastic Search"
                        placement="top"
                        isButton={false}
                      >
                        <CustomAsterisk/> Index Data <FaRegCircleQuestion />
                      </CustomTooltip>
                    </Form.Label>
                    <Form.Control 
                      type='text'
                      value={consulta?.index_data}
                      onChange={(e) => setConsulta({ ...consulta, index_data: e.target.value })}
                      disabled={editPage === false}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label>
                      <CustomTooltip
                        text="Indica si los datos a extraer son de tipo log o similares"
                        placement="top"
                        isButton={false}
                      >
                        <CustomAsterisk/> Data Stream <FaRegCircleQuestion />
                      </CustomTooltip>
                    </Form.Label>
                    <Form.Control
                      defaultValue={
                        id_consulta_extraccion 
                          ? consulta?.data_stream 
                          : 'false'
                      }
                      value={consulta?.data_stream}
                      disabled
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label>
                      <CustomTooltip
                        text="Tomar el cuenta el primary key de la columna"
                        placement="top"
                        isButton={false}
                      >
                        <CustomAsterisk/> Use Columns Value <FaRegCircleQuestion />
                      </CustomTooltip>
                    </Form.Label>
                    <Form.Control
                      defaultValue={
                        id_consulta_extraccion 
                          ? consulta?.use_columns_value 
                          : 'true'
                      }
                      value={consulta?.use_columns_value}
                      disabled
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label>
                      <CustomTooltip
                        text="Nombre de la tabla a extraer"
                        placement="top"
                        isButton={false}
                      >
                        <CustomAsterisk/> Type <FaRegCircleQuestion />
                      </CustomTooltip>
                    </Form.Label>
                    <Form.Control 
                      type='text'
                      value={consulta?.type}
                      onChange={(e) => setConsulta({ ...consulta, type: e.target.value })}
                      disabled={editPage === false}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label>
                      <CustomTooltip
                        text="Primary key de la tabla a extraer"
                        placement="top"
                        isButton={false}
                      >
                        <CustomAsterisk/> Tracking Columns <FaRegCircleQuestion />
                      </CustomTooltip>
                    </Form.Label>
                    <Form.Control 
                      type='text'
                      value={consulta?.tracking_columns}
                      onChange={(e) => setConsulta({ ...consulta, tracking_columns: e.target.value })}
                      disabled={editPage === false}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label>
                      <CustomTooltip
                        text="Conexión IP de Elastic Search"
                        placement="top"
                        isButton={false}
                      >
                        <CustomAsterisk/> Conexion Elastic <FaRegCircleQuestion />
                      </CustomTooltip>
                    </Form.Label>
                    <Form.Select
                      onChange={handleSelectConexionElastic}
                      value={conexionElasticSeleccionada || consulta?.id_conexion_elastic}
                      disabled={editPage === false}
                    >
                      <option value="">--Seleccione la conexion Elastic Search--</option>
                      {
                        conexionElastic?.map((ces) => (
                          <option 
                            key={ces.id_conexion_elastic} 
                            value={ces.id_conexion_elastic}
                          >
                            {ces.hosts_elastic}
                          </option>
                        ))
                      }
                    </Form.Select>
                  </Form.Group>     
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Usuario Insercion</Form.Label>
                    <Form.Control 
                      type='text'
                      disabled
                      value={consulta?.usuario_insercion}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Fecha Insercion</Form.Label>
                    <Form.Control 
                      type='text'
                      disabled
                      value={consulta?.fecha_insercion}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label>Usuario Actualizacion</Form.Label>
                    <Form.Control 
                      type='text'
                      disabled
                      value={consulta?.usuario_actualizacion}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label>Fecha Actualizacion</Form.Label>
                    <Form.Control 
                      type='text'
                      disabled
                      value={consulta?.fecha_actualizacion}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-4'>
                    <Form.Label><CustomAsterisk/> Estado</Form.Label>
                    <Form.Control 
                      type='text'
                      disabled
                      value={showState(consulta?.estado)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {
                editPage === true
                ? (
                  <Button 
                    size='lg' 
                    className="mb-2 w-100" 
                    variant='success'
                    onClick={id_consulta_extraccion ? handleUpdateConsultaExtraction : handleCreateConsultaExtraction}
                  >
                    { id_consulta_extraccion ? 'Actualizar Consulta' : 'Crear Consulta' }
                  </Button>
                )
                : (
                  null
                )
              }
            </Container>
          )
      }
      <ToastContainer />
    </Layout>
  );
};
