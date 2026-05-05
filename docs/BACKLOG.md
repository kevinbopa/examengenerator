# Product Backlog

## Etat actuel

- Sprint 1 termine
- Issues GitHub terminees : `#1`, `#2`, `#3`, `#4`, `#5`
- Mode de travail actif : TDD par defaut sur la logique metier, les helpers critiques et les endpoints
- Limite majeure actuelle : la generation d'examen reste encore largement dependante de la banque seed tant que l'upload et l'ingestion ne sont pas livres

## Epic 1 - Fondations produit

- [x] Initialiser le depot Git et le workflow GitHub
- [ ] Nettoyer les artefacts et fichiers legacy
- [x] Documenter l'architecture actuelle
- [x] Ajouter une strategie de tests frontend et backend
- [x] Formaliser les prompts IA critiques dans des builders testables

## Epic 2 - Gestion des cours et des sources

- [x] Creer un modele de cours generique
- [x] Permettre l'upload de documents de cours
- [x] Permettre l'upload d'anciens examens
- [ ] Definir un stockage local MVP pour les sources
- [ ] Afficher l'etat d'ingestion d'un cours

## Epic 3 - Ingestion et base pedagogique

- [ ] Extraire et nettoyer le texte des documents televerses
- [ ] Extraire et nettoyer le texte des anciens examens televerses
- [ ] Construire un index exploitable par cours
- [ ] Identifier les concepts, themes et signaux de style d'examen
- [ ] Garantir une strategie de fallback si l'ingestion echoue

## Epic 4 - Generation d'examens IA par cours

- [x] Formaliser le prompt de generation avec contraintes pedagogiques
- [ ] Generer un examen a partir des sources du cours
- [ ] Garantir la variete des questions entre deux sessions
- [ ] Associer chaque question a des concepts du cours
- [ ] Estimer automatiquement un temps d'examen credible

## Epic 5 - Correction intelligente

- [ ] Renforcer la correction IA par bareme structure
- [x] Ajouter une copie corrigee complete et lisible
- [ ] Afficher un diagnostic par concept
- [ ] Produire un feedback severe mais explicatif
- [ ] Corriger en s'appuyant sur les sources du cours televerse

## Epic 6 - Assistant linguistique

- [x] Stabiliser la detection temps reel
- [ ] Permettre la correction phrase par phrase
- [ ] Ajouter un mode style academique plus fin
- [ ] Conserver un historique leger et fiable

## Epic 7 - Experience examen

- [ ] Finaliser le mode examen sans distraction
- [ ] Ajouter verrouillage et soumission finale robuste
- [ ] Ameliorer l'accessibilite et la lisibilite
- [ ] Ajouter sauvegarde locale de progression
- [ ] Permettre l'export de la copie et de la correction

## Sprint 0 propose

- [x] Initialiser Git et GitHub
- [x] Poser le cadre de travail agile
- [x] Verifier l'etat du build
- [x] Definir les premieres stories priorisees

## Sprint 1 prioritaire

- [x] Documenter l'architecture fonctionnelle et technique actuelle
- [x] Ajouter des tests backend pour la generation et la correction IA
- [x] Stabiliser l'assistant linguistique dans les reponses longues
- [x] Finaliser la copie corrigee avec une UX lisible et exploitable
- [x] Formaliser les prompts de generation et de correction avec des sorties structurees

## Sprint 2 MVP propose

- [x] Creer un modele de cours generique
- [x] Ajouter l'upload des documents de cours
- [x] Ajouter l'upload des anciens examens
- [ ] Construire le pipeline d'ingestion MVP
- [ ] Generer un examen a partir des sources televersees
- [x] Formaliser le suivi des bugs avec une issue dediee a chaque bug detecte
