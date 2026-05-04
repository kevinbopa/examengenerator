import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const TYPE_LABELS = {
  orthographe: "Orthographe",
  grammaire: "Grammaire",
  syntaxe: "Syntaxe",
  clarte: "Clarte",
  style: "Style"
};

export default function SmartWritingEditor({
  questionId,
  value,
  onChange,
  placeholder,
  guidance,
  source
}) {
  const shellRef = useRef(null);
  const editorRef = useRef(null);
  const selectionRef = useRef(null);
  const requestIdRef = useRef(0);

  const [suggestions, setSuggestions] = useState([]);
  const [ignoredIds, setIgnoredIds] = useState([]);
  const [activeSuggestionId, setActiveSuggestionId] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState(null);
  const [status, setStatus] = useState("idle");
  const [history, setHistory] = useState([]);

  const visibleSuggestions = useMemo(() => {
    const ignoredSet = new Set(ignoredIds);
    return suggestions.filter((suggestion) => !ignoredSet.has(suggestion.id));
  }, [suggestions, ignoredIds]);

  const activeSuggestion = visibleSuggestions.find(
    (suggestion) => suggestion.id === activeSuggestionId
  );

  useEffect(() => {
    setSuggestions([]);
    setIgnoredIds([]);
    setActiveSuggestionId(null);
    setPopoverPosition(null);
    setStatus("idle");
    setHistory([]);
  }, [questionId]);

  useEffect(() => {
    const trimmed = (value || "").trim();
    if (!trimmed || trimmed.length < 25) {
      setSuggestions([]);
      setActiveSuggestionId(null);
      setStatus("idle");
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      const currentRequestId = requestIdRef.current + 1;
      requestIdRef.current = currentRequestId;
      setStatus("checking");

      try {
        const response = await fetch("/writing-assistant/correct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: value,
            action: "review"
          })
        });

        const payload = await response.json();
        if (requestIdRef.current !== currentRequestId) {
          return;
        }

        const nextSuggestions = (payload.suggestions || [])
          .filter((suggestion) => suggestion.original !== suggestion.corrected)
          .map((suggestion, index) => ({
            ...suggestion,
            id: buildSuggestionId(suggestion, index)
          }));

        setSuggestions(nextSuggestions);
        setIgnoredIds((current) =>
          current.filter((id) => nextSuggestions.some((suggestion) => suggestion.id === id))
        );
        setStatus(nextSuggestions.length ? "ready" : "clean");
      } catch {
        if (requestIdRef.current === currentRequestId) {
          setStatus("error");
        }
      }
    }, 900);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value]);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (!shellRef.current?.contains(event.target)) {
        setActiveSuggestionId(null);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const isFocused = document.activeElement === editor;
    const selectionSnapshot = isFocused ? selectionRef.current : null;
    const nextHtml = renderHighlightedHtml(value || "", visibleSuggestions, activeSuggestionId);

    if (editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml;
    }

    if (isFocused && selectionSnapshot) {
      restoreSelection(editor, selectionSnapshot.start, selectionSnapshot.end);
    }
  }, [value, visibleSuggestions, activeSuggestionId]);

  function handleInput() {
    selectionRef.current = getSelectionOffsets(editorRef.current);
    const nextValue = getPlainText(editorRef.current);
    onChange(nextValue);
  }

  function handlePaste(event) {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, pastedText);
  }

  function handleMouseDown(event) {
    const suggestionElement = event.target.closest("[data-suggestion-id]");
    if (suggestionElement) {
      event.preventDefault();
    }
  }

  function handleClick(event) {
    const suggestionElement = event.target.closest("[data-suggestion-id]");
    if (!suggestionElement) {
      return;
    }

    const suggestionId = suggestionElement.getAttribute("data-suggestion-id");
    const rect = suggestionElement.getBoundingClientRect();
    const shellRect = shellRef.current.getBoundingClientRect();
    const maxLeft = Math.max(16, shellRef.current.clientWidth - 320);

    setPopoverPosition({
      top: rect.bottom - shellRect.top + 10,
      left: Math.min(Math.max(12, rect.left - shellRect.left), maxLeft)
    });
    setActiveSuggestionId(suggestionId);
  }

  async function requestRewrite(mode) {
    if (!activeSuggestion) {
      return;
    }

    setStatus("rewriting");

    try {
      const response = await fetch("/writing-assistant/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: value,
          action: mode,
          selectionText: activeSuggestion.original,
          selectionStart: activeSuggestion.startIndex,
          selectionEnd: activeSuggestion.endIndex
        })
      });

      const payload = await response.json();
      const refinedSuggestion = payload.suggestions?.[0];

      if (refinedSuggestion) {
        const nextSuggestion = {
          ...refinedSuggestion,
          id: activeSuggestion.id
        };

        setSuggestions((current) =>
          current.map((suggestion) =>
            suggestion.id === activeSuggestion.id ? nextSuggestion : suggestion
          )
        );
        setStatus("ready");
      } else {
        setStatus("clean");
      }
    } catch {
      setStatus("error");
    }
  }

  function applySuggestion() {
    if (!activeSuggestion) {
      return;
    }

    const nextValue = applySuggestionToText(value || "", activeSuggestion);
    onChange(nextValue);
    setHistory((current) => [
      {
        original: activeSuggestion.original,
        corrected: activeSuggestion.corrected,
        type: activeSuggestion.type
      },
      ...current
    ].slice(0, 5));
    setActiveSuggestionId(null);
    setPopoverPosition(null);
  }

  function ignoreSuggestion() {
    if (!activeSuggestion) {
      return;
    }

    setIgnoredIds((current) => [...current, activeSuggestion.id]);
    setActiveSuggestionId(null);
    setPopoverPosition(null);
  }

  const issueCount = visibleSuggestions.length;

  return (
    <div className="answer-block">
      <div className="smart-editor-header">
        <label className="answer-label" htmlFor="smart-editor">
          Ta reponse
        </label>
        <div className={`assistant-status assistant-${status}`}>
          <span>Assistant langue</span>
          <strong>{issueCount}</strong>
        </div>
      </div>

      <div className="smart-editor-shell" ref={shellRef}>
        <div
          id="smart-editor"
          ref={editorRef}
          className="smart-editor"
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          data-placeholder={placeholder}
          onInput={handleInput}
          onPaste={handlePaste}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
        />

        {activeSuggestion && popoverPosition ? (
          <div
            className="suggestion-popover"
            style={{
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`
            }}
          >
            <div className="suggestion-popover-head">
              <span>{TYPE_LABELS[activeSuggestion.type] || activeSuggestion.type}</span>
              <strong>{Math.round((activeSuggestion.confidence || 0) * 100)}%</strong>
            </div>
            <p className="suggestion-line">
              <strong>Original :</strong> {activeSuggestion.original}
            </p>
            <p className="suggestion-line">
              <strong>Proposition :</strong> {activeSuggestion.corrected}
            </p>
            <p className="suggestion-line">{activeSuggestion.explanation}</p>
            <div className="suggestion-actions">
              <button type="button" className="mini-primary-button" onClick={applySuggestion}>
                Appliquer
              </button>
              <button type="button" className="mini-ghost-button" onClick={ignoreSuggestion}>
                Ignorer
              </button>
            </div>
            <div className="suggestion-actions secondary-row">
              <button type="button" className="mini-ghost-button" onClick={() => requestRewrite("clarity")}>
                Reformuler plus clairement
              </button>
              <button type="button" className="mini-ghost-button" onClick={() => requestRewrite("academic")}>
                Style academique
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="editor-footnotes">
        <p className="answer-guidance">
          <strong>Attendu :</strong> {guidance}
        </p>
        <p className="answer-guidance">
          <strong>Source d'inspiration :</strong> {source}
        </p>
      </div>

      <div className="assistant-history-strip">
        <div className="assistant-history-title">
          <strong>Corrections acceptees</strong>
          <span>{history.length}</span>
        </div>
        {history.length ? (
          <ul className="assistant-history-list">
            {history.map((entry, index) => (
              <li key={`${entry.original}-${index}`}>
                <strong>{TYPE_LABELS[entry.type] || entry.type}</strong>
                <span>{entry.corrected}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="assistant-history-empty">
            Les corrections acceptees apparaitront ici.
          </p>
        )}
      </div>
    </div>
  );
}

function buildSuggestionId(suggestion, index) {
  return [
    suggestion.startIndex,
    suggestion.endIndex,
    suggestion.type,
    index
  ].join("-");
}

function renderHighlightedHtml(text, suggestions, activeSuggestionId) {
  if (!text) {
    return "";
  }

  const sortedSuggestions = [...suggestions].sort((left, right) => left.startIndex - right.startIndex);
  const segments = [];
  let cursor = 0;

  sortedSuggestions.forEach((suggestion) => {
    if (suggestion.startIndex > cursor) {
      segments.push({
        text: text.slice(cursor, suggestion.startIndex),
        kind: "plain"
      });
    }

    segments.push({
      text: text.slice(suggestion.startIndex, suggestion.endIndex),
      kind: "issue",
      suggestionId: suggestion.id,
      active: suggestion.id === activeSuggestionId
    });

    cursor = suggestion.endIndex;
  });

  if (cursor < text.length) {
    segments.push({
      text: text.slice(cursor),
      kind: "plain"
    });
  }

  return segments
    .map((segment) => {
      const escaped = escapeHtml(segment.text).replace(/\n/g, "<br>");
      if (segment.kind === "issue") {
        return `<span class="editor-issue ${segment.active ? "active" : ""}" data-suggestion-id="${segment.suggestionId}">${escaped}</span>`;
      }
      return escaped;
    })
    .join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getPlainText(element) {
  return (element.innerText || "")
    .replace(/\r/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\n$/, "");
}

function getSelectionOffsets(root) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) {
    return null;
  }

  const startRange = range.cloneRange();
  startRange.selectNodeContents(root);
  startRange.setEnd(range.startContainer, range.startOffset);

  const endRange = range.cloneRange();
  endRange.selectNodeContents(root);
  endRange.setEnd(range.endContainer, range.endOffset);

  return {
    start: startRange.toString().length,
    end: endRange.toString().length
  };
}

function restoreSelection(root, start, end) {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();
  const startPoint = locatePosition(root, start);
  const endPoint = locatePosition(root, end);

  range.setStart(startPoint.node, startPoint.offset);
  range.setEnd(endPoint.node, endPoint.offset);

  selection.removeAllRanges();
  selection.addRange(range);
}

function locatePosition(root, targetOffset) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let traversed = 0;
  let currentNode = walker.nextNode();

  while (currentNode) {
    const length = currentNode.textContent.length;
    if (traversed + length >= targetOffset) {
      return {
        node: currentNode,
        offset: Math.max(0, targetOffset - traversed)
      };
    }
    traversed += length;
    currentNode = walker.nextNode();
  }

  return {
    node: root,
    offset: root.childNodes.length
  };
}

function applySuggestionToText(text, suggestion) {
  const directMatch = text.slice(suggestion.startIndex, suggestion.endIndex);
  if (directMatch === suggestion.original) {
    return (
      text.slice(0, suggestion.startIndex) +
      suggestion.corrected +
      text.slice(suggestion.endIndex)
    );
  }

  const fallbackIndex = text.indexOf(suggestion.original);
  if (fallbackIndex === -1) {
    return text;
  }

  return (
    text.slice(0, fallbackIndex) +
    suggestion.corrected +
    text.slice(fallbackIndex + suggestion.original.length)
  );
}
