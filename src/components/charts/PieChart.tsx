import { Pie } from "react-chartjs-2";

interface PieChartProps {
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

export const PieChart: React.FC<PieChartProps> = ({ title, chartData }) => {
  return (
    <div className="chart-container">
      <Pie
        width={600}
        height={500}
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: title
            },
            legend: {
              display: true
            }
          },
          maintainAspectRatio: false
        }}
      />
    </div>
  );
};
  
