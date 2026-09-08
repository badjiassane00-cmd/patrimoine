# Téranga — patrimoine vivant du Sénégal

Plateforme d'archivage et de médiation culturelle du patrimoine matériel et
immatériel du Sénégal : collections, récits, exploration géographique,
passeport gamifié et chatbot "Le Griot".

## Origine de ce projet

Cette version fusionne deux bases :

- **Le projet de base** (architecture, contenu, backend, PWA) : entièrement
  conservé. C'est la version qui fonctionne réellement en local, avec ses
  23 composants, ses 5 pages routées et son serveur de chat.
- **La direction artistique "afrofuturisme éditorial"** (palette noir baobab /
  sable de Joal / rouge bissap / jaune soleil) : reprise et adaptée dans
  `src/index.css`, sans renommer les tokens existants pour ne rien casser.
  Un nouveau logo SVG autonome (`TerangaMark`) remplace le badge générique
  dans le header et le footer — l'ancien logo pointait vers un stockage
  d'images propriétaire indisponible en local, donc recréé ici en SVG pur.

## Stack

React 19 + Vite + React Router + Tailwind CSS v4 (frontend), Express +
Anthropic SDK avec réponses locales de secours (backend chat "Le Griot").

## Lancer le projet

```bash
npm install
cp .env.example .env   # optionnel : ajoutez votre clé Anthropic pour le chat IA
npm run dev             # frontend Vite sur http://localhost:5173
npm run dev:server      # backend Express sur http://localhost:8787 (autre terminal)
```

Sans clé `ANTHROPIC_API_KEY`, le chatbot "Le Griot" répond quand même grâce
à un jeu de réponses locales prédéfinies (`server/knowledge.js`).

## Build de production

```bash
npm run build   # génère dist/
npm run start   # sert le build + l'API sur le port défini par PORT (8787 par défaut)
```

## Déployer sur Render

Le dépôt contient un [render.yaml](../render.yaml) prêt pour un **Web Service Node**. Il utilise `teranga-final` comme répertoire racine, installe les dépendances avec le lockfile, génère `dist/`, puis démarre Express.

Configuration équivalente si le service est créé manuellement :

- **Root Directory** : `teranga-final`
- **Runtime** : Node
- **Build Command** : `npm ci && npm run build`
- **Start Command** : `npm start`
- **Health Check Path** : `/api/health`
- **Version Node** : `20.19.0` ou une version 20 ultérieure compatible avec Vite 8

Variables d'environnement :

- `DATABASE_URL` : URL interne de la base PostgreSQL Render. Elle est optionnelle, mais nécessaire pour conserver les scores et abonnements après un redémarrage.
- `ANTHROPIC_API_KEY` : optionnelle. Sans elle, le chat et le Conteur utilisent leurs réponses locales de secours.
- `ANTHROPIC_MODEL` : optionnelle, avec `claude-3-5-haiku-latest` par défaut.
- `CLIENT_ORIGIN` : à renseigner uniquement si le frontend est servi depuis une autre origine; pour ce service monolithique, les appels `/api/*` sont relatifs et fonctionnent sur le même domaine.
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_CONTACT` : optionnelles, uniquement pour les notifications push.

Si `DATABASE_URL` est absente ou momentanément indisponible, le serveur démarre tout de même afin que Render puisse valider `/api/health`; la migration est réessayée au prochain redémarrage. Vérifiez ensuite les logs Render pour corriger l'URL ou les droits PostgreSQL.
