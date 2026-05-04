# Catalogue de prompts

## Objectif

Formaliser les prompts IA critiques comme des artefacts lisibles, testables et reutilisables.

## Source de verite

Les builders sont centralises dans :
- `src/utils/promptBuilders.js`

## Prompts formalisés

### Generation d'examen

Builder :
- `buildExamGenerationPrompt(...)`

Intentions garanties :
- style proche d'un vrai examen reel;
- couverture de tout le chapitre;
- severite pedagogique;
- questions nouvelles;
- baremes et criteres exploitables.

### Correction professorale

Builder :
- `buildExamEvaluationPrompt(...)`

Intentions garanties :
- severite mais justice;
- separation stricte entre contenu et langue;
- feedback professoral credible;
- respect du bareme;
- valorisation du partiellement juste sans indulgence excessive.

### Assistant linguistique

Builder :
- `buildWritingAssistantPrompt(...)`

Intentions garanties :
- aucune modification du fond;
- pas de nouvelles idees;
- conservation du sens original;
- reformulation locale uniquement;
- adaptation selon `review`, `clarity` ou `academic`.

### Copie corrigee

Builder :
- `buildCorrectedCopyPrompt(...)`

Intentions garanties :
- correction de forme seulement;
- preservation du sens;
- pas d'enrichissement du contenu;
- sortie exploitable pour la restitution finale.

## Verification

Ces prompts sont verifies par tests dans :
- `tests/prompt-builders.test.mjs`

Les tests controlent notamment :
- la presence des contraintes pedagogiques;
- la severite demandee;
- la separation contenu / langue;
- les regles de preservation du fond;
- les contraintes de generation et de correction.
