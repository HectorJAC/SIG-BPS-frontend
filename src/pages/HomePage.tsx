import { Col, Container, Row, Image } from "react-bootstrap";
import { Layout } from "../layout/Layout";

export const HomePage = () => {
  return (
    <Layout>
      <Container className="mt-3 d-flex justify-content-center align-items-center">
        <Row>
          <Col md={24}>
            <Image 
              src="/logo.jpg" 
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

