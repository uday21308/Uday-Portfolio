import Image from "next/image";
import { site } from "@/content/site";
import { withItalicAccents } from "@/components/ui/ItalicAccent";
import { Reveal } from "@/components/ui/Reveal";

const intro = [
  "AI / ML Engineer at *Mindcres*, architecting a multilingual voice grievance bot for a state-government portal — 25-state conversation flow, 4 FastAPI microservices, 2,300+ Pytest cases at 90%+ coverage.",
  "Previously at *Spinnaker Analytics*, shipped an 8-stage healthcare RAG pipeline hitting 93.3% precision, and a FastMCP server with Claude Desktop integration.",
];

const philosophy = [
  "I care about systems that *survive* contact with reality — not demos.",
  "*AI engineering is 10% models, 90% the glue.* I like writing the glue.",
];

export function About() {
  return (
    <section id="about" className="px-6 md:px-10 py-16 md:py-20">
      <Reveal className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-8 md:gap-10 items-start max-w-5xl mx-auto">
        <div className="w-[160px] h-[160px] rounded-full overflow-hidden">
          <Image
            src={site.profileImage}
            alt={site.name}
            width={320}
            height={320}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <div>
          {intro.map((p, i) => (
            <p
              key={i}
              className="font-[family-name:var(--font-sans)] text-base md:text-lg leading-[1.65] mb-3.5 text-[var(--color-fg-muted)] max-w-[620px]"
            >
              {withItalicAccents(p)}
            </p>
          ))}
          <div className="mt-7 md:mt-9 pl-5 md:pl-6 border-l-2 border-[var(--color-accent)]/60 max-w-[680px] space-y-4">
            {philosophy.map((p, i) => (
              <p
                key={i}
                className="font-[family-name:var(--font-sans)] text-xl md:text-2xl leading-[1.35] font-medium text-[var(--color-fg)] tracking-[-0.005em]"
              >
                {withItalicAccents(p)}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
