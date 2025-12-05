export type PresignedUrlType = 'avatar' | 'inspiration' | 'message' | 'event-banner' | string;

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  headers?: Record<string, string>;
}

export interface UploadProgress {
  loaded: number;
  total?: number;
  progress: number; // 0..1
}

export interface UploadHandle {
  cancel: () => void;
}

interface UploadOptions {
  mimeType: string;
  signal?: AbortSignal;
  onProgress?: (progress: UploadProgress) => void;
}

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
};

/**
 * Retrieve a pre-signed URL from the backend.
 *
 * The backend is expected to expose an endpoint like `/api/storage/presign?type=<type>`.
 */
export async function getPresignedUrl(
  type: PresignedUrlType,
  backendBaseUrl: string,
  token?: string,
): Promise<PresignedUrlResponse> {
  const url = `${backendBaseUrl.replace(/\/$/, '')}/api/storage/presign?type=${encodeURIComponent(type)}`;

  const headers: Record<string, string> = { ...DEFAULT_HEADERS };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch presigned URL (${response.status}): ${body || response.statusText}`);
  }

  const payload = (await response.json()) as PresignedUrlResponse;
  if (!payload?.uploadUrl || !payload?.fileUrl) {
    throw new Error('Invalid presigned URL payload received from backend');
  }

  return payload;
}

/**
 * Upload a binary payload directly to S3 using the provided pre-signed URL.
 * Uses XMLHttpRequest to enable upload progress in React Native.
 */
export function uploadBinary(
  presignedUrl: string,
  binary: Blob | ArrayBuffer,
  options: UploadOptions,
): { promise: Promise<void>; handle: UploadHandle } {
  const { mimeType, onProgress, signal } = options;
  const xhr = new XMLHttpRequest();

  const promise = new Promise<void>((resolve, reject) => {
    xhr.upload.onprogress = (event) => {
      if (onProgress) {
        const progress: UploadProgress = {
          loaded: event.loaded,
          total: event.lengthComputable ? event.total : undefined,
          progress: event.lengthComputable ? event.loaded / event.total : 0,
        };
        onProgress(progress);
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error while uploading to storage'));
    };

    xhr.onabort = () => {
      reject(new Error('Upload was cancelled by the user'));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', mimeType);
    xhr.send(binary as any);
  });

  const cancel = () => {
    xhr.abort();
  };

  if (signal) {
    signal.addEventListener('abort', cancel, { once: true });
  }

  return { promise, handle: { cancel } };
}

/**
 * High level helper to pick a pre-signed URL, upload the resource and return the final public URL.
 */
export async function uploadFromUri(
  type: PresignedUrlType,
  backendBaseUrl: string,
  fileUri: string,
  mimeType: string,
  token?: string,
  onProgress?: (progress: UploadProgress) => void,
  signal?: AbortSignal,
): Promise<{ fileUrl: string; cancel: () => void }> {
  const presign = await getPresignedUrl(type, backendBaseUrl, token);

  const response = await fetch(fileUri);
  if (!response.ok) {
    throw new Error('Unable to read local file for upload');
  }

  const blob = await response.blob();
  const { promise, handle } = uploadBinary(presign.uploadUrl, blob, { mimeType, onProgress, signal });
  await promise;

  return { fileUrl: presign.fileUrl, cancel: handle.cancel };
}
