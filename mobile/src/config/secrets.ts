import Constants from 'expo-constants';

export type AppSecrets = {
  apiBaseUrl?: string;
  fcmWebApiKey?: string;
};

const loadSecrets = (): AppSecrets => {
  const extra = Constants.expoConfig?.extra ?? {};
  return {
    apiBaseUrl:
      typeof extra.apiBaseUrl === 'string'
        ? extra.apiBaseUrl
        : process.env.API_BASE_URL ?? undefined,
    fcmWebApiKey:
      typeof extra.fcmWebApiKey === 'string'
        ? extra.fcmWebApiKey
        : process.env.FCM_WEB_API_KEY ?? undefined
  };
};

export const secrets = loadSecrets();
