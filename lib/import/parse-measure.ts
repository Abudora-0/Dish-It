/*
  Best effort parser for free text measure strings from an external recipe
  source ("2 tbsp", "1 1/2 cups", "400g", "a pinch"). Splits a leading numeric
  quantity from the rest. When there is no confident number the whole string is
  kept as the unit label and quantity stays null, which the servings scaler
  already leaves untouched.
*/

const UNICODE_FRACTIONS: Record<string, number> = {
  "½": 0.5,
  "⅓": 1 / 3,
  "⅔": 2 / 3,
  "¼": 0.25,
  "¾": 0.75,
  "⅛": 0.125,
  "⅜": 0.375,
  "⅝": 0.625,
  "⅞": 0.875,
  "⅕": 0.2,
  "⅖": 0.4,
  "⅗": 0.6,
  "⅘": 0.8,
  "⅙": 1 / 6,
  "⅚": 5 / 6,
};

export function parseMeasure(raw: string): {
  quantity: number | null;
  unit: string | null;
} {
  const text = (raw ?? "").trim();
  if (!text || /^(to taste|as needed|as required|for garnish)$/i.test(text)) {
    return { quantity: null, unit: text || null };
  }

  let work = text;
  for (const [glyph, value] of Object.entries(UNICODE_FRACTIONS)) {
    work = work.split(glyph).join(` ${value} `);
  }
  work = work.replace(/\s+/g, " ").trim();

  const match = work.match(
    /^(\d+(?:\.\d+)?)(?:\s+(\d+)\s*\/\s*(\d+))?(?:\s*\/\s*(\d+))?\s*(.*)$/,
  );
  if (!match) {
    return { quantity: null, unit: text };
  }

  let quantity = parseFloat(match[1]);
  if (match[2] && match[3]) {
    quantity += parseInt(match[2], 10) / parseInt(match[3], 10);
  } else if (match[4]) {
    quantity = parseFloat(match[1]) / parseInt(match[4], 10);
  }
  quantity = Math.round(quantity * 1000) / 1000;

  const rest = match[5].trim().replace(/^of\s+/i, "");
  return { quantity, unit: rest || null };
}
