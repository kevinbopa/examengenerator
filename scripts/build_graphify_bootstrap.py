from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
LOCAL_SITE_PACKAGES = ROOT / ".graphify-local" / "Lib" / "site-packages"

if LOCAL_SITE_PACKAGES.exists():
    sys.path.insert(0, str(LOCAL_SITE_PACKAGES))

from graphify.analyze import god_nodes, suggest_questions, surprising_connections
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.detect import detect
from graphify.export import to_html, to_json
from graphify.extract import collect_files, extract
from graphify.report import generate


OUTPUT_DIR = ROOT / "graphify-out"


def build_community_labels(graph, communities: dict[int, list[str]]) -> dict[int, str]:
    labels: dict[int, str] = {}
    for community_id, node_ids in communities.items():
        ranked = sorted(
            node_ids,
            key=lambda node_id: graph.degree(node_id),
            reverse=True
        )
        top_labels = [graph.nodes[node_id].get("label", node_id) for node_id in ranked[:2]]
        labels[community_id] = " / ".join(top_labels) if top_labels else f"Community {community_id}"
    return labels


def main() -> int:
    detection_result = detect(ROOT)
    code_paths = detection_result.get("files", {}).get("code", [])

    if not code_paths:
        print("No code files detected for Graphify bootstrap build.")
        return 1

    code_files: list[Path] = []
    for raw_path in code_paths:
        path = Path(raw_path)
        code_files.extend(collect_files(path) if path.is_dir() else [path])

    extraction = extract(code_files)
    graph = build_from_json(extraction)
    communities = cluster(graph)
    cohesion_scores = score_all(graph, communities)
    community_labels = build_community_labels(graph, communities)
    god_node_list = god_nodes(graph)
    surprise_list = surprising_connections(graph, communities)
    suggested_questions = suggest_questions(graph, communities, community_labels)

    OUTPUT_DIR.mkdir(exist_ok=True)
    to_json(graph, communities, str(OUTPUT_DIR / "graph.json"))
    to_html(
        graph,
        communities,
        str(OUTPUT_DIR / "graph.html"),
        community_labels=community_labels
    )

    report = generate(
        graph,
        communities,
        cohesion_scores,
        community_labels,
        god_node_list,
        surprise_list,
        detection_result,
        {
            "input": extraction.get("input_tokens", 0),
            "output": extraction.get("output_tokens", 0)
        },
        str(ROOT),
        suggested_questions=suggested_questions
    )
    (OUTPUT_DIR / "GRAPH_REPORT.md").write_text(report, encoding="utf-8")

    summary = {
        "mode": "bootstrap-code-only",
        "detectedFiles": detection_result.get("total_files", 0),
        "detectedWords": detection_result.get("total_words", 0),
        "codeFiles": len(code_files),
        "nodes": graph.number_of_nodes(),
        "edges": graph.number_of_edges(),
        "communities": len(communities),
        "outputDir": str(OUTPUT_DIR)
    }
    (OUTPUT_DIR / "build-summary.json").write_text(
        json.dumps(summary, indent=2),
        encoding="utf-8"
    )

    print(json.dumps(summary, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
