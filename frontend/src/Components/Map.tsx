import Map, { GeolocateControl, Marker } from 'react-map-gl';
import { GeocoderControl } from './GeocoderControl';
// import { useBounds } from '../api';
import { Dispatch, FC, SetStateAction } from 'react';
import { Coords } from '../App';

type SearchMapProps = {
  latitude: number;
  longitude: number;
  setCoords: Dispatch<SetStateAction<Coords>>;
};

const TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'token-is-missing';

const SearchMap: FC<SearchMapProps> = (props) => {
  // const { bounds, loading } = useBounds();

  return (
    <div className="w-full h-96">
      <Map
        id="map"
        initialViewState={{
          zoom: 9,
          ...props,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={TOKEN}
        onClick={(e) => {
          props.setCoords({
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
          });
        }}
      >
        <Marker key={`marker`} {...props} anchor="bottom">
          <Pin />
        </Marker>
        <GeolocateControl
          onGeolocate={({ coords }) => props.setCoords(coords)}
        />
        <GeocoderControl
          mapboxAccessToken={TOKEN}
          position="top-left"
          onResult={(e) =>
            props.setCoords(() => {
              const coords = (e as any).result.geometry.coordinates;
              return { latitude: coords[1], longitude: coords[0] };
            })
          }
        />
      </Map>
    </div>
  );
};

const pinStyle = {
  fill: '#d00',
  stroke: 'none',
};

function Pin({ size = 20 }) {
  return (
    <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
      <path
        d={`M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`}
      />
    </svg>
  );
}

export { SearchMap };
