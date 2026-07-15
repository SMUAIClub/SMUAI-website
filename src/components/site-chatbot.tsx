"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, SendHorizontal, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const starterPrompts = [
  "How do I join SMUAI as a member?",
  "What upcoming events does SMUAI have?",
  "Who is in the current ExCo?",
  "How can I contact SMUAI?",
];

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm the SMUAI Bot. I can help with joining SMUAI as a member, upcoming events, the team, partners, and contact details from this website.",
  },
];

function renderInlineContent(content: string, keyPrefix: string) {
  const tokenPattern =
    /\*\*([^*]+)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/)[^)]+)\)|(https?:\/\/[^\s]+|mailto:[^\s]+|\/[a-zA-Z0-9/-]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(content)) !== null) {
    const [fullMatch, boldText, markdownLabel, markdownHref, rawHref] = match;
    const startIndex = match.index;

    if (startIndex > lastIndex) {
      parts.push(
        <span key={`${keyPrefix}-text-${startIndex}`}>{content.slice(lastIndex, startIndex)}</span>,
      );
    }

    if (boldText) {
      parts.push(
        <strong key={`${keyPrefix}-bold-${startIndex}`} className="font-semibold text-brand-deep-blue">
          {boldText}
        </strong>,
      );
      lastIndex = startIndex + fullMatch.length;
      continue;
    }

    const href = markdownHref ?? rawHref;
    const label = markdownLabel ?? href;
    const isInternalRoute = href.startsWith("/");
    const isMailto = href.startsWith("mailto:");

    parts.push(
      <a
        key={`${keyPrefix}-link-${startIndex}`}
        href={href}
        target={isInternalRoute || isMailto ? undefined : "_blank"}
        rel={isInternalRoute || isMailto ? undefined : "noreferrer"}
        className="font-semibold text-brand-deep-blue underline underline-offset-4"
      >
        {label}
      </a>,
    );

    lastIndex = startIndex + fullMatch.length;
  }

  if (lastIndex < content.length) {
    parts.push(<span key={`${keyPrefix}-text-${lastIndex}`}>{content.slice(lastIndex)}</span>);
  }

  return parts;
}

function renderMessageContent(content: string) {
  return content.split("\n").map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={`spacer-${index}`} className="h-3" />;
    }

    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const bulletContent = trimmed.slice(2).trim();
      return (
        <div key={`bullet-${index}`} className="flex gap-2">
          <span className="pt-0.5 text-brand-slate">•</span>
          <span>{renderInlineContent(bulletContent, `bullet-${index}`)}</span>
        </div>
      );
    }

    return (
      <div key={`line-${index}`}>
        {renderInlineContent(line, `line-${index}`)}
      </div>
    );
  });
}

