import { Col, Container, Row } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { useEffect, useState } from "react";
import { sigbpsApi } from "../api/baseApi";
import { DashboardUserDataProps } from "../interfaces/dashboardUserDataInterface";
import { getIdUser } from "../utils/getLocalStorageData";

export const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardUserDataProps[]>([]);

  useEffect(() => {
    sigbpsApi.get('/dashboard_kibana/getDashboardKibanaByUser', {
      params: {
        id_usuario: Number(getIdUser())
      }
    })
    .then((response) => {
      setDashboardData(response.data);
    })
    .catch((error) => {
      console.log(error);
    })
  }, []);

  return (
    <Layout>
      <Container className="mt-3 d-flex justify-content-center align-items-center">
        <Row>
          <Col md={24}>
            {
              dashboardData.map((dashboard) => (
                <div key={dashboard.id_usuario_dashboard}>
                  <h3>{dashboard.nombre_dashboard}</h3>
                  <iframe
                    src={dashboard.dashboard_source}
                    height={700}
                    width={1200}
                  ></iframe>
                </div>
              ))
            }
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

