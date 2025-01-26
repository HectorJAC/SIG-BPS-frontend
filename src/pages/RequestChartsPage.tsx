import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useState } from "react";
import { CustomBasicModal } from "../components/CustomBasicModal";
import { sigbpsApi } from "../api/baseApi";
import { ToastContainer, toast } from "react-toastify";
import { getIdUser } from "../utils/getLocalStorageData";
import { formatterDateToBackend } from "../utils/formatters";

export const RequestChartsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [descRequest, setDescRequest] = useState<string>('');

  const handleSendRequest = () => {
    sigbpsApi.post('/pedidos/createPedido', {
      descripcion_pedido: descRequest,
      id_usuario: getIdUser(),
      fecha_pedido: formatterDateToBackend(new Date().toString())
    })
      .then((response) => {
        setShowModal(false);
        setDescRequest('');
        toast.success(response.data.message);
      })
      .catch((error) => {
        setShowModal(false);
        toast.error(`${error.response.data.message}`);
      });
  };

  return (
    <Layout>
      <Container>
        <Row>
          <Col>
            <h1 className="mt-3 mb-4">
              Solicitar Gráficos
            </h1>
          </Col>
        </Row>

        <Row>
          <Col>
            <h2>Digite los datos de los gráficos que requiere</h2>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form>
              <textarea
                onChange={(e) => setDescRequest(e.target.value)}
                value={descRequest}
                className="form-control mb-2" 
                placeholder="Solicitud" 
                rows={10}
                style={{
                  borderRadius: '10px',
                  border: '5px solid #ced4da'
                }}
              ></textarea>
            </Form>
          </Col>
        </Row>

        <Row>
          <Col md={8} />
          <Col md={4}>
            <Button 
              size='lg' 
              className="mb-2 w-100"
              variant='success'
              onClick={() => setShowModal(true)}
            >
              Enviar Solicitud
            </Button>
          </Col>
        </Row>
      </Container>

      <CustomBasicModal
        title="Enviar Solicitud"
        body="¿Desea enviar la solicitud con los datos ingresados?"
        secondaryButton="Cancelar"
        primaryButton="Aceptar"
        showModal={showModal}
        setShowModal={() => setShowModal(false)}
        onClick={handleSendRequest}
      />
      <ToastContainer />
    </Layout>
  );
};
