import React from 'react';
import { YStack, Button, H2, Paragraph } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background" padding="$4">
        <YStack space="$4">
          <H2 color="$blue10">Bienvenue</H2>
          <Paragraph color="$gray11">
            Explorez la nouvelle application mobile avec une navigation prête à l'emploi et
            un thème cohérent.
          </Paragraph>
          <Button alignSelf="flex-start" theme="active">
            <Button.Text>Commencer</Button.Text>
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

export default HomeScreen;