export default function SiteChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [assistantIconError, setAssistantIconError] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: open ? "smooth" : "auto",
    });
  }, [messages, open, isLoading]);

  async function sendMessage(rawText: string) {
    const trimmed = rawText.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    const nextHistory = [...messages, userMessage].map(({ role, content }) => ({ role, content }));

    setOpen(true);
    setError("");
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory,
        }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok || !data.message) {
        throw new Error(data.error || "Unable to get a reply.");
      }

      const assistantContent = data.message;

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: assistantContent,
        },
      ]);
    } catch {
      setError("The assistant is having trouble right now.");
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: "I couldn't answer that just now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
      <div className="pointer-events-auto flex w-full max-w-[22rem] flex-col items-end gap-3 sm:max-w-sm">
        <AnimatePresence initial={false}>
          {open ? (
            <motion.section
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex h-[min(38rem,70vh)] w-full flex-col overflow-hidden rounded-[2rem] border border-brand-soft/80 bg-white shadow-[0_30px_70px_-28px_rgba(27,43,84,0.42)]"
            >
              <div className="border-b border-brand-soft/80 bg-brand-deep-blue px-4 py-4 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-3 text-sm font-semibold text-white">
                      <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white">
                        {assistantIconError ? (
                          <span className="inline-flex h-full w-full items-center justify-center bg-white text-brand-deep-blue">
                            <Sparkles size={18} />
                          </span>
                        ) : (
                          <Image
                            src="/brand/smuai-assistant.png"
                            alt="SMUAI assistant"
                            fill
                            sizes="40px"
                            className="object-contain"
                            onError={() => setAssistantIconError(true)}
                          />
                        )}
                      </span>
                      <span className="text-base font-semibold text-white">Ask SMUAI Bot</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8 transition hover:bg-white/14"
                    aria-label="Close chat assistant"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div ref={messagesRef} className="flex-1 space-y-4 overflow-y-auto bg-brand-cloud/55 px-4 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={
                        message.role === "user"
                          ? "max-w-[85%] rounded-[1.4rem] rounded-br-md bg-brand-deep-blue px-4 py-3 text-sm leading-relaxed text-white shadow-[0_20px_40px_-32px_rgba(27,43,84,0.55)]"
                          : "max-w-[90%] rounded-[1.4rem] rounded-bl-md border border-brand-soft/90 bg-white px-4 py-3 text-sm leading-relaxed text-brand-slate shadow-[0_18px_36px_-30px_rgba(27,43,84,0.24)]"
                      }
                    >
                      <div className="space-y-2">{renderMessageContent(message.content)}</div>
                    </div>
                  </div>
                ))}

                {isLoading ? (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-[1.4rem] rounded-bl-md border border-brand-soft/90 bg-white px-4 py-3 text-sm text-brand-slate shadow-[0_18px_36px_-30px_rgba(27,43,84,0.24)]">
                      <Loader2 size={16} className="animate-spin" />
                      Thinking...
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="border-t border-brand-soft/80 bg-white px-4 py-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      disabled={isLoading}
                      className="inline-flex max-w-full items-center rounded-2xl border border-brand-soft/90 bg-white px-3.5 py-2 text-left text-[13px] font-semibold leading-snug text-brand-deep-blue shadow-[0_16px_30px_-26px_rgba(27,43,84,0.38)] transition hover:-translate-y-0.5 hover:border-brand-deep-blue/18 hover:bg-brand-cloud/75 hover:shadow-[0_18px_34px_-24px_rgba(27,43,84,0.44)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void sendMessage(input);
                  }}
                  className="flex items-end gap-2"
                >
                  <label htmlFor="smuai-chat-input" className="sr-only">
                    Ask the SMUAI assistant
                  </label>
                  <textarea
                    id="smuai-chat-input"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();

                        if (input.trim().length > 0 && !isLoading) {
                          void sendMessage(input);
                        }
                      }
                    }}
                    rows={1}
                    placeholder="Ask SMUAI Bot..."
                    className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-brand-soft bg-brand-cloud/60 px-4 py-3 text-sm text-brand-deep-blue outline-none transition placeholder:text-brand-slate/75 focus:border-brand-deep-blue"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || input.trim().length === 0}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-deep-blue text-white transition hover:bg-brand-deep-blue/92 disabled:cursor-not-allowed disabled:opacity-55"
                    aria-label="Send message"
                  >
                    <SendHorizontal size={18} />
                  </button>
                </form>

                {error ? <p className="mt-2 text-xs text-amber-700">{error}</p> : null}
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <motion.button
          type="button"
          animate={
            open
              ? { y: 0, scale: 1 }
              : { y: [0, -11, 0], scale: [1, 1.045, 1] }
          }
          transition={
            open
              ? { duration: 0.18, ease: "easeOut" }
              : {
                  duration: 1.45,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 0.55,
                }
          }
          whileHover={{ scale: 1.05, y: -3, rotate: -4 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setOpen((current) => !current)}
          className="group relative inline-flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full border-[3px] border-brand-deep-blue/18 bg-white p-1.5 text-brand-deep-blue shadow-[0_24px_48px_-18px_rgba(27,43,84,0.45)] transition hover:border-brand-deep-blue/30 hover:shadow-[0_30px_62px_-18px_rgba(27,43,84,0.56)]"
          aria-label={open ? "Close SMUAI assistant" : "Open SMUAI assistant"}
        >
          <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
            {assistantIconError ? (
              <span className="inline-flex h-full w-full items-center justify-center bg-white text-brand-deep-blue">
                <Sparkles size={24} />
              </span>
            ) : (
              <Image
                src="/brand/smuai-assistant.png"
                alt="SMUAI assistant"
                fill
                sizes="80px"
                className="object-contain p-0.5 scale-[1.14] transition duration-300 group-hover:scale-[1.2] group-hover:-rotate-3 group-hover:drop-shadow-[0_14px_16px_rgba(27,43,84,0.18)]"
                onError={() => setAssistantIconError(true)}
              />
            )}
          </span>
          {open ? (
            <span className="absolute -right-1 -top-1 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-deep-blue text-white shadow-[0_12px_24px_-14px_rgba(27,43,84,0.65)]">
              <X size={14} />
            </span>
          ) : null}
        </motion.button>
      </div>
    </div>
  );
}
