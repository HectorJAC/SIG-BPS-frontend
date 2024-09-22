import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';

export const Footer = () => {
  return (
    <footer
      style={{
        marginTop: 'auto',
        position: 'inherit', 
        bottom: 0, 
        width: '100%' 
      }}
    >
      <Container>
        <Row>
          <Col>
            <p className="text-muted text-center">
              {"Copyright © "}
                Hector Arámboles, BPS&TEC{" "} 
              {new Date().getFullYear()}
              {"."}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
