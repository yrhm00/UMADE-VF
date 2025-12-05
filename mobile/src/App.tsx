import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { secrets } from './config/secrets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0f172a'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center'
  }
});

export default function App(): JSX.Element {
  const [status, setStatus] = useState('Chargement...');

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = secrets.apiBaseUrl ?? 'http://localhost:3000';

    const fetchStatus = async (): Promise<void> => {
      try {
        const response = await fetch(`${baseUrl}/health`, {
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error('API non disponible');
        }
        const payload = await response.json();
        setStatus(payload.status ?? 'OK');
      } catch (error) {
        setStatus('Mode hors-ligne (mock)');
      }
    };

    void fetchStatus();
    return () => controller.abort();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View>
        <Text style={styles.title}>Umade Mobile</Text>
        <Text style={styles.subtitle}>Statut API : {status}</Text>
      </View>
    </SafeAreaView>
  );
}
