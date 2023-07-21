import { Stats } from './Components/Stats';
import { Header } from './Components/Header';
// import { Subscribe } from './Components/Subscribe';
import { SearchMap } from './Components/Map';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useForecast } from './api';
import { useState } from 'react';
import { Chart } from './Components/Chart';
import dayjs from 'dayjs';
import { convertPm25ToColor } from './lib';

type Coords = {
  latitude: number;
  longitude: number;
};

const microGramsPerM3 = (
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
    <main className="container mx-auto max-w-7xl">
      <Header />
      <div className="p-0 lg:px-2">
        <div
          className={`gap-2 lg:gap-4 grid grid-cols-4 mx-auto w-full ${
            loading ? 'animate-pulse' : 'animate-none'
          }`}
        >
          <div className="w-full h-72 lg:h-96 col-span-4 lg:col-span-2 rounded-none lg:rounded-lg overflow-hidden">
            <SearchMap
              className="w-full h-full"
              coords={coords}
              setCoords={setCoords}
            />
          </div>

          {forecast ? (
            <Chart
              className={`w-full h-72 lg:h-96 col-span-4 lg:col-span-2 rounded-none lg:rounded-lg overflow-hidden ${
                loading ? 'animate-pulse' : 'animate-none'
              }`}
              data={forecast?.data}
              style={{
                backgroundColor: convertPm25ToColor(
                  forecast.meta.max_pm25.value,
                ),
              }}
            />
          ) : (
            <>...</>
          )}

          {forecast ? (
            <Stats
              className={
                'bg-slate-600 col-span-4 rounded-none lg:rounded-lg overflow-hidden ' +
                (loading ? 'animate-pulse' : 'animate-none')
              }
              stats={[
                {
                  name: 'Min pm2.5',
                  value: forecast.meta.min_pm25.value.toFixed(2),
                  unit: microGramsPerM3,
                  meta: dayjs(forecast.meta.min_pm25.datetime).format(
                    'ddd, ha',
                  ),
                },
                {
                  name: 'Max pm2.5',
                  value: forecast.meta.max_pm25.value.toFixed(2),
                  unit: microGramsPerM3,
                  meta: dayjs(forecast.meta.max_pm25.datetime).format(
                    'ddd, ha',
                  ),
                },
                {
                  name: 'Worst AQI',
                  value: String(forecast.meta.aqi.rating),
                  meta: forecast.meta.aqi.category,
                },
                { name: 'Humidity', value: '58.5%' },
              ]}
            />
          ) : (
            <>...</>
          )}
        </div>
      </div>

      {/* <Subscribe /> */}
    </main>
  );
}

export { App };
export type { Coords };
