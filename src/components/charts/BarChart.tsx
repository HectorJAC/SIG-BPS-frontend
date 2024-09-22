import { Bar } from "react-chartjs-2";

interface BarChartProps {
  id?: string;
  title: string;
  chartData: {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
    }[];
  };
}

export const BarChart: React.FC<BarChartProps> = ({ id, title, chartData }) => {
  return (
    <div className="chart-container">
      <Bar
        width={600}
        height={500}
        id={id}
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: title
            },
            legend: {
              display: false
            }
          },
          maintainAspectRatio: false
        }}
      />
    </div>
  );
};