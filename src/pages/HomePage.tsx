import { Col, Container, Row, Image } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useUserStore } from "../store/userStore";
import { useEffect } from "react";
import { getUserById } from "../api/usuarios/getUserById";

export const HomePage = () => {
  const { onSetUser } = useUserStore();

  useEffect(() => {
    getUserById()
      .then((response) => {
        onSetUser(response);
      });
  }, []);

  return (
    <Layout>
      <Container className="mt-3 d-flex justify-content-center align-items-center">
        <Row>
          <Col md={24}>
            <Image 
              src="/logo.png" 
              alt="SIG-BPS" 
              className="img-fluid" 
              style={{ height: '500px', width: '500px' }}
            />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

