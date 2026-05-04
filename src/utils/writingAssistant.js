export function buildSuggestionId(suggestion, index) {
  return [
    suggestion.startIndex,
    suggestion.endIndex,
    suggestion.type,
    index
  ].join("-");
}

export function getNonOverlappingSuggestions(suggestions) {
  const sortedSuggestions = [...suggestions].sort((left, right) => {
    if (left.startIndex !== right.startIndex) {
      return left.startIndex - right.startIndex;
    }
    return left.endIndex - right.endIndex;
  });

  const filteredSuggestions = [];
  let cursor = -1;

  sortedSuggestions.forEach((suggestion) => {
    if (
      !Number.isInteger(suggestion.startIndex) ||
      !Number.isInteger(suggestion.endIndex) ||
      suggestion.startIndex < 0 ||
      suggestion.endIndex <= suggestion.startIndex
    ) {
      return;
    }

    if (suggestion.startIndex < cursor) {
      return;
    }

    filteredSuggestions.push(suggestion);
    cursor = suggestion.endIndex;
  });

  return filteredSuggestions;
}

export function pruneIgnoredIds(ignoredIds, nextSuggestions) {
  const nextIds = new Set(nextSuggestions.map((suggestion) => suggestion.id));
  return ignoredIds.filter((id) => nextIds.has(id));
}

export function mergeSuggestionRewrite(activeSuggestion, refinedSuggestion) {
  return {
    ...activeSuggestion,
    ...refinedSuggestion,
    id: activeSuggestion.id,
    startIndex:
      refinedSuggestion.startIndex ?? activeSuggestion.startIndex,
    endIndex:
      refinedSuggestion.endIndex ?? activeSuggestion.endIndex
  };
}

export function applySuggestionToText(text, suggestion) {
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

