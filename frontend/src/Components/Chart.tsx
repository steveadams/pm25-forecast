import { FC, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import {
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Chart as ChartJS,
  Tooltip,
} from 'chart.js';
import dayjs from 'dayjs';
import { calculateAQI, convertPm25ToColor } from '../lib';

ChartJS.register(LineElement);
ChartJS.register(PointElement);
ChartJS.register(LinearScale);
ChartJS.register(TimeScale);
ChartJS.register(Tooltip);

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: [datetime: string, value: number][];
}

const Chart: FC<ChartProps> = ({ className, data }) => {
  const ref = useRef();

  const dataset = data.reduce<{ x: string; y: number }[]>(
    (acc, [datetime, value]) => {
      acc.push({
        x: new Date(datetime).toISOString(),
        y: value,
      });

      return acc;
    },
    [],
  );

  let minPm25 = Number.POSITIVE_INFINITY;
  let maxPm25 = Number.NEGATIVE_INFINITY;
  let sumPm25 = 0;

  for (let point of dataset) {
    minPm25 = Math.min(minPm25, point.y);
    maxPm25 = Math.max(maxPm25, point.y);
    sumPm25 += point.y;
  }

  let avgPm25 = sumPm25 / dataset.length;

  const chartData = {
    datasets: [
      {
        label: 'pm2.5 level',
        data: dataset,
        fill: false,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return;
          }

          // Use min, avg and max PM2.5 to compute gradient stops
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top,
          );
          gradient.addColorStop(0, convertPm25ToColor(minPm25));
          gradient.addColorStop(0.5, convertPm25ToColor(avgPm25));
          gradient.addColorStop(1, convertPm25ToColor(maxPm25));

          return gradient;
        },
        borderColor: function (context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return;
          }

          // Use min, avg and max PM2.5 to compute gradient stops
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top,
          );
          gradient.addColorStop(0, convertPm25ToColor(minPm25));
          gradient.addColorStop(0.5, convertPm25ToColor(avgPm25));
          gradient.addColorStop(1, convertPm25ToColor(maxPm25));

          return gradient;
        },
      },
    ],
  };

  return (
    <div className={className}>
      <Line
        className="relative w-full h-32"
        ref={ref}
        data={chartData}
        options={{
          layout: {
            padding: 20,
          },
          maintainAspectRatio: false,
          interaction: {
            axis: 'x',
            mode: 'nearest',
            intersect: false,
          },
          spanGaps: 1000 * 60 * 60 * 12,
          plugins: {
            tooltip: {
              enabled: true,
              callbacks: {
                title: function (context: any[]) {
                  const { dataset, dataIndex } = context[0];
                  const { x } = dataset.data[dataIndex];

                  return dayjs(x).format('ddd h:mm A');
                },
                label: function (context: any) {
                  const { dataset, dataIndex } = context;
                  const { y } = dataset.data[dataIndex];

                  return ` ${y.toFixed(2)} µg/m³`;
                },
                footer: function (context: any) {
                  const { dataset, dataIndex } = context[0];
                  const { y } = dataset.data[dataIndex];

                  const { aqi, category } = calculateAQI(y);

                  return `AQI: ${aqi} (${category})`;
                },
              },
            },
          },
          scales: {
            x: {
              type: 'time',
              display: true,
              ticks: {
                autoSkip: false,
                maxRotation: 0,
                major: {
                  enabled: true,
                },
                font: function (context: any) {
                  if (context.tick && context.tick.major) {
                    return {
                      weight: 'bold',
                      color: 'red',
                    };
                  }
                },
              },
            },
            y: {
              display: true,
              position: 'left',
            },
          },
        }}
      />
    </div>
  );
};

export { Chart };
