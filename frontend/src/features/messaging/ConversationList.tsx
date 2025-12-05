import { useEffect, useState } from 'react';
import { fetchConversations } from './api';
import { Conversation, PaginatedResponse } from './types';
import './messaging.css';

interface ConversationListProps {
  onSelect: (conversationId: string) => void;
}

export function ConversationList({ onSelect }: ConversationListProps) {
  const [page, setPage] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Conversation>, 'items'>>({
    page: 0,
    size: 20,
    total: 0,
    hasMore: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchConversations(page)
      .then((response) => {
        if (!isMounted) return;
        setConversations((prev) => [...prev, ...response.items]);
        setPagination({
          page: response.page,
          size: response.size,
          total: response.total,
          hasMore: response.hasMore,
        });
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));

    return () => {
      isMounted = false;
    };
  }, [page]);

  return (
    <div className="conversation-list">
      <header>
        <h2>Conversations</h2>
      </header>
      {conversations.map((conversation) => {
        const [user1, user2] = conversation.participants;
        return (
          <button
            key={conversation.id}
            className="conversation-row"
            onClick={() => onSelect(conversation.id)}
          >
            <div className="avatars">
              {user1.avatarUrl && <img src={user1.avatarUrl} alt={user1.displayName} />}
              {user2.avatarUrl && <img src={user2.avatarUrl} alt={user2.displayName} />}
            </div>
            <div className="meta">
              <div className="names">
                {user1.displayName} · {user2.displayName}
              </div>
              <div className="preview">{conversation.lastMessagePreview ?? 'Démarrer la conversation'}</div>
            </div>
          </button>
        );
      })}

      {error && <p className="error">{error}</p>}

      {pagination.hasMore && (
        <button
          className="load-more"
          disabled={loading}
          onClick={() => setPage((current) => current + 1)}
        >
          {loading ? 'Chargement…' : 'Voir plus'}
        </button>
      )}
    </div>
  );
}
