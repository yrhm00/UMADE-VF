import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ProfileUpdatePayload } from "../api";
import { useProfile } from "../store";

interface FieldConfig {
  key: keyof ProfileUpdatePayload;
  label: string;
  required?: boolean;
  keyboardType?: "default" | "email-address";
}

const fields: FieldConfig[] = [
  { key: "firstName", label: "Prénom", required: true },
  { key: "lastName", label: "Nom", required: true },
  { key: "email", label: "Email", required: true, keyboardType: "email-address" },
  { key: "bio", label: "Bio" },
];

function validate(payload: ProfileUpdatePayload): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!payload.firstName.trim()) {
    errors.firstName = "Le prénom est obligatoire";
  }

  if (!payload.lastName.trim()) {
    errors.lastName = "Le nom est obligatoire";
  }

  if (!payload.email.trim()) {
    errors.email = "L'email est obligatoire";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "Email invalide";
  }

  if (payload.bio && payload.bio.length > 280) {
    errors.bio = "La bio doit faire moins de 280 caractères";
  }

  return errors;
}

export function ProfileEdit() {
  const { profile, loading, error, refresh, saveProfile, uploadAvatar } = useProfile();
  const [form, setForm] = useState<ProfileUpdatePayload>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | undefined>();

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        bio: profile.bio ?? "",
        avatarUrl: profile.avatarUrl,
        avatarContentType: profile.metadata.avatarContentType,
        avatarSize: profile.metadata.avatarSize,
      });
    }
  }, [profile]);

  const validationErrors = useMemo(() => validate(form), [form]);

  const handleChange = (key: keyof ProfileUpdatePayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setStatus(undefined);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await saveProfile(form);
    setStatus("Profil mis à jour");
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadAvatar(file, file.name, file.type);
    setStatus("Avatar synchronisé avec S3");
  };

  if (!profile && loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modifier mon profil</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {status ? <Text style={styles.success}>{status}</Text> : null}

      {fields.map((field) => (
        <View key={field.key} style={styles.field}>
          <Text style={styles.label}>
            {field.label}
            {field.required ? " *" : ""}
          </Text>
          <TextInput
            value={(form[field.key] as string) ?? ""}
            onChangeText={(text) => handleChange(field.key, text)}
            style={[styles.input, errors[field.key] ? styles.inputError : undefined]}
            placeholder={field.label}
            autoCapitalize="none"
            keyboardType={field.keyboardType ?? "default"}
          />
          <Text style={styles.helper}>
            {errors[field.key] ?? validationErrors[field.key] ?? ""}
          </Text>
        </View>
      ))}

      <View style={styles.field}>
        <Text style={styles.label}>Avatar</Text>
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
        <Text style={styles.helper}>
          {profile?.metadata.avatarContentType && profile?.metadata.avatarSize
            ? `${profile.metadata.avatarContentType} – ${profile.metadata.avatarSize} o`
            : "Ajoutez une image pour synchroniser avec S3"}
        </Text>
      </View>

      <Button title={loading ? "Sauvegarde..." : "Enregistrer"} onPress={handleSubmit} disabled={loading} />

      <View style={styles.metadata}>
        <Text style={styles.metadataTitle}>Métadonnées</Text>
        <Text style={styles.metadataItem}>Créé le : {profile ? new Date(profile.metadata.createdAt).toLocaleString() : "–"}</Text>
        <Text style={styles.metadataItem}>
          Mis à jour : {profile ? new Date(profile.metadata.updatedAt).toLocaleString() : "–"}
        </Text>
        <Text style={styles.metadataItem}>Type avatar : {profile?.metadata.avatarContentType ?? "–"}</Text>
        <Text style={styles.metadataItem}>Taille avatar : {profile?.metadata.avatarSize ? `${profile.metadata.avatarSize} o` : "–"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#b91c1c",
  },
  helper: {
    color: "#6b7280",
    marginTop: 4,
    minHeight: 18,
  },
  success: {
    color: "#16a34a",
    marginBottom: 8,
  },
  error: {
    color: "#b91c1c",
    marginBottom: 8,
  },
  metadata: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
  },
  metadataTitle: {
    fontWeight: "700",
    marginBottom: 8,
  },
  metadataItem: {
    marginBottom: 4,
    color: "#374151",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileEdit;
