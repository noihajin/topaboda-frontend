import { C, font, fontSerif } from "./constants";
import {
  IconMapPin, IconBookmark, IconHeart, IconShare,
} from "./DetailUI";

export default function HeritageHero({ data, isLiked, isBookmarked, likeCount, onLike, onBookmark }) {
  const actionBtns = [
    { icon: <IconBookmark active={isBookmarked} />, label: "保存",                  onClick: onBookmark },
    { icon: <IconHeart    active={isLiked} />,      label: likeCount.toLocaleString(), onClick: onLike     },
    { icon: <IconShare />,                          label: "共有",                  onClick: () => {}    },
  ];

  return (
    <div style={{ position: "relative", height: "75vh", minHeight: 560 }}>
      <img
        src={data.thumbnail}
        alt={data.nameJa}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {/* 그라디언트 오버레이 */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.05) 100%)",
      }} />

      {/* 유산 정보 (좌하단) */}
      <div style={{ position: "absolute", bottom: 56, left: 72 }}>
        {/* 배지 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <span style={{
            background: data.gcodeName === "国宝" ? C.yellowGrad : data.gcodeName === "宝物" ? C.red : C.navy,
            color: data.gcodeName === "国宝" ? C.navy : "white",
            fontWeight: 700, fontSize: 13, borderRadius: 100, padding: "6px 18px",
            fontFamily: font, letterSpacing: "0.02em",
          }}>
            {data.gcodeName}
          </span>
          <span style={{ color: C.yellow, fontWeight: 700, fontSize: 18, fontFamily: font }}>
            {data.number}
          </span>
        </div>

        {/* 제목 */}
        <h1 style={{
          fontFamily: fontSerif, fontSize: "clamp(52px, 6vw, 80px)",
          color: "white", margin: "0 0 8px", lineHeight: 1.1, fontWeight: 700,
        }}>
          {data.nameJa}
        </h1>
        <p style={{
          fontSize: "clamp(16px, 2vw, 24px)", color: "rgba(255,255,255,0.88)",
          margin: "0 0 8px", fontFamily: font, fontWeight: 400,
        }}>
          {data.nameJaReading}
        </p>
        <p style={{
          fontSize: 14, color: "rgba(255,255,255,0.55)",
          margin: "0 0 18px", fontFamily: font, fontWeight: 400, letterSpacing: "0.04em",
        }}>
          {data.nameKo}
        </p>

        {/* 위치 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconMapPin />
          <span style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", fontFamily: font }}>
            {data.location}
          </span>
        </div>
      </div>

      {/* 액션 버튼 (우하단) */}
      <div style={{
        position: "absolute", bottom: 56, right: 72,
        display: "flex", gap: 16, alignItems: "center",
      }}>
        {actionBtns.map((btn) => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 4,
              width: 72, height: 72, borderRadius: "50%",
              background: "white", border: "none", cursor: "pointer",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.25)"; }}
          >
            {btn.icon}
            <span style={{ fontSize: 11, fontWeight: 600, color: C.textDark, fontFamily: font }}>
              {btn.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
