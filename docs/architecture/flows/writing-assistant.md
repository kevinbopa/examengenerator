# Flux assistant linguistique

```mermaid
flowchart LR
    A["Etudiant ecrit une reponse"] --> B["SmartWritingEditor"]
    B --> C["POST /writing-assistant/correct"]
    C --> D["Analyse linguistique IA"]
    D --> E["Suggestions structurees"]
    E --> F["Soulignement discret"]
    F --> G["Menu flottant"]
    G --> H["Appliquer"]
    G --> I["Ignorer"]
    G --> J["Reformuler plus clairement"]
    G --> K["Style academique"]
    H --> L["Texte mis a jour apres validation"]
    I --> M["Texte original preserve"]
    J --> L
    K --> L
```

## Intentions du flux

- ne jamais modifier automatiquement le texte;
- garder le sens original;
- separer strictement langue et contenu;
- rendre l'aide discrete pour ne pas perturber l'examen.

