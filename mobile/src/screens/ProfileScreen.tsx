import React from 'react';
import { Avatar, YStack, XStack, H3, Paragraph, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background" padding="$4" space="$4">
        <XStack space="$3" alignItems="center">
          <Avatar circular size="$4">
            <Avatar.Fallback backgroundColor="$blue10" alignItems="center" justifyContent="center">
              <Text color="white">UV</Text>
            </Avatar.Fallback>
          </Avatar>
          <YStack>
            <H3 color="$blue10">
              Utilisateur invité
            </H3>
            <Paragraph color="$gray11">Bienvenue dans votre nouvel espace mobile.</Paragraph>
          </YStack>
        </XStack>
        <Paragraph color="$gray11">
          Personnalisez cette page pour afficher les informations de profil, les paramètres ou
          d'autres modules importants.
        </Paragraph>
      </YStack>
    </SafeAreaView>
  );
};

export default ProfileScreen;
