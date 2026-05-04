# Architecture du projet

## Pourquoi cette structure

On veut une architecture :
- simple a lire;
- facile a mettre a jour;
- exploitable dans GitHub;
- compatible avec une cartographie plus avancee plus tard.

## Position sur Graphify

Graphify peut etre utile comme couche d'exploration et de cartographie evolutive du projet, surtout pour generer et revisiter des maps plus tard.

En revanche, pour la source de verite versionnee dans le repo, on garde des fichiers texte simples :
- Markdown pour l'explication;
- Mermaid pour les schemas.

Cette combinaison est ideale car :
- GitHub l'affiche nativement;
- les diffs sont lisibles;
- les mises a jour sont simples;
- on peut ensuite reutiliser ces artefacts dans une future couche Graphify.

## Source de verite

- [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)
- [MODULE_MAP.md](./MODULE_MAP.md)
- [flows/exam-lifecycle.md](./flows/exam-lifecycle.md)
- [flows/writing-assistant.md](./flows/writing-assistant.md)

## Utilisation future avec Graphify

Quand on voudra enrichir la cartographie :
- Graphify pourra analyser le code et la doc;
- les diagrams Mermaid de ce dossier pourront servir de contexte humain;
- les futures maps resteront alignees avec la documentation versionnee.

## Regle de maintenance

A chaque fois qu'on modifie un flux important :
- endpoint;
- composant critique;
- pipeline IA;
- logique de correction;

on met a jour au minimum :
- le schema Mermaid concerne;
- le document `SYSTEM_OVERVIEW.md`.
