import { Fragment } from "react";

const TOKEN = /\*([^*]+)\*/g;

export function withItalicAccents(input: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = TOKEN.exec(input)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Fragment key={key++}>{input.slice(lastIndex, match.index)}</Fragment>);
    }
    parts.push(
      <em
        key={key++}
        className="font-[family-name:var(--font-serif)] italic font-medium text-[var(--color-accent)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1' }}
      >
        {match[1]}
      </em>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < input.length) {
    parts.push(<Fragment key={key++}>{input.slice(lastIndex)}</Fragment>);
  }
  return parts;
}

export function ItalicAccent({ children }: { children: string }) {
  return <>{withItalicAccents(children)}</>;
}
