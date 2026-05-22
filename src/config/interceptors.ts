import type { AxiosInstance } from "axios";

export function applyInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    }
  );
}