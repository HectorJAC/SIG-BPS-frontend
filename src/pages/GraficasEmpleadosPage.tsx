import { useEffect, useState } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js/auto";
import { BarChart } from "../components/charts/BarChart";
import { Layout } from "../layout/Layout";
import { useCompanyStore } from "../store/companyStore";
import { cantEmpleadosPuestos } from '../api/graficas/empleados/cantEmpleadosPuestos';
import { cantEmpleadosSexo } from "../api/graficas/empleados/cantEmpleadosSexo";
import { cantEmpleadosFechaIngreso } from "../api/graficas/empleados/cantEmpleadosFechaIngreso";
import { getUniqueRandomColor } from "../utils/dataGraphs";
import { cantEmpleadosDepartamentos } from '../api/graficas/departamentos/cantEmpleadosDepartamentos';
import { cantEmpleadosSalario } from '../api/graficas/empleados/cantEmpleadosSalario';
import { GraphicsProps } from "../interfaces/graphicsInterface";

Chart.register(CategoryScale);

export const GraficasEmpleadosPage = () => {

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
  const [chartDataPuestos, setChartDataPuestos] = useState<GraphicsProps>({...chartData});
  const [chartDataSexo, setChartDataSexo] = useState<GraphicsProps>({...chartData});
  const [chartDataFechaIngreso, setChartDataFechaIngreso] = useState<GraphicsProps>({...chartData});
  const [chartDataSalario, setChartDataSalario] = useState<GraphicsProps>({...chartData});

  const { company } = useCompanyStore();

  useEffect(() => {
    cantEmpleadosDepartamentos()
      .then((data) => {
        const usedColors = new Set<string>();
        const colors = data?.datasets[0]?.data.map(() => getUniqueRandomColor(usedColors)) || [];
        if (data) {
          setChartData({
            labels: data.labels,
            datasets: [
              {
                label: "Cant. empleados",
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
  }, []);

  useEffect(() => {
    cantEmpleadosPuestos()
      .then((data) => {
        const usedColors = new Set<string>();
        const colors = data?.datasets[0]?.data.map(() => getUniqueRandomColor(usedColors)) || [];
        if (data) {
          setChartDataPuestos({
            labels: data.labels,
            datasets: [
              {
                label: "Cant. empleados",
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
  }, []);

  useEffect(() => {
    cantEmpleadosSexo(company.id_empresa!)
      .then((data) => {
        const usedColors = new Set<string>();
        const colors = data?.datasets[0]?.data.map(() => getUniqueRandomColor(usedColors)) || [];
        if (data) {
          setChartDataSexo({
            labels: data.labels,
            datasets: [
              {
                label: "Cant. empleados",
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
    cantEmpleadosFechaIngreso(company.id_empresa!)
      .then((data) => {
        const usedColors = new Set<string>();
        const colors = data?.datasets[0]?.data.map(() => getUniqueRandomColor(usedColors)) || [];
        if (data) {
          setChartDataFechaIngreso({
            labels: data.labels,
            datasets: [
              {
                label: "Cant. empleados",
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
    cantEmpleadosSalario(company.id_empresa!)
      .then((data) => {
        const usedColors = new Set<string>();
        const colors = data?.datasets[0]?.data.map(() => getUniqueRandomColor(usedColors)) || [];
        if (data) {
          setChartDataSalario({
            labels: data.labels,
            datasets: [
              {
                label: "Cant. empleados",
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
              Gráficas de Empleados
            </h1>
          </Col>
        </Row>

        <Row>
          <Col className="mb-3">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header className="sidebar-header">Cantidad de Empelados por Departamentos</Accordion.Header>
                <Accordion.Body>
                  <BarChart 
                    title="Cantidad de empleados por departamentos"
                    chartData={{
                      labels: chartData.labels,
                      datasets: chartData.datasets.map(dataset => ({
                        label: dataset.label,
                        data: dataset.data,
                        backgroundColor: dataset.backgroundColor as unknown as string,
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
                <Accordion.Header className="sidebar-header">Cantidad de Empelados por Puestos</Accordion.Header>
                <Accordion.Body>
                  <BarChart 
                    title="Cantidad de empleados por puestos"
                    chartData={{
                      labels: chartDataPuestos.labels,
                      datasets: chartDataPuestos.datasets.map(dataset => ({
                        label: dataset.label,
                        data: dataset.data,
                        backgroundColor: dataset.backgroundColor as unknown as string,
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
                <Accordion.Header className="sidebar-header">Cantidad de Empelados por Sexo</Accordion.Header>
                <Accordion.Body>
                  <BarChart 
                    title="Cantidad de empleados por sexo"
                    chartData={{
                      labels: chartDataSexo.labels,
                      datasets: chartDataSexo.datasets.map(dataset => ({
                        label: dataset.label,
                        data: dataset.data,
                        backgroundColor: dataset.backgroundColor as unknown as string,
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
                <Accordion.Header className="sidebar-header">Cantidad de Empelados por Fecha de Ingreso a la Empresa</Accordion.Header>
                <Accordion.Body>
                  <BarChart 
                    title="Cantidad de empleados por fecha de ingreso a la empresa"
                    chartData={{
                      labels: chartDataFechaIngreso.labels,
                      datasets: chartDataFechaIngreso.datasets.map(dataset => ({
                        label: dataset.label,
                        data: dataset.data,
                        backgroundColor: dataset.backgroundColor as unknown as string,
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
                <Accordion.Header className="sidebar-header">Cantidad de Empelados por Salario</Accordion.Header>
                <Accordion.Body>
                  <BarChart 
                    title="Cantidad de empleados por salario"
                    chartData={{
                      labels: chartDataSalario.labels,
                      datasets: chartDataSalario.datasets.map(dataset => ({
                        label: dataset.label,
                        data: dataset.data,
                        backgroundColor: dataset.backgroundColor as unknown as string,
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
