import { PolarArea } from "react-chartjs-2";

interface PolarAreaChartProps {
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

export const PolarAreaChart: React.FC<PolarAreaChartProps> = ({ title, chartData }) => {
  return (
    <div className="chart-container">
      <PolarArea
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
  
