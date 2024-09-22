import { Container, Row, Col, Form } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import DatePicker from "react-datepicker";
import { formatterDate } from "../utils/formatters";
import { useCompanyStore } from "../store/companyStore";
import { CustomImage } from "../components/CustomImage";

export const ConsultCompanyPage = () => {

  const { company } = useCompanyStore();

  return (
    <Layout>
      <Container>
        <Row>
          <Col>
            <h1 className="mt-3 mb-4">
              Consultar Empresa
            </h1>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <CustomImage 
              imageData={company.logo_empresa}
              alt="Logo de la empresa"
              style={{ width: "100%", height: "auto" }}
              className="mb-2"
            />
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Nombre de la empresa</Form.Label>
              <Form.Control
                className="mb-3"
                disabled
                type="text"
                name="nombre_empresa"
                value={company.nombre_empresa}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>RNC de la empresa</Form.Label>
              <Form.Control
                className="mb-3"
                disabled
                type="text"
                name="rnc_empresa"
                value={company.rnc_empresa}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fecha de fundación</Form.Label>
              <br />
              <DatePicker
                value={
                  company.fecha_fundacion 
                    ? formatterDate(company.fecha_fundacion)
                    : undefined
                }
                required
                disabled
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="dd/mm/yyyy"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="mt-3">Dirección de la empresa</Form.Label>
              <Form.Control
                className="mb-3"
                disabled
                type="text"
                name="direccion_empresa"
                value={company.direccion_empresa}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Número telefónico</Form.Label>
              <Form.Control
                className="mb-3"
                disabled
                type="text"
                name="numero_telefonico"
                value={company.numero_telefonico}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                className="mb-3"
                disabled
                type="email"
                name="correo_empresa"
                value={company.correo_empresa}
              />
            </Form.Group>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};