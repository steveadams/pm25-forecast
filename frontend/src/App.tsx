// import { useState } from 'react';
import { Stats } from './Components/Stats';
import { Chart } from './Components/Chart';
import { Header } from './Components/Header';
import { Subscribe } from './Components/Subscribe';
import { SearchMap } from './Components/Map';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useForecast } from './api';
import { useState } from 'react';

type Coords = {
  latitude: number;
  longitude: number;
};

const mgPerM3 = (
  <span>
    µg/m<sup>3</sup>
  </span>
);

function App() {
  const [coords, setCoords] = useState<Coords>({
    latitude: 49.0561341,
    longitude: -122.4919411,
  });
  const { forecast, loading } = useForecast(coords.latitude, coords.longitude);

  return (
    <main className="container mx-auto my-6 max-w-5xl">
      <Header />

      <h2 className="text-2xl font-bold text-center my-6">Where are you?</h2>

      {/* <span className="text-center my-4 block">
        <p className="text-center text-lg mb-2">
          Let us give you a 24h forecast of the smoke and weather in your area.
        </p>
        <p className="text-slate-500 italic text-sm dark:text-gray-300">
          We don't record this unless you ask us to notify you.
        </p>
      </span> */}

      <SearchMap
        className={loading ? 'animate-pulse' : 'animate-none'}
        {...coords}
        setCoords={setCoords}
      />
      {forecast ? <Chart data={forecast?.timeseries} /> : <>one sec</>}

      {forecast ? (
        <Stats
          className={loading ? 'animate-pulse' : 'animate-none'}
          stats={[
            {
              name: 'Minimum pm2.5',
              value: forecast.min.toFixed(2),
              unit: mgPerM3,
              meta: 'around 2pm',
            },
            {
              name: 'Maximum pm2.5',
              value: forecast.max.toFixed(2),
              unit: mgPerM3,
              meta: 'around 7am',
            },
            {
              name: 'Average Range',
              value: String(
                (
                  forecast.timeseries.reduce((acc, curr) => {
                    return acc + curr[1];
                  }, 0) / forecast.timeseries.length
                ).toFixed(2),
              ),
              unit: mgPerM3,
              meta: 'low risk',
            },
            { name: 'Humidity', value: '58.5%' },
          ]}
        />
      ) : (
        <>one sec</>
      )}

      <Subscribe />
    </main>
  );
}

export { App };
export type { Coords };
