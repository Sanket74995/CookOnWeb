const QUESTION_MARK_PATTERN = /^[?\s.,!;:'"()-]+$/;

export const hasUsableLocalizedText = (value) => {
  const text = String(value || '').trim();
  if (!text) {
    return false;
  }

  if (QUESTION_MARK_PATTERN.test(text)) {
    return false;
  }

  const questionMarkCount = [...text].filter((char) => char === '?').length;
  return questionMarkCount / text.length < 0.4;
};

export const getLocalizedField = (recipe, currentLang, field) => {
  const translatedValue = recipe?.translations?.[currentLang]?.[field];
  return currentLang !== 'en' && hasUsableLocalizedText(translatedValue)
    ? translatedValue
    : recipe?.[field];
};

export const hasUsableLocalizedItems = (items, field) =>
  Array.isArray(items) &&
  items.length > 0 &&
  items.some((item) => hasUsableLocalizedText(item?.[field]));
