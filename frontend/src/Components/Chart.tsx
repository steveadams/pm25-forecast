import { FC, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: [datetime: string, value: number][];
}

const Chart: FC<ChartProps> = ({ className, data }) => {
  const ref = useRef();

  const datetimes = data.map((tuple) => {
    let date = new Date(tuple[0]);

    let monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let monthName = monthNames[date.getMonth()];

    let day = date.getDate();

    let hour = date.getHours() % 12;
    if (hour === 0) {
      hour = 12;
    }

    let period = date.getHours() >= 12 ? 'pm' : 'am';

    return `${monthName} ${day}, ${hour}${period}`;
  });

  const values = data.map((tuple) => tuple[1]);

  const chartData = {
    labels: datetimes,
    datasets: [
      {
        label: 'pm2.5 level',
        data: values,
        fill: true,
        // backgroundColor: 'rgb(75, 192, 192)',
        // borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
    legend: {
      boxHeight: 20,
      boxWidth: 20,
      borderRadius: 10,
      useBorderRadius: true,
    },
  };

  return (
    <div className={className}>
      <Line ref={ref} data={chartData} />
    </div>
  );
};

export { Chart };
