import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

const SECTIONS = [
  { id: "section-hero",    label: "メインビジュアル" },
  { id: "section-map",     label: "地図" },
  { id: "section-popular", label: "人気遺産" },
];

export default function SectionNavButton() {
  const { pathname } = useLocation();
  const isHome = pathname === "/" || pathname === "/home";

  // 현재 보이는 섹션 인덱스 (IntersectionObserver로 추적)
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState("down"); // "down" | "up"
  const [hovered, setHovered] = useState(false);

  // IntersectionObserver로 각 섹션 감지
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
          // 보이는 섹션 중 가장 작은 인덱스를 현재로 설정
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

  const goNext = useCallback(() => {
    let nextIdx;

    if (direction === "down") {
      nextIdx = currentIdx + 1;
      if (nextIdx >= SECTIONS.length) {
        // 마지막에서 방향 전환 → 한 단계 위로
        nextIdx = currentIdx - 1;
        setDirection("up");
      } else if (nextIdx === SECTIONS.length - 1) {
        // 마지막 섹션 도달 → 다음 클릭부터 위로 올라가도록 방향 전환
        setDirection("up");
      }
    } else {
      // 위로 올라가는 중
      nextIdx = currentIdx - 1;
      if (nextIdx <= 0) {
        nextIdx = 0;
        setDirection("down"); // 맨 위 도달 → 다시 아래로
      }
    }

    const el = document.getElementById(SECTIONS[nextIdx].id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentIdx, direction]);

  if (!isHome) return null;

  const isGoingUp = direction === "up";
  const nextLabel = isGoingUp
    ? (currentIdx > 0 ? SECTIONS[currentIdx - 1].label : "トップ")
    : (currentIdx < SECTIONS.length - 1 ? SECTIONS[currentIdx + 1].label : "トップ");

  return (
    <div
      style={{
        position: "fixed",
        bottom: 116,   // TOP 버튼(bottom:40) 위에 위치 (40 + 62 + 14)
        right: 40,
        zIndex: 8999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      {/* 다음 섹션 라벨 툴팁 */}
      <div
        style={{
          background: "rgba(0,13,87,0.85)",
          color: "white",
          fontSize: 11,
          fontFamily: "'Noto Sans JP', sans-serif",
          padding: "4px 10px",
          borderRadius: 20,
          whiteSpace: "nowrap",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.2s, transform 0.2s",
          pointerEvents: "none",
        }}
      >
        {isGoingUp ? `↑ ${nextLabel}` : `↓ ${nextLabel}`}
      </div>

      {/* 섹션 이동 버튼 */}
      <button
        onClick={goNext}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="次のセクションへ"
        style={{
          width: 62,
          height: 62,
          borderRadius: "50%",
          border: "2px solid #caca00",
          background: hovered ? "#caca00" : "white",
          boxShadow: hovered
            ? "2px 3px 12px rgba(202,202,0,0.45)"
            : "2px 3px 4px rgba(0,0,0,0.15)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
        }}
      >
        {/* 마지막 섹션이면 위화살표, 아니면 아래화살표 */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={hovered ? "white" : "#caca00"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isGoingUp ? "rotate(180deg)" : "none",
            transition: "transform 0.3s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* 섹션 인디케이터 점 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
        {SECTIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const el = document.getElementById(SECTIONS[i].id);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            aria-label={SECTIONS[i].label}
            style={{
              width: i === currentIdx ? 8 : 6,
              height: i === currentIdx ? 8 : 6,
              borderRadius: "50%",
              background: i === currentIdx ? "#caca00" : "#ccc",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.2s",
              alignSelf: "center",
            }}
          />
        ))}
      </div>
    </div>
  );
}
