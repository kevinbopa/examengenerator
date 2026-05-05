# Strategie de tests

## Objectif

Commencer par securiser les flux backend les plus critiques avant d'etendre la couverture.

## Choix technique

La suite utilise :
- `node:test`
- `node:assert/strict`
- un serveur Express lance sur un port ephemere
- `fetch` natif de Node pour les appels HTTP

Ce choix permet :
- zero dependance de test supplementaire;
- une base simple a maintenir;
- des tests proches du comportement reel des endpoints.

## Perimetre actuel

Les tests backend couvrent d'abord les comportements de secours et de validation :
- `GET /api/health`
- `GET /api/courses`
- `POST /api/courses`
- `POST /api/courses/:courseId/documents`
- `POST /api/courses/:courseId/past-exams`
- `POST /api/generate-exam`
- `POST /api/evaluate-exam`
- `POST /api/generate-corrected-copy`
- `POST /writing-assistant/correct`

La suite couvre aussi la logique critique de l'assistant linguistique :
- identifiants de suggestions;
- filtrage des chevauchements;
- conservation des suggestions ignorees valides;
- fusion d'une reformulation ciblee;
- application robuste d'une correction au texte.

La suite couvre aussi la logique critique de la copie corrigee :
- normalisation stricte des entrees retournees;
- conservation de l'ordre reel des questions redigees;
- preservation du texte original de l'etudiant;
- fallback propre si la reformulation est absente ou partielle;
- construction d'un modele d'affichage clair pour l'UI.

La suite couvre aussi la formalisation des prompts IA :
- contraintes de severite pedagogique;
- separation contenu / langue;
- preservation du fond dans les aides linguistiques;
- contraintes explicites de generation et de correction.

La suite couvre aussi le nouveau modele de cours :
- creation et normalisation d'un `Course`;
- gestion d'un catalogue local avec cours actif;
- exposition backend des routes `GET /api/courses` et `POST /api/courses`.

La suite couvre aussi l'upload de documents de cours :
- validation des formats supportes;
- persistence locale d'un document lie a un cours;
- mise a jour du catalogue apres televersement.

La suite couvre aussi l'upload des anciens examens :
- validation des formats supportes;
- verification des metadonnees minimales;
- persistence locale d'un ancien examen lie a un cours;
- mise a jour du catalogue apres televersement.

## Pourquoi le mode fallback en premier

Le mode fallback est le plus stable pour une suite automatique locale car :
- il ne depend pas d'un appel reseau externe;
- il permet de verifier les contrats JSON;
- il protege les regressions sur le comportement minimal garanti.

## Evolution recommandee

1. Ajouter des tests unitaires sur les fonctions de sanitation et de schemas.
2. Introduire des tests d'integration avec mocking d'OpenAI.
3. Ajouter des tests frontend sur les parcours critiques.
