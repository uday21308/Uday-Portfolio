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

export function sweep(text: string): string {
  let out = text;
  for (const { re, replacement } of PATTERNS) out = out.replace(re, replacement);
  return out;
}
