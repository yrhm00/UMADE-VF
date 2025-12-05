import apiClient from '../api/client';
import { authResponseSchema, refreshResponseSchema } from '../api/schemas/auth';
import { setTokens, clearTokens, getRefreshToken } from '../storage/secureStore';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  firstName?: string;
  lastName?: string;
  role?: 'CLIENT' | 'PROVIDER' | 'ADMIN';
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post('/auth/login', payload);
  const data = authResponseSchema.parse(response.data);
  await setTokens(data.tokens.accessToken, data.tokens.refreshToken);
  return data;
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post('/auth/register', payload);
  const data = authResponseSchema.parse(response.data);
  await setTokens(data.tokens.accessToken, data.tokens.refreshToken);
  return data;
}

export async function refreshSession() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const response = await apiClient.post('/auth/refresh', { refreshToken });
  const parsed = refreshResponseSchema.parse(response.data);
  const tokens = 'tokens' in parsed ? parsed.tokens : parsed;
  await setTokens(tokens.accessToken, tokens.refreshToken);
  return tokens;
}

export async function logout() {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Even if logout request fails, proceed with local cleanup
  }
  await clearTokens();
}
