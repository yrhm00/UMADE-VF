import React, { useEffect } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useProfile } from "../store";

function MetadataRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <View style={styles.metadataRow}>
      <Text style={styles.metadataLabel}>{label}</Text>
      <Text style={styles.metadataValue}>{value ?? "–"}</Text>
    </View>
  );
}

export function ProfileView() {
  const { profile, loading, error, refresh } = useProfile();

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading && !profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error && !profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text>Profil introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {profile.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.placeholderText}>
              {profile.firstName.charAt(0)}
              {profile.lastName.charAt(0)}
            </Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.email}>{profile.email}</Text>
          {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Métadonnées</Text>
        <MetadataRow label="Créé le" value={new Date(profile.metadata.createdAt).toLocaleString()} />
        <MetadataRow label="Mis à jour" value={new Date(profile.metadata.updatedAt).toLocaleString()} />
        <MetadataRow label="Type avatar" value={profile.metadata.avatarContentType} />
        <MetadataRow label="Taille avatar" value={profile.metadata.avatarSize ? `${profile.metadata.avatarSize} o` : undefined} />
      </View>

      {error ? (
        <View style={styles.section}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#e5e7eb",
  },
  placeholderAvatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#6b7280",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  email: {
    color: "#6b7280",
    marginTop: 2,
  },
  bio: {
    marginTop: 8,
  },
  section: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  metadataLabel: {
    color: "#4b5563",
  },
  metadataValue: {
    fontWeight: "600",
  },
  error: {
    color: "#b91c1c",
  },
});

export default ProfileView;
