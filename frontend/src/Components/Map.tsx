import Map, { GeolocateControl } from 'react-map-gl';
import { GeocoderControl } from './GeocoderControl';
import { useBounds } from '../api';

const TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'token-is-missing';

const SearchMap = () => {
  const { bounds } = useBounds();

  return (
    <div className="w-full h-96">
      {bounds.loading ? (
        <p>one sec</p>
      ) : (
        <Map
          id="map"
          initialViewState={{ zoom: 9 }}
          maxBounds={bounds}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={TOKEN}
        >
          <GeolocateControl />
          <GeocoderControl mapboxAccessToken={TOKEN} position="top-left" />
        </Map>
      )}
    </div>
  );
};

export { SearchMap };
