import imgIconSearchWht from "../../assets/icon_search_white.svg";
import { C, font, fontSerif, HERO_STATS } from "./constants";

// 상단 히어로 배너 + 검색바
export default function HeritageHero({ searchInput, onSearchChange, onSearch, onKeyDown }) {
  return (
    <>
      {/* ── 히어로 배너 ── */}
      <div style={{
        background: "linear-gradient(180deg, #000d57 0%, #061470 50%, #0d1f8a 100%)",
        paddingTop: 120, paddingBottom: 60,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.3,
          background: "radial-gradient(ellipse at 80% 50%, rgba(202,202,0,0.15) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", textAlign: "center" }}>
          <span style={{
            display: "inline-block",
            background: `${C.gold}20`, color: C.gold,
            padding: "6px 20px", borderRadius: 99,
            fontSize: 11, fontWeight: 900, letterSpacing: 2,
            textTransform: "uppercase", marginBottom: 18,
            border: `1px solid ${C.gold}40`,
          }}>
            ARCHIVE
          </span>
          <h1 style={{ fontFamily: fontSerif, fontSize: 42, fontWeight: 700, color: "white", margin: "0 0 14px", lineHeight: 1.2 }}>
            国家遺産リスト
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", margin: "0 0 40px" }}>
            国宝、宝物、史跡など、韓国の文化遺産を一箇所でご覧いただけます。
          </p>
          {/* 통계 수치 */}
          <div style={{ display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            {HERO_STATS.map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 40 }}>
                {i > 0 && <div style={{ width: 1, height: 44, background: "rgba(255,255,255,0.12)" }} />}
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 700, color: "white", margin: 0, lineHeight: 1 }}>{s.num}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "5px 0 0" }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 검색 바 ── */}
      <div style={{ background: C.white, borderBottom: `1.5px solid ${C.border}`, padding: "16px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
            <input
              value={searchInput}
              onChange={onSearchChange}
              onKeyDown={onKeyDown}
              placeholder="国家遺産の検索 (例: 景福宮、石窟庵、瞻星台)"
              style={{
                width: "100%", height: 56, padding: "0 70px 0 28px",
                border: "none", borderRadius: 9999, background: "#f3f4f6",
                fontSize: 15, outline: "none", fontFamily: font, fontWeight: 500,
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={onSearch}
              style={{
                position: "absolute", right: 6, top: 6, bottom: 6, width: 44,
                background: C.navy, border: "none", borderRadius: 9999,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.red}
              onMouseLeave={e => e.currentTarget.style.background = C.navy}
            >
              <img src={imgIconSearchWht} alt="検索" style={{ width: 18 }} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
