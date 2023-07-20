import Map, {
  FullscreenControl,
  GeolocateControl,
  Layer,
  LayerProps,
  MapRef,
  Marker,
  NavigationControl,
  Source,
} from 'react-map-gl';
import { GeocoderControl } from './GeocoderControl';
import { Dispatch, FC, SetStateAction, useCallback, useRef } from 'react';
import { Coords } from '../App';

interface SearchMapProps extends React.HTMLAttributes<HTMLDivElement> {
  coords: Coords;
  setCoords: Dispatch<SetStateAction<Coords>>;
}

const TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'token-is-missing';

const SearchMap: FC<SearchMapProps> = ({ className, coords, setCoords }) => {
  const mapRef = useRef<MapRef>(null);

  const setAndFlyTo = useCallback(
    ({ latitude, longitude }: Coords) => {
      setCoords({ latitude, longitude });

      mapRef.current?.flyTo({
        center: [longitude, latitude],
        zoom: 6,
        duration: 2000,
        curve: 1,
      });
    },
    [setCoords],
  );

  const initialViewState = {
    ...coords,
    zoom: 5,
    bearing: 0,
    pitch: 0,
  };

  return (
    <div
      className={`mx-auto my-6 w-full max-w-3xl h-96 overflow-hidden rounded-lg ${className}`}
    >
      <Map
        id="map"
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={TOKEN}
        onClick={(e) => {
          const { lat, lng } = e.lngLat;
          setCoords({ latitude: lat, longitude: lng });
        }}
      >
        <Marker key={`marker`} {...coords} anchor="bottom">
          <Pin />
        </Marker>

        <Source
          id="fire_perimeters"
          type="geojson"
          data={import.meta.env.VITE_API_BASE_URL + '/fire_perimeters'}
        >
          <Layer {...outlineLayer} />
          <Layer {...fillLayer} />
        </Source>

        <GeolocateControl
          onGeolocate={({ coords }) => {
            setAndFlyTo({
              latitude: coords.latitude,
              longitude: coords.longitude,
            });
          }}
          showUserLocation={false}
          position="top-left"
        />

        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />

        <GeocoderControl
          mapboxAccessToken={TOKEN}
          position="top-right"
          onResult={(e) => {
            setAndFlyTo({
              latitude: (e as any).result.center[1],
              longitude: (e as any).result.center[0],
            });
          }}
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

const fillLayer: LayerProps = {
  id: 'fire_perimeters_fill',
  type: 'fill',
  source: 'fire_perimeters',
  layout: {},
  paint: {
    'fill-color': '#f97316',
    'fill-opacity': 0.5,
  },
  filter: ['==', '$type', 'Polygon'],
  // minzoom: 7,
};

const outlineLayer: LayerProps = {
  id: 'fire_perimeters_outline',
  type: 'line',
  source: 'fire_perimeters',
  layout: {},
  paint: {
    'line-color': '#ea580c',
    'line-width': 2,
  },
  filter: ['==', '$type', 'Polygon'],
  // minzoom: 7,
};
