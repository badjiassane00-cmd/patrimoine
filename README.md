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
