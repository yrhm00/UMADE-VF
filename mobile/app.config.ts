import 'dotenv/config';
import { ExpoConfig } from 'expo/config';

type Context = { config: ExpoConfig };

export default ({ config }: Context): ExpoConfig => ({
  ...config,
  name: 'Umade',
  slug: 'umade',
  version: '0.1.0',
  orientation: 'portrait',
  sdkVersion: '51.0.0',
  platforms: ['ios', 'android'],
  assetBundlePatterns: ['**/*'],
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID
    },
    apiBaseUrl: process.env.API_BASE_URL,
    fcmWebApiKey: process.env.FCM_WEB_API_KEY
  },
  updates: {
    enabled: true,
    checkAutomatically: 'ON_LOAD'
  }
});
