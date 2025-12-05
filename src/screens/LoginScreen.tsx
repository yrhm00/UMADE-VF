import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { z } from 'zod';
import { AuthStackParamList } from '../navigation/AuthNavigator';

const loginSchema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = () => {
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) formErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(formErrors);
      return;
    }

    setErrors({});
    // TODO: appeler l'API de connexion, puis sauvegarder le token sécurisé
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Connexion</Text>

      <View style={{ marginBottom: 12 }}>
        <Text>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          style={{ borderWidth: 1, padding: 8, borderRadius: 4, marginTop: 6 }}
        />
        {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text>Mot de passe</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          style={{ borderWidth: 1, padding: 8, borderRadius: 4, marginTop: 6 }}
        />
        {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
      </View>

      <View style={{ marginBottom: 12 }}>
        <Button title="Se connecter" onPress={onSubmit} />
      </View>
      <View style={{ marginBottom: 12 }}>
        <Button title="Créer un compte" onPress={() => navigation.navigate('Register')} />
      </View>
      <Button title="Mot de passe oublié" onPress={() => navigation.navigate('ResetPassword')} />
    </View>
  );
};

export default LoginScreen;
