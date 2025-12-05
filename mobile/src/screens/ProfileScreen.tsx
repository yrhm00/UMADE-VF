import React from 'react';
import { Avatar, Box, Heading, HStack, Text, VStack } from 'native-base';

export const ProfileScreen: React.FC = () => {
  return (
    <Box safeArea flex={1} bg="neutral.50" px={4} py={6}>
      <VStack space={4}>
        <HStack space={3} alignItems="center">
          <Avatar bg="primary.500">UV</Avatar>
          <VStack>
            <Heading size="md" color="primary.700">
              Utilisateur invité
            </Heading>
            <Text color="neutral.700">Bienvenue dans votre nouvel espace mobile.</Text>
          </VStack>
        </HStack>
        <Text color="neutral.700">
          Personnalisez cette page pour afficher les informations de profil, les paramètres ou
          d'autres modules importants.
        </Text>
      </VStack>
    </Box>
  );
};

export default ProfileScreen;
