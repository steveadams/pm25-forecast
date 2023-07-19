import useSWR from 'swr';

type Bounds = [[number, number], [number, number]];
type BoundsData = {
  bounds: Bounds;
};

type Forecast = {
  max: number;
  min: number;
  timeseries: [string, number][];
};

const apiBaseURL = import.meta.env.VITE_API_BASE_URL as string;

const apiFetcher = async (path: string, method = 'GET') => {
  const res = await fetch(`${apiBaseURL}${path}`, {
    method,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');

    // @ts-ignore
    error.status = res.status;
    throw error;
  }

  return res.json();
};

const useBounds = () => {
  const { data, error } = useSWR<BoundsData>('/bounds', apiFetcher);

  const loading = !data && !error;

  return {
    loading,
    error,
    bounds: data ? data.bounds : undefined,
  };
};

const useForecast = (lat: number, lon: number) => {
  const { data, error } = useSWR<Forecast>(
    `/forecast/${lat}/${lon}`,
    apiFetcher,
    {
      keepPreviousData: true,
    },
  );

  const loading = !data && !error;

  return {
    loading,
    error,
    forecast: data ? data : undefined,
  };
};

export { useBounds, useForecast };
