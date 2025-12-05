import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { z } from 'zod';
import { AuthStackParamList } from '../navigation/AuthNavigator';

const registerSchema = z
  .object({
    email: z.string().email('Adresse e-mail invalide'),
    password: z.string().min(6, 'Mot de passe trop court'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = () => {
    const result = registerSchema.safeParse({ email, password, confirmPassword });

    if (!result.success) {
      const formErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) formErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(formErrors);
      return;
    }

    setErrors({});
    // TODO: appeler l'API d'inscription, puis sauvegarder le token sécurisé
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Inscription</Text>

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
        <Text>Confirmer le mot de passe</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="••••••••"
          style={{ borderWidth: 1, padding: 8, borderRadius: 4, marginTop: 6 }}
        />
        {errors.confirmPassword && <Text style={{ color: 'red' }}>{errors.confirmPassword}</Text>}
      </View>

      <View style={{ marginBottom: 12 }}>
        <Button title="Créer mon compte" onPress={onSubmit} />
      </View>
      <Button title="Déjà un compte ? Connexion" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default RegisterScreen;
