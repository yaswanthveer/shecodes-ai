"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hey there! I'm SheCodes.AI — your personal companion. Ask me anything about health, career, mindfulness, or just talk. I'm here for you. 💜" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          message: userMsg,
          context: `User is on ${pathname} page`,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.result }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "SheCodes.AI is warming up. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  // Don't show on landing page
  if (pathname === "/") return null;

  return (
    <>
      {/* Floating Button */}
      <button className="floating-chat-btn" onClick={() => setOpen(!open)} aria-label="Chat with SheCodes.AI">
        {open ? "✕" : "✦"}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="floating-chat-panel">
          <div className="ai-chat-container" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="ai-chat-header">
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✦</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>SheCodes.AI</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Powered by IBM watsonx</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", border: "none", color: "white", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            <div className="ai-chat-messages" ref={scrollRef} style={{ flex: 1, maxHeight: 350 }}>
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === "ai" ? "ai-msg" : ""} style={msg.role === "user" ? { display: "flex", justifyContent: "flex-end" } : undefined}>
                  {msg.role === "ai" && (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,160,220,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 2 }}>✦</div>
                  )}
                  <div className={msg.role === "ai" ? "ai-msg-bubble" : "user-msg-bubble"}>{msg.text}</div>
                </div>
              ))}
              {loading && (
                <div className="ai-msg">
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,160,220,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>✦</div>
                  <div className="typing-indicator"><span /><span /><span /></div>
                </div>
              )}
            </div>

            <div className="ai-chat-input-area">
              <input
                className="ai-chat-input"
                placeholder="Talk to SheCodes.AI..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />
              <button className="ai-chat-send" onClick={sendMessage} disabled={!input.trim() || loading} style={{ opacity: !input.trim() || loading ? 0.5 : 1 }}>↑</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
