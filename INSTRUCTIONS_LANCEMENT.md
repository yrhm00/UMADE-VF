# 🚀 Guide de Démarrage UMADE (Corrigé)

Ce guide permet de lancer le projet **Umade**.

## 📋 Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (installé et lancé)
- [Homebrew](https://brew.sh/) (pour installer Gradle)
- Java 17 (vérifier avec `java -version`)
- Node.js (vérifier avec `node -v`)

---

## Étape 1 : Installer Gradle (Si absent)

Apparemment, le fichier de lancement rapide (`gradlew`) est manquant. Il faut installer Gradle manuellement :

```bash
brew install gradle
```

Vous pouvez ensuite générer le script manquant pour le futur (optionnel) :
```bash
cd "Desktop/UMADE VF/backend"
gradle wrapper
```

---

## Étape 2 : Lancer la Base de Données (Terminal 1)

Lancez cette commande pour démarrer PostgreSQL via Docker.

```bash
docker run --name umade-db \
  -e POSTGRES_DB=umade \
  -e POSTGRES_USER=umade \
  -e POSTGRES_PASSWORD=umade \
  -p 5432:5432 \
  --rm \
  postgres:15
```

---

## Étape 3 : Lancer le Backend (Terminal 2)

Ouvrez un **nouveau terminal**, puis exécutez :

```bash
# 1. Aller dans le dossier backend
cd "Desktop/UMADE VF/backend"

# 2. Lancer le serveur avec la commande installée
gradle bootRun
```

> **Attendez** de voir le message : `Started UmadeApplication in ... seconds`.

---

## Étape 4 : Configurer l'IP (Une seule fois)

1. Trouvez votre **adresse IP locale** :
   - Sur Mac : `ipconfig getifaddr en0` (ou en1).
   - Supposons que c'est `192.168.1.45`.

2. Ouvrez le fichier `.env` qui se trouve dans `Desktop/UMADE VF/`.
3. Modifiez la première ligne avec **votre** IP :
   ```env
   API_BASE_URL=http://192.168.1.45:8080
   ```

---

## Étape 5 : Lancer l'Application Mobile (Terminal 3)

Ouvrez un **troisième terminal**, puis exécutez :

```bash
# 1. Aller dans le dossier mobile
cd "Desktop/UMADE VF/mobile"

# 2. Lancer Expo
npx expo start --clear
```

### Comment tester ?
- **Sur iPhone/Android** : Installez l'app "Expo Go" et scannez le QR code.
- **Sur Simulateur** : Touche `i` pour iOS.
