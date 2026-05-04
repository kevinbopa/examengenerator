# Cartographie des modules

## Vue modules

```mermaid
flowchart TD
    A["App.jsx"] --> B["Hero"]
    A --> C["ExamWorkspace"]
    A --> D["ResultsView"]
    A --> E["RightRail"]
    A --> F["AppSidebar"]
    A --> G["examData.js"]
    A --> H["grading.js"]

    C --> I["QuestionRenderer"]
    I --> J["SmartWritingEditor"]

    K["server/index.mjs"] --> L["/api/health"]
    K --> M["/api/generate-exam"]
    K --> N["/api/evaluate-exam"]
    K --> O["/writing-assistant/correct"]
    K --> P["/api/generate-corrected-copy"]

    M --> Q["OpenAI Responses API"]
    N --> Q
    O --> Q
    P --> Q

    M --> R["H26_GLO2003_09_Agilite_XP.md"]
    M --> S["examens.md"]
    M --> G
    N --> R
    N --> S
    N --> H
```

## Lecture rapide

- `App.jsx` orchestre l'etat global du cycle d'examen.
- `ExamWorkspace` porte l'experience de passage de l'examen.
- `QuestionRenderer` adapte l'UI au type de question.
- `SmartWritingEditor` encapsule la logique de correction linguistique en cours d'ecriture.
- `ResultsView` centralise la restitution de la correction.
- `server/index.mjs` concentre actuellement la quasi-totalite du backend.

## Points de couplage a surveiller

- `App.jsx` porte beaucoup d'etat et de transitions d'ecran.
- `server/index.mjs` cumule routing, prompts, schemas, sanitation et fallbacks.
- les contrats JSON entre frontend et backend sont implicites dans certains flux.

