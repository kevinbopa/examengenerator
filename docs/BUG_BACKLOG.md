# Journal local des bugs

Ce fichier sert de filet de securite si un bug est detecte avant la creation de son issue GitHub.

## Regle

Chaque bug detecte doit etre :
- ajoute ici temporairement si l'issue GitHub n'est pas encore ouverte;
- retire ou marque comme reference croisee une fois l'issue creee.

## Etat actuel

- `BUG-001` `P1` - Corrige dans l'issue 9. Les textes ingeres sont maintenant reutilises par le contexte de generation, et la lecture de secours ne bloque plus la progression du pipeline.
- `BUG-002` `P3` - Corrige dans l'issue 9. Des artefacts d'encodage apparaissaient dans certaines cartes d'upload et d'ingestion, ce qui degradiait la lisibilite du suivi de sources.
- `BUG-003` `P1` - Corrige dans l'issue 9. L'endpoint d'ingestion acceptait un cours vide sans aucune source ni ancien examen, ce qui pouvait afficher un statut trompeur et lancer un pipeline sans matiere exploitable.
