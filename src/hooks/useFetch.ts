import { useEffect, useState } from "react";

type FetchResult<T> = {
    loading: boolean;
    error: string | null;
    data: T |null;
    refetch: () => void;
};

function useFetch<T>(fetchFn: (...args: any[]) => Promise<T>, ...params: any[]): FetchResult<T> {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<T | null>(null);
  
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFn(...params);
        setData(result);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des données : ", err);
        setError(err.message || 'Une erreur est survenue.');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
  
    const refetch = () => {
      fetchData();
    };
  
    useEffect(() => {
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...params]); // Reruns the query if parameters change
  
    return { loading, error, data, refetch };
  }
  
  export default useFetch;
