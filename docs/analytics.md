# Analytics & Crash Reporting

## Sources d'événements

| Funnel | Event name | Déclencheur backend | Properties |
| --- | --- | --- | --- |
| Signup | `Signup Completed` | Après création de compte (`AuthService.register`) | `role`, `email` |
| Favoris | `Inspiration Favorited` | Ajout d'un favori inspiration (`InspirationService.addFavorite`) | `inspirationId`, `title`, `authorId` |
| Messages | `Message Sent` | Envoi d'un message (`MessageService.sendMessage`) | `conversationId`, `recipientId`, `hasAttachment` |

Tous les événements sont envoyés en parallèle vers **Segment** et **Amplitude** lorsque les clés d'API sont configurées. Si aucune clé n'est présente, l'événement est ignoré sans bloquer l'appel métier.

## Configuration

Ajoutez les clés via variables d'environnement ou `application.yml` :

```yaml
analytics:
  enabled: true
  segment:
    write-key: ${SEGMENT_WRITE_KEY:}
  amplitude:
    api-key: ${AMPLITUDE_API_KEY:}
```

Les endpoints sont configurables (`analytics.segment.endpoint`, `analytics.amplitude.endpoint`) si vous utilisez des proxies.

## Crash reporting

Le starter Sentry Spring Boot capture automatiquement les exceptions (logback inclus). Paramètres principaux dans `application.yml` :

```yaml
sentry:
  dsn: ${SENTRY_DSN:}
  environment: ${SENTRY_ENVIRONMENT:local}
  release: ${SENTRY_RELEASE:0.0.1}
  traces-sample-rate: 1.0
  profiles-sample-rate: 0.2
  attach-stacktrace: true
```

- **Release + source maps / source bundles** : alignez `SENTRY_RELEASE` avec vos builds et uploadez les sources lors du déploiement via `sentry-cli upload-dif --include-sources` pour permettre l'affichage du code dans les stacktraces.
- **Crashlytics** : si l'app mobile utilise Firebase Crashlytics, faites correspondre la release à `SENTRY_RELEASE` pour corréler les incidents mobile ↔ backend.

## Bonnes pratiques

- Garder les noms d'événements stables : ils sont prêts pour les funnels (signup → favoris → message).
- Ajouter des propriétés métier supplémentaires côté service si nécessaire (ex : type de compte, payload message, provenance de la session).
- Eviter de logger des données sensibles dans les propriétés.
