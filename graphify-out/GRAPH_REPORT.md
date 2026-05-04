# Graph Report - C:\Users\kev\OneDrive - Université Laval\examen  (2026-05-04)

## Corpus Check
- Corpus is ~19,775 words - fits in a single context window. You may not need a graph.

## Summary
- 67 nodes · 86 edges · 16 communities (13 shown, 3 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_grading.js  gradeLabel()|grading.js / gradeLabel()]]
- [[_COMMUNITY_SmartWritingEditor.jsx  locatePosition()|SmartWritingEditor.jsx / locatePosition()]]
- [[_COMMUNITY_index.mjs  evaluateExamWithAI()|index.mjs / evaluateExamWithAI()]]
- [[_COMMUNITY_flattenQuestions()  generateCorrectedCopyWithAI()|flattenQuestions() / generateCorrectedCopyWithAI()]]
- [[_COMMUNITY_examSchema()  codeSchema()|examSchema() / codeSchema()]]
- [[_COMMUNITY_generateExamWithAI()  sanitizeGeneratedExam()|generateExamWithAI() / sanitizeGeneratedExam()]]
- [[_COMMUNITY_build_community_labels()  main()|build_community_labels() / main()]]
- [[_COMMUNITY_runWritingAssistant()  attachSuggestionPositions()|runWritingAssistant() / attachSuggestionPositions()]]
- [[_COMMUNITY_ExamWorkspace()  formatTime()|ExamWorkspace() / formatTime()]]

## God Nodes (most connected - your core abstractions)
1. `flattenQuestions()` - 7 edges
2. `generateExamWithAI()` - 5 edges
3. `examSchema()` - 5 edges
4. `sectionScores()` - 5 edges
5. `gradeLabel()` - 5 edges
6. `evaluateExamWithAI()` - 4 edges
7. `ResultsView()` - 4 edges
8. `runWritingAssistant()` - 3 edges
9. `generateCorrectedCopyWithAI()` - 3 edges
10. `writtenSchema()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `evaluateExamWithAI()` --calls--> `flattenQuestions()`  [INFERRED]
  server/index.mjs → src/data/examData.js
- `buildFallbackCorrectedCopy()` --calls--> `flattenQuestions()`  [INFERRED]
  server/index.mjs → src/data/examData.js
- `generateCorrectedCopyWithAI()` --calls--> `flattenQuestions()`  [INFERRED]
  server/index.mjs → src/data/examData.js
- `App()` --calls--> `flattenQuestions()`  [INFERRED]
  src/App.jsx → src/data/examData.js
- `ResultsView()` --calls--> `sectionScores()`  [INFERRED]
  src/components/ResultsView.jsx → src/utils/grading.js

## Communities (16 total, 3 thin omitted)

### Community 0 - "grading.js / gradeLabel()"
Cohesion: 0.38
Nodes (7): formatTime(), ResultsView(), RightRail(), gradeLabel(), gradeQuestion(), normalize(), sectionScores()

### Community 2 - "index.mjs / evaluateExamWithAI()"
Cohesion: 0.28
Nodes (3): evaluateExamWithAI(), evaluationSchema(), sanitizeEvaluation()

### Community 3 - "flattenQuestions() / generateCorrectedCopyWithAI()"
Cohesion: 0.29
Nodes (6): flattenQuestions(), buildFallbackCorrectedCopy(), correctedCopySchema(), generateCorrectedCopyWithAI(), App(), gradeExam()

### Community 4 - "examSchema() / codeSchema()"
Cohesion: 0.5
Nodes (5): codeSchema(), criteriaSchema(), examSchema(), mcqSchema(), writtenSchema()

### Community 5 - "generateExamWithAI() / sanitizeGeneratedExam()"
Cohesion: 0.5
Nodes (4): generateExamWithAI(), sanitizeGeneratedExam(), sectionGenerationPlan(), seedBankForPrompt()

### Community 7 - "runWritingAssistant() / attachSuggestionPositions()"
Cohesion: 0.67
Nodes (3): attachSuggestionPositions(), runWritingAssistant(), writingAssistantSchema()

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `gradeExam()` connect `flattenQuestions() / generateCorrectedCopyWithAI()` to `grading.js / gradeLabel()`, `index.mjs / evaluateExamWithAI()`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `flattenQuestions()` (e.g. with `evaluateExamWithAI()` and `generateCorrectedCopyWithAI()`) actually correct?**
  _`flattenQuestions()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `sectionScores()` (e.g. with `ResultsView()` and `RightRail()`) actually correct?**
  _`sectionScores()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `gradeLabel()` (e.g. with `ResultsView()` and `RightRail()`) actually correct?**
  _`gradeLabel()` has 2 INFERRED edges - model-reasoned connections that need verification._