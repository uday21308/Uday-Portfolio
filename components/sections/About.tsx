import Image from "next/image";
import { site } from "@/content/site";
import { withItalicAccents } from "@/components/ui/ItalicAccent";

const paragraphs = [
  "AI / ML Engineer at *Mindcres*, architecting a multilingual voice grievance bot for a state-government portal — 25-state conversation flow, 4 FastAPI microservices, 2,300+ Pytest cases at 90%+ coverage.",
  "Previously at *Spinnaker Analytics*, shipped an 8-stage healthcare RAG pipeline hitting 93.3% precision, and a FastMCP server with Claude Desktop integration.",
  "I care about systems that *survive* contact with reality — not demos.",
  "*AI engineering is 10% models, 90% the glue.* I like writing the glue.",
];

export function About() {
  return (
    <section id="about" className="px-6 md:px-10 py-20 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-8 md:gap-10 items-start max-w-5xl mx-auto">
        <div className="w-[120px] h-[120px] rounded-full overflow-hidden border border-[var(--color-accent)]/20 bg-gradient-to-br from-[#1a1a2a] to-[var(--color-bg)]">
          <Image
            src={site.profileImage}
            alt={site.name}
            width={120}
            height={120}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-[family-name:var(--font-sans)] text-base md:text-lg leading-[1.65] mb-3.5 text-[var(--color-fg-muted)] max-w-[620px]"
            >
              {withItalicAccents(p)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
