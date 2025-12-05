import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';
import AuthNavigator from '../navigation/AuthNavigator';
import { readToken, removeToken } from '../services/secureToken';
import { isJwtValid } from '../utils/jwt';

const AuthGate = () => {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'guest'>('loading');

  useEffect(() => {
    const checkToken = async () => {
      const token = await readToken();

      if (!token) {
        setStatus('guest');
        return;
      }

      if (isJwtValid(token)) {
        setStatus('authenticated');
        return;
      }

      await removeToken();
      setStatus('guest');
    };

    checkToken();
  }, []);

  const navigator = useMemo(() => {
    if (status === 'authenticated') return <AppNavigator />;
    if (status === 'guest') return <AuthNavigator />;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }, [status]);

  return <NavigationContainer>{navigator}</NavigationContainer>;
};

export default AuthGate;
