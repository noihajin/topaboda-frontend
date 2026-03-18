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
const font     = "'Noto Sans KR', 'Noto Sans JP', sans-serif";
const fontSerif= "'Noto Serif KR', 'Georgia', serif";

// ── 배지 색상 ────────────────────────────────────────────────────────
const BADGE_STYLE = {
  국보:     { bg: C.gold,    color: C.navy  },
  보물:     { bg: C.red,     color: "white" },
  사적:     { bg: C.navy,    color: "white" },
  천연기념물: { bg: "#1a4c7c", color: "white" },
  무형유산:  { bg: "#2d6a4f", color: "white" },
  민속문화재: { bg: "#3d005c", color: "white" },
};

// ── 목 데이터 ────────────────────────────────────────────────────────
const MOCK_HERITAGES = [
  { id: 1,  nameKo: "독도",           nameEn: "Dokdo",                       region: "경북", category: "천연기념물", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600" },
  { id: 2,  nameKo: "제주 한라산",     nameEn: "Hallasan Mountain",            region: "제주", category: "천연기념물", img: "https://images.unsplash.com/photo-1570092640903-9f959e3f4456?q=80&w=600" },
  { id: 3,  nameKo: "훈민정음 해례본", nameEn: "Hunminjeongeum Haerye",        region: "서울", category: "국보",     img: "https://images.unsplash.com/photo-1618176729090-253077a8f948?q=80&w=600" },
  { id: 4,  nameKo: "경복궁",         nameEn: "Gyeongbokgung Palace",         region: "서울", category: "사적",     img: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=600" },
  { id: 5,  nameKo: "창덕궁",         nameEn: "Changdeokgung Palace",         region: "서울", category: "사적",     img: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=600" },
  { id: 6,  nameKo: "수원 화성",       nameEn: "Hwaseong Fortress",            region: "경기", category: "사적",     img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=600" },
  { id: 7,  nameKo: "해인사 팔만대장경",nameEn: "Haeinsa Tripitaka Koreana",   region: "경남", category: "국보",     img: "https://images.unsplash.com/photo-1590603740183-980e7f6920eb?q=80&w=600" },
  { id: 8,  nameKo: "석굴암",         nameEn: "Seokguram Grotto",             region: "경북", category: "국보",     img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=600" },
  { id: 9,  nameKo: "종묘",           nameEn: "Jongmyo Shrine",               region: "서울", category: "사적",     img: "https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600" },
  { id: 10, nameKo: "불국사",         nameEn: "Bulguksa Temple",              region: "경북", category: "국보",     img: "https://images.unsplash.com/photo-1590603740183-980e7f6920eb?q=80&w=600" },
  { id: 11, nameKo: "안동 하회마을",   nameEn: "Hahoe Folk Village",           region: "경북", category: "민속문화재", img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600" },
  { id: 12, nameKo: "남한산성",       nameEn: "Namhansanseong Fortress",      region: "경기", category: "사적",     img: "https://images.unsplash.com/photo-1598935888738-cd2622bcd437?q=80&w=600" },
  { id: 13, nameKo: "강화 고인돌",    nameEn: "Ganghwa Dolmen",               region: "경기", category: "사적",     img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=600" },
  { id: 14, nameKo: "첨성대",         nameEn: "Cheomseongdae Observatory",     region: "경북", category: "사적",     img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=600" },
  { id: 15, nameKo: "양동마을",       nameEn: "Yangdong Folk Village",         region: "경북", category: "민속문화재", img: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=600" },
];

const CATEGORIES = ["전체", "국보", "보물", "사적", "천연기념물", "무형유산", "민속문화재"];
const REGIONS    = ["전체지역", "서울", "경기", "경북", "경남", "전남", "전북", "충남", "강원", "제주"];
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
        background: C.white,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 12px 32px rgba(0,0,0,0.15)"
          : "0 4px 12px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "box-shadow 0.25s, transform 0.25s",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
      onClick={() => navigate(`/heritage/${item.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 이미지 영역 */}
      <div style={{ position: "relative", height: 220, overflow: "hidden", background: "#e5e7eb" }}>
        <img
          src={item.img}
          alt={item.nameKo}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s", transform: hovered ? "scale(1.05)" : "scale(1)" }}
        />
        {/* 배지 */}
        <span style={{
          position: "absolute", top: 14, left: 16,
          background: badge.bg, color: badge.color,
          fontSize: 13, fontWeight: 600,
          padding: "5px 14px", borderRadius: 999, fontFamily: font,
        }}>
          {item.category}
        </span>
      </div>

      {/* 텍스트 영역 */}
      <div style={{ padding: "20px 22px 18px" }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: "0 0 4px", fontFamily: font }}>{item.nameKo}</h3>
        <p style={{ fontSize: 13, color: C.textSub, margin: "0 0 12px", fontFamily: font }}>{item.nameEn}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 14 }}>
          <PinIcon />
          <span style={{ fontSize: 13, color: C.textBody, fontFamily: font }}>{item.region}</span>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          <span style={{
            fontSize: 14, fontWeight: 600, color: C.red, fontFamily: font,
            transition: "opacity 0.2s", opacity: hovered ? 1 : 0.85,
          }}>
            자세히 보기 →
          </span>
        </div>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────
export default function HeritageList() {
  const [searchInput, setSearchInput]   = useState("");
  const [query, setQuery]               = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [activeRegion, setActiveRegion]     = useState("전체지역");
  const [currentPage, setCurrentPage]       = useState(0);

  // 필터링 로직
  const filtered = useMemo(() => {
    return MOCK_HERITAGES.filter(h => {
      const matchCat    = activeCategory === "전체" || h.category === activeCategory;
      const matchRegion = activeRegion === "전체지역" || h.region === activeRegion;
      const matchQuery  = !query || h.nameKo.includes(query) || h.nameEn.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchRegion && matchQuery;
    });
  }, [activeCategory, activeRegion, query]);

  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
  const displayed   = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const handleSearch = () => { setQuery(searchInput); setCurrentPage(0); };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const handleCategory = (cat) => { setActiveCategory(cat); setCurrentPage(0); };
  const handleRegion   = (reg) => { setActiveRegion(reg); setCurrentPage(0); };

  return (
    <div style={{ minHeight: "100vh", fontFamily: font, background: C.bg }}>

      {/* ── 1. 히어로 ── */}
      <div style={{
        background: "linear-gradient(180deg, #000d57 0%, #061470 50%, #0d1f8a 100%)",
        paddingTop: 120, paddingBottom: 60,
        paddingLeft: "6%", paddingRight: "6%",
        position: "relative", overflow: "hidden",
      }}>
        {/* 배경 장식 */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.3,
          background: "radial-gradient(ellipse at 80% 50%, rgba(202,202,0,0.15) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        {/* 국가유산 목록 뱃지 */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          border: `1.5px solid rgba(202,202,0,0.35)`,
          background: "rgba(202,202,0,0.12)", borderRadius: 999,
          padding: "8px 18px", marginBottom: 24,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
          <span style={{ color: C.gold, fontSize: 16, fontWeight: 500 }}>국가유산 목록</span>
        </div>

        {/* 타이틀 */}
        <h1 style={{ fontFamily: fontSerif, fontSize: "clamp(32px, 4vw, 60px)", fontWeight: 700, color: "white", margin: "0 0 16px", lineHeight: 1.2 }}>
          대한민국의 소중한 국가유산
        </h1>
        <p style={{ fontSize: "clamp(14px, 1.8vw, 22px)", color: "rgba(255,255,255,0.6)", margin: "0 0 48px" }}>
          국보, 보물, 사적 등 우리나라의 문화유산을 한곳에서 만나보세요.
        </p>

        {/* 통계 */}
        <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
          {[
            { num: "349",    label: "국보" },
            { num: "2,220",  label: "보물" },
            { num: "536",    label: "사적" },
            { num: "473",    label: "천연기념물" },
            { num: "4,000+", label: "전체 유산" },
          ].map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 48 }}>
              {i > 0 && <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.12)" }} />}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: fontSerif, fontSize: "clamp(28px, 3vw, 48px)", fontWeight: 700, color: "white", margin: 0, lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "6px 0 0", fontWeight: 400 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. 검색 바 ── */}
      <div style={{ background: C.white, borderBottom: `1.5px solid ${C.border}`, padding: "20px 6%" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", maxWidth: 900 }}>
          <div style={{
            flex: 1, position: "relative",
            background: C.bg, borderRadius: 14,
            border: `2px solid ${C.border}`,
            display: "flex", alignItems: "center",
            padding: "0 16px", height: 52,
          }}>
            <SearchIcon />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="국가유산 검색 (예: 경복궁, 석굴암, 첨성대)"
              style={{
                flex: 1, border: "none", background: "transparent",
                fontSize: 15, color: "#333", outline: "none",
                marginLeft: 10, fontFamily: font,
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{
              background: C.red, color: "white",
              border: "none", borderRadius: 14,
              padding: "0 28px", height: 52,
              fontSize: 15, fontWeight: 600,
              cursor: "pointer", fontFamily: font,
              transition: "opacity 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            검색
          </button>
        </div>
      </div>

      {/* ── 3. 카테고리 탭 ── */}
      <div style={{ background: C.white, borderBottom: `1.5px solid ${C.border}`, padding: "0 6%" }}>
        <div style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                style={{
                  background: "none", border: "none",
                  borderBottom: isActive ? `3px solid ${C.navy}` : "3px solid transparent",
                  color: isActive ? C.navy : C.textSub,
                  fontSize: 16, fontWeight: isActive ? 700 : 500,
                  padding: "18px 24px", cursor: "pointer",
                  fontFamily: font, whiteSpace: "nowrap",
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
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {REGIONS.map(reg => {
            const isActive = activeRegion === reg;
            return (
              <button
                key={reg}
                onClick={() => handleRegion(reg)}
                style={{
                  background: isActive ? C.navy : C.white,
                  color: isActive ? "white" : C.textBody,
                  border: `2px solid ${isActive ? C.navy : C.border}`,
                  borderRadius: 999, padding: "7px 18px",
                  fontSize: 14, fontWeight: isActive ? 600 : 400,
                  cursor: "pointer", fontFamily: font,
                  transition: "all 0.2s",
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
        {/* 결과 수 */}
        <p style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 24, fontFamily: font }}>
          {filtered.length}
          <span style={{ fontWeight: 400, color: C.textSub }}>건의 유산</span>
        </p>

        {/* 그리드 */}
        {displayed.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}>
            {displayed.map(item => <HeritageCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0", color: C.textSub, fontSize: 16 }}>
            검색 결과가 없습니다.
          </div>
        )}

        {/* ── 페이지네이션 ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 48 }}>
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(p => p - 1)}
              style={{
                width: 44, height: 44, borderRadius: 12,
                border: `2px solid ${C.border}`, background: C.white,
                cursor: currentPage === 0 ? "default" : "pointer",
                opacity: currentPage === 0 ? 0.3 : 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { if (currentPage !== 0) e.currentTarget.style.background = C.bg; }}
              onMouseLeave={e => e.currentTarget.style.background = C.white}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  border: currentPage === i ? "none" : `2px solid ${C.border}`,
                  background: currentPage === i ? C.navy : C.white,
                  color: currentPage === i ? "white" : C.navy,
                  cursor: "pointer", fontSize: 16, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", fontFamily: font,
                }}
                onMouseEnter={e => { if (currentPage !== i) e.currentTarget.style.background = C.bg; }}
                onMouseLeave={e => { if (currentPage !== i) e.currentTarget.style.background = C.white; }}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(p => p + 1)}
              style={{
                width: 44, height: 44, borderRadius: 12,
                border: `2px solid ${C.border}`, background: C.white,
                cursor: currentPage >= totalPages - 1 ? "default" : "pointer",
                opacity: currentPage >= totalPages - 1 ? 0.3 : 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
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
