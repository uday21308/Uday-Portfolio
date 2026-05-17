export type Chunk = { text: string; title: string };
export type ChunkOptions = { maxWords?: number; overlapWords?: number };

const HEADING_RE = /^(?:#{1,3}\s+(?:DOCUMENT\s+\d+\s*:\s*)?)(.+?)\s*$/gm;

export function chunk(input: string, opts: ChunkOptions = {}): Chunk[] {
  const maxWords = opts.maxWords ?? 200;
  const overlapWords = opts.overlapWords ?? 30;

  const sections: Chunk[] = [];
  const matches = [...input.matchAll(HEADING_RE)];
  if (matches.length === 0) {
    const text = input.trim();
    if (text) sections.push({ title: "untitled", text });
  } else {
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index! + matches[i][0].length;
      const end = i + 1 < matches.length ? matches[i + 1].index! : input.length;
      const body = input.slice(start, end).trim();
      if (body) sections.push({ title: matches[i][1].trim(), text: body });
    }
  }

  const out: Chunk[] = [];
  for (const sec of sections) {
    const words = sec.text.split(/\s+/);
    if (words.length <= maxWords) {
      out.push(sec);
      continue;
    }
    const stride = maxWords - overlapWords;
    for (let i = 0; i < words.length; i += stride) {
      const window = words.slice(i, i + maxWords);
      if (window.length === 0) break;
      out.push({ title: sec.title, text: window.join(" ") });
      if (i + maxWords >= words.length) break;
    }
  }
  return out;
}
