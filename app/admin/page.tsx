"use client";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <AppLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em", marginBottom: 8 }}>Admin</h1>
            <p style={{ fontSize: 17, color: "var(--text-secondary)" }}>Platform Management & IBM Cloud Status</p>
          </div>
          <div className="badge" style={{ background: "var(--accent-red)", color: "white" }}>Restricted Access</div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "1px solid var(--border-color)", paddingBottom: 16 }}>
          {["users", "ai", "content"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 16px",
                background: activeTab === tab ? "var(--bg-secondary)" : "transparent",
                border: "none",
                borderRadius: "var(--radius-full)",
                fontSize: 14,
                fontWeight: activeTab === tab ? 600 : 500,
                color: activeTab === tab ? "var(--text-primary)" : "var(--text-secondary)",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <div className="card">
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Database Status</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <div style={{ padding: 16, background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>IBM Cloudant connection</div>
                <div style={{ fontWeight: 600, color: "var(--accent-green)" }}>Healthy</div>
              </div>
              <div style={{ padding: 16, background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Total Profiles (Cloudant)</div>
                <div style={{ fontWeight: 600 }}>142</div>
              </div>
              <div style={{ padding: 16, background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Assessments Saved</div>
                <div style={{ fontWeight: 600 }}>128</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="card">
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>IBM watsonx Configuration</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>Base System Prompt (Therapist Persona)</label>
              <textarea 
                className="input-field" 
                rows={4} 
                defaultValue="You are an empathetic, highly intelligent AI assistant designed specifically for mothers going through identity shifts, career comebacks, and burnout. Always respond with warmth, validation, and practical steps."
              />
            </div>
            <button className="btn-primary" style={{ fontSize: 13 }}>Update Prompt</button>
          </div>
        )}

        {activeTab === "content" && (
          <div className="card" style={{ textAlign: "center", padding: 60, color: "var(--text-secondary)" }}>
            Content Management System will be initialized here.
          </div>
        )}
      </div>
    </AppLayout>
  );
}
