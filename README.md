# Examen IA

Plateforme de revision universitaire orientee examen pour le cours de processus logiciel, avec un premier focus sur le chapitre Agilite et Extreme Programming.

## Vision

L'application doit permettre a un etudiant de :
- generer un examen realiste a partir du cours et d'anciens examens;
- passer une simulation chronometree;
- recevoir une correction detaillee et severe fondee sur le contenu du cours;
- obtenir un diagnostic par concept;
- ameliorer la forme linguistique de ses reponses sans trahir le fond.

## Etat actuel

Le projet contient deja :
- une application React + Vite;
- un serveur Express pour la generation et la correction IA;
- une interface de simulation d'examen;
- un assistant de correction linguistique;
- une base de questions locales et une generation dynamique d'examens;
- une copie corrigee generee a la demande;
- une architecture documentee;
- des prompts IA centralises et testes.

## Stack

- Frontend : React, Vite
- Backend : Node.js, Express
- IA : OpenAI API
- Style : CSS custom

## Demarrage

1. Installer les dependances :

```powershell
npm install
```

2. Configurer l'environnement :

Creer ou modifier le fichier `.env` a la racine :

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.2
EXAM_SERVER_PORT=8787
```

3. Lancer le projet :

```powershell
npm run dev
```

4. Ouvrir :

[http://localhost:5173](http://localhost:5173)

## Tests

Lancer les tests backend :

```powershell
npm test
```

La strategie actuelle couvre d'abord les endpoints critiques en mode fallback :
- generation d'examen;
- correction d'examen;
- copie corrigee;
- assistant linguistique.

## Structure

```text
src/
  components/
  data/
  utils/
server/
  index.mjs
docs/
  BACKLOG.md
  ROADMAP.md
  SPRINT_01.md
  WORKFLOW.md
```

## Documents de reference

- [H26_GLO2003_09_Agilite_XP.md](./H26_GLO2003_09_Agilite_XP.md)
- [examens.md](./examens.md)
- [mvp_correction_ia_structured_tdd.md](./mvp_correction_ia_structured_tdd.md)
- [docs/ROADMAP.md](./docs/ROADMAP.md)
- [docs/SPRINT_01.md](./docs/SPRINT_01.md)
- [docs/SPRINT_02.md](./docs/SPRINT_02.md)
- [docs/PROMPTS.md](./docs/PROMPTS.md)
- [docs/architecture/README.md](./docs/architecture/README.md)

## Principes de travail

- petites iterations utiles;
- TDD sur la logique metier et les endpoints;
- feedback rapide;
- code simple et evolutif;
- une user story a la fois;
- aucune fonction IA sans garde-fous clairs.
