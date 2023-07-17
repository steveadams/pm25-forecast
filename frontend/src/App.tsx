// import { useState } from 'react';
import { Stats } from './Components/Stats';
import { Header } from './Components/Header';
import { Subscribe } from './Components/Subscribe';
import { SearchMap } from './Components/Map';
import 'mapbox-gl/dist/mapbox-gl.css';

const mgPerM3 = (
  <span>
    µg/m<sup>3</sup>
  </span>
);

const stats = [
  { name: 'Minimum pm2.5', value: '0', unit: mgPerM3, meta: 'around 2pm' },
  { name: 'Maximum pm2.5', value: '3.65', unit: mgPerM3, meta: 'around 7am' },
  { name: 'Weather', value: '98.5%' },
  { name: 'AQI Range', value: '4-6', meta: 'low risk' },
];

function App() {
  // const [coords] = useState<[number, number]>([0, 0]);

  return (
    <main className="container mx-auto my-6 max-w-5xl">
      <Header />

      <h2 className="text-2xl font-bold text-center my-6">Where are you?</h2>

      <span className="text-center my-4 block">
        <p className="text-slate-700 text-centertext-lg mb-2">
          Let us give you a 24h forecast of the smoke and weather in your area.
        </p>
        <p className="text-slate-500 italic text-sm">
          We don't record this unless you ask us to notify you.
        </p>
      </span>

      <SearchMap />

      <Stats stats={stats} />

      <Subscribe />
    </main>
  );
}

export default App;
