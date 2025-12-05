import { decode as base64Decode } from 'base-64';

const decodePayload = (token: string) => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return {};

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
    const decoded = base64Decode(paddedPayload);
    return JSON.parse(decoded) as { exp?: number };
  } catch (error) {
    console.warn('Invalid JWT token', error);
    return {};
  }
};

export const isJwtValid = (token: string): boolean => {
  const payload = decodePayload(token);
  if (!payload.exp) return false;

  const expiry = payload.exp * 1000;
  return expiry > Date.now();
};
