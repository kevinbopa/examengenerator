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
- erreurs et warnings d'ingestion.

Critere d'acceptation :
- les documents de cours peuvent etre convertis en texte exploitable;
- les anciens examens peuvent etre convertis en texte exploitable;
- chaque source a un statut clair;
- une strategie de fallback existe si un document ne peut pas etre parse;
- la logique est testee en TDD.

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
- la logique est testee.

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

## Ordre recommande

1. Issue 6 - Modele de cours
2. Issue 7 - Upload des documents de cours
3. Issue 8 - Upload des anciens examens
4. Issue 9 - Pipeline d'ingestion MVP
5. Issue 10 - Index pedagogique
6. Issue 11 - Generation a partir des sources
7. Issue 12 - Suivi systematique des bugs

## Definition of Done du sprint

- chaque issue critique suit TDD;
- les tests et le build passent;
- la documentation produit et technique est mise a jour;
- le MVP gagne en utilite reelle pour un cours televerse par l'utilisateur.
