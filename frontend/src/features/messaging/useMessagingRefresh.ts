import { useEffect } from 'react';
import { RefreshStrategy } from './types';

interface RefreshOptions {
  conversationId: string;
  onRefresh: () => void;
}

export function useMessagingRefresh(strategy: RefreshStrategy | undefined, { onRefresh }: RefreshOptions) {
  useEffect(() => {
    if (!strategy) {
      return;
    }

    if (strategy.type === 'polling') {
      const interval = setInterval(onRefresh, strategy.intervalMs ?? 5000);
      return () => clearInterval(interval);
    }

    const socket = new WebSocket(strategy.url);
    socket.addEventListener('message', (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.type === 'MESSAGE_CREATED') {
          onRefresh();
        }
      } catch (error) {
        console.error('WS parsing error', error);
      }
    });

    return () => {
      socket.close();
    };
  }, [strategy, onRefresh]);
}
