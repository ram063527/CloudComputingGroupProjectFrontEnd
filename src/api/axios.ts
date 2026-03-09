import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:9000',
});

let currentToken: string | undefined = undefined;

export const setAuthToken = (token?: string) => {
  currentToken = token;
};

api.interceptors.request.use(
  (config) => {
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
