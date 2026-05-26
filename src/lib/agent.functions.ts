import { createServerFn } from "@tanstack/react-start";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

const WORKSPACE_SYSTEM_PROMPT = `You are Hermes — an AI agent living in the merQato Agent Workspace at /workspace.

Your identity:
- You ARE the Hermes Agent running on this website
- You write code, push to GitHub, manage content, and build things
- You have access to file tools, terminal, and the site's content store
- You are practical, direct, and focused on building

Your capabilities:
- Code: React 19, TypeScript, Tailwind CSS, Node.js, TanStack Start
- Git: Push to GitHub, manage branches, deploy via Lovable
- Content: Read/write site content, blog posts, portfolio items via CMS
- Search: Web search, file browsing, API calls

Rules:
- Keep responses under 300 words unless building something
- Be direct and helpful — show your work
- When asked about your current status, describe what you're actually doing
- If you can't do something, say so clearly
- Sound like a capable AI that's happy to be put to work`;

const AGENTS_SYSTEM_PROMPT = `You are a Palawan AI Operator — an intelligent assistant for micro-resorts and small businesses in Palawan, Philippines.

Your role:
- Help resort owners with bookings, guest communications, operations, and marketing
- Be friendly, warm, and practical — Palawan hospitality
- Give concise, actionable answers (2-3 paragraphs max)
- Sound like a knowledgeable local who knows hospitality inside out
- If asked about your capabilities, explain: you can help with bookings, guest messages, menu digitization, operations, and marketing

Rules:
- Keep responses under 200 words unless asked for detail
- Don't make up specific pricing or availability — direct users to contact merQato.digital
- Be encouraging — Palawan small business owners are your people
- Use simple, clear English`;

const OPENROUTER_MODEL = "google/gemma-2-2b-it:free";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function getOllamaUrl() {
  return process.env.OLLAMA_URL || "http://localhost:11434";
}

function getOllamaModel() {
  return process.env.AI_MODEL || "llama3.2:3b";
}

async function callOpenRouter(messages: Message[], systemPrompt: string) {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (!openrouterKey) return null;

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openrouterKey}`,
      "HTTP-Referer": "https://merqato.digital",
      "X-Title": "Hermes Agent Workspace",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`OpenRouter HTTP ${response.status}: ${errText}`);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content || "";
}

async function callOllama(messages: Message[], systemPrompt: string) {
  const ollamaUrl = getOllamaUrl();
  const response = await fetch(`${ollamaUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: getOllamaModel(),
      stream: false,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama HTTP ${response.status}`);
  }

  const json = await response.json();
  return json.message?.content || "";
}

/**
 * Send a chat message to the AI and get a reply.
 * Uses OpenRouter in production, Ollama locally.
 */
export const chatWithAgent = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: Message[] }) => {
    if (!input?.messages?.length) throw new Error("Messages required");
    return input;
  })
  .handler(async ({ data }) => {
    const recentMessages = data.messages.slice(-10);
    const isWorkspace = recentMessages.some(
      (m) => m.content?.includes("/workspace") || m.content?.includes("Hermes")
    );
    const systemPrompt = isWorkspace ? WORKSPACE_SYSTEM_PROMPT : AGENTS_SYSTEM_PROMPT;

    // ── Try OpenRouter first ──
    try {
      const content = await callOpenRouter(recentMessages, systemPrompt);
      if (content) return { content, ok: true };
    } catch (err) {
      console.error("OpenRouter error:", err);
    }

    // ── Fallback: Ollama ──
    try {
      const content = await callOllama(recentMessages, systemPrompt);
      if (content) return { content, ok: true };
    } catch (err) {
      console.error("Ollama error:", err);
    }

    // ── Both failed ──
    return {
      content:
        "⚠️ I'm having trouble connecting. I need either:\n\n1. **OpenRouter API key** — set OPENROUTER_API_KEY in your environment\n2. **Ollama running locally** — run `ollama serve` on your machine\n\nOnce either is set up, I'll be able to respond!",
      ok: false,
    };
  });
