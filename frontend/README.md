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
