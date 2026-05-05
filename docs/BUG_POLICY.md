# Politique de suivi des bugs

## But

Eviter que les bugs se perdent dans les discussions et garantir qu'un probleme observe devienne une action suivie.

## Regle

Tout bug detecte pendant le developpement, le test ou la revue doit etre :
- note;
- decrit;
- rattache a une issue dediee ou a une issue existante clairement nommee.

Si l'issue GitHub n'est pas creee immediatement, le bug doit d'abord etre enregistre dans [BUG_BACKLOG.md](./BUG_BACKLOG.md).

## Contenu minimal d'un bug

- titre clair;
- contexte;
- etapes pour reproduire;
- comportement attendu;
- comportement observe;
- impact utilisateur;
- zone technique suspectee si connue.

## Priorisation simple MVP

- `P0` : bloque une demo ou une fonctionnalite coeur;
- `P1` : bug important mais contournable;
- `P2` : bug reel a corriger sans urgence immediate;
- `P3` : inconfort mineur ou dette UX/technique.

## Regle de cloture

Un bug n'est ferme que si :
- la correction est implemente;
- elle est verifiee;
- les tests utiles ont ete ajoutes ou ajustes si pertinent.
