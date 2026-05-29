import { Mail, ArrowDown } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticHeadline } from "@/components/ui/MagneticHeadline";
import { MagneticLink } from "@/components/ui/MagneticLink";

export function Contact() {
  return (
    <section id="contact" className="px-6 md:px-10 py-24 md:py-28 text-center">
      <MagneticHeadline
        lines={["LET'S", "*build*", "SOMETHING."]}
        className="font-[family-name:var(--font-display)] font-extrabold text-5xl md:text-7xl lg:text-[80px] uppercase leading-[0.95] tracking-[-0.005em] m-0 mb-3.5"
      />
      <Reveal delay={0.2} variant="lift">
        <p className="font-[family-name:var(--font-sans)] italic text-base md:text-lg text-[var(--color-fg-muted)] opacity-85 mb-7">
          open to senior AI / ML roles · agentic systems · voice + RAG infra
        </p>
      </Reveal>
      <div className="flex gap-3 justify-center flex-wrap">
        <Reveal delay={0.3} variant="lift">
          <MagneticLink
            href={site.resumePath}
            download
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs tracking-[0.16em] uppercase px-5 py-3 border border-[var(--color-accent)] rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold hover:bg-transparent hover:text-[var(--color-accent)] transition-colors"
          >
            Download Resume <ArrowDown size={14} />
          </MagneticLink>
        </Reveal>
        <Reveal delay={0.4} variant="lift">
          <MagneticLink
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs tracking-[0.16em] uppercase px-5 py-3 border border-[var(--color-accent)]/25 rounded-full hover:border-[var(--color-accent)] transition-colors"
          >
            <Mail size={14} /> Email
          </MagneticLink>
        </Reveal>
        <Reveal delay={0.5} variant="lift">
          <MagneticLink
            href={site.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs tracking-[0.16em] uppercase px-5 py-3 border border-[var(--color-accent)]/25 rounded-full hover:border-[var(--color-accent)] transition-colors"
          >
            <FaLinkedin size={14} /> LinkedIn
          </MagneticLink>
        </Reveal>
        <Reveal delay={0.6} variant="lift">
          <MagneticLink
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs tracking-[0.16em] uppercase px-5 py-3 border border-[var(--color-accent)]/25 rounded-full hover:border-[var(--color-accent)] transition-colors"
          >
            <FaGithub size={14} /> GitHub
          </MagneticLink>
        </Reveal>
      </div>
    </section>
  );
}
