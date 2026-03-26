import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SECTIONS = [
  { id: "section-hero",    label: "メインビジュアル" },
  { id: "section-map",     label: "地図" },
  { id: "section-popular", label: "人気遺産" },
];

export default function SectionNavButton() {
  const { pathname } = useLocation();
  const isHome = pathname === "/" || pathname === "/home";

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!isHome) return;

    const observers = [];
    const visibilityMap = {};

    SECTIONS.forEach((sec, i) => {
      const el = document.getElementById(sec.id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          visibilityMap[i] = entry.isIntersecting;
          const visible = Object.entries(visibilityMap)
            .filter(([, v]) => v)
            .map(([k]) => Number(k));
          if (visible.length > 0) setCurrentIdx(Math.min(...visible));
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  const scrollTo = (idx) => {
    const el = document.getElementById(SECTIONS[idx].id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!isHome) return null;

  const canUp   = currentIdx > 0;
  const canDown = currentIdx < SECTIONS.length - 1;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 116,
        right: 40,
        zIndex: 8999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      {/* 위 화살표 */}
      <ArrowBtn
        direction="up"
        disabled={!canUp}
        onClick={() => canUp && scrollTo(currentIdx - 1)}
      />
      {/* 아래 화살표 */}
      <ArrowBtn
        direction="down"
        disabled={!canDown}
        onClick={() => canDown && scrollTo(currentIdx + 1)}
      />
    </div>
  );
}

function ArrowBtn({ direction, disabled, onClick }) {
  const [hovered, setHovered] = useState(false);
  const active = !disabled && hovered;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={direction === "up" ? "前のセクションへ" : "次のセクションへ"}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: `1.5px solid ${disabled ? "#e5e7eb" : active ? "#caca00" : "#caca00"}`,
        background: active ? "#caca00" : disabled ? "#f9fafb" : "white",
        boxShadow: active ? "0 4px 12px rgba(202,202,0,0.35)" : "0 2px 6px rgba(0,0,0,0.08)",
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: active ? "translateY(-2px)" : "none",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.35 : 1,
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "white" : disabled ? "#ccc" : "#caca00"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "stroke 0.2s" }}
      >
        {direction === "up"
          ? <polyline points="18 15 12 9 6 15" />
          : <polyline points="6 9 12 15 18 9" />
        }
      </svg>
    </button>
  );
}
