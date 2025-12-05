import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { z } from 'zod';
import { AuthStackParamList } from '../navigation/AuthNavigator';

const resetSchema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
});

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const onSubmit = () => {
    const result = resetSchema.safeParse({ email });

    if (!result.success) {
      const formErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) formErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(formErrors);
      setSuccess('');
      return;
    }

    setErrors({});
    setSuccess("Un lien de réinitialisation a été envoyé si l'email existe");
    // TODO: appeler l'API de réinitialisation
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Mot de passe oublié</Text>

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
        <Button title="Envoyer" onPress={onSubmit} />
      </View>
      {success ? <Text style={{ color: 'green', marginBottom: 12 }}>{success}</Text> : null}
      <Button title="Retour" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default ResetPasswordScreen;
