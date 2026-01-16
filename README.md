# API MVC Node - Documentation Développeurs

Bienvenue dans le projet **API MVC Node**. Cette documentation est destinée aux développeurs pour comprendre l'architecture, les conventions et les procédures de développement.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Versioning](#versioning)
- [Authentification](#authentification)
- [Téléchargement de fichiers](#téléchargement-de-fichiers)
- [Logging](#logging)
- [Tests](#tests)
- [Documentation Swagger](#documentation-swagger)
- [Conventions de code](#conventions-de-code)
- [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble

Ce projet est une API REST construite avec **Express.js** en utilisant le pattern **MVC** (Model-View-Controller). Elle supporte le **versioning d'API** avec des routes séparées pour chaque version (v1, v2, etc.).

**Stack technologique :**
- Node.js (ES modules)
- Express 5.x
- JWT pour l'authentification
- Multer pour les uploads de fichiers
- Pino pour le logging
- Jest pour les tests
- Swagger/OpenAPI pour la documentation
- Rate limiting pour la protection

---

## 🏗️ Architecture

### Pattern MVC

Le projet suit une architecture MVC structurée par version d'API :

```
src/
├── v1/                          # API Version 1
│   ├── controllers/             # Logique métier
│   ├── routes/                  # Définition des routes
│   ├── middlewares/             # Middlewares personnalisés
│   ├── models/                  # Schémas de données
│   └── services/                # Services réutilisables
├── v2/                          # API Version 2
│   ├── controllers/             # Logique métier
│   ├── routes/                  # Définition des routes
│   ├── middlewares/             # Middlewares personnalisés
│   ├── models/                  # Schémas de données
│   └── services/                # Services réutilisables
├── config/                      # Configuration (Swagger, etc.)
├── services/                    # Services partagés (JWT, etc.)
├── utils/                       # Utilitaires (Logger, etc.)
├── app.js                       # Configuration Express
└── server.js                    # Entrée du serveur
```

### Détails des répertoires

| Répertoire | Rôle |
|-----------|------|
| `controllers/` | Traitement des requêtes, appel de services, envoi de réponses |
| `routes/` | Définition des endpoints, validation, middleware d'authentification |
| `middlewares/` | Authentification, autorisation, validation |
| `models/` | Schémas et validations de données |
| `services/` | Logique métier réutilisable, requêtes BD, calculs |
| `config/` | Configuration globale (Swagger, BD, etc.) |

### Principes architecturaux

- **Séparation des préoccupations** : Chaque couche a une responsabilité unique
- **Réutilisabilité** : Services partagés entre versions
- **Versioning** : Maintenance parallèle de plusieurs versions
- **Maintenabilité** : Code organisé et facile à naviguer

---

## 💻 Installation

### Prérequis

- **Node.js** >= 16.x
- **npm** ou **yarn**
- Un gestionnaire d'environnement (`.env`)

### Étapes

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd api-mvc-node
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos configurations
   ```

4. **Configurer Prisma**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   # if is their some trouble please read prisma doc
   # you probable nead model in schema.prisma or complete tour DSN in tour .env 
   ```

5. **Vérifier l'installation**
   ```bash
   npm run dev
   ```
   Le serveur devrait démarrer sur `http://localhost:3000`

---

## ⚙️ Configuration

### Variables d'environnement (`.env`)

```bash
# Serveur
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_change_in_production

# Téléchargements
UPLOAD_DIR=uploads
UPLOAD_MAX_SIZE=5242880  # 5MB en bytes

# Logging
LOG_DIR=logs
LOG_FILE=app.log
LOG_LEVEL=info           # debug, info, warn, error
```

### .env.example

Créez un fichier `.env.example` à la racine avec les variables modèles :

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=change_me_in_production

# File Upload
UPLOAD_DIR=uploads
UPLOAD_MAX_SIZE=5242880

# Logging
LOG_DIR=logs
LOG_FILE=app.log
LOG_LEVEL=info
```

### Variables importantes

| Variable | Description | Défaut |
|----------|-------------|--------|
| `PORT` | Port du serveur | `3000` |
| `JWT_SECRET` | Clé secrète JWT | (obligatoire) |
| `UPLOAD_DIR` | Répertoire des uploads | `uploads` |
| `UPLOAD_MAX_SIZE` | Taille max des fichiers (bytes) | `5242880` (5MB) |
| `LOG_LEVEL` | Niveau de log | `info` |

---

## 🚀 Démarrage

### Mode développement (avec auto-reload)

```bash
npm run dev
```

- Utilise **Nodemon** pour redémarrer le serveur automatiquement
- Parfait pour le développement local
- Les modifications sont détectées en temps réel

### Mode production

```bash
npm start
```

- Lance directement le serveur sans surveillance
- Port par défaut : `3000` (configurable via `PORT`)
- Optimisé pour les performances

### Vérifier le démarrage

Une fois démarré, vous verrez dans la console :

```
🚀 Server running on port 3000
✓ Route registered: /api/v1/auth
✓ Route registered: /api/v1/users
✓ Route registered: /api/v1/uploads
✓ Route registered: /api/v2/auth
✓ Route registered: /api/v2/users
✓ Route registered: /api/v2/uploads
```

---

## 📁 Structure du projet

### Fichiers racine

| Fichier | Objectif |
|---------|----------|
| `package.json` | Dépendances et scripts npm |
| `.env` | Variables d'environnement (à créer) |
| `.env.example` | Modèle de configuration |
| `.gitignore` | Fichiers à ignorer dans Git |
| `jest.config.cjs` | Configuration des tests |

### Répertoires principaux

```
src/
├── app.js                    # Instance Express + initialisation routes
├── server.js                 # Point d'entrée (PORT + démarrage)
├── config/
│   └── swagger.js            # Configuration OpenAPI/Swagger
├── services/
│   └── jwt.service.js        # Gestion des JWT
├── utils/
│   └── logger.js             # Configuration Pino logger
├── v1/ et v2/                # Versions de l'API
└── __tests__/
    └── user.controller.test.js  # Tests unitaires

logs/                          # Fichiers journaux (généré à runtime)
uploads/                       # Fichiers uploadés (généré à runtime)
test-api/                      # Scripts de test API
```

### Fichiers d'exécution

```
compare-versions.js            # Script pour comparer v1 vs v2
test-endpoints.js              # Script pour tester les endpoints
test-setup.js                  # Configuration des tests
```

---

## 🔌 API Endpoints

### Endpoints v1

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/v1/users/info` | Info basique de l'API | ❌ |
| `GET` | `/api/v1/users/profile` | Profil utilisateur | ✅ JWT |
| `POST` | `/api/v1/uploads/:name` | Upload une image | ❌ |

### Endpoints v2

| Méthode | Endpoint | Description | Différences |
|---------|----------|-------------|-------------|
| `GET` | `/api/v2/users/info` | Info enrichie (OS, hostname) | Inclut api_version, os, arch, hostname |
| `GET` | `/api/v2/users/profile` | Profil utilisateur | Identique à v1 |
| `POST` | `/api/v2/uploads/:name` | Upload une image | Identique à v1 |

### Exemples de requêtes

**v1 - Info basique :**
```bash
curl http://localhost:3000/api/v1/users/info
```
Réponse (200) :
```json
{
  "msg": "ok"
}
```

**v2 - Info enrichie :**
```bash
curl http://localhost:3000/api/v2/users/info
```
Réponse (200) :
```json
{
  "msg": "ok",
  "api_version": "v2",
  "os": "linux",
  "arch": "x64",
  "hostname": "server-01"
}
```

**Profil utilisateur (avec JWT) :**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:3000/api/v1/users/profile
```
Réponse (200) :
```json
{
  "id": "user123",
  "role": "admin"
}
```

**Upload d'image :**
```bash
curl -X POST -F "file=@image.jpg" \
  http://localhost:3000/api/v1/uploads/my-image
```
Réponse (201) :
```json
{
  "url": "uploads/my-image.jpg",
  "size": 15234,
  "mimetype": "image/jpeg"
}
```

---

## 🔄 Versioning

### Stratégie de versioning

- **Compatibilité descendante** : Les clients utilisant v1 ne sont pas affectés par les changements en v2
- **Évolution progressive** : Déployer des améliorations sans briser l'API existante
- **Maintenance parallèle** : Pouvoir supporter plusieurs versions pendant la transition

### Structure d'une version

Chaque version possède sa propre structure indépendante :

```
src/v1/
├── controllers/    # Logique spécifique à v1
├── routes/        # Routes v1
├── middlewares/   # Middlewares v1
├── models/        # Models v1
└── services/      # Services v1
```

### Ajouter une nouvelle version (v3)

1. **Créer la structure**
   ```bash
   mkdir -p src/v3/{controllers,routes,middlewares,models,services}
   ```

2. **Créer les fichiers** (copier depuis v2 et adapter)
   ```
   src/v3/
   ├── controllers/
   ├── routes/
   ├── middlewares/
   ├── models/
   └── services/
   ```

3. **Le système découvre automatiquement** les nouvelles routes grâce au code dans [app.js](src/app.js) :
   ```javascript
   const versionDirs = fs.readdirSync(versionsDir)
     .filter(file => /^v\d+$/.test(file));
   ```

4. **Les endpoints seront disponibles** sur `/api/v3/...`

### Différences entre versions

Utilisez `compare-versions.js` pour comparer les réponses entre versions :

```bash
node compare-versions.js
```

---

## 🔐 Authentification

### JWT (JSON Web Tokens)

L'authentification utilise **JWT** avec les éléments suivants :

**Génération d'un token :**
```javascript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { id: userId, role: userRole },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

**Vérification via middleware :**

Utilisez le middleware `authMiddleware` sur les routes protégées :

```javascript
import { Router } from 'express';
import { profile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
router.get('/profile', authMiddleware, profile);

export default router;
```

**Header requis pour les endpoints protégés :**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Flux d'authentification

1. **Utilisateur envoie ses identifiants** au endpoint de login
2. **Serveur valide et génère un JWT**
3. **Client stocke le token** (localStorage, sessionStorage, cookie)
4. **Client envoie le token** dans chaque requête protégée
5. **Middleware valide le token** avant d'exécuter la route

### Erreurs d'authentification

| Code | Message | Cause |
|------|---------|-------|
| `401` | `"Token missing"` | Header Authorization absent |
| `401` | `"Invalid token"` | Token malformé, expiré ou clé incorrecte |

---

## 📤 Téléchargement de fichiers

### Configuration

- **Répertoire** : `uploads/` (configurable via `UPLOAD_DIR`)
- **Taille max** : 5 MB (configurable via `UPLOAD_MAX_SIZE`)
- **Types autorisés** : JPEG, PNG, GIF, WebP
- **Sécurité** : Noms de fichiers sanitisés

### Utilisation

**Endpoint :**
```
POST /api/v1/uploads/:name
POST /api/v2/uploads/:name
```

**Exemple avec curl :**
```bash
curl -X POST -F "file=@photo.png" \
  http://localhost:3000/api/v1/uploads/my-photo
```

**Exemple avec JavaScript/Fetch :**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/v1/uploads/my-photo', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.url); // uploads/my-photo.png
```

**Réponse réussie (201) :**
```json
{
  "url": "uploads/my-photo.png",
  "size": 15234,
  "mimetype": "image/png"
}
```

**Erreurs possibles :**

| Code | Cause | Solution |
|------|-------|----------|
| `400` | Fichier manquant ou type non autorisé | Vérifier le type MIME (JPEG, PNG, GIF, WebP) |
| `413` | Fichier trop volumineux | Réduire la taille ou augmenter `UPLOAD_MAX_SIZE` |

### Accéder aux fichiers uploadés

Une fois uploadés, les fichiers sont accessibles via :

```
http://localhost:3000/uploads/my-photo.png
```

Le serveur expose le répertoire `uploads/` en tant que ressource statique.

### Configuration de la taille

Pour augmenter la limite de taille d'upload, modifiez `.env` :

```bash
# 10 MB
UPLOAD_MAX_SIZE=10485760

# 50 MB
UPLOAD_MAX_SIZE=52428800
```

---

## 📊 Logging

### Configuration

Le projet utilise **Pino** pour un logging performant et structuré. Les logs sont enregistrés dans des fichiers et affichés dans la console.

**Variables d'environnement :**
```bash
LOG_DIR=logs           # Répertoire des logs
LOG_FILE=app.log       # Nom du fichier
LOG_LEVEL=info         # Niveaux: debug, info, warn, error
```

### Niveaux de log

| Niveau | Utilisation | Exemple |
|--------|------------|---------|
| `debug` | Informations détaillées pour débogage | Données temporaires, état intermédiaire |
| `info` | Événements normaux | Requêtes reçues, opérations complétées |
| `warn` | Avertissements | Erreurs résolubles, fichiers manquants |
| `error` | Erreurs graves | Exceptions non gérées, BD inaccessible |

### Accéder au logger dans le code

**Dans les contrôleurs (via middleware Pino) :**
```javascript
export const profile = (req, res) => {
  req.log?.info({ userId: req.user?.id }, 'profile requested');
  res.json({ id: req.user.id, role: req.user.role });
};
```

**Dans les services :**
```javascript
import { logger } from '../utils/logger.js';

export const userService = {
  getUser(id) {
    logger.debug({ userId: id }, 'Fetching user');
    // logique métier
    logger.info({ userId: id }, 'User fetched');
  }
};
```

### Changer le niveau de log

**Temporairement (en ligne de commande) :**
```bash
LOG_LEVEL=debug npm run dev
```

**Permanemment (dans .env) :**
```bash
LOG_LEVEL=debug
```

### Fichiers générés

Les logs sont écrits dans `logs/app.log` et affichés dans la console. Format :

```json
{"level":30,"time":"2026-01-15T10:30:45.123Z","pid":1234,"hostname":"server-01","msg":"profile requested","userId":"user123"}
```

---

## 🧪 Tests

### Exécuter les tests

```bash
# Mode once (une seule exécution)
npm test

# Mode watch (détecte les changements)
npm run test:watch
```

### Framework et outils

- **Jest** : Framework de test avec assertions
- **Supertest** : Testing des routes HTTP sans serveur externe

### Écrire un test

Exemple d'un test d'endpoint :

```javascript
import request from 'supertest';
import app, { initializeRoutes } from '../app.js';

describe('User Controller', () => {
  beforeAll(async () => {
    // Initialiser les routes avant les tests
    await initializeRoutes();
  });

  test('GET /api/v1/users/info returns 200 and msg', async () => {
    const res = await request(app)
      .get('/api/v1/users/info')
      .expect(200);
    
    expect(res.body).toEqual({ msg: 'ok' });
  });

  test('GET /api/v2/users/info returns enhanced info', async () => {
    const res = await request(app)
      .get('/api/v2/users/info')
      .expect(200);
    
    expect(res.body).toHaveProperty('api_version');
    expect(res.body).toHaveProperty('os');
    expect(res.body).toHaveProperty('arch');
    expect(res.body).toHaveProperty('hostname');
  });
});
```

### Test d'authentification

```javascript
test('GET /api/v1/users/profile without token returns 401', async () => {
  const res = await request(app)
    .get('/api/v1/users/profile')
    .expect(401);
  
  expect(res.body.error).toBe('Token missing');
});

test('GET /api/v1/users/profile with token returns 200', async () => {
  const token = jwt.sign({ id: 'user1', role: 'admin' }, process.env.JWT_SECRET);
  
  const res = await request(app)
    .get('/api/v1/users/profile')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  
  expect(res.body.id).toBe('user1');
});
```

### Localisation des tests

Les tests sont organisés dans `src/__tests__/` :
- `user.controller.test.js` : Tests du contrôleur utilisateur
- `auth.controller.test.js` : Tests d'authentification (à ajouter)
- `upload.controller.test.js` : Tests d'upload (à ajouter)

### Configuration Jest

Le fichier `src/jest.config.cjs` configure Jest pour ES modules. Vérifiez qu'il contient :

```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
};
```

---

## 📚 Documentation Swagger

### Accès

L'API est documentée avec **Swagger/OpenAPI** et accessible à :

```
http://localhost:3000/docs
```

**Format brut JSON :**
```
http://localhost:3000/docs.json
```

### Ajouter une documentation pour une route

Utilisez les commentaires **JSDoc OpenAPI** au-dessus de vos routes :

```javascript
/**
 * @openapi
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: user123
 *                 role:
 *                   type: string
 *                   example: admin
 *       401:
 *         description: Unauthorized - Token missing or invalid
 */
router.get('/profile', authMiddleware, profile);
```

### Exemple complet avec upload

```javascript
/**
 * @openapi
 * /uploads:
 *   post:
 *     summary: Upload an image file
 *     description: Upload an image (JPEG, PNG, GIF, WebP). Max size 5MB.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: uploads/image-123.jpg
 *       400:
 *         description: Invalid file type or missing file
 *       413:
 *         description: File too large
 */
router.post('/:name', uploadHandler);
```

### Configuration Swagger

La configuration se trouve dans [src/config/swagger.js](src/config/swagger.js). Vous pouvez y ajouter :

```javascript
const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API MVC Node',
      version: '1.0.0',
      description: 'REST API with MVC pattern and versioning'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development server' }
    ]
  },
  apis: ['./src/**/routes/*.js']
};
```

---

## 📝 Conventions de code

### Nommage des fichiers

- **Routes** : `{resource}.routes.js` (ex: `user.routes.js`)
- **Contrôleurs** : `{resource}.controller.js` (ex: `user.controller.js`)
- **Middlewares** : `{type}.middleware.js` (ex: `auth.middleware.js`)
- **Models** : `{resource}.model.js` (ex: `user.model.js`)
- **Services** : `{resource}.service.js` (ex: `jwt.service.js`)
- **Tests** : `{resource}.test.js` (ex: `user.controller.test.js`)

### Style de code

- **Syntax** : ES Modules (`import`/`export`)
- **Indentation** : 2 espaces
- **Quotes** : Guillemets simples (`'`) sauf pour JSDoc
- **Semicolons** : Oui
- **Async/await** : Préféré aux callbacks ou `.then()`

### Structure d'une route

```javascript
import { Router } from 'express';
import { profile, info } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /users/profile:
 *   get:
 *     summary: Description
 */
router.get('/profile', authMiddleware, profile);

router.get('/info', info);

export default router;
```

### Structure d'un contrôleur

```javascript
export const profile = (req, res, next) => {
  try {
    req.log?.info({ userId: req.user?.id }, 'profile requested');
    res.status(200).json({
      id: req.user.id,
      role: req.user.role
    });
  } catch (err) {
    next(err); // Passer les erreurs au middleware d'erreur
  }
};

export const info = (req, res, next) => {
  try {
    res.status(200).json({ msg: 'ok' });
  } catch (err) {
    next(err);
  }
};
```

### Structure d'un service

```javascript
export const userService = {
  /**
   * Récupère un utilisateur par ID
   * @param {string} id - ID utilisateur
   * @returns {Promise<Object>} Données utilisateur
   */
  async getUser(id) {
    req.log?.debug({ userId: id }, 'Fetching user');
    // logique métier
    return user;
  }
};
```

### Gestion des erreurs

```javascript
export const createUser = (req, res, next) => {
  try {
    // Validation
    if (!req.body.email) {
      const error = new Error('Email is required');
      error.status = 400;
      throw error;
    }

    // Logique métier
    const user = userService.create(req.body);
    
    res.status(201).json(user);
  } catch (err) {
    // Laisser le middleware d'erreur global gérer
    next(err);
  }
};
```

---

## 🐛 Dépannage

### Le serveur ne démarre pas

**Erreur** : `EADDRINUSE: address already in use :::3000`

**Cause** : Le port 3000 est déjà utilisé

**Solutions** :

```bash
# Windows : Trouver et tuer le processus
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux :
lsof -i :3000
kill -9 <PID>

# Ou utiliser un port différent
PORT=3001 npm run dev
```

### "Cannot find module" errors

**Erreur** : `Cannot find module 'express'`

**Cause** : Dépendances non installées

**Solution** :
```bash
npm install
```

### Erreurs d'import ES modules

**Erreur** : `ERR_MODULE_NOT_FOUND`

**Cause** : Chemin d'import incorrect

**Vérifier** :
- L'extension `.js` est incluse dans l'import
- Le chemin relatif est correct
- `"type": "module"` est présent dans `package.json`

```javascript
// ✅ Correct
import app from './app.js';

// ❌ Incorrect
import app from './app';
```

### Erreurs de JWT

**Erreur** : `"Invalid token"`

**Cause** : Token expiré ou clé secrète incorrecte

**Solution** :
```bash
# Vérifier la clé secrète
echo $JWT_SECRET  # macOS/Linux
echo %JWT_SECRET%  # Windows

# Modifier .env
JWT_SECRET=new_secret_key
```

**Erreur** : `"Token missing"`

**Cause** : Header Authorization absent

**Solution** : Ajouter le header :
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/users/profile
```

### Les logs ne s'affichent pas

**Problème** : `LOG_LEVEL` trop élevé ou fichier non créé

**Solution** :
```bash
# Réduire le seuil
LOG_LEVEL=debug npm run dev

# Ou modifier .env
LOG_LEVEL=debug

# Vérifier que le répertoire existe
mkdir -p logs
```

### Upload échoue

**Erreur 413** : `Payload Too Large`

**Cause** : Fichier dépasse la taille limite

**Solution** :
```bash
# Augmenter la limite dans .env
UPLOAD_MAX_SIZE=10485760  # 10MB

# Ou réduire le fichier
```

**Erreur 400** : `Only image files are allowed`

**Cause** : Type de fichier non autorisé

**Types acceptés** : JPEG, PNG, GIF, WebP

**Vérifier** :
```bash
# Utiliser un fichier valide
file image.jpg  # Doit afficher : image data

# Ou utiliser imagemagick
identify image.jpg
```

### Tests ne passent pas

**Erreur** : `Test suites: 1 failed`

**Solution** :
```bash
# Vérifier que le serveur n'est pas en cours d'exécution
npm test

# Mode verbose pour plus de détails
npm test -- --verbose

# Exécuter un test spécifique
npm test -- user.controller.test.js
```

### Base de données introuvable

**Erreur** : `ECONNREFUSED`

**Cause** : Service BD non accessible

**Vérifier** :
```bash
# Vérifier la connexion
ping database_host

# Vérifier les ports
netstat -an | grep 5432  # PostgreSQL
netstat -an | grep 3306  # MySQL
```

---

## 📞 Support & Contribution

Pour toute question ou contribution :

1. **Consulter la documentation** : [Swagger UI](/docs)
2. **Vérifier les logs** : `logs/app.log`
3. **Exécuter les tests** : `npm test`
4. **Testez manuellement** : `node compare-versions.js` ou `node test-endpoints.js`
5. **Ouvrir une issue** sur le repository

---

## Scripts utiles

### Scripts npm

```bash
# Démarrage
npm start                 # Mode production
npm run dev             # Mode développement avec auto-reload

# Tests
npm test                # Exécuter les tests une seule fois
npm run test:watch      # Mode watch (détecte les changements)

# Utilitaires
node compare-versions.js  # Comparer v1 vs v2
node test-endpoints.js    # Tester les endpoints
```

---

**Dernière mise à jour** : Janvier 2026  
**Version du projet** : 1.0.0  
**Node.js requis** : >= 16.x  
**License** : ISC
