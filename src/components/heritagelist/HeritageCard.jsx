import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, font, BADGE_STYLE } from "./constants";

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

export default function HeritageCard({ item }) {
  const navigate        = useNavigate();
  const badge           = BADGE_STYLE[item.type] || { bg: C.navy, color: "white" };
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: C.white, borderRadius: 16, overflow: "hidden",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.15)" : "0 4px 12px rgba(0,0,0,0.08)",
        cursor: "pointer", transition: "box-shadow 0.25s, transform 0.25s",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
      onClick={() => navigate(`/heritage/${item.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 썸네일 */}
      <div style={{ position: "relative", height: 220, overflow: "hidden", background: "#e5e7eb" }}>
        <img
          src={item.thumbnail} alt={item.nameKo}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s", transform: hovered ? "scale(1.05)" : "scale(1)" }}
        />
        <span style={{
          position: "absolute", top: 14, left: 16,
          background: badge.bg, color: badge.color,
          fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 999, fontFamily: font,
        }}>
          {item.type}
        </span>
      </div>

      {/* 텍스트 */}
      <div style={{ padding: "20px 22px 18px" }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: "0 0 2px", fontFamily: font }}>{item.nameJa}</h3>
        <p style={{ fontSize: 13, color: C.textSub, margin: "0 0 4px", fontFamily: "'Noto Sans KR', sans-serif" }}>{item.nameKo}</p>
        <p style={{ fontSize: 12, color: C.textSub, margin: "0 0 12px", opacity: 0.7, fontFamily: font }}>{item.era}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 14 }}>
          <PinIcon />
          <span style={{ fontSize: 13, color: C.textBody, fontFamily: font }}>{item.region}</span>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: font, color: hovered ? C.navy : C.red, transition: "color 0.2s" }}>
            詳細を見る →
          </span>
        </div>
      </div>
    </div>
  );
}
