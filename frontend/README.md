# UMADE Frontend Messaging Module

This folder contains a lightweight React/TypeScript implementation for the messaging feature described in the product brief. The module is framework-agnostic and can be dropped into an existing React application.

## Structure

```
src/features/messaging/
  api.ts                 // Client API with pagination and incremental refresh
  types.ts               // Shared types and enums
  ConversationList.tsx   // Paginated list of conversations
  ConversationDetail.tsx // Message thread with bubbles, status, and resend
  MessageInput.tsx       // Composer with attachment URL support
  useMessagingRefresh.ts // Polling / WebSocket refresh helper
  messaging.css          // Minimal styling for bubbles and layout
```

## Usage

Import the components you need:

```tsx
import { ConversationList, ConversationDetail, RefreshStrategy } from './src/features/messaging';
```

- `ConversationList` loads the conversations page by page and triggers `onSelect` when the user chooses a thread.
- `ConversationDetail` renders bubbles for the current thread, handles message status (`pending`, `sent`, `failed`), and offers a **Réessayer** action on failures.
- `MessageInput` provides the composer and wires with the send callback used by `ConversationDetail`.
- `useMessagingRefresh` accepts either a polling strategy or a WebSocket URL to keep the thread up to date.

Set the API base URL via `API_BASE_URL` environment variable before bundling your frontend.
# UMADE Mobile – Client React Native

Ce dossier ajoute une base d'intégration TanStack Query pour l'app mobile UMADE.

- **Persistance** via `@tanstack/query-async-storage-persister` + `AsyncStorage` (voir `src/query/persistence.ts`).
- **Stale-while-revalidate** pour les listes `feed` et `providers` avec `staleTime` prolongé et refetch forcé au montage (`src/query/client.ts`).
- **Retry contrôlé** (3 tentatives progressives, arrêt sur 401) dans `src/query/client.ts`.
- **Suivi réseau** (`NetInfo`) + écran d'état (`src/screens/NetworkStatusScreen.tsx`).
- **Toasts d'erreur API** globaux (`src/toast/ErrorToast.tsx`) branchés sur le cache TanStack (`src/query/errorHandling.ts`).

`src/App.tsx` assemble le provider React Query persistant, l'écran réseau et les toasts.
