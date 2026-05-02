"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  text: string;
}

interface InlineAIChatProps {
  title: string;
  subtitle?: string;
  systemAction: string;
  placeholder?: string;
  accentColor?: string;
  initialMessage?: string;
  extraPayload?: Record<string, any>;
}

export default function InlineAIChat({
  title,
  subtitle,
  systemAction,
  placeholder = "Ask SheCodes.AI anything...",
  accentColor = "var(--accent-rose)",
  initialMessage,
  extraPayload = {},
}: InlineAIChatProps) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessage ? [{ role: "ai", text: initialMessage }] : []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: systemAction,
          message: userMsg,
          ...extraPayload,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.result }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "SheCodes.AI is warming up. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-container" style={{ marginBottom: 24 }}>
      <div className="ai-chat-header" style={{ background: accentColor.startsWith("var") ? undefined : accentColor }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✦</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 400 }}>{subtitle}</div>}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 10, background: "rgba(255,255,255,0.2)", padding: "3px 8px", borderRadius: 20, fontWeight: 500 }}>IBM watsonx</div>
      </div>

      <div className="ai-chat-messages" ref={scrollRef} style={{ minHeight: 120, maxHeight: 300 }}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "ai" ? "ai-msg" : ""} style={msg.role === "user" ? { display: "flex", justifyContent: "flex-end" } : undefined}>
            {msg.role === "ai" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,160,220,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 2 }}>✦</div>
            )}
            <div className={msg.role === "ai" ? "ai-msg-bubble" : "user-msg-bubble"}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="ai-msg">
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,160,220,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>✦</div>
            <div className="typing-indicator">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      <div className="ai-chat-input-area">
        <input
          className="ai-chat-input"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button
          className="ai-chat-send"
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          style={{ opacity: !input.trim() || loading ? 0.5 : 1 }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
