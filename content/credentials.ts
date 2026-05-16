export type CredentialAccent = "cream" | "violet" | "cyan" | "lime";
export type CredentialIcon = "claude" | "sparkles" | "google" | "brain";

export type Credential = {
  title: string;
  source: string;
  meta: string;
  icon: CredentialIcon;
  accent: CredentialAccent;
  featured?: boolean;
};

export const credentials: Credential[] = [
  {
    title: "Claude Code in Action",
    source: "Anthropic Academy",
    meta: "2026",
    icon: "claude",
    accent: "cream",
    featured: true,
  },
  {
    title: "GenAI + Agentic AI Development",
    source: "Boston Institute of Analytics",
    meta: "2025",
    icon: "sparkles",
    accent: "violet",
  },
  {
    title: "Introduction to Generative AI",
    source: "Google Cloud Skills Boost",
    meta: "2024",
    icon: "google",
    accent: "cyan",
  },
  {
    title: "Machine Learning with Python",
    source: "Infosys Springboard",
    meta: "2024",
    icon: "brain",
    accent: "lime",
  },
];
