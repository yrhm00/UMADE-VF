import { z } from 'zod';

export const inspirationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  mediaUrls: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  authorId: z.string(),
  isFavorite: z.boolean().optional(),
  favoritesCount: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const inspirationFeedSchema = z.object({
  content: z.array(inspirationSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export type Inspiration = z.infer<typeof inspirationSchema>;
export type InspirationFeed = z.infer<typeof inspirationFeedSchema>;
