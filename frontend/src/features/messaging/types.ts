export type MessageDeliveryState = 'pending' | 'sent' | 'failed';

export interface ConversationParticipant {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Conversation {
  id: string;
  participants: [ConversationParticipant, ConversationParticipant];
  lastMessagePreview?: string;
  lastMessageAt?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
  hasMore: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachmentUrl?: string;
  createdAt: string;
  deliveryState?: MessageDeliveryState;
  clientMessageId?: string;
}

export interface SendMessagePayload {
  content: string;
  attachmentUrl?: string;
  clientMessageId?: string;
}

export type RefreshStrategy =
  | { type: 'polling'; intervalMs?: number; afterMessageId?: string }
  | { type: 'websocket'; url: string };
