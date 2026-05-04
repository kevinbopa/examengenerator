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

## Pourquoi le mode fallback en premier

Le mode fallback est le plus stable pour une suite automatique locale car :
- il ne depend pas d'un appel reseau externe;
- il permet de verifier les contrats JSON;
- il protege les regressions sur le comportement minimal garanti.

## Evolution recommandee

1. Ajouter des tests unitaires sur les fonctions de sanitation et de schemas.
2. Introduire des tests d'integration avec mocking d'OpenAI.
3. Ajouter des tests frontend sur les parcours critiques.
