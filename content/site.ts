export const site = {
  name: "Uday Kiran Battula",
  shortName: "Uday Kiran",
  role: "AI / ML Engineer",
  org: "Mindcres",
  tagline:
    "Voice agents, RAG pipelines, MCP tools, and the production glue that makes them all stop being demos.",
  heroLines: ["BUILDING", "*intelligent*", "SYSTEMS THAT SHIP."] as const,
  email: "udaykiranbattula304@gmail.com",
  links: {
    linkedin: "https://linkedin.com/in/uday-kiran-22053b285",
    github: "https://github.com/uday21308",
  },
  githubUsername: "uday21308",
  resumePath: "/resume/Uday_Kiran_Battula_AIML.pdf",
  profileImage: "/images/profile-avatar.png",
  totalRepoCount: 11,
} as const;

export type Site = typeof site;
