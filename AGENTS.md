## graphify

When available, this project uses a graphify knowledge graph at `graphify-out/`.

Rules:
- If `graphify-out/GRAPH_REPORT.md` exists, read it first for god nodes and community structure before answering architecture or codebase questions
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files
- For cross-module questions such as "how does X relate to Y", prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep because these commands traverse the graph's `EXTRACTED` and `INFERRED` edges
- After modifying code files in a session where graphify is active, run `graphify update .` to keep the graph current with AST-only updates

