import React from 'react';
import { YStack, H2, Paragraph } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ExploreScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background" padding="$4" space="$3">
        <YStack space="$3">
          <H2 color="$blue10">Explorer</H2>
          <Paragraph color="$gray11">
            Ajoutez vos futures fonctionnalités ici : cartes, listes ou toute autre expérience
            personnalisée.
          </Paragraph>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

export default ExploreScreen;
