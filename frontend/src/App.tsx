import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { QueryProvider } from './query/QueryProvider';
import NetworkStatusScreen from './screens/NetworkStatusScreen';
import { ErrorToast } from './toast/ErrorToast';
import { attachErrorToast } from './query/errorHandling';
import { queryClient } from './query/client';

const App = () => {
  useEffect(() => {
    const detach = attachErrorToast(queryClient);
    return () => detach();
  }, []);

  return (
    <QueryProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <NetworkStatusScreen />
        <ErrorToast />
      </SafeAreaView>
    </QueryProvider>
  );
};

export default App;
