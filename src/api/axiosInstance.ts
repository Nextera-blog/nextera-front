import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const baseURL = 'http://localhost:8000';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const refreshResponse: AxiosResponse<{ access: string; refresh: string }> = await axios.post(
            `${baseURL}/token/refresh/`,
            { refresh: refreshToken }
          );

          const { access, refresh: newRefreshToken } = refreshResponse.data;

          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', newRefreshToken);

          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

          return axiosInstance(originalRequest);
        } else if (originalRequest?.url !== `${baseURL}/token/`) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
