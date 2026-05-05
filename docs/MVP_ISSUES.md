# Issues MVP detaillees

Ce document sert de source de verite pour les prochaines issues du MVP. Il est ecrit pour eviter les allers-retours flous et pour garder un niveau d'exigence stable.

## Rappel du vrai but du produit

Le produit doit permettre a un utilisateur de :
- creer ou selectionner un cours;
- televerser les documents de ce cours;
- televerser les anciens examens associes;
- laisser le systeme ingerer ces sources;
- generer un nouvel examen credible a partir de ces entrees;
- passer l'examen;
- recevoir une correction utile et une copie corrigee.

## Issue 6 - Modele de cours generique

### Probleme

Le projet repose encore trop sur des sources locales et un chapitre precis. Cette structure bloque l'evolution vers un vrai produit multi-cours.

### Resultat attendu

Introduire un modele `Course` clair, stable et reutilisable.

### Portee technique

- definir les types ou schemas de cours et de source;
- choisir un stockage local MVP;
- permettre la lecture/ecriture d'un cours actif;
- preparer les relations entre cours, documents et anciens examens.

### Risques

- melanger les anciennes donnees hardcodees et les nouvelles donnees utilisateur;
- surconstruire trop tot sans besoin reel.

### TDD attendu

- tests unitaires sur les schemas;
- tests sur la creation et la lecture d'un cours;
- tests sur les cas invalides.

## Issue 7 - Upload des documents de cours

### Probleme

Sans upload de sources, le produit ne peut pas fonctionner sur de vrais cours.

### Resultat attendu

L'utilisateur peut importer les documents d'un cours et voir leur etat.

### Portee technique

- composant frontend d'upload;
- route backend de reception;
- stockage des fichiers;
- liaison au cours concerne.

### Risques

- formats non geres;
- mauvaise UX si l'etat des fichiers n'est pas clair.

### TDD attendu

- tests sur la validation des formats;
- tests sur le rattachement a un cours;
- tests sur les erreurs de televersement.

## Issue 8 - Upload des anciens examens

### Probleme

La generation doit s'inspirer de vrais examens, pas seulement du cours.

### Resultat attendu

L'utilisateur peut importer plusieurs examens passes associes a un cours.

### Portee technique

- UI dediee;
- route backend;
- metadonnees minimales;
- listing dans l'espace du cours.

### TDD attendu

- validation de l'upload;
- persistance de la metadonnee;
- gestion des erreurs.

## Issue 9 - Pipeline d'ingestion MVP

### Probleme

Les fichiers importes doivent devenir une matiere exploitable par l'application.

### Resultat attendu

Chaque source importee produit un texte propre, exploitable et trace.

### Portee technique

- extraction texte;
- nettoyage;
- segmentation;
- journal d'erreurs d'ingestion.

### TDD attendu

- tests sur le nettoyage;
- tests sur les statuts d'ingestion;
- tests sur les fallbacks.

## Issue 10 - Index pedagogique d'un cours

### Probleme

La generation et la correction ont besoin d'une representation plus stable du cours que le simple texte brut.

### Resultat attendu

Un index pedagogique par cours avec concepts, themes et signaux de style.

### Portee technique

- extraction des concepts;
- regroupement thematique;
- exposition des donnees au moteur de generation.

### TDD attendu

- tests sur les structures d'index;
- tests sur le rattachement aux sources;
- tests sur les cas de cours pauvres ou incomplets.

## Issue 11 - Generation a partir des sources televersees

### Probleme

Le systeme doit cesser de dependre principalement des fichiers statiques du repo.

### Resultat attendu

La generation d'examen se fait a partir du cours actif et de ses anciens examens.

### Portee technique

- remplacement du contexte hardcode par le contexte du cours;
- integration de l'index pedagogique;
- garde-fous anti-repetition.

### TDD attendu

- tests sur la construction du prompt;
- tests sur le fallback;
- tests sur la selection du bon cours actif.

## Issue 12 - Suivi systematique des bugs

### Probleme

Les bugs peuvent se perdre dans la conversation, ce qui donne une impression de tourner en rond.

### Resultat attendu

Tout bug detecte devient une trace actionnable.

### Portee technique

- template de bug GitHub;
- doc de triage;
- journal local minimal.

### Regle de fonctionnement

Si un bug est detecte :
1. on le nomme;
2. on le documente;
3. on le rattache a une issue dediee ou existante;
4. on ne le considere pas regle tant qu'il n'est pas verifie.
