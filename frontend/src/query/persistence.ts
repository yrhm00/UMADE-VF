import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 2000,
});

export const persistOptions: PersistQueryClientOptions = {
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24h cache persistence
  dehydrateOptions: { shouldDehydrateMutation: () => false },
};
