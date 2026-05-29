import Image from "next/image";
import { site } from "@/content/site";
import { KineticQuote } from "@/components/ui/KineticQuote";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollLitParagraph } from "@/components/ui/ScrollLitParagraph";

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
      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-8 md:gap-10 items-start max-w-5xl mx-auto">
        <Reveal variant="mask">
          <div className="w-[160px] h-[160px] rounded-full overflow-hidden">
            <Image
              src={site.profileImage}
              alt={site.name}
              width={160}
              height={160}
              sizes="160px"
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </Reveal>
        <div>
          {intro.map((p, i) => (
            <ScrollLitParagraph
              key={i}
              text={p}
              className="font-[family-name:var(--font-sans)] text-base md:text-lg leading-[1.65] mb-3.5 text-[var(--color-fg-muted)] max-w-[620px]"
            />
          ))}
          <Reveal delay={0.32}>
            <div className="mt-8 md:mt-10 pl-5 md:pl-6 border-l-2 border-[var(--color-accent)]/70 max-w-[680px] space-y-6 md:space-y-8">
              {philosophy.map((p, i) => (
                <KineticQuote
                  key={i}
                  text={p}
                  ghost={i === 0 ? "SURVIVE" : "THE GLUE"}
                  className="font-[family-name:var(--font-display-alt)] text-xl md:text-2xl lg:text-[28px] leading-[1.1] font-extrabold uppercase tracking-[-0.005em] text-[var(--color-fg)]"
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
