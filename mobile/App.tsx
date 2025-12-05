import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from '@/navigation/RootNavigator';
import theme from '@/theme';

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar style="dark" />
      <RootNavigator />
    </NativeBaseProvider>
  );
}
