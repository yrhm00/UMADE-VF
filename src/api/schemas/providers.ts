import { z } from 'zod';

export const providerSchema = z.object({
  id: z.string(),
  userId: z.string(),
  companyName: z.string(),
  description: z.string().nullable().optional(),
  services: z.array(z.string()).default([]),
  priceRange: z.string().nullable().optional(),
  rating: z.number().nullable().optional(),
  reviewCount: z.number().nullable().optional(),
  socialLinks: z.record(z.string()).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  coverUrl: z.string().url().nullable().optional(),
  location: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const providerListResponseSchema = z.object({
  content: z.array(providerSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export type Provider = z.infer<typeof providerSchema>;
export type ProviderList = z.infer<typeof providerListResponseSchema>;
