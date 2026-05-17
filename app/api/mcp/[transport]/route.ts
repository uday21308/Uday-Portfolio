import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { tools } from "@/lib/mcp/server";
import { mcpLimiter, ipFromRequest } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

const TOOL_LIST = [
  {
    name: "ask_uday",
    description:
      "Ask Uday's AI Twin a question about his work, projects, or background.",
    inputSchema: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description:
            "Free-form question about Uday's experience, projects, or skills.",
        },
      },
      required: ["question"],
    },
  },
  {
    name: "list_projects",
    description:
      "List all of Uday's projects with tier (primary/secondary) and a short summary.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_project",
    description:
      "Get the full content for a single project by name (use list_projects first to discover names).",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Project name as returned by list_projects.",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "match_jd",
    description:
      "Given a job description, return a structured fit analysis (score 1-10, 3 strengths, 3 tailored bullets, cover paragraph).",
    inputSchema: {
      type: "object",
      properties: {
        jd: {
          type: "string",
          description: "Full job description text.",
        },
        company: {
          type: "string",
          description: "Optional company name for personalization.",
        },
        role: {
          type: "string",
          description: "Optional role title for personalization.",
        },
      },
      required: ["jd"],
    },
  },
];

function createServer(): Server {
  const server = new Server(
    { name: "uday-portfolio", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_LIST,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const name = req.params.name as keyof typeof tools;
    const args = (req.params.arguments ?? {}) as Record<string, unknown>;

    if (!(name in tools)) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: `unknown tool: ${name}` }),
          },
        ],
        isError: true,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (tools as any)[name](args);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  });

  return server;
}

async function handle(req: Request): Promise<Response> {
  const rl = await mcpLimiter.limit(ipFromRequest(req));
  if (!rl.success) {
    return new Response(JSON.stringify({ error: "rate limited" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  // WebStandardStreamableHTTPServerTransport uses Fetch Request/Response natively —
  // ideal for Next.js route handlers (no Node.js IncomingMessage bridging needed).
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode — one transport per request
  });

  const server = createServer();
  await server.connect(transport);

  return transport.handleRequest(req);
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
