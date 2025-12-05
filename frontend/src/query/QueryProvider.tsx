import React, { PropsWithChildren, useEffect } from 'react';
import { AppState } from 'react-native';
import { focusManager, onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import NetInfo from '@react-native-community/netinfo';
import { queryClient } from './client';
import { persistOptions } from './persistence';

export const QueryProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
      onlineManager.setOnline(isOnline);
    });

    const appStateSubscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');
    });

    return () => {
      unsubscribeNetInfo();
      appStateSubscription.remove();
    };
  }, []);

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions} onSuccess={() => queryClient.resumePausedMutations()}>
      {children}
    </PersistQueryClientProvider>
  );
};
