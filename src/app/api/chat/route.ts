import { NextResponse } from "next/server";
import { buildFallbackChatReply, buildSiteChatContext, type SiteChatMessage } from "@/lib/site-chatbot";

type ChatRequestPayload = {
  message?: string;
  history?: SiteChatMessage[];
};

function sanitizeHistory(history: SiteChatMessage[] | undefined) {
  return (history ?? [])
    .filter(
      (item): item is SiteChatMessage =>
        (item.role === "user" || item.role === "assistant") && typeof item.content === "string",
    )
    .map((item) => ({
      role: item.role,
      content: item.content.trim(),
    }))
    .filter((item) => item.content.length > 0)
    .slice(-8);
}

async function generateReplyWithGemini(message: string, history: SiteChatMessage[]) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const prompt = [
    buildSiteChatContext(),
    "",
    "Conversation so far:",
    ...history.map((item) => `${item.role === "user" ? "User" : "Assistant"}: ${item.content}`),
    `User: ${message}`,
    "",
    "Answer the user's latest question using only the site context above.",
    "If the answer is not clearly available, say so plainly and redirect them to the most relevant page or contact channel.",
    "Avoid markdown formatting like **bold** and [links](url). Write clean plain text.",
    "Keep the answer under 140 words unless listing concrete steps or events is clearly more helpful.",
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.35,
        },
      }),
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() ?? "";
  return text.length > 0 ? text : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestPayload;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const history = sanitizeHistory(body.history);
    const reply = (await generateReplyWithGemini(message, history)) ?? buildFallbackChatReply(message);

    return NextResponse.json({ message: reply });
  } catch {
    return NextResponse.json(
      { message: "I couldn't answer that just now. Please try again or contact smuai@sa.smu.edu.sg." },
      { status: 200 },
    );
  }
}
