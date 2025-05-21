// import { useState, useCallback } from 'react';
// import axiosInstance from '../api/axiosInstance';

// interface ApiResponse<T> {
//   data: T | null;
//   loading: boolean;
//   error: string | null;
//   fetchData: (...params: any[]) => Promise<void>;
// }

// function useApi<T>(
//   endpoint: string,
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
// ): ApiResponse<T> {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(async (...params: any[]) => {
//     setLoading(true);
//     setError(null);
//     try {
//       let response;
//       switch (method) {
//         case 'GET':
//           response = await axiosInstance.get<T>(endpoint);
//           break;
//         case 'POST':
//           response = await axiosInstance.post<T>(endpoint, params[0]);
//           break;
//         case 'PUT':
//           response = await axiosInstance.put<T>(endpoint, params[0]);
//           break;
//         case 'DELETE':
//           response = await axiosInstance.delete<T>(endpoint, { data: params[0] });
//           break;
//         default:
//           throw new Error(`Méthode HTTP non prise en charge : ${method}`);
//       }
//       setData(response.data);
//     } catch (err: any) {
//       console.error(`Erreur lors de la requête vers ${endpoint} :`, err);
//       setError(err.response?.data?.message || err.message || 'Une erreur est survenue.');
//       setData(null);
//     } finally {
//       setLoading(false);
//     }
//   }, [endpoint, method]);

//   return { data, loading, error, fetchData };
// }

// export default useApi;