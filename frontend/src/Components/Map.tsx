import Map, {
  GeolocateControl,
  Layer,
  LayerProps,
  // MapEvent,
  MapRef,
  Marker,
  Source,
} from 'react-map-gl';
// import { GeoJSONSource } from 'mapbox-gl';
import { GeocoderControl } from './GeocoderControl';
import { Dispatch, FC, SetStateAction, useEffect, useRef } from 'react';

interface SearchMapProps extends React.HTMLAttributes<HTMLDivElement> {
  latitude: number;
  longitude: number;
  setLatitude: Dispatch<SetStateAction<number>>;
  setLongitude: Dispatch<SetStateAction<number>>;
}

const TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'token-is-missing';

const SearchMap: FC<SearchMapProps> = (props) => {
  const mapRef = useRef<MapRef>(null);

  // const onLoad = (event: MapEvent) => {
  //   if (!mapRef.current) {
  //     return;
  //   }

  //   // @ts-ignore
  //   console.log(event);
  //   console.log('features', event.features[0]);
  //   const feature = event.features[0];
  //   const clusterId = feature.properties.cluster_id;

  //   const mapboxSource = mapRef.current.getSource(
  //     'fire_perimeters',
  //   ) as any as GeoJSONSource;

  //   mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
  //     if (err || mapRef.current === null) {
  //       return;
  //     }

  //     mapRef.current.easeTo({
  //       center: feature.geometry.coordinates,
  //       zoom,
  //       duration: 500,
  //     });
  //   });
  // };

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.easeTo({
      center: [props.longitude, props.latitude],
      duration: 500,
    });
  }, [props.latitude, props.longitude]);

  return (
    <div
      className={`mx-auto my-6 w-full max-w-3xl h-96 overflow-hidden rounded-lg ${props.className}`}
    >
      <Map
        id="map"
        ref={mapRef}
        initialViewState={{
          zoom: 5,
          latitude: props.latitude,
          longitude: props.longitude,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={TOKEN}
        onClick={(e) => {
          props.setLatitude(e.lngLat.lat);
          props.setLongitude(e.lngLat.lng);
        }}
      >
        <Marker
          key={`marker`}
          latitude={props.latitude}
          longitude={props.longitude}
          anchor="bottom"
        >
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
            props.setLatitude(coords.latitude);
            props.setLongitude(coords.longitude);
          }}
          showUserLocation={false}
        />
        <GeocoderControl
          mapboxAccessToken={TOKEN}
          position="top-left"
          onResult={(e) => {
            props.setLatitude((e as any).result.center[1]);
            props.setLongitude((e as any).result.center[0]);
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
};
