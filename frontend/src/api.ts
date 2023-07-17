import useSWR from 'swr';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL as string;

const apiFetcher = async (path: string) => {
  const res = await fetch(`${apiBaseURL}/${path}`);

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');

    // @ts-ignore
    error.status = res.status;
    throw error;
  }

  return res.json();
};

const useBounds = () => {
  const { data, error } = useSWR('/bounds', apiFetcher);

  const loading = !data && !error;

  return {
    loading,
    error,
    bounds: data.bounds,
  };
};

export { useBounds };
