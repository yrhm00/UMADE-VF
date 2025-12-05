import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  role: z.enum(['CLIENT', 'PROVIDER', 'ADMIN']).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  phone: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paginatedUsersSchema = z.object({
  content: z.array(userSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export type User = z.infer<typeof userSchema>;
export type PaginatedUsers = z.infer<typeof paginatedUsersSchema>;
