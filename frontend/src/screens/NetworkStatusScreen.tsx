import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const NetworkStatusScreen = () => {
  const { isOffline, type, details } = useNetworkStatus();

  return (
    <View style={[styles.container, isOffline ? styles.offline : styles.online]}>
      <Text style={styles.title}>{isOffline ? 'Hors connexion' : 'Connecté'}</Text>
      <Text style={styles.subtitle}>Type: {type}</Text>
      {details && <Text style={styles.subtitle}>Détails: {JSON.stringify(details)}</Text>}
      {isOffline && <Text style={styles.helper}>Vérifiez votre connexion ou réessayez plus tard.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  offline: {
    backgroundColor: '#fff1f0',
  },
  online: {
    backgroundColor: '#f0fff4',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
  helper: {
    fontSize: 14,
    color: '#cc0000',
  },
});

export default NetworkStatusScreen;
