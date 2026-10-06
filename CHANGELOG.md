# Journal des versions

Les changements notables sont consignés ici. Les versions suivent SemVer ;
voir [la stratégie de versionnement](docs/VERSIONING.md).

## [0.1.0] — 2026-10-06

### Ajouté

- Espaces client et administration avec comptes, rôles, sessions sécurisées et
  persistance PostgreSQL des contributions.
- Services et routes séparés pour les comptes, contributions, quiz,
  notifications push et réponses du chatbot.
- Chargement différé des pages de compte et limitation de débit configurable.

### Corrigé

- Conservation des endpoints de quiz et des abonnements push persistants.
- Retrait de la configuration Vite qui acceptait tous les noms d'hôte.
- Exclusion de `.env`, `node_modules/` et `dist/` du suivi Git.

### Sécurité

- Mise à jour des dépendances ; l'audit npm de production ne signale aucune
  vulnérabilité connue à la date de cette release.
