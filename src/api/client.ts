import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../storage/secureStore';
import { refreshResponseSchema } from './schemas/auth';

interface RetriableAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const baseURL =
  process.env.API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:8080/api';

const apiClient: AxiosInstance = axios.create({ baseURL });

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      try {
        const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
        const parsed = refreshResponseSchema.parse(response.data);
        const tokens = 'tokens' in parsed ? parsed.tokens : parsed;
        await setTokens(tokens.accessToken, tokens.refreshToken);
        return tokens.accessToken;
      } catch (error) {
        await clearTokens();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

apiClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableAxiosRequestConfig;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        };
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
