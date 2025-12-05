const ACCESS_TOKEN_KEY = 'umade_access_token';
const REFRESH_TOKEN_KEY = 'umade_refresh_token';

const memoryStore: Record<string, string | null> = {
  [ACCESS_TOKEN_KEY]: null,
  [REFRESH_TOKEN_KEY]: null,
};

function hasLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch (error) {
    return false;
  }
}

async function setItem(key: string, value: string | null): Promise<void> {
  if (hasLocalStorage()) {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  }
  memoryStore[key] = value;
}

async function getItem(key: string): Promise<string | null> {
  if (hasLocalStorage()) {
    const value = window.localStorage.getItem(key);
    if (value !== null) {
      memoryStore[key] = value;
      return value;
    }
  }
  return memoryStore[key];
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await setItem(ACCESS_TOKEN_KEY, accessToken);
  await setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getAccessToken(): Promise<string | null> {
  return getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return getItem(REFRESH_TOKEN_KEY);
}

export async function clearTokens(): Promise<void> {
  await setItem(ACCESS_TOKEN_KEY, null);
  await setItem(REFRESH_TOKEN_KEY, null);
}
