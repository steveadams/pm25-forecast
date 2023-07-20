// import { useState } from 'react';
import { Stats } from './Components/Stats';
import { Chart } from './Components/Chart';
import { Header } from './Components/Header';
import { Subscribe } from './Components/Subscribe';
import { SearchMap } from './Components/Map';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useForecast } from './api';
import { useEffect, useState } from 'react';

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
  const [latitude, setLatitude] = useState<number>(49.0561341);
  const [longitude, setLongitude] = useState<number>(-122.4919411);
  const { forecast, loading } = useForecast(latitude, longitude);

  useEffect(() => {
    // get user coordinates with geolocation
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, [latitude, longitude]);

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
        latitude={latitude}
        longitude={longitude}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
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
