import React from 'react';
import { Box, Button, Heading, Text, VStack } from 'native-base';

export const HomeScreen: React.FC = () => {
  return (
    <Box safeArea flex={1} bg="neutral.50" px={4} py={6}>
      <VStack space={4}>
        <Heading color="primary.700">Bienvenue</Heading>
        <Text color="neutral.700">
          Explorez la nouvelle application mobile avec une navigation prête à l'emploi et
          un thème cohérent.
        </Text>
        <Button alignSelf="flex-start">Commencer</Button>
      </VStack>
    </Box>
  );
};

export default HomeScreen;
