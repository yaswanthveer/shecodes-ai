"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/health", label: "Health", icon: "💊" },
  { href: "/mind", label: "Mind", icon: "🧠" },
  { href: "/work", label: "Career", icon: "🚀" },
  { href: "/nourish", label: "Nourish", icon: "🥗" },
  { href: "/relationships", label: "Relationships", icon: "💜" },
  { href: "/community", label: "Community", icon: "👩‍👩‍👧" },
  { href: "/ai-news", label: "AI Guide", icon: "✦" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg-primary)" }}>
      {/* SIDEBAR */}
      <aside style={{
        width: 250, background: "var(--bg-glass-strong)", backdropFilter: "blur(20px)",
        borderRight: "1px solid var(--border-color)", display: "flex", flexDirection: "column",
        position: "fixed", top: 0, bottom: 0, left: 0
      }}>
        <div style={{ padding: "24px 20px" }}>
          <Link href="/" style={{ fontSize: 22, fontWeight: 800, textDecoration: "none", color: "var(--accent-rose)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ background: "var(--gradient-rose)", color: "white", width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>S</span>
            SheCodes.AI
          </Link>
        </div>

        <nav style={{ padding: "0 12px", flex: 1, marginTop: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 12px", marginBottom: 12 }}>Modules</div>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                borderRadius: "var(--radius-md)", textDecoration: "none",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive ? "rgba(201,160,220,0.1)" : "transparent",
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                marginBottom: 2,
                transition: "all 0.2s ease",
                borderLeft: isActive ? "3px solid var(--accent-rose)" : "3px solid transparent",
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* AI Status */}
        <div style={{ padding: 20, borderTop: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(201,160,220,0.08)", borderRadius: "var(--radius-md)", border: "1px solid rgba(201,160,220,0.15)" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent-sage)" }} />
              <div style={{ position: "absolute", inset: -2, borderRadius: "50%", border: "2px solid var(--accent-sage)", animation: "floatPulse 2s ease infinite", opacity: 0.4 }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>SheCodes.AI Active</div>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>IBM watsonx connected</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: 250 }}>
        {/* TOPBAR */}
        <header style={{
          height: 64,
          background: "var(--bg-glass-strong)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px",
          position: "sticky", top: 0, zIndex: 10
        }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
            <span>SheCodes.AI</span>
            <span style={{ color: "var(--border-strong)" }}>/</span>
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{navItems.find(n => n.href === pathname)?.label || "Overview"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="badge" style={{ fontSize: 11 }}>✦ AI Ready</div>
            <ThemeToggle />
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "var(--gradient-rose)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "white", fontWeight: 600, cursor: "pointer"
            }}>
              P
            </div>
          </div>
        </header>

        <div style={{ padding: 40, maxWidth: 1000, margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
