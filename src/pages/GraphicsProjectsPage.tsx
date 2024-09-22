import { useEffect, useState } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js/auto";
import { BarChart } from "../components/charts/BarChart";
import { Layout } from "../layout/Layout";
import { useCompanyStore } from "../store/companyStore";
import { getUniqueRandomColor } from "../utils/dataGraphs";
import { cantProyectosEstado } from "../api/graficas/proyectos/cantProyectosEstado";
import { GraphicsProps } from "../interfaces/graphicsInterface";
import { cantTareasEstado } from "../api/graficas/proyectos/cantTareasEstado";

Chart.register(CategoryScale);

export const GraphicsProjectsPage = () => {

  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "",
        data: [] as number[],
        backgroundColor: "",
      }
    ],
  });

  const [chartDataTareas, setChartDataTareas] = useState<GraphicsProps>({...chartData});
  const { company } = useCompanyStore();

  useEffect(() => {
    cantProyectosEstado(company.id_empresa!)
      .then((data) => {
        const usedColors = new Set<string>();
        const colors = data?.datasets[0]?.data.map(() => getUniqueRandomColor(usedColors)) || [];
        if (data) {
          setChartData({
            labels: data.labels,
            datasets: [
              {
                label: "Cant. proyectos",
                data: data.datasets[0].data,
                backgroundColor: colors,
              }
            ],
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [company.id_empresa]);

  useEffect(() => {
    cantTareasEstado()
      .then((data) => {
        const usedColors = new Set<string>();
        const colors = data?.datasets[0]?.data.map(() => getUniqueRandomColor(usedColors)) || [];
        if (data) {
          setChartDataTareas({
            labels: data.labels,
            datasets: [
              {
                label: "Cant. tareas",
                data: data.datasets[0].data,
                backgroundColor: colors,
              }
            ],
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [company.id_empresa]);

  return (
    <Layout>
      <Container className="mt-3">

        <Row>
          <Col>
            <h1 className="mt-3 mb-4">
              Gráficas de Proyectos
            </h1>
          </Col>
        </Row>

        <Row>
          <Col className="mb-3">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header className="sidebar-header">Cantidad de Proyectos por Estado</Accordion.Header>
                <Accordion.Body>
                  <BarChart 
                    title="Cantidad de proyectos por estado"
                    chartData={{
                      labels: chartData.labels,
                      datasets: chartData.datasets.map(dataset => ({
                        label: dataset.label,
                        data: dataset.data,
                        backgroundColor: dataset.backgroundColor as unknown as string[],
                      })),
                    }} 
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        <Row>
          <Col className="mb-3">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header className="sidebar-header">Cantidad de Tareas por Estado</Accordion.Header>
                <Accordion.Body>
                  <BarChart 
                    title="Cantidad de tareas por estado"
                    chartData={{
                      labels: chartDataTareas.labels,
                      datasets: chartDataTareas.datasets.map(dataset => ({
                        label: dataset.label,
                        data: dataset.data,
                        backgroundColor: dataset.backgroundColor as unknown as string[],
                      })),
                    }} 
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

      </Container>
    </Layout>
  );
};
