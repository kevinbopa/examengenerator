# Flux examen

```mermaid
flowchart LR
    A["Cours + examens passes + banque locale"] --> B["Backend Express"]
    B --> C["POST /api/generate-exam"]
    C --> D["Examen structure"]
    D --> E["Frontend React"]
    E --> F["Simulation chronometree"]
    F --> G["Reponses etudiant"]
    G --> H["POST /api/evaluate-exam"]
    H --> I["Correction professorale"]
    G --> J["POST /api/generate-corrected-copy"]
    J --> K["Copie corrigee"]
    I --> L["Resultats finaux"]
    K --> L
```

## Intentions du flux

- garder un examen generable meme sans IA;
- distinguer clairement la correction professorale et la copie corrigee linguistique;
- conserver une structure stable entre generation, passation et restitution.

