# Sprint 2

## Objectif du sprint

Faire passer le produit d'un socle fonctionnel a un vrai MVP pedagogique credible pour le chapitre Agilite / XP.

## Periode

Sprint 2 de consolidation MVP.

## Issues MVP proposees

### Issue 6 - Garantir la variete inter-sessions des examens

En tant qu'etudiant,
je veux que deux sessions successives ne me redonnent pas un examen trop similaire,
afin de m'entrainer reellement et d'eviter l'effet de memorisation.

Critere d'acceptation :
- la generation introduit des variations mesurables de questions et d'angles;
- le systeme evite les doublons trop proches d'une session a l'autre;
- une strategie de fallback locale reste disponible;
- la logique est testee.

### Issue 7 - Mapper chaque question aux concepts du chapitre

En tant qu'etudiant,
je veux savoir quels concepts du chapitre sont evalues par chaque question,
afin de comprendre mes zones de force et de faiblesse.

Critere d'acceptation :
- chaque question expose un ou plusieurs concepts cibles;
- le mapping reste coherent avec le chapitre Agilite / XP;
- la donnee est exploitable ensuite pour le diagnostic final;
- la logique est testee.

### Issue 8 - Renforcer la correction par bareme structure

En tant qu'etudiant,
je veux une correction appuyee sur un bareme plus explicite,
afin de comprendre pourquoi je gagne ou perds des points.

Critere d'acceptation :
- les questions redigees ont des attendus et criteres plus structurees;
- la correction IA s'appuie sur ces attendus;
- les scores partiels sont expliques;
- la logique est testee.

### Issue 9 - Afficher un diagnostic par concept

En tant qu'etudiant,
je veux un bilan par concept en fin d'examen,
afin de savoir quoi reviser en priorite.

Critere d'acceptation :
- un score ou niveau par concept est calcule;
- les concepts faibles sont mis en avant;
- l'UI reste lisible et orientee action;
- la logique est testee.

### Issue 10 - Estimer un temps d'examen plus credible

En tant qu'etudiant,
je veux un temps d'examen estime de maniere plus stricte et plus juste,
afin de me preparer dans des conditions proches d'un vrai examen.

Critere d'acceptation :
- chaque type de question contribue a une estimation justifiee;
- l'estimation finale est visible avant l'examen;
- l'IA peut ajuster mais dans un cadre borne;
- la logique est testee.

### Issue 11 - Finaliser le mode examen MVP

En tant qu'etudiant,
je veux un mode examen plus concentre et plus robuste,
afin de simuler une vraie situation d'evaluation.

Critere d'acceptation :
- l'UI limite les distractions pendant l'examen;
- la progression est sauvegardee localement;
- la soumission finale est robuste;
- les parcours critiques sont verifies.

## Ordre recommande

1. Issue 6 - Variete inter-sessions
2. Issue 7 - Mapping question -> concepts
3. Issue 8 - Bareme structure
4. Issue 9 - Diagnostic par concept
5. Issue 10 - Temps d'examen credible
6. Issue 11 - Mode examen MVP

## Definition of Done du sprint

- chaque issue critique suit TDD;
- les tests et le build passent;
- la documentation produit et technique est mise a jour;
- le MVP gagne en credibilite pedagogique et en fiabilite d'usage.
