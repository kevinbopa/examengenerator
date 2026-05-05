# Roadmap Produit

## Vision cible

Construire une plateforme de preparation aux examens qui permet de televerser les documents d'un cours et ses anciens examens, puis de generer de nouveaux examens credibles, les faire passer, les corriger et guider la progression de l'etudiant.

## Phase 1 - Base MVP exploitable

Objectif : sortir du mode mono-chapitre code en dur et rendre le produit utilisable de bout en bout pour un vrai cours televerse par l'utilisateur.

Livrables :
- modele de cours;
- upload de documents de cours;
- upload d'anciens examens;
- pipeline d'ingestion de texte exploitable;
- generation d'examens a partir des sources du cours;
- simulation chronometree;
- correction IA exploitable;
- assistant linguistique discret;
- copie corrigee;
- base de pilotage Git/GitHub.

Etat :
- socle livre et fonctionnel;
- Sprint 1 termine;
- prochaine priorite : remplacer les contenus hardcodes par un flux generique par cours.

## Phase 2 - Fiabilite et profondeur pedagogique

Objectif : rendre la correction plus robuste et plus juste.

Livrables :
- baremes structures par type de question;
- diagnostic par concept;
- mapping question -> concepts;
- temps d'examen estime plus finement;
- couverture de tests backend;
- anti-duplication entre deux generations.

## Phase 3 - Experience produit

Objectif : rendre l'experience plus premium et plus rassurante.

Livrables :
- mode examen verrouille;
- sauvegarde de progression;
- copie corrigee annotee;
- meilleure accessibilite;
- historique d'examens;
- export de copie et correction.

## Phase 4 - Plateforme evolutive

Objectif : aller vers un vrai coach d'examen multi-cours.

Livrables :
- multi-chapitres;
- import de documents;
- RAG mieux structure;
- recommandations d'entrainement personnalisees;
- parcours adaptatif selon les faiblesses.

## Priorites actuelles

1. Permettre l'import d'un vrai cours et de ses anciens examens.
2. Construire un pipeline d'ingestion fiable et reutilisable.
3. Generer des examens a partir des sources televersees plutot que de contenus hardcodes.
4. Continuer en TDD sur chaque brique critique du MVP.
