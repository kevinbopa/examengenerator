# Journal local des bugs

Ce fichier sert de filet de securite si un bug est detecte avant la creation de son issue GitHub.

## Regle

Chaque bug detecte doit etre :
- ajoute ici temporairement si l'issue GitHub n'est pas encore ouverte;
- retire ou marque comme reference croisee une fois l'issue creee.

## Etat actuel

- `BUG-001` `P1` - Les fichiers de cours televerses pour un nouveau cours sont bien stockes localement, mais le pipeline de generation ne relit pas encore ces chemins depuis le repertoire de stockage dedie. Impact : la future generation a partir d'un cours utilisateur risque d'echouer tant que la resolution de chemin n'est pas branchee sur le storage des uploads.
