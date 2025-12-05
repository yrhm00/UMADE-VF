import { QueryClient } from '@tanstack/react-query';

const retryDelays = [1000, 2000, 4000];

const shouldRetry = (failureCount: number, error: unknown) => {
  if (failureCount >= retryDelays.length) return false;
  if (error instanceof Error && error.message?.toLowerCase().includes('401')) return false;
  return true;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      retryDelay: (attemptIndex) => retryDelays[Math.min(attemptIndex, retryDelays.length - 1)],
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: 'online',
    },
    mutations: {
      retry: shouldRetry,
      retryDelay: (attemptIndex) => retryDelays[Math.min(attemptIndex, retryDelays.length - 1)],
      networkMode: 'online',
    },
  },
});

// Stale-while-revalidate strategy for list endpoints
queryClient.setQueryDefaults(['feed'], {
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 60,
  refetchOnMount: 'always',
});

queryClient.setQueryDefaults(['providers'], {
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 60,
  refetchOnMount: 'always',
});
