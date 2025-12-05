import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '@/screens/HomeScreen';
import ExploreScreen from '@/screens/ExploreScreen';
import ProfileScreen from '@/screens/ProfileScreen';

export type RootStackParamList = {
  Root: undefined;
};

export type RootTabParamList = {
  Accueil: undefined;
  Explorer: undefined;
  Profil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const lightNavigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0466e0',
    background: '#f7f9fb'
  }
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#0466e0',
      tabBarIcon: ({ color, size }) => {
        const icons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
          Accueil: 'home',
          Explorer: 'compass',
          Profil: 'person'
        };
        const iconName = icons[route.name as keyof RootTabParamList];
        return <Ionicons name={iconName} size={size} color={color} />;
      }
    })}
  >
    <Tab.Screen name="Accueil" component={HomeScreen} />
    <Tab.Screen name="Explorer" component={ExploreScreen} />
    <Tab.Screen name="Profil" component={ProfileScreen} />
  </Tab.Navigator>
);

export const RootNavigator = () => (
  <NavigationContainer theme={lightNavigationTheme}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={TabNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
