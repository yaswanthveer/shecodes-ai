"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="theme-toggle-btn"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid var(--border-color)",
          background: "var(--bg-glass)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          fontSize: 18,
        }}
      >
        <span style={{ opacity: 0.5 }}>◐</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="theme-toggle-btn"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid var(--border-color)",
        background: "var(--bg-glass)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontSize: 18,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isDark ? "translateY(0) rotate(0deg)" : "translateY(40px) rotate(180deg)",
          opacity: isDark ? 1 : 0,
        }}
      >
        🌙
      </span>
      <span
        style={{
          position: "absolute",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isDark ? "translateY(-40px) rotate(-180deg)" : "translateY(0) rotate(0deg)",
          opacity: isDark ? 0 : 1,
        }}
      >
        ☀️
      </span>
    </button>
  );
}

// Made with Bob
