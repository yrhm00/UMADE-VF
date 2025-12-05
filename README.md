# 📘 UMADE – Rapport d'Architecture Technique Backend (Spring Boot, PostgreSQL, AWS S3)

*Rédigé par un Senior Software Engineer / Backend Architect*

## 1. 🎯 Objectif du Backend

Le backend d'Umade constitue l'épine dorsale du système. Il centralise :

- la gestion des utilisateurs (clients et prestataires)
- la publication et la consultation des inspirations
- la messagerie client–prestataire
- la gestion des événements
- la mise en avant et la conversion des prestataires
- le système de favoris / abonnements
- les reviews
- le système de notification
- la gestion des médias via AWS S3

Il expose une API REST moderne, stateless, sécurisée par JWT, et adaptée aux contraintes d'une application mobile.

## 2. 🏗️ Stack Technique

### Backend

- Java 17
- Spring Boot 3.x
- Spring Web – exposition de l'API REST
- Spring Data JPA – mapping objet/relationnel
- Spring Security – sécurisation + filtre JWT
- Hibernate ORM – moteur ORM
- Jakarta Validation – validation des DTO

### Base de données

- PostgreSQL 15+
- Indexation avancée (GIN, JSONB)
- Relations complexes (favoris, abonnements, reviews)

### Stockage multimédia

- AWS S3
- Upload via URL pré-signée générée par le backend
- Aucun fichier ne transite par l'API → performance et sécurité

### Authentification

- JWT (JSON Web Token) signé en HS256
- Expiration configurable (24h par défaut)

### Notifications

- Firebase Cloud Messaging (FCM)
- Push : nouveau message, nouvelle review, prestataire mis à jour, inspiration favorite mise à jour

### Build & outils

- Gradle
- Docker (optionnel)
- Swagger/OpenAPI (optionnel)
- CI/CD GitHub Actions (potentiel)

## 3. ⚙️ Architecture Applicative

Le backend suit une architecture par feature, découpée en modules indépendants et cohérents.

### Structure générale

```
com.umade
 ├─ auth/               (JWT + Login + Register)
 ├─ users/              (entités & profil utilisateur)
 ├─ providers/          (profil prestataire)
 ├─ inspirations/       (inspirations & médias)
 ├─ favorites/          (favoris inspirations & prestataires)
 ├─ events/             (gestion événements)
 ├─ messages/           (conversations & messages)
 ├─ reviews/            (avis clients)
 ├─ notifications/      (notifications push + centre de notif)
 ├─ storage/            (AWS S3 pre-signed URLs)
 ├─ common/             (base classes, exceptions globales)
 ├─ config/             (sécurité, CORS, JWT filter)
 └─ UmadeApplication.java
```

## 4. 🧩 Architecture Logique

Umade suit une architecture hexagonale simplifiée :

- **Controllers** → endpoints REST
- **Services** → règles métiers
- **Repositories** → interactions DB
- **Entities** → objets de persistance
- **DTOs** → objets d'exposition

Flux classique : `Controller → Service → Repository → PostgreSQL` (avec appels S3 au besoin).

## 5. 🔐 Sécurité : JWT + Spring Security

Le backend utilise un filtre JWT stateless pour sécuriser toutes les routes (sauf login/register/public).

1. Le client envoie un token JWT dans l'en-tête `Authorization: Bearer <token>`.
2. `JwtAuthenticationFilter` vérifie la signature, extrait l'`userId`, charge l'utilisateur depuis la DB et peuple le contexte Spring Security.
3. La requête continue vers le controller déjà authentifiée.

Aucun état serveur, donc mise à l'échelle simple.

## 6. 🗄️ Modèle de Données (PostgreSQL)

### Users

- Profil client ou prestataire
- Email unique, password hashé
- Avatar
- Rôle (`CLIENT`, `PROVIDER`)

### Providers

- Extension d'un user prestataire
- Nom de l'entreprise, description, services, tarifs
- Réseaux sociaux
- Photo/portfolio

### Inspirations

- Liées à un prestataire
- Plusieurs médias (images/vidéos)
- Tags : type, mood, colors, budget
- Visibles dans le feed

### Favoris

