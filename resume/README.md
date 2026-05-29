# Resume LaTeX Source

LaTeX source for the AI/ML resume linked from the portfolio homepage download button.

## How to update

1. Open `Uday_Kiran_Battula_AIML.tex` in [Overleaf](https://www.overleaf.com/) (paste into a blank project, or upload).
2. Edit content. Compile (pdfLaTeX). Download the PDF.
3. Replace `public/resume/Uday_Kiran_Battula_AIML.pdf` with the new file.
4. Commit both the updated `.tex` and the new `.pdf`.

## ATS compliance

The template is Jake's Resume (single column, ATS-safe). Do not:
- Add tables, two-column blocks, headers/footers, or icons
- Use exotic fonts (stick to Latin Modern)
- Add color outside hyperlinks

After compiling, open the PDF, select all, paste into Notepad — text must come out in top-to-bottom reading order with no garbled ligatures. If it doesn't, the parser will see it the same way.

See the design spec for the full ruleset: `docs/superpowers/specs/2026-05-26-ats-resume-design.md`.
