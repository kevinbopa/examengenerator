# Workflow Agile

## Cadre

Nous travaillons avec une approche agile inspiree du chapitre Agilite / XP :
- iterations courtes;
- feedback rapide;
- simplicite;
- tests frequents;
- amelioration continue.

## Regles de fonctionnement

1. Une fonctionnalite = une user story claire.
2. On decoupe le travail en petites tranches livrables.
3. TDD est la regle par defaut pour la logique metier, les helpers critiques et les API.
4. Toute integration IA doit avoir :
   - un objectif clair,
   - un format de sortie structure,
   - des regles de securite metier,
   - un fallback raisonnable si l'IA echoue.
5. Chaque iteration se termine par :
   - une verification technique,
   - une verification produit,
   - un commit propre.

## Format de story

En tant que `type d'utilisateur`,
je veux `capacite`,
afin de `benefice`.

### Exemple

En tant qu'etudiant,
je veux obtenir une copie corrigee complete,
afin de comprendre a la fois mes erreurs de fond et de langue.

## Definition of Done

Une story est terminee si :
- les tests ont ete ecrits ou ajustes avant la validation finale du comportement;
- le comportement est implemente;
- les cas essentiels sont testes;
- le build passe;
- l'UI reste coherent;
- la documentation necessaire est mise a jour.

## Strategie de branches proposee

- `main` : branche stable
- `feature/...` : une fonctionnalite
- `fix/...` : un correctif
- `docs/...` : documentation

## Convention de commits proposee

- `feat:`
- `fix:`
- `docs:`
- `refactor:`
- `test:`
- `chore:`
