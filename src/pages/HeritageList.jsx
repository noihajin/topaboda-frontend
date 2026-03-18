import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ── 디자인 토큰 ──────────────────────────────────────────────────────
const C = {
  navy:    "#000d57",
  red:     "#6e0000",
  gold:    "#caca00",
  bg:      "#f3f3f5",
  white:   "#ffffff",
  border:  "rgba(0,13,87,0.1)",
  textSub: "rgba(0,13,87,0.5)",
  textBody:"rgba(0,13,87,0.7)",
};

// 일본어 환경에 최적화된 폰트 스택
const font     = "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'sans-serif'";
const fontSerif= "'Noto Serif JP', 'Shippori Mincho', 'serif'";

// ── 배지 색상 (공식 명칭 반영) ──────────────────────────────────────────
const BADGE_STYLE = {
  "国宝":       { bg: C.gold,    color: C.navy  },
  "宝物":       { bg: C.red,     color: "white" },
  "史跡":       { bg: C.navy,    color: "white" },
  "天然記念物":  { bg: "#1a4c7c", color: "white" },
  "無形遺産":    { bg: "#2d6a4f", color: "white" },
  "民俗文化財":  { bg: "#3d005c", color: "white" },
};

// ── 목 데이터 (일본어 번역 완료) ────────────────────────────────────────
const MOCK_HERITAGES = [
  { id: 1,  nameKo: "独島",            nameKr: "독도",            nameEn: "Dokdo",                      region: "慶北",  category: "天然記念物", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600" },
  { id: 2,  nameKo: "済州 漢拏山",      nameKr: "제주 한라산",     nameEn: "Hallasan Mountain",           region: "済州",  category: "天然記念物", img: "https://images.unsplash.com/photo-1570092640903-9f959e3f4456?q=80&w=600" },
  { id: 3,  nameKo: "訓民正音 解例本",  nameKr: "훈민정음 해례본", nameEn: "Hunminjeongeum Haerye",       region: "ソウル", category: "国宝",      img: "https://images.unsplash.com/photo-1618176729090-253077a8f948?q=80&w=600" },
  { id: 4,  nameKo: "景福宮",          nameKr: "경복궁",          nameEn: "Gyeongbokgung Palace",        region: "ソウル", category: "史跡",      img: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=600" },
  { id: 5,  nameKo: "昌徳宮",          nameKr: "창덕궁",          nameEn: "Changdeokgung Palace",        region: "ソウル", category: "史跡",      img: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=600" },
  { id: 6,  nameKo: "水原 華城",        nameKr: "수원 화성",       nameEn: "Hwaseong Fortress",           region: "京畿",  category: "史跡",      img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=600" },
  { id: 7,  nameKo: "海印寺 八万大蔵経", nameKr: "해인사 팔만대장경", nameEn: "Haeinsa Tripitaka Koreana", region: "慶南",  category: "国宝",      img: "https://images.unsplash.com/photo-1590603740183-980e7f6920eb?q=80&w=600" },
  { id: 8,  nameKo: "石窟庵",          nameKr: "석굴암",          nameEn: "Seokguram Grotto",            region: "慶北",  category: "国宝",      img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=600" },
  { id: 9,  nameKo: "宗廟",            nameKr: "종묘",            nameEn: "Jongmyo Shrine",              region: "ソウル", category: "史跡",      img: "https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600" },
  { id: 10, nameKo: "仏国寺",          nameKr: "불국사",          nameEn: "Bulguksa Temple",             region: "慶北",  category: "国宝",      img: "https://images.unsplash.com/photo-1590603740183-980e7f6920eb?q=80&w=600" },
  { id: 11, nameKo: "安東 河回村",      nameKr: "안동 하회마을",   nameEn: "Hahoe Folk Village",          region: "慶北",  category: "民俗文化財", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600" },
  { id: 12, nameKo: "南漢山城",        nameKr: "남한산성",        nameEn: "Namhansanseong Fortress",     region: "京畿",  category: "史跡",      img: "https://images.unsplash.com/photo-1598935888738-cd2622bcd437?q=80&w=600" },
];

const CATEGORIES = ["すべて", "国宝", "宝物", "史跡", "天然記念物", "無形遺産", "民俗文化財"];
const REGIONS    = ["すべての地域", "ソウル", "京畿", "慶北", "慶南", "全南", "全北", "忠南", "江原", "済州"];
const PAGE_SIZE  = 9;

// ── 아이콘 ────────────────────────────────────────────────────────────
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textBody} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

// ── 카드 컴포넌트 ────────────────────────────────────────────────────
function HeritageCard({ item }) {
  const navigate = useNavigate();
  const badge    = BADGE_STYLE[item.category] || { bg: C.navy, color: "white" };
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
      <div style={{ position: "relative", height: 220, overflow: "hidden", background: "#e5e7eb" }}>
        <img
          src={item.img} alt={item.nameKo}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s", transform: hovered ? "scale(1.05)" : "scale(1)" }}
        />
        <span style={{
          position: "absolute", top: 14, left: 16,
          background: badge.bg, color: badge.color,
          fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 999, fontFamily: font,
        }}>
          {item.category}
        </span>
      </div>
      <div style={{ padding: "20px 22px 18px" }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: "0 0 2px", fontFamily: font }}>{item.nameKo}</h3>
        <p style={{ fontSize: 13, color: C.textSub, margin: "0 0 4px", fontFamily: "'Noto Sans KR', sans-serif" }}>{item.nameKr}</p>
        <p style={{ fontSize: 12, color: C.textSub, margin: "0 0 12px", opacity: 0.7, fontFamily: font }}>{item.nameEn}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 14 }}>
          <PinIcon />
          <span style={{ fontSize: 13, color: C.textBody, fontFamily: font }}>{item.region}</span>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, display: "flex", justifyContent: "flex-end" }}>
          <span style={{
            fontSize: 14, fontWeight: 600, fontFamily: font,
            color: hovered ? C.navy : C.red,
            transition: "color 0.2s",
          }}>
            詳細を見る →
          </span>
        </div>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────
export default function HeritageList() {
  const [searchInput, setSearchInput]       = useState("");
  const [query, setQuery]                   = useState("");
  const [activeCategory, setActiveCategory] = useState("すべて");
  const [activeRegion, setActiveRegion]     = useState("すべての地域");
  const [currentPage, setCurrentPage]       = useState(0);

  const filtered = useMemo(() => {
    return MOCK_HERITAGES.filter(h => {
      const matchCat    = activeCategory === "すべて" || h.category === activeCategory;
      const matchRegion = activeRegion === "すべての地域" || h.region === activeRegion;
      const matchQuery  = !query || h.nameKo.includes(query) || h.nameEn.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchRegion && matchQuery;
    });
  }, [activeCategory, activeRegion, query]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const displayed  = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const handleSearch  = () => { setQuery(searchInput); setCurrentPage(0); };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  return (
    <div style={{ minHeight: "100vh", fontFamily: font, background: C.bg }}>

      {/* ── 1. 히어로 ── */}
      <div style={{
        background: "linear-gradient(180deg, #000d57 0%, #061470 50%, #0d1f8a 100%)",
        paddingTop: 120, paddingBottom: 60, paddingLeft: "6%", paddingRight: "6%",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.3,
          background: "radial-gradient(ellipse at 80% 50%, rgba(202,202,0,0.15) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          border: "1.5px solid rgba(202,202,0,0.35)", background: "rgba(202,202,0,0.12)",
          borderRadius: 999, padding: "8px 18px", marginBottom: 24,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
          <span style={{ color: C.gold, fontSize: 16, fontWeight: 500 }}>国家遺産アーカイブ</span>
        </div>
        <h1 style={{ fontFamily: fontSerif, fontSize: "clamp(32px, 4vw, 60px)", fontWeight: 700, color: "white", margin: "0 0 16px", lineHeight: 1.2 }}>
          大韓民国の貴重な国家遺産
        </h1>
        <p style={{ fontSize: "clamp(14px, 1.8vw, 22px)", color: "rgba(255,255,255,0.6)", margin: "0 0 48px" }}>
          国宝、宝物、史跡など、韓国の文化遺産を一箇所でご覧いただけます。
        </p>
        <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
          {[
            { num: "349",    label: "国宝" },
            { num: "2,220",  label: "宝物" },
            { num: "536",    label: "史跡" },
            { num: "473",    label: "天然記念物" },
            { num: "4,000+", label: "全遺産" },
          ].map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 48 }}>
              {i > 0 && <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.12)" }} />}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: fontSerif, fontSize: "clamp(28px, 3vw, 48px)", fontWeight: 700, color: "white", margin: 0, lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "6px 0 0" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. 검색 바 ── */}
      <div style={{ background: C.white, borderBottom: `1.5px solid ${C.border}`, padding: "20px 6%" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", maxWidth: 900 }}>
          <div style={{
            flex: 1, position: "relative", background: C.bg, borderRadius: 14,
            border: `2px solid ${C.border}`, display: "flex", alignItems: "center",
            padding: "0 16px", height: 52,
          }}>
            <SearchIcon />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="国家遺産の検索 (例: 景福宮、石窟庵、瞻星台)"
              style={{ flex: 1, border: "none", background: "transparent", fontSize: 15, color: "#333", outline: "none", marginLeft: 10, fontFamily: font }}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{ background: C.red, color: "white", border: "none", borderRadius: 14, padding: "0 28px", height: 52, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: font, transition: "opacity 0.2s", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            検索
          </button>
        </div>
      </div>

      {/* ── 3. 카테고리 탭 ── */}
      <div style={{ background: C.white, borderBottom: `1.5px solid ${C.border}`, padding: "0 6%" }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(0); }}
                style={{
                  background: "none", border: "none",
                  borderBottom: isActive ? `3px solid ${C.navy}` : "3px solid transparent",
                  color: isActive ? C.navy : C.textSub,
                  fontSize: 16, fontWeight: isActive ? 700 : 500,
                  padding: "18px 24px", cursor: "pointer", fontFamily: font, whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. 지역 필터 ── */}
      <div style={{ background: C.white, borderBottom: `1.5px solid ${C.border}`, padding: "14px 6%" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {REGIONS.map(reg => {
            const isActive = activeRegion === reg;
            return (
              <button
                key={reg}
                onClick={() => { setActiveRegion(reg); setCurrentPage(0); }}
                style={{
                  background: isActive ? C.navy : C.white,
                  color: isActive ? "white" : C.textBody,
                  border: `2px solid ${isActive ? C.navy : C.border}`,
                  borderRadius: 999, padding: "7px 18px",
                  fontSize: 14, fontWeight: isActive ? 600 : 400,
                  cursor: "pointer", fontFamily: font, transition: "all 0.2s",
                }}
              >
                {reg}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 5. 카드 그리드 ── */}
      <div style={{ padding: "40px 6% 60px", maxWidth: 1400, margin: "0 auto" }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 24, fontFamily: font }}>
          {filtered.length}<span style={{ fontWeight: 400, color: C.textSub }}>件の遺産</span>
        </p>
        {displayed.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {displayed.map(item => <HeritageCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0", color: C.textSub, fontSize: 16, fontFamily: font }}>
            検索結果がありません。
          </div>
        )}

        {/* ── 페이지네이션 ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 48 }}>
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(p => p - 1)}
              style={{ width: 44, height: 44, borderRadius: 12, border: `2px solid ${C.border}`, background: C.white, cursor: currentPage === 0 ? "default" : "pointer", opacity: currentPage === 0 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
              onMouseEnter={e => { if (currentPage !== 0) e.currentTarget.style.background = C.bg; }}
              onMouseLeave={e => e.currentTarget.style.background = C.white}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                style={{ width: 44, height: 44, borderRadius: 12, border: currentPage === i ? "none" : `2px solid ${C.border}`, background: currentPage === i ? C.navy : C.white, color: currentPage === i ? "white" : C.navy, cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", fontFamily: font }}
                onMouseEnter={e => { if (currentPage !== i) e.currentTarget.style.background = C.bg; }}
                onMouseLeave={e => { if (currentPage !== i) e.currentTarget.style.background = C.white; }}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(p => p + 1)}
              style={{ width: 44, height: 44, borderRadius: 12, border: `2px solid ${C.border}`, background: C.white, cursor: currentPage >= totalPages - 1 ? "default" : "pointer", opacity: currentPage >= totalPages - 1 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
              onMouseEnter={e => { if (currentPage < totalPages - 1) e.currentTarget.style.background = C.bg; }}
              onMouseLeave={e => e.currentTarget.style.background = C.white}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
