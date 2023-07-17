import { FC } from 'react';
import { Line } from 'react-chartjs-2';

interface ChartProps {
  data: [datetime: string, value: number][];
}

const TimeSeriesChart: FC<ChartProps> = ({ data }) => {
  const datetimes = data.map((tuple) => tuple[0]);
  const values = data.map((tuple) => tuple[1]);

  const chartData = {
    labels: datetimes,
    datasets: [
      {
        label: 'PM2.5 levels',
        data: values,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  // Render the line chart
  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export { TimeSeriesChart };