- Relations `user ↔ inspiration` et `user ↔ prestataire`
- PK composée pour efficacité

### Messages

- Conversation client↔prestataire
- Messages horodatés
- Pièces jointes (S3)

### Events

- CRUD complet
- Invités
- Couverture
- Lieu / date

### Notifications

- Stockées localement pour le centre de notifications
- Synchronisées via push FCM

## 7. 🔗 API REST – Design global

### Auth

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/password/reset
```

### Users

```
GET /api/users/me
PUT /api/users/me
DELETE /api/users/me
```

### Providers

```
GET /api/providers
GET /api/providers/{id}
POST /api/providers/me
PUT /api/providers/me
POST /api/providers/{id}/favorite
POST /api/providers/{id}/subscribe
POST /api/providers/{id}/review
```

### Inspirations

```
GET /api/inspirations
GET /api/inspirations/{id}
POST /api/inspirations
POST /api/inspirations/{id}/favorite
POST /api/inspirations/{id}/report
```

### Messages

```
GET /api/conversations
POST /api/conversations
POST /api/conversations/{id}/messages
```

### Notifications

```
GET /api/notifications
POST /api/notifications/read-all
```

Design stateless, pagination standard ISO, JSON propre.

## 8. 📦 Gestion des médias – AWS S3

Le backend ne reçoit pas les fichiers directement. Il génère des pre-signed URLs :

1. Le mobile demande `POST /api/storage/presign?type=inspiration`.
2. Le backend retourne une URL pré-signée valable 5 minutes.
3. Le mobile upload directement sur S3.
4. Le backend stocke uniquement l'URL dans PostgreSQL.

Avantages : rapidité, sécurité, aucune charge binaire sur l'API.

## 9. ⚙️ Organisation des tests

- Unit tests sur les services
- Integration tests sur les controllers via Testcontainers (PostgreSQL)
- MockMvc pour tester les endpoints REST

## 10. 🚀 Roadmap du Backend

### Feature flags & rollout progressif

Pour sécuriser l'activation progressive des fonctionnalités sensibles (messagerie et notifications), un système de feature flags maison est introduit :

- Configuration dans `application.yml` sous `umade.feature-flags.messaging` et `umade.feature-flags.notifications`.
- Chaque feature définit :
  - `enabled` : bascule globale (false par défaut pour éviter l'exposition accidentelle).
  - `rollout-percentage` : pourcentage d'utilisateurs autorisés, basé sur un hashing déterministe du `userId`.
  - `allow-list` : liste blanche d'UUIDs toujours activés (équipes QA/ops).
- Les services `MessageService` et `NotificationService` vérifient les flags avant toute action et renvoient un HTTP 403 explicite si la fonctionnalité n'est pas encore ouverte pour l'utilisateur.

### Phase 1 – Fondation (MVP technique)

- Auth complet (register / login / JWT)
- Users (CRUD + profil)
- Feed inspirations (lecture publique)
- Profile utilisateur

### Phase 2 – Providers & favoris

- Providers (profil pro)
- Favorites (inspirations + prestataires)
- Reviews
- Upload S3 (pré-signé)

### Phase 3 – Engagement utilisateur (messaging + notifications)

- Messages client ↔ prestataire (débloqués via feature flag `messaging`)
- Notifications push (FCM) + centre de notifications (débloqués via feature flag `notifications`)

### Phase 4 – Événements

- CRUD événements
- Liste invités
- Partage d'événements
- Bannière

### Phase 5 – Améliorations marketplace

- Filtres avancés
- Search engine (PostgreSQL + indexes)
- Analytics prestataire (simple)

## 11. 🎁 Conclusion

Cette architecture est :

- **Scalable** : stateless par défaut
- **Mobile-first** : JSON propre, pagination efficace
- **Sécurisée** : JWT + Bcrypt + filtrage server side
- **Performante** : S3 direct, pas de transfert de fichier dans l'API
- **Claire pour les devs** : architecture par feature
- **Prête pour le futur** : monétisation prestataires, pub, sponsoring, analytics

Inspirée des standards de plateformes comme Airbnb Experiences, Pinterest, Instagram Business ou WeddingWire.
