import { useState, useEffect } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="ページ上部へ戻る"
      style={{
        position: "fixed",
        bottom: 40,
        right: 40,
        zIndex: 9000,
        width: 62,
        height: 62,
        borderRadius: "50%",
        border: "none",
        background: hovered ? "#b8b800" : "#caca00",
        boxShadow: hovered
          ? "2px 3px 12px rgba(0,0,0,0.35)"
          : "2px 3px 4px rgba(0,0,0,0.25)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible
          ? (hovered ? "translateY(-3px)" : "translateY(0)")
          : "translateY(16px)",
        transition: "opacity 0.25s ease, transform 0.25s ease, background 0.2s, box-shadow 0.2s",
      }}
    >
      {/* 위 화살표 SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
