import { useEffect, useState } from "react";
import { fetchProfile, Profile, ProfileUpdatePayload, syncAvatar, updateProfile } from "./api";

export interface ProfileState {
  profile?: Profile;
  loading: boolean;
  error?: string;
}

export interface ProfileStore {
  getState: () => ProfileState;
  subscribe: (listener: (state: ProfileState) => void) => () => void;
  refresh: () => Promise<void>;
  saveProfile: (payload: ProfileUpdatePayload) => Promise<void>;
  uploadAvatar: (file: Blob, fileName: string, contentType: string) => Promise<void>;
}

function createProfileStore(): ProfileStore {
  let state: ProfileState = { loading: false };
  const listeners = new Set<(next: ProfileState) => void>();

  const setState = (next: Partial<ProfileState>) => {
    state = { ...state, ...next };
    listeners.forEach((listener) => listener(state));
  };

  const refresh = async () => {
    setState({ loading: true, error: undefined });
    try {
      const profile = await fetchProfile();
      setState({ profile, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load profile";
      setState({ error: message, loading: false });
    }
  };

  const saveProfile = async (payload: ProfileUpdatePayload) => {
    setState({ loading: true, error: undefined });
    try {
      const profile = await updateProfile(payload);
      setState({ profile, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save profile";
      setState({ error: message, loading: false });
    }
  };

  const uploadAvatar = async (file: Blob, fileName: string, contentType: string) => {
    setState({ loading: true, error: undefined });
    try {
      const avatarData = await syncAvatar(file, fileName, contentType);
      const nextProfile = state.profile
        ? {
            ...state.profile,
            avatarUrl: avatarData.avatarUrl,
            metadata: {
              ...state.profile.metadata,
              avatarContentType: avatarData.avatarContentType,
              avatarSize: avatarData.avatarSize,
            },
          }
        : undefined;
      setState({ profile: nextProfile, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to upload avatar";
      setState({ error: message, loading: false });
    }
  };

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
    refresh,
    saveProfile,
    uploadAvatar,
  };
}

export const profileStore = createProfileStore();

export function useProfile(): ProfileState & {
  refresh: () => Promise<void>;
  saveProfile: (payload: ProfileUpdatePayload) => Promise<void>;
  uploadAvatar: (file: Blob, fileName: string, contentType: string) => Promise<void>;
} {
  const [state, setState] = useState<ProfileState>(profileStore.getState());

  useEffect(() => profileStore.subscribe(setState), []);

  return {
    ...state,
    refresh: profileStore.refresh,
    saveProfile: profileStore.saveProfile,
    uploadAvatar: profileStore.uploadAvatar,
  };
}
