# Audit technique — 6 octobre 2026

## Périmètre

Revue statique du frontend React/Vite et du serveur Express : routage,
authentification, autorisations, accès PostgreSQL, limitation de débit,
configuration Vite, livraison du build et dépendances npm.

## Corrections réalisées

- **Sécurité des dépendances** : `npm audit` a révélé `proxy-addr` (critique),
  `qs` (modéré) et `source-map-js` (élevé). `npm audit fix` a appliqué les
  versions compatibles ; npm a ensuite indiqué zéro vulnérabilité.
- **Rate limit** : limites séparées pour connexion/inscription, contributions
  et autres routes. Le proxy inverse n'est considéré fiable que si
  `TRUST_PROXY` est explicitement configuré.
- **Comptes et rôles** : mots de passe hachés avec scrypt, cookies de session
  HttpOnly/SameSite, origine vérifiée sur les mutations et permissions admin
  contrôlées côté serveur.
- **Contribution trompeuse** : le formulaire public n'affiche plus un succès
  fictif ; il dirige vers le flux authentifié qui persiste la proposition.
- **Production** : Express sert le build Vite et ses routes SPA ; Vite ne
  désactive plus la vérification de nom d'hôte.
- **Qualité** : lint limité au code du projet, erreurs et avertissements
  applicatifs corrigés. Les pages sont chargées à la demande ; le bundle
  d'entrée minifié est passé d'environ 693 Ko à 278 Ko.
- **Git** : `.gitignore` exclut secrets, dépendances et build ; version initiale
  `0.1.0`, conventions Conventional Commits et SemVer documentées.

## Vérifications effectuées

- `npm run lint` : succès, sans avertissements.
- `npm run build` : succès ; aucun chunk ne dépasse 500 Ko.
- `node --check` sur les fichiers JavaScript du serveur : succès.
- Smoke test HTTP sans base : health check, fallback SPA, absence de DB et 404
  API vérifiés avec succès.
- Audit npm complet : après les corrections, `npm audit fix` a indiqué zéro
  vulnérabilité.

## Limites restantes

- Aucun serveur PostgreSQL ni `DATABASE_URL` n'est fourni dans cet espace ; les
  parcours compte/modération n'ont donc pas pu être exercés contre une vraie
  base.
- Aucun répertoire de tests automatisés n'existait. Le smoke test était
  éphémère ; aucun test navigateur, PostgreSQL d'intégration ou test de charge
  n'est encore conservé dans le dépôt.
- Les contributions enregistrent titre et description ; l'envoi des fichiers
  d'archive et leur stockage restent à implémenter.
- Les abonnements push sont persistés avec PostgreSQL ; sans base, le mode
  local garde les abonnements en mémoire et les perd au redémarrage.
- Les créations de tables sont idempotentes, mais ne sont pas encore gérées
  par un historique de migrations versionnées avec rollback.
- Le lint et le build ne remplacent pas une revue de contenu, une recette UI
  mobile ni une validation de déploiement derrière le proxy réel.
