import axios, { type InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from '../auth/tokens';

export const client = axios.create({ baseURL: '/api' });

let accessToken = tokenStore.getAccess();

export function setAccessToken(token: string | null) {
  accessToken = token;
}

client.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const doRefresh = async () => {
  const { data } = await axios.post('/api/auth/refresh', {
    refreshToken: tokenStore.getRefresh(),
  });
  tokenStore.set(data.accessToken, data.refreshToken);
  setAccessToken(data.accessToken);
}

let refreshing: Promise<void> | null = null;

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as RetriableConfig;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        if (!refreshing) {
          refreshing = doRefresh().finally(() => {
            refreshing = null;
          });
        }
        await refreshing;
        return client(original);
      } catch {
        window.dispatchEvent(new Event('auth:expired'));
        return Promise.reject(error);
      }
    }

    // if (error.response?.status === 401) {
    //   window.dispatchEvent(new Event('auth:expired'));
    // }
    return Promise.reject(error);
  }
);
