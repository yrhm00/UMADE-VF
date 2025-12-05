import React from 'react';
import { Box, Heading, Text, VStack } from 'native-base';

export const ExploreScreen: React.FC = () => {
  return (
    <Box safeArea flex={1} bg="neutral.50" px={4} py={6}>
      <VStack space={3}>
        <Heading color="primary.700">Explorer</Heading>
        <Text color="neutral.700">
          Ajoutez vos futures fonctionnalités ici : cartes, listes ou toute autre expérience
          personnalisée.
        </Text>
      </VStack>
    </Box>
  );
};

export default ExploreScreen;
