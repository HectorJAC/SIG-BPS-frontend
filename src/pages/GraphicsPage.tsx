import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Layout } from "../layout/Layout";
import { CustomDownloadButton } from "../components/CustomDownloadButton";
import { CustomAsterisk } from '../components/CustomAsterisk';
import { BarChart } from "../components/charts/BarChart";
import { PieChart } from "../components/charts/PieChart";
import { saveAs } from 'file-saver';
import './styles/graphicsPage.css';
import { cantEmpleadosDepartamentos } from "../api/graficas/departamentos/cantEmpleadosDepartamentos";
import { cantEmpleadosPuestos} from "../api/graficas/empleados/cantEmpleadosPuestos";
import { getUniqueRandomColor } from '../utils/dataGraphs';
import { PolarAreaChart } from "../components/charts/PolarAreaChart";

interface ChartDataProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export const GraphicsPage = () => {
    
  const [tipoGraficoSeleccionado, setTipoGraficoSeleccionado] = useState("");
  const [moduloGraficoSeleccionado, setModuloGraficoSeleccionado] = useState("");
  const [chartData, setChartData] = useState<ChartDataProps>({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: "",
      }
    ],
  });

  const generateGraph = () => {
    switch (tipoGraficoSeleccionado) {
    case 'Gráfico de barras':
      return <BarChart id="grafico" title="Gráfico de Barras" chartData={chartData} />;
    case 'Gráfico circular':
      return <PieChart title="Gráfico Circular" chartData={chartData} />;
    case 'Gráfico polar':
      return <PolarAreaChart title="Gráfico Polar" chartData={chartData} />;
    default:
      return null;
    }
  };

  const handleTipoGraficoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoGraficoSeleccionado(e.target.value);
  };

  const handleModuloGraficoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModuloGraficoSeleccionado(e.target.value);
  };

  const handleDatosChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.value) {
    case "Cant de Empleados por Departamento":
      cantEmpleadosDepartamentos().then((data) => {
        const usedColors = new Set<string>();
        const colors = data?.datasets[0]?.data.map(() => getUniqueRandomColor(usedColors)) || [];
        setChartData({
          labels: data?.labels,
          datasets: [
            {
              label: "Cant. empleados",
              data: data?.datasets[0].data,
              backgroundColor: colors,
            }
          ]
        });
      });
      break;
    case "Cant de Empleados por Puesto":
      cantEmpleadosPuestos().then((data) => {
        const usedColors = new Set<string>();
        const colors = data?.datasets[0]?.data.map(() => getUniqueRandomColor(usedColors)) || [];
        setChartData({
          labels: data?.labels,
          datasets: [
            {
              label: "Cant. empleados",
              data: data?.datasets[0].data,
              backgroundColor: colors,
            }
          ]
        });
      });
      break;
    default:
      break;
    }
  };

  const handleDownload = () => {
    const canvasSave = document.getElementById('grafico') as HTMLCanvasElement;
    const blob = new Blob([canvasSave?.toDataURL()], { type: 'image/png' });
    saveAs(blob, 'grafico.png');

    console.log({
      canvasSave,
      blob
    })
  };

  return (
    <Layout>
      <Container>
        <h1 className="fw-bold text-black my-3">Generar Gráficos personalizados</h1>
        <Row>
          <Col md={4}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label><CustomAsterisk /> Selecciona el tipo de gráfico</Form.Label>
                <Form.Select onChange={handleTipoGraficoChange}>
                  <option>Selecciona una opción</option>
                  <option>Gráfico de barras</option>
                  <option>Gráfico circular</option>
                  <option>Gráfico polar</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Col>

          <Col md={4}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label><CustomAsterisk /> Selecciona el módulo</Form.Label>
                {
                  tipoGraficoSeleccionado !== "" && tipoGraficoSeleccionado !== "Selecciona una opción" && (
                    <Form.Select onChange={handleModuloGraficoChange}>
                      <option>Selecciona una opción</option>
                      <option value="departamentos">Departamentos</option>
                      <option value="empleados">Empleados</option>
                      <option value="proyectos">Proyectos</option>
                    </Form.Select>
                  )
                }
              </Form.Group>
            </Form>
          </Col>

          <Col md={4}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label><CustomAsterisk /> Selecciona los datos</Form.Label>
                {
                  moduloGraficoSeleccionado !== "" && moduloGraficoSeleccionado === "empleados" && (
                    <Form.Select onChange={handleDatosChange}>
                      <option>Selecciona una opción</option>
                      <option value="Cant de Empleados por Departamento">Cant de Empleados por Departamento</option>
                      <option value="Cant de Empleados por Puesto">Cant de Empleados por Puesto</option>
                    </Form.Select>
                  )
                }
              </Form.Group>
            </Form>
          </Col>
        </Row>

        <Row>
          <Col md={4} className="mt-2">
            <CustomDownloadButton 
              onClick={handleDownload}
            />
          </Col>

          {/* <Col md={12} className="mt-4 mb-2">
                        <div className="chart-container">
                            {generateGraph()}
                        </div>
                    </Col> */}
          {generateGraph()}
        </Row>
      </Container>
    </Layout>
  )
};
