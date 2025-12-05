import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchConversationMessages, sendMessage } from './api';
import { Message, PaginatedResponse, RefreshStrategy, SendMessagePayload } from './types';
import { MessageInput } from './MessageInput';
import { useMessagingRefresh } from './useMessagingRefresh';
import './messaging.css';

interface ConversationDetailProps {
  conversationId: string;
  meId: string;
  refreshStrategy?: RefreshStrategy;
}

interface PendingMessage extends Message {
  deliveryState: 'pending' | 'failed';
}

export function ConversationDetail({ conversationId, meId, refreshStrategy }: ConversationDetailProps) {
  const [page, setPage] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Message>, 'items'>>({
    page: 0,
    size: 20,
    total: 0,
    hasMore: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latestMessageId = useMemo(() => messages.at(-1)?.id, [messages]);

  const loadMessages = useCallback(
    (nextPage: number) => {
      setLoading(true);
      fetchConversationMessages(conversationId, nextPage)
        .then((response) => {
          setMessages((prev) => {
            const deduped = new Map(prev.map((item) => [item.id, item] as const));
            response.items.forEach((item) => deduped.set(item.id, item));
            return Array.from(deduped.values()).sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            );
          });
          setPagination({
            page: response.page,
            size: response.size,
            total: response.total,
            hasMore: response.hasMore,
          });
        })
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    },
    [conversationId],
  );

  const refreshFromTail = useCallback(() => {
    if (!latestMessageId) {
      return loadMessages(0);
    }

    fetchConversationMessages(conversationId, 0, pagination.size, latestMessageId)
      .then((response) => {
        if (response.items.length === 0) return;
        setMessages((prev) => [...prev, ...response.items]);
      })
      .catch((err: Error) => setError(err.message));
  }, [conversationId, latestMessageId, loadMessages, pagination.size]);

  useMessagingRefresh(refreshStrategy, { conversationId, onRefresh: refreshFromTail });

  useEffect(() => {
    loadMessages(page);
  }, [page, loadMessages]);

  const handleSend = async (payload: SendMessagePayload) => {
    const pending: PendingMessage = {
      id: payload.clientMessageId ?? crypto.randomUUID(),
      clientMessageId: payload.clientMessageId,
      conversationId,
      senderId: meId,
      content: payload.content,
      attachmentUrl: payload.attachmentUrl,
      createdAt: new Date().toISOString(),
      deliveryState: 'pending',
    };
    setMessages((prev) => [...prev, pending]);

    try {
      const saved = await sendMessage(conversationId, payload);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === pending.id
            ? { ...saved, deliveryState: 'sent', clientMessageId: payload.clientMessageId }
            : msg,
        ),
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === pending.id ? { ...msg, deliveryState: 'failed' } : msg)),
      );
    }
  };

  const handleResend = async (message: PendingMessage) => {
    await handleSend({
      content: message.content,
      attachmentUrl: message.attachmentUrl,
      clientMessageId: message.clientMessageId ?? message.id,
    });
    setMessages((prev) => prev.filter((item) => item.id !== message.id));
  };

  return (
    <div className="conversation-detail">
      <div className="messages">
        {pagination.hasMore && (
          <button className="load-more" onClick={() => setPage((current) => current + 1)} disabled={loading}>
            {loading ? 'Chargement…' : 'Voir plus'}
          </button>
        )}

        {messages.map((message) => {
          const isMine = message.senderId === meId;
          const isPending = message.deliveryState === 'pending';
          const isFailed = message.deliveryState === 'failed';
          return (
            <div key={message.id} className={`bubble-row ${isMine ? 'mine' : 'theirs'}`}>
              <div className={`bubble ${isFailed ? 'failed' : ''}`}>
                <p>{message.content}</p>
                {message.attachmentUrl && (
                  <a href={message.attachmentUrl} target="_blank" rel="noreferrer">
                    Pièce jointe
                  </a>
                )}
                <span className="meta">
                  {new Date(message.createdAt).toLocaleTimeString()} ·{' '}
                  {isFailed ? 'Échec' : isPending ? 'Envoi…' : 'Envoyé'}
                </span>
              </div>
              {isFailed && (
                <button className="resend" onClick={() => handleResend(message)}>
                  Réessayer
                </button>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="error">{error}</p>}

      <MessageInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
