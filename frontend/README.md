# UMADE Mobile – Client React Native

Ce dossier ajoute une base d'intégration TanStack Query pour l'app mobile UMADE.

- **Persistance** via `@tanstack/query-async-storage-persister` + `AsyncStorage` (voir `src/query/persistence.ts`).
- **Stale-while-revalidate** pour les listes `feed` et `providers` avec `staleTime` prolongé et refetch forcé au montage (`src/query/client.ts`).
- **Retry contrôlé** (3 tentatives progressives, arrêt sur 401) dans `src/query/client.ts`.
- **Suivi réseau** (`NetInfo`) + écran d'état (`src/screens/NetworkStatusScreen.tsx`).
- **Toasts d'erreur API** globaux (`src/toast/ErrorToast.tsx`) branchés sur le cache TanStack (`src/query/errorHandling.ts`).

`src/App.tsx` assemble le provider React Query persistant, l'écran réseau et les toasts.
