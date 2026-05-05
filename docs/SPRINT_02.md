# Sprint 2

## Objectif du sprint

Faire passer le produit d'un socle local mono-chapitre a un vrai MVP capable de prendre en entree un cours televerse et ses anciens examens.

## Periode

Sprint 2 de consolidation MVP.

## Issues MVP proposees

### Issue 6 - Creer un modele de cours generique

En tant qu'equipe produit,
je veux un vrai modele `Course`,
afin de sortir de la logique actuelle basee sur un seul chapitre code en dur.

Portee :
- definir l'identite d'un cours;
- definir ses documents sources;
- definir ses anciens examens;
- definir son etat de traitement.

Donnees minimales :
- `id`
- `title`
- `courseCode`
- `description`
- `sources[]`
- `pastExams[]`
- `ingestionStatus`
- `createdAt`
- `updatedAt`

Critere d'acceptation :
- un cours peut etre cree et charge localement;
- la structure est reutilisable par le frontend et le backend;
- la logique actuelle peut referencer un cours actif;
- la logique est testee en TDD.

Statut :
- terminee
- livree avec modele partage, catalogue local seed, endpoints `GET /api/courses`, `POST /api/courses` et `activeCourse` expose dans `GET /api/health`

### Issue 7 - Ajouter l'upload des documents de cours

En tant qu'etudiant,
je veux televerser les documents de mon cours,
afin que l'application puisse generer un examen pertinent a partir de ma vraie matiere.

Portee :
- UI d'upload;
- validation des formats;
- stockage local MVP;
- affichage des fichiers importes.

Formats MVP vises :
- `pdf`
- `md`
- `txt`
- `docx` si le parsing reste maitrisable

Critere d'acceptation :
- l'utilisateur peut televerser un ou plusieurs documents;
- les fichiers sont lies au bon cours;
- l'interface montre l'etat du televersement;
- les erreurs de format sont gerees proprement;
- les parcours critiques sont testes.

Statut :
- terminee
- livree avec endpoint `POST /api/courses/:courseId/documents`, stockage local MVP, validation des formats `md`, `txt`, `pdf`, `docx` et interface de televersement sur la landing

### Issue 8 - Ajouter l'upload des anciens examens

En tant qu'etudiant,
je veux televerser d'anciens examens lies a mon cours,
afin que la generation reproduise mieux le style des vraies evaluations.

Portee :
- UI d'upload dediee;
- rattachement a un cours;
- metadonnees minimales;
- consultation de la liste des examens importes.

Metadonnees MVP :
- `session`
- `year`
- `sourceName`
- `format`

Critere d'acceptation :
- l'utilisateur peut ajouter plusieurs anciens examens;
- les examens sont stockes et visibles par cours;
- les erreurs de televersement sont claires;
- les parcours critiques sont testes.

Statut :
- terminee
- livree avec endpoint `POST /api/courses/:courseId/past-exams`, stockage local MVP, metadonnees minimales `session`, `year`, `sourceName`, validation des formats et interface dediee sur la landing

### Issue 9 - Construire le pipeline d'ingestion MVP

En tant que systeme,
je veux extraire et nettoyer le texte des fichiers televerses,
afin de produire une base exploitable pour la generation et la correction.

Portee :
- extraction texte;
- nettoyage;
- normalisation;
- segmentation;
- statut de traitement.

Sorties attendues :
- texte brut extrait;
- texte nettoye;
- segments exploitables;
- erreurs et warnings d'ingestion;
- une base suffisante pour pouvoir produire un premier examen d'exemple du cours.

Critere d'acceptation :
- les documents de cours peuvent etre convertis en texte exploitable;
- les anciens examens peuvent etre convertis en texte exploitable;
- chaque source a un statut clair;
- une strategie de fallback existe si un document ne peut pas etre parse;
- la logique est testee en TDD.

Statut :
- terminee
- livree avec endpoint `POST /api/courses/:courseId/ingest`, extraction best-effort, nettoyage, segmentation, resume d'ingestion, garde-fou sur cours vide et reutilisation des textes ingeres pour preparer la generation future

### Issue 10 - Construire l'index pedagogique d'un cours

En tant que systeme,
je veux construire un index pedagogique par cours,
afin d'alimenter la generation d'examens et la correction avec une base plus fiable.

Portee :
- themes recurrents;
- concepts detectes;
- vocabulaire significatif;
- signaux de style observes dans les anciens examens.

Critere d'acceptation :
- un cours televerse produit un index exploitable;
- cet index peut etre relu par le moteur de generation;
- les concepts identifies restent lies aux sources;
- la logique est testee.

Statut :
- terminee
- livree avec endpoint `POST /api/courses/:courseId/pedagogical-index`, extraction heuristique de concepts, themes et signaux de style, persistance sur le cours actif, exposition au moteur de prompt et carte UI dediee

### Issue 11 - Generer un examen a partir des sources televersees

En tant qu'etudiant,
je veux obtenir un examen genere a partir de mon cours et de ses anciens examens,
afin de m'entrainer sur un sujet proche de la realite.

Portee :
- selection d'un cours;
- prompt de generation contextualise par les sources du cours;
- generation de questions variees;
- fallback si l'IA echoue.

Critere d'acceptation :
- la generation n'utilise plus seulement les fichiers hardcodes du repo;
- l'examen produit fait reference au cours actif;
- les anciens examens influencent la tournure des questions;
- un examen d'exemple du cours peut etre cree des que les sources minimales sont disponibles;
- la logique est testee.

Statut :
- terminee
- livree avec generation fallback source-driven depuis le cours actif, auto-preparation de l index pedagogique si necessaire, prompts IA generiques par cours et premier examen d exemple cree a partir des sources importees

### Issue 12 - Suivi systematique des bugs

En tant qu'equipe produit,
je veux qu'un bug detecte donne lieu a une issue dediee,
afin d'eviter de tourner en rond et de perdre les problemes en discussion.

Portee :
- template GitHub de bug;
- politique de triage;
- journal local des bugs si GitHub n'est pas ouvert immediatement.

Critere d'acceptation :
- un template de bug existe dans le repo;
- une politique de triage est documentee;
- tout bug detecte pendant le dev doit etre note avant correction ou explicitement rattache a une issue existante.

Statut :
- terminee cote pilotage repo
- livree avec templates GitHub, politique de triage et backlog local de bugs

## Ordre recommande

1. Renforcer la variete inter-sessions et l anti-duplication
2. Associer plus finement chaque question aux concepts du cours

## Definition of Done du sprint

- chaque issue critique suit TDD;
- les tests et le build passent;
- la documentation produit et technique est mise a jour;
- le MVP gagne en utilite reelle pour un cours televerse par l'utilisateur.
