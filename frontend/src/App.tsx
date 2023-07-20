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
  const { forecast, loading } = useForecast(coords);

  return (
    <main className="container mx-auto my-6 max-w-5xl">
      <Header />

      <h2 className="text-2xl font-bold text-center my-6">Where are you?</h2>

      <SearchMap
        className={loading ? 'animate-pulse' : 'animate-none'}
        coords={coords}
        setCoords={setCoords}
      />
      {forecast ? <Chart data={forecast?.timeseries} /> : <>...</>}

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
              name: 'Worst Projected AQI',
              value: String(forecast.aqi.rating),
              meta: forecast.aqi.category,
            },
            { name: 'Humidity', value: '58.5%' },
          ]}
        />
      ) : (
        <>...</>
      )}

      <Subscribe />
    </main>
  );
}

export { App };
export type { Coords };
