import { C, font, CATEGORIES, REGIONS } from "./constants";

// 카테고리 탭 + 지역 필터
export default function HeritageFilters({ activeCategory, onCategoryChange, activeRegion, onRegionChange }) {
  return (
    <>
      {/* ── 카테고리 탭 ── */}
      <div style={{ background: C.white, borderBottom: `1.5px solid ${C.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none", justifyContent: "center" }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  style={{
                    background: "none", border: "none",
                    borderBottom: isActive ? `3px solid ${C.navy}` : "3px solid transparent",
                    color: isActive ? C.navy : C.textSub,
                    fontSize: 15, fontWeight: isActive ? 700 : 500,
                    padding: "16px 20px", cursor: "pointer", fontFamily: font, whiteSpace: "nowrap",
                    transition: "color 0.2s",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 지역 필터 ── */}
      <div style={{ background: C.white, borderBottom: `1.5px solid ${C.border}`, padding: "12px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {REGIONS.map(reg => {
              const isActive = activeRegion === reg;
              return (
                <button
                  key={reg}
                  onClick={() => onRegionChange(reg)}
                  style={{
                    background: isActive ? C.navy : C.white,
                    color: isActive ? "white" : C.textBody,
                    border: `2px solid ${isActive ? C.navy : C.border}`,
                    borderRadius: 999, padding: "6px 16px",
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                    cursor: "pointer", fontFamily: font, transition: "all 0.2s",
                  }}
                >
                  {reg}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
