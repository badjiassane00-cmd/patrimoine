# Versionnement et livraisons

Téranga suit SemVer (`MAJOR.MINOR.PATCH`) et les messages Conventional Commits.
La version de référence est celle de `package.json` ; chaque version publiée
correspond à un tag Git annoté `vMAJOR.MINOR.PATCH`.

## Choisir le prochain numéro

- **PATCH** : correction rétrocompatible, sécurité, documentation ou
  optimisation sans changement de contrat.
- **MINOR** : nouvelle fonctionnalité rétrocompatible.
- **MAJOR** : changement incompatible d'API, de schéma, de configuration ou
  de comportement documenté.

Les changements de schéma PostgreSQL doivent inclure une migration, une note de
mise à niveau et une stratégie de retour arrière avant toute livraison.

## Commits

Utiliser des branches courtes `feat/`, `fix/`, `refactor/` ou `docs/`, puis
des commits atomiques sous la forme :

```text
<type>(<scope>): <résumé à l'impératif>
```

Types utilisés : `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`,
`ci` et `chore`. Un commit doit compiler et ne doit pas inclure `.env`,
`node_modules/`, `dist/` ou des données locales. Les secrets ne sont jamais
ajoutés à Git.

Exemples :

```text
feat(auth): ajouter les rôles administrateur et client
fix(api): empêcher le rate limit de faire confiance aux en-têtes non vérifiés
perf(frontend): charger les pages à la demande
```

## Procédure de release

1. Mettre à jour `version` dans `package.json` et `package-lock.json`.
2. Exécuter `npm run lint`, `npm run build` et `npm audit`.
3. Vérifier les migrations et le parcours admin/client avec une base de test.
4. Créer un commit `chore(release): vX.Y.Z`.
5. Créer un tag annoté sur ce commit :

   ```bash
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   ```

Les tags publiés sont immuables. Une correction après release reçoit un nouveau
numéro PATCH et un nouveau tag, sans réécrire l'historique.

## État initial

Le dépôt GitHub possédait déjà un historique. La branche d'intégration part de
son `main` afin de préserver les commits et fonctionnalités déjà publiés ;
`0.1.0` devient la première version suivie par cette stratégie de release.
