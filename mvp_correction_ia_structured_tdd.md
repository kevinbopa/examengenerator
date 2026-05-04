# Extension du MVP — Correction IA intelligente

## 1. Nouveau scope MVP
Ton MVP devient une version sérieuse avec les fonctionnalités suivantes :

1. Upload des cours et des anciens examens.
2. Génération d’un examen.
3. Simulation d’examen en mode réel.
4. Soumission des réponses.
5. Correction IA détaillée.
6. Diagnostic de niveau.
7. Analyse des concepts maîtrisés et faibles.

## 2. Fonctionnement de la correction IA
### Étape 1 — L’étudiant répond
Types de réponses :
- QCM : auto-corrigé.
- Réponses courtes : texte.
- Questions longues : texte structuré.

### Étape 2 — Correction basée sur le cours
L’IA ne corrige pas avec son savoir global. Elle corrige uniquement avec :
- le cours,
- les anciens examens,
- les corrigés,
- les critères de correction générés.

La correction repose sur :
- la réponse de l’étudiant,
- le contexte du cours via RAG,
- la réponse attendue,
- le barème.

### Étape 3 — Sortie de correction
Pour chaque question, la correction doit afficher :
- la note,
- l’analyse,
- la correction idéale,
- les erreurs,
- un conseil ciblé.

Exemple :
- Note : 7/10
- Analyse : bonne compréhension du concept X, manque de précision sur Y, mauvaise justification sur Z.
- Correction idéale : [réponse modèle]
- Erreurs : confusion entre A et B, oubli de C.
- Conseil : revoir le chapitre 3, section « CI/CD ».

## 3. Système de scoring global
Après correction complète, le système affiche :
- le score global,
- le niveau estimé,
- le pourcentage de préparation,
- une interprétation claire.

Exemple :
- Score : 72%
- Niveau estimé : Pas prêt / Limite / Prêt / Très prêt
- Préparation estimée : 68%
- Interprétation : tu peux réussir, mais tu risques encore des erreurs importantes.

## 4. Analyse par concept
C’est la partie clé du produit. Chaque question est liée à :
- un chapitre,
- un ou plusieurs concepts.

Ensuite :
- score par question,
- score par concept,
- score global.

Exemple de sortie :
- Concepts maîtrisés :
  - Processus logiciel : 85%
  - Tests unitaires : 78%
- Concepts fragiles :
  - CI/CD : 52%
  - Gestion de configuration : 48%
- Concepts critiques à revoir :
  - Déploiement continu : 40%

## 5. Diagnostic intelligent
Le diagnostic final doit expliquer le profil de l’étudiant de manière claire.

Exemple :
- Tu comprends les bases, mais tu manques de rigueur dans les justifications et les définitions précises.
- Ton profil : étudiant intermédiaire.
- Risque à l’examen : erreurs sur les questions longues.
- Recommandation : pratiquer les questions à développement et revoir les définitions clés.

## 6. Mode examen
Le système doit proposer un vrai mode examen avec :
- minuterie,
- pas d’aide,
- interface propre,
- verrouillage des réponses,
- soumission finale.

Après la soumission :
- correction immédiate, ou
- correction différée.

## 7. Pipeline IA pour la correction
Pipeline recommandé :

1. Génération de l’examen.
2. Génération du corrigé idéal.
3. Génération du barème.
4. Liaison question → concepts.
5. Réponse de l’utilisateur.
6. Récupération du contexte via RAG.
7. Correction IA avec grille.
8. Analyse des erreurs.
9. Score par concept.
10. Rapport final.

## 8. Prompt de correction
### Prompt type
Tu es un professeur universitaire.

Tu dois corriger une réponse d’étudiant.

Contraintes :
- Utilise uniquement le contenu du cours fourni.
- Compare avec la réponse attendue.
- Applique le barème.
- Sois précis, structuré et juste.
- Explique les erreurs sans être vague.

Format :
1. Note (/10)
2. Points forts
3. Erreurs
4. Correction idéale
5. Concepts maîtrisés
6. Concepts à revoir
7. Recommandation

## 9. Fiabilité
Pour obtenir une correction fiable :
- IA 1 corrige.
- IA 2 critique la correction.
- Chaque question doit avoir un barème structuré.
- Le RAG doit toujours injecter les extraits du cours liés à la question.

## 10. Base de données
### UserAnswer
- id
- exam_id
- question_id
- answer_text

### Correction
- id
- user_answer_id
- score
- feedback
- concepts_scores (JSON)

### Concept
- id
- chapter_id
- name

### UserConceptProgress
- user_id
- concept_id
- score

## 11. À éviter absolument
Ne jamais :
- corriger sans barème,
- corriger sans lien au cours,
- donner un score sans justification,
- ne pas expliquer les erreurs,
- donner des feedbacks vagues.

Sinon, le produit perd son intérêt.

## 12. Évolution future
Cette partie n’est pas dans le MVP, mais elle est très pertinente pour la phase 2 :
- plan d’entraînement automatique,
- exercices ciblés sur les faiblesses,
- répétition intelligente,
- progression adaptative.

Exemple :
- tu es faible en CI/CD,
- l’app te génère 10 questions ciblées,
- difficulté progressive,
- correction immédiate.

## 13. Vision produit
L’app devient un coach d’examen intelligent, pas seulement un générateur.
Elle doit permettre de :
- générer,
- simuler,
- corriger,
- analyser,
- améliorer.

## 14. Verdict
Avec cette fonctionnalité, le projet passe d’un outil utile à un produit sérieux avec un potentiel business réel.

Les étudiants veulent :
- savoir s’ils sont prêts,
- comprendre leurs erreurs,
- s’entraîner efficacement.

Actuellement, peu d’apps le font correctement avec leurs propres cours.

## 15. Prochaine étape recommandée
Étapes possibles pour continuer :
- endpoints backend exacts en FastAPI,
- modèles Pydantic,
- prompts complets pour la génération et la correction,
- schéma RAG complet,
- structure de repo prête à utiliser.

## 16. Méthode de développement
Pour le code, je veux que le développement soit fait avec la méthode **TDD** (Test-Driven Development).

Principe :
- écrire les tests avant l’implémentation,
- faire échouer les tests,
- implémenter le minimum pour les faire passer,
- refactoriser sans casser les tests.

Objectif :
- code plus fiable,
- meilleure maintenabilité,
- réduction des régressions,
- base solide pour le MVP.
