# Examen IA

Plateforme de revision universitaire orientee examen. L'objectif produit est de pouvoir televerser les documents d'un cours et ses anciens examens, puis de generer, faire passer et corriger de nouveaux examens credibles.

## Vision

L'application doit permettre a un etudiant de :
- televerser les documents de son cours;
- televerser les anciens examens lies a ce cours;
- obtenir un examen d'exemple du cours cree a partir des sources importees;
- generer un examen realiste a partir du cours et d'anciens examens;
- passer une simulation chronometree;
- recevoir une correction detaillee et severe fondee sur le contenu du cours;
- obtenir un diagnostic par concept;
- ameliorer la forme linguistique de ses reponses sans trahir le fond.

## Etat actuel

Le projet contient deja :
- une application React + Vite;
- un serveur Express pour la generation et la correction IA;
- un modele de cours generique avec catalogue local seed;
- un upload local de documents de cours pour le cours actif;
- un upload local d'anciens examens avec metadonnees minimales;
- un pipeline d'ingestion MVP avec nettoyage, segmentation et resume par cours;
- un index pedagogique de cours avec concepts, themes et signaux de style;
- une generation source-driven capable de produire un premier examen d'exemple a partir d'un cours televerse;
- une bibliotheque d'examens generes conservant plusieurs simulations par cours;
- une interface de simulation d'examen;
- un assistant de correction linguistique;
- une base de questions locales et une generation dynamique d'examens;
- une copie corrigee generee a la demande;
- une architecture documentee;
- des prompts IA centralises et testes.

Limite actuelle :
- la generation source-driven fonctionne maintenant, mais la variete inter-sessions, le rattachement explicite des questions aux concepts et l estimation de temps restent encore a renforcer.

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

## Upload de documents de cours

Le MVP permet deja de televerser des documents de cours pour le cours actif depuis l'interface d'accueil.

Formats actuellement acceptes :
- `md`
- `txt`
- `pdf`
- `docx`

Tu peux maintenant ajouter plusieurs documents en une seule action.

## Upload d'anciens examens

Le MVP permet aussi de televerser des anciens examens pour le cours actif.

Metadonnees minimales actuellement requises :
- `session`
- `year`

Tu peux maintenant ajouter plusieurs anciens examens en une seule action. Le nom de chaque source est derive automatiquement du nom du fichier si aucun intitulé explicite n'est fourni.

## Ingestion des sources

Le MVP permet maintenant de lancer une ingestion du cours actif.

Cette etape :
- extrait un texte brut best-effort;
- nettoie le texte;
- le segmente en blocs exploitables;
- produit un resume global du cours;
- prepare la future generation d'un examen d'exemple a partir des textes ingeres.

## Index pedagogique

Le MVP permet maintenant de construire un index pedagogique a partir des sources ingerees.

Cet index :
- extrait des concepts lies aux sources;
- resume des themes dominants du cours;
- detecte des signaux de style a partir des anciens examens;
- alimente les prompts de generation et de correction.

## Generation d examen

Le MVP sait maintenant produire un examen d exemple a partir du cours actif importe.

En pratique :
- si l IA est disponible, les prompts utilisent le cours actif, les anciens examens et l index pedagogique;
- si l IA n est pas disponible, un fallback local genere quand meme un examen contextualise a partir des sources importees.
- chaque generation est conservee pour que plusieurs examens puissent coexister sur le meme cours.
- l interface permet maintenant de choisir combien d examens generer en une fois.
- la preparation du cours est lancee automatiquement au moment de la generation pour eviter des etapes techniques visibles.

## Persistance locale

Les donnees runtime du MVP ne polluent plus le seed versionne du projet.

En pratique :
- le seed versionne reste dans `data/courses/catalog.json`;
- l etat local evolutif du dashboard est ecrit dans `data/courses/catalog.local.json`;
- les fichiers televerses sont stockes dans `data/courses/uploads/`.

## Tests

Lancer les tests backend :

```powershell
npm test
```

La strategie actuelle couvre d'abord les endpoints critiques en mode fallback :
- ingestion de cours;
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
- [docs/MVP_ISSUES.md](./docs/MVP_ISSUES.md)
- [docs/BUG_POLICY.md](./docs/BUG_POLICY.md)
- [docs/BUG_BACKLOG.md](./docs/BUG_BACKLOG.md)
- [docs/PROMPTS.md](./docs/PROMPTS.md)
- [docs/architecture/README.md](./docs/architecture/README.md)

## Principes de travail

- petites iterations utiles;
- TDD sur la logique metier et les endpoints;
- feedback rapide;
- code simple et evolutif;
- une user story a la fois;
- aucune fonction IA sans garde-fous clairs.
