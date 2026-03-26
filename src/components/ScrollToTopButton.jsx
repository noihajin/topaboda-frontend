import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// TOP 버튼을 숨길 경로
const HIDE_PATHS = ["/", "/login", "/register", "/register/form", "/register/select"];

export default function ScrollToTopButton() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isHidden = HIDE_PATHS.includes(pathname);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isHidden) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="ページ上部へ戻る"
      style={{
        position: "fixed",
        bottom: 40,
        right: 40,
        zIndex: 9000,
        width: 40,
        height: 40,
        borderRadius: "50%",
        // 기본: 흰 배경 + 골드 테두리 / 호버: 골드 채우기
        border: "2px solid #caca00",
        background: hovered ? "#caca00" : "white",
        boxShadow: hovered
          ? "2px 3px 12px rgba(202,202,0,0.45)"
          : "2px 3px 4px rgba(0,0,0,0.15)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible
          ? hovered ? "translateY(-3px)" : "translateY(0)"
          : "translateY(16px)",
        transition:
          "opacity 0.25s ease, transform 0.25s ease, background 0.2s, box-shadow 0.2s, border 0.2s",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        // 기본: 골드 화살표 / 호버: 흰 화살표
        stroke={hovered ? "white" : "#caca00"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "stroke 0.2s" }}
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
