module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo|expo-.*|@expo-google-fonts/.*|@unimodules/.*|unimodules|react-native-vector-icons|@react-native-community|@react-native-masked-view/masked-view)'
  ]
};
