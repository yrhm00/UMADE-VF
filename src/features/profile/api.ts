export interface ProfileMetadata {
  createdAt: string;
  updatedAt: string;
  avatarContentType?: string;
  avatarSize?: number;
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  metadata: ProfileMetadata;
}

export interface ProfileUpdatePayload {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  avatarContentType?: string;
  avatarSize?: number;
}

export interface AvatarUploadLink {
  uploadUrl: string;
  publicUrl: string;
  contentType: string;
  requiredHeaders?: Record<string, string>;
}

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:8080";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${text}`);
  }

  return (await response.json()) as T;
}

export async function fetchProfile(): Promise<Profile> {
  return fetchJson<Profile>("/api/users/me");
}

export async function updateProfile(payload: ProfileUpdatePayload): Promise<Profile> {
  return fetchJson<Profile>("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function requestAvatarUploadLink(
  fileName: string,
  contentType: string
): Promise<AvatarUploadLink> {
  return fetchJson<AvatarUploadLink>(`/api/storage/presign?type=avatar`, {
    method: "POST",
    body: JSON.stringify({
      fileName,
      contentType,
    }),
  });
}

export async function uploadAvatarToS3(
  link: AvatarUploadLink,
  file: Blob
): Promise<void> {
  const headers = new Headers();
  headers.set("Content-Type", link.contentType);

  if (link.requiredHeaders) {
    Object.entries(link.requiredHeaders).forEach(([key, value]) => headers.set(key, value));
  }

  const response = await fetch(link.uploadUrl, {
    method: "PUT",
    body: file,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Avatar upload failed: ${response.status} ${text}`);
  }
}

export async function syncAvatar(
  file: Blob,
  fileName: string,
  contentType: string
): Promise<Pick<ProfileUpdatePayload, "avatarUrl" | "avatarContentType" | "avatarSize">> {
  const link = await requestAvatarUploadLink(fileName, contentType);
  await uploadAvatarToS3(link, file);

  return {
    avatarUrl: link.publicUrl,
    avatarContentType: contentType,
    avatarSize: file.size,
  };
}
