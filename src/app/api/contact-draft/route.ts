import { NextResponse } from "next/server";

type ContactDraftPayload = {
  name?: string;
  organization?: string;
  topic?: string;
  subject?: string;
  message?: string;
};

type ContactDraftResult = {
  subject: string;
  message: string;
};

function buildDraft({
  name,
  organization,
  topic,
  subject,
  message,
}: Required<ContactDraftPayload>): ContactDraftResult {
  const cleanMessage = message.trim();
  const greeting = "Hi SMUAI Team,";
  const senderName = name || "[Your Name]";
  const orgLine = organization ? ` from ${organization}` : "";
  const intro = `I'm ${senderName}${orgLine}, and I'm reaching out regarding ${topic.toLowerCase()} collaboration opportunities.`;

  if (cleanMessage.length > 0) {
    const normalized = cleanMessage.startsWith("Hi ") || cleanMessage.startsWith("Hello ")
      ? cleanMessage
      : [greeting, "", intro, "", cleanMessage].join("\n");

    return {
      subject: subject || `SMUAI ${topic} Collaboration`,
      message: [
        normalized,
        "",
        "A few helpful details we can align on:",
        "- Goals:",
        "- Proposed timeline:",
        "- Support or collaboration needed from SMUAI:",
        "",
        "Looking forward to exploring this together.",
        "",
        "Best regards,",
        senderName,
      ].join("\n"),
    };
  }

  return {
    subject: subject || `SMUAI ${topic} Collaboration`,
    message: [
      greeting,
      "",
      intro,
      "",
      "Context:",
      "- Goals:",
      "- Proposed timeline:",
      "- Support or collaboration needed from SMUAI:",
      "",
      "Looking forward to exploring this together.",
      "",
      "Best regards,",
      senderName,
    ].join("\n"),
  };
}

function extractJsonObject(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(text.slice(start, end + 1)) as Partial<ContactDraftResult>;
  } catch {
    return null;
  }
}

async function generateDraftWithGemini(payload: Required<ContactDraftPayload>) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const fallback = buildDraft(payload);
  const prompt = [
    "You improve email drafts for SMUAI partnership outreach.",
    "Return valid JSON only.",
    'Use exactly this shape: {"subject":"...","message":"..."}',
    "If the user already wrote a draft, improve and expand it instead of replacing it.",
    "Preserve the user's intent and any concrete details they already provided.",
    "Make the email concise, polished, and professional.",
    "Do not invent factual details, names, timelines, or commitments.",
    "Keep the output suitable for an email to SMUAI.",
    "",
    `Name: ${payload.name || "[Your Name]"}`,
    `Organization: ${payload.organization || ""}`,
    `Topic: ${payload.topic}`,
    `Current subject: ${payload.subject || ""}`,
    "Existing message:",
    payload.message || "[No existing draft]",
    "",
    "If the existing draft is empty, create a helpful starter draft.",
    `Fallback subject if needed: ${fallback.subject}`,
  ].join("\n");

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      model: "gemini-3.5-flash",
      input: prompt,
      generation_config: {
        temperature: 0.6,
        thinking_level: "low",
      },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { output_text?: string };
  const parsed = extractJsonObject(data.output_text ?? "");

  if (!parsed?.message) {
    return null;
  }

  return {
    subject: parsed.subject?.trim() || fallback.subject,
    message: parsed.message.trim(),
  } satisfies ContactDraftResult;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactDraftPayload;
    const payload = {
      name: body.name?.trim() ?? "",
      organization: body.organization?.trim() ?? "",
      topic: body.topic?.trim() || "General",
      subject: body.subject?.trim() ?? "",
      message: body.message?.trim() ?? "",
    };
    const result = (await generateDraftWithGemini(payload)) ?? buildDraft(payload);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unable to generate draft." }, { status: 400 });
  }
}
