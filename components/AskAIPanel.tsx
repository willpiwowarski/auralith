"use client";

import { useEffect, useRef, useState } from "react";
import { ColumnSummary, Row } from "@/types/dataset";
import {
  askAI,
  loadConversation,
  ChatMessage,
  ChatRole,
} from "@/lib/api";

type Props = {
  datasetId: string;
  rows: Row[];
  columns: ColumnSummary[];
};

type DisplayMessage = {
  id: string;
  role: ChatRole;
  content: string;
  pending?: boolean;
};

function toDisplay(message: ChatMessage): DisplayMessage {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
  };
}

export default function AskAIPanel({ datasetId, rows, columns }: Props) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!datasetId) return;

    let cancelled = false;

    async function load() {
      const result = await loadConversation(datasetId);

      if (cancelled) return;

      if (result.success) {
        setMessages(result.messages.map(toDisplay));
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [datasetId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || loading || !datasetId) return;

    const userTempId = `user-${Date.now()}`;
    const assistantTempId = `assistant-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userTempId, role: "user", content: trimmed },
      { id: assistantTempId, role: "assistant", content: "...", pending: true },
    ]);
    setInput("");
    setLoading(true);

    try {
      const result = await askAI({
        datasetId,
        message: trimmed,
        rows: rows.slice(0, 50),
        columns,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantTempId
            ? {
                id: assistantTempId,
                role: "assistant",
                content: result.message,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("AI request failed:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantTempId
            ? {
                id: assistantTempId,
                role: "assistant",
                content: "AI request failed. Please try again.",
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  }

  const disabled = !datasetId || loading;

  return (
    <section className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
        Ask Auralith AI
      </h2>

      <p className="text-cyan-300/70 mt-2">
        Ask questions about your dataset using Gemini AI. Your conversation is
        saved with this dataset.
      </p>

      <div
        ref={scrollRef}
        className="mt-6 max-h-96 overflow-y-auto space-y-3 pr-1"
      >
        {!datasetId && (
          <p className="text-cyan-300/70 text-sm">
            Save this dataset to start chatting.
          </p>
        )}

        {datasetId && messages.length === 0 && (
          <p className="text-cyan-300/70 text-sm">
            No messages yet. Ask a question below to get started.
          </p>
        )}

        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[80%] bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-cyan-50 whitespace-pre-wrap text-[15px] leading-7">
                {msg.content}
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-start">
              <div
                className={`max-w-[80%] bg-slate-950 border border-cyan-500/30 rounded-2xl px-4 py-3 text-cyan-50/95 whitespace-pre-wrap text-[15px] leading-7 shadow-[0_0_15px_rgba(34,211,238,0.08)] ${
                  msg.pending ? "text-cyan-300/60 italic" : ""
                }`}
              >
                {msg.content}
              </div>
            </div>
          )
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            datasetId
              ? "What trends do you notice?"
              : "Save this dataset first"
          }
          disabled={disabled}
          className="flex-1 bg-slate-950 border border-cyan-500/20 rounded-xl p-3 text-cyan-50 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={disabled || input.trim().length === 0}
          className="bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 px-6 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </form>
    </section>
  );
}
