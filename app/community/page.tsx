"use client";
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import InlineAIChat from "@/components/InlineAIChat";

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiReplying, setAiReplying] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setPosts([
        { id: 1, author: "Sarah M.", text: "First day back at work after 3 years. Terrified but ready.", time: "2h ago", likes: 12, aiReply: "" },
        { id: 2, author: "Elena R.", text: "Does anyone else feel like they're failing at both work and home?", time: "5h ago", likes: 34, aiReply: "" },
        { id: 3, author: "Maya K.", text: "My toddler said 'I love you, mama' today and I just broke down crying. The overwhelm is real.", time: "8h ago", likes: 67, aiReply: "" }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosts([{ id: Date.now(), author: "You", text: newPost, time: "Just now", likes: 0, aiReply: "" }, ...posts]);
    setNewPost("");
  };

  const getAiSupport = async (postId: number, postText: string) => {
    setAiReplying(postId);
    try {
      const res = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "community_support", postText })
      });
      const data = await res.json();
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, aiReply: data.result } : p));
    } catch (e) {
      console.error("AI support failed");
    } finally {
      setAiReplying(null);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div className="badge" style={{ marginBottom: 12, background: "rgba(123,167,204,0.15)", color: "var(--accent-blue)", borderColor: "rgba(123,167,204,0.3)" }}>👩‍👩‍👧 Community</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>Community</h1>
          <p style={{ fontSize: 17, color: "var(--text-secondary)" }}>A private space to connect with other mothers. AI moderates with empathy.</p>
        </div>

        {/* AI COMMUNITY BOT */}
        <InlineAIChat
          title="Community AI"
          subtitle="Ask for advice, support, or inspiration"
          systemAction="community_support"
          placeholder="Share what's on your mind with the community AI..."
          accentColor="var(--accent-blue)"
          initialMessage="Welcome to the community! I'm here to offer support, connect you with similar stories, or just listen. What's on your heart today? 💙"
          extraPayload={{ context: "community support for mothers" }}
        />

        <div className="card" style={{ marginBottom: 24 }}>
          <textarea className="input-field" placeholder="Share your thoughts..." value={newPost} onChange={e => setNewPost(e.target.value)} rows={3} style={{ resize: "none", marginBottom: 16, border: "none", padding: 0 }} />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" onClick={handlePost} disabled={!newPost.trim()} style={{ opacity: !newPost.trim() ? 0.5 : 1 }}>Post</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "var(--text-tertiary)", padding: 40 }}>Loading feed...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {posts.map(p => (
              <div key={p.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontWeight: 600 }}>{p.author}</div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{p.time}</div>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.55, marginBottom: 16 }}>{p.text}</p>

                <div style={{ display: "flex", gap: 16 }}>
                  <button style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer", display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 16 }}>🤍</span> {p.likes}
                  </button>
                  <button style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer", display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 16 }}>💬</span> Reply
                  </button>
                  {!p.aiReply && (
                    <button onClick={() => getAiSupport(p.id, p.text)} disabled={aiReplying === p.id} style={{ background: "none", border: "none", color: "var(--accent-rose)", fontSize: 13, cursor: "pointer", display: "flex", gap: 6, alignItems: "center", marginLeft: "auto" }}>
                      <span>✦</span> {aiReplying === p.id ? "Thinking..." : "AI Support"}
                    </button>
                  )}
                </div>

                {p.aiReply && (
                  <div className="animate-fade-in" style={{ marginTop: 16, padding: 16, background: "rgba(201,160,220,0.06)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--accent-rose)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-rose)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>✦ SheCodes.AI Community Support</div>
                    <p style={{ fontSize: 14, lineHeight: 1.55 }}>{p.aiReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
