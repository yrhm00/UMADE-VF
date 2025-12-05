import React from 'react';
import { TamaguiProvider, Theme } from 'tamagui';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from '@/navigation/RootNavigator';
import config from './tamagui.config';

export default function App() {
  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <StatusBar style="dark" />
        <RootNavigator />
      </Theme>
    </TamaguiProvider>
  );
}
