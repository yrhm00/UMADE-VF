import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'authToken';

export const readToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('Unable to read token', error);
    return null;
  }
};

export const saveToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.warn('Unable to persist token', error);
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('Unable to delete token', error);
  }
};
