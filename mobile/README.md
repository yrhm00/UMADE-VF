# Umade Mobile

Ce dossier contient le socle Expo/React Native (TypeScript strict) pour l'application mobile Umade.

## Outillage et conventions

- **ESLint + Prettier** : linting/formatage avec configuration stricte TypeScript et règles React/React Native.
- **Tests** : Jest + React Native Testing Library pour les tests UI, `msw` pour mocker les appels API.
- **Husky (pre-commit)** : exécute `npm run lint` puis `npm run test:ci` avant chaque commit.

### Scripts principaux

- `npm run start` : démarrer Expo.
- `npm run lint` : lint TypeScript/JS.
- `npm run test` / `npm run test:ci` : exécuter Jest avec les mocks `msw`.
- `npm run typecheck` : vérification TypeScript strict.
- `npm run format` : Prettier sur l'ensemble du projet.

### Secrets & configuration

- Copier `.env.example` vers `.env` et renseigner `API_BASE_URL` et `FCM_WEB_API_KEY`.
- `app.config.ts` injecte ces variables dans `extra` pour Expo (compatible `eas secret` ou `expo secrets:set`).
- Pour une gestion avancée, chiffrer `.env` via `sops` ou utiliser les secrets chiffrés EAS (`eas secret:create`).

### Tests & mocks

- Les handlers MSW sont dans `src/mocks/handlers.ts` et déclarés dans `jest.setup.ts`.
- Exemple de test UI dans `src/App.test.tsx` montre le rendu conditionné par une requête API mockée.

### CI/CD

- Le workflow GitHub Actions (`.github/workflows/mobile-ci.yml`) exécute lint + tests sur chaque push/PR.
- Les jobs de build utilisent `eas build` (profils `beta` et `release`) avec les secrets `EXPO_TOKEN`, `EAS_PROJECT_ID` et credentials Android/iOS fournis via secrets GitHub.

