import { FC } from 'react';

interface StatsProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: {
    name: string;
    value: string;
    meta?: string;
    unit?: JSX.Element;
  }[];
}

const Stats: FC<StatsProps> = ({ className, stats }) => {
  return (
    <div
      className={`bg-gray-900 text-left sm:rounded-xl overflow-hidden my-6 ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8"
            >
              <p className="text-sm font-medium leading-6 text-gray-400">
                {stat.name}
              </p>
              <p className="mt-2 flex items-baseline gap-x-2">
                <span className="text-4xl font-semibold tracking-tight text-white">
                  {stat.value}
                </span>
                {stat.unit ? (
                  <span className="text-sm text-gray-400">{stat.unit}</span>
                ) : null}
              </p>
              <p className="mt-2 flex items-baseline gap-x-2">
                {stat.meta ? (
                  <span className="text-sm text-gray-400">{stat.meta}</span>
                ) : null}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Stats };
