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
    // Do not send token for catalog requests to prevent Spring Security from rejecting public endpoints
    if (currentToken && config.url && !config.url.includes('/catalog')) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${currentToken}`);
      } else {
        config.headers['Authorization'] = `Bearer ${currentToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
