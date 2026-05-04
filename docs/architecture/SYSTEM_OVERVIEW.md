# Vue d'ensemble du systeme

## But produit

L'application permet de :
- generer un examen a partir du cours et d'examens passes;
- faire passer une simulation chronometree;
- corriger les reponses avec une logique locale et/ou IA;
- assister l'etudiant sur la langue sans changer le fond.

## Blocs principaux

### Frontend

Le frontend React/Vite gere :
- l'accueil du chapitre;
- le lancement d'un examen;
- l'affichage des questions;
- la saisie des reponses;
- l'assistant linguistique;
- les resultats et la copie corrigee.

Principales zones :
- `src/App.jsx`
- `src/components/ExamWorkspace.jsx`
- `src/components/QuestionRenderer.jsx`
- `src/components/SmartWritingEditor.jsx`
- `src/components/ResultsView.jsx`
- `src/data/examData.js`
- `src/utils/grading.js`

### Backend

Le backend Express gere :
- la generation d'examen;
- la correction finale;
- l'assistance linguistique;
- la copie corrigee.

Point d'entree :
- `server/index.mjs`

Responsabilites actuelles :
- healthcheck et configuration IA;
- generation d'examen;
- correction finale;
- assistant linguistique;
- copie corrigee;
- schemas JSON et sanitation des sorties.

### Sources pedagogiques

Le systeme s'appuie sur :
- `H26_GLO2003_09_Agilite_XP.md`
- `examens.md`
- la banque locale `src/data/examData.js`

## Endpoints critiques

### `POST /api/generate-exam`

Role :
- generer un examen IA base sur le chapitre, la banque actuelle et les exemples d'examens.

Fallback :
- retourne l'examen local si l'IA est indisponible.

### `POST /api/evaluate-exam`

Role :
- produire une correction professorale finale avec note, feedback et priorites d'amelioration.

Fallback :
- utilise `gradeExam(...)` si l'IA est indisponible.

### `POST /writing-assistant/correct`

Role :
- analyser une reponse en cours d'ecriture;
- proposer des ameliorations de langue;
- ne jamais ajouter de contenu de fond.

Fallback :
- retourne une liste vide si l'IA est indisponible.

### `POST /api/generate-corrected-copy`

Role :
- produire une copie corrigee sur la forme linguistique, sans enrichissement de fond.

Fallback :
- conserve le texte original si l'IA est indisponible.

## Flux principaux

- Generation d'examen :
  cours + exemples + banque locale -> backend -> OpenAI ou fallback -> frontend
- Passage de l'examen :
  frontend -> navigation questions -> stockage local des reponses -> minuterie
- Correction finale :
  frontend -> `/api/evaluate-exam` -> sortie structuree -> vue resultats
- Assistance linguistique :
  editeur -> `/writing-assistant/correct` -> suggestions localisees -> validation utilisateur

## Source de verite de cartographie

- [MODULE_MAP.md](./MODULE_MAP.md)
- [flows/exam-lifecycle.md](./flows/exam-lifecycle.md)
- [flows/writing-assistant.md](./flows/writing-assistant.md)

## Risques actuels

- forte concentration de logique dans `server/index.mjs`;
- prompts IA encore tres couples a l'implementation;
- absence actuelle de vraie couverture de tests backend;
- robustesse du repérage de suggestions linguistiques encore sensible aux cas limites de texte.

## Direction d'evolution

1. Extraire la logique IA dans des modules dedies.
2. Isoler schemas, prompts et adaptateurs de sortie.
3. Ajouter des tests backend sur les endpoints critiques.
4. Stabiliser encore l'assistant linguistique.

