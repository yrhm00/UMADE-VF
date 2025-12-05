import { z } from 'zod';
import { userSchema } from './users';

export const tokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().optional(),
});

export const authResponseSchema = z.object({
  user: userSchema,
  tokens: tokenSchema,
});

export const refreshResponseSchema = z.union([
  tokenSchema,
  z.object({ tokens: tokenSchema }),
]);

export type TokenResponse = z.infer<typeof tokenSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
