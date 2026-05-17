export const REJECTION = {
  salary: "[redacted — happy to discuss salary directly with the hiring team]",
  notice: "[redacted — notice period is negotiable, typically around 30 days]",
};

const PATTERNS: { re: RegExp; replacement: string }[] = [
  // USD figures: $90k, $120,000, $1.5M, $5K
  { re: /\$\s?\d{1,3}(?:[,.]\d{3})*[kKmM]?\b/g, replacement: REJECTION.salary },
  // INR lakh / lakhs (case-insensitive, optional space)
  { re: /\b\d{1,3}\s?[lL]akh(?:s)?\b/g, replacement: REJECTION.salary },
  // INR crore / crores (case-insensitive)
  { re: /\b\d+(?:\.\d+)?\s?[Cc]rore(?:s)?\b/g, replacement: REJECTION.salary },
];

// Strip fake inline citation markers the model sometimes inserts even when
// told not to. Sources are surfaced in the UI's collapsed citations panel.
function stripFakeCitations(text: string): string {
  return text
    // [#1], [#42], [# 1]
    .replace(/\s*\[#\s*\d+\s*\]/g, "")
    // (#1), (#42)
    .replace(/\s*\(#\s*\d+\s*\)/g, "")
    // Plain [1], [42] when followed by a space, end-of-string, or punctuation
    // (avoids stripping things like [version 2] but catches "as mentioned [1].")
    .replace(/\s*\[\s*\d+\s*\](?=[\s.,;:!?)]|$)/g, "")
    // Source-tag echoes like "(source: faq)" / "[source: linkedin]"
    .replace(/\s*[(\[]\s*source:?\s*[^)\]]+[)\]]/gi, "")
    // Tidy up double spaces and orphaned space-before-punct
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function sweep(text: string): string {
  let out = text;
  for (const { re, replacement } of PATTERNS) out = out.replace(re, replacement);
  return stripFakeCitations(out);
}
