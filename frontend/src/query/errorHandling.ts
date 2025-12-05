import { QueryCache, QueryClient } from '@tanstack/react-query';
import { showApiErrorToast } from '../toast/ErrorToast';

export const attachErrorToast = (client: QueryClient) => {
  const cache = new QueryCache({
    onError: (error, query) => {
      const label = query.queryHash.includes('feed') ? 'le fil' : query.queryHash.includes('providers') ? 'les prestataires' : 'la requête';
      const message = error instanceof Error ? error.message : 'Veuillez réessayer.';
      showApiErrorToast(`Impossible de charger ${label}: ${message}`);
    },
  });

  client.setQueryCache(cache);
  return () => cache.clear();
};
