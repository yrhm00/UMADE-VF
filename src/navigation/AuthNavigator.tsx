import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Connexion' }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Inscription' }} />
    <Stack.Screen
      name="ResetPassword"
      component={ResetPasswordScreen}
      options={{ title: 'Réinitialiser le mot de passe' }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
