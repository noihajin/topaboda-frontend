import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoBlack from "../assets/logo_black.svg";

// ── 디자인 토큰 ──────────────────────────────────────────────────
const C = {
  navy:   "#000d57",
  red:    "#6e0000",
  gold:   "#caca00",
  white:  "#ffffff",
  bg:     "#f8fafc",
  gray3:  "#6a7282",
  gray4:  "#99a1af",
  border: "#e2e8f0",
};
const font = "'Noto Sans JP', 'Noto Sans KR', sans-serif";

// ── 뱃지 스타일 ─────────────────────────────────────────────────
const BADGE = {
  "国宝":      { bg: "rgba(202,202,0,0.15)", color: "#a08c00" },
  "史跡":      { bg: "#e2e8f0", color: "#6a7282" },
  "博物館":    { bg: "#e2e8f0", color: "#6a7282" },
  "ランドマーク": { bg: "#e2e8f0", color: "#6a7282" },
  "伝統市場":  { bg: "#e2e8f0", color: "#6a7282" },
  "文化通り":  { bg: "#e2e8f0", color: "#6a7282" },
};

// ── 목 데이터: 북마크된 장소 ────────────────────────────────────
const BOOKMARKED = [
  { id: 1, nameJa: "景福宮",         nameEn: "Gyeongbokgung Palace",    address: "ソウル特別市 鐘路区 社稷路 161",         duration: "2時間",   category: "国宝" },
  { id: 2, nameJa: "昌徳宮",         nameEn: "Changdeokgung Palace",    address: "ソウル特別市 鐘路区 栗谷路 99",          duration: "1.5時間", category: "国宝" },
  { id: 3, nameJa: "国立中央博物館", nameEn: "National Museum of Korea", address: "ソウル特別市 龍山区 西氷庫路 137",       duration: "3時間",   category: "博物館" },
  { id: 4, nameJa: "北村韓屋村",     nameEn: "Bukchon Hanok Village",   address: "ソウル特別市 鐘路区 渓洞路 37",          duration: "1時間",   category: "史跡" },
  { id: 5, nameJa: "南山ソウルタワー", nameEn: "N Seoul Tower",          address: "ソウル特別市 龍山区 南山公園路 105",     duration: "2時間",   category: "ランドマーク" },
  { id: 6, nameJa: "廣蔵市場",       nameEn: "Gwangjang Market",        address: "ソウル特別市 鐘路区 昌慶宮路 88",        duration: "1.5時間", category: "伝統市場" },
  { id: 7, nameJa: "徳寿宮",         nameEn: "Deoksugung Palace",       address: "ソウル特別市 中区 世宗大路 99",          duration: "1時間",   category: "国宝" },
  { id: 8, nameJa: "仁寺洞",         nameEn: "Insadong",                address: "ソウル特別市 鐘路区 仁寺洞길",          duration: "2時間",   category: "文化通り" },
];

// ── SVG 아이콘 ─────────────────────────────────────────────────
const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const LayersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gray3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const BookmarkFillIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>
);
const RouteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/>
    <path d="M9 6h5.5A2.5 2.5 0 0117 8.5v0A2.5 2.5 0 0114.5 11H9.5A2.5 2.5 0 007 13.5v0A2.5 2.5 0 009.5 16H15"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

// ── 저장 모달 ──────────────────────────────────────────────────
function SaveModal({ count, onClose, onSave }) {
  const [routeName, setRouteName] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: C.white, borderRadius: 20, padding: "40px 36px", width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", fontFamily: font }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: "0 0 8px" }}>ルートを保存</h3>
        <p style={{ fontSize: 14, color: C.gray3, margin: "0 0 28px" }}>{count}か所の場所を含むルートを保存します</p>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.gray3, display: "block", marginBottom: 8 }}>ルート名</label>
        <input
          type="text"
          value={routeName}
          onChange={e => setRouteName(e.target.value)}
          placeholder="例：ソウル宮殿ツアー"
          style={{ width: "100%", padding: "12px 16px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 15, fontFamily: font, outline: "none", boxSizing: "border-box", marginBottom: 24 }}
          onFocus={e => e.target.style.borderColor = C.navy}
          onBlur={e => e.target.style.borderColor = C.border}
        />
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", border: `1.5px solid ${C.border}`, borderRadius: 10, background: "white", color: C.gray3, fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: font }}>キャンセル</button>
          <button
            onClick={() => routeName.trim() && onSave(routeName.trim())}
            disabled={!routeName.trim()}
            style={{ flex: 2, padding: "12px", border: "none", borderRadius: 10, background: routeName.trim() ? C.navy : C.border, color: "white", fontWeight: 700, fontSize: 15, cursor: routeName.trim() ? "pointer" : "default", fontFamily: font, transition: "background 0.2s" }}
          >保存する</button>
        </div>
      </div>
    </div>
  );
}

// ── 장소 카드 ──────────────────────────────────────────────────
function PlaceCard({ place, added, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const badge = BADGE[place.category] || { bg: "#e2e8f0", color: "#6a7282" };
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `2px solid ${added ? C.navy : hovered ? "#c0c4d0" : C.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        background: added ? "rgba(0,13,87,0.03)" : C.white,
        cursor: "pointer",
        transition: "all 0.18s",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 이름 + 뱃지 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{place.nameJa}</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: badge.bg, color: badge.color, whiteSpace: "nowrap" }}>{place.category}</span>
        </div>
        {/* 영어명 */}
        <p style={{ fontSize: 12, color: C.gray4, margin: "0 0 7px" }}>{place.nameEn}</p>
        {/* 주소 */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, color: C.gray3 }}>
          <PinIcon />
          <span style={{ fontSize: 12, color: C.gray3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{place.address}</span>
        </div>
        {/* 소요시간 */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: C.gray3 }}>
          <ClockIcon />
          <span style={{ fontSize: 12, color: C.gray3 }}>{place.duration}</span>
        </div>
      </div>

      {/* 추가/체크 버튼 */}
      <button
        onClick={e => { e.stopPropagation(); onToggle(); }}
        style={{
          width: 34, height: 34, borderRadius: "50%", border: "none", flexShrink: 0,
          background: added ? C.navy : C.border,
          color: added ? C.white : C.gray3,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        {added ? <CheckIcon /> : <PlusIcon />}
      </button>
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────
export default function RouteCreate() {
  const navigate = useNavigate();
  const [added, setAdded] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [navTab, setNavTab] = useState("bookmark");

  const toggle = (id) => {
    setAdded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = (name) => {
    // localStorage에 저장 (실제 API 연동 전 mock)
    const existing = JSON.parse(localStorage.getItem("myRoutes") || "[]");
    const selectedPlaces = BOOKMARKED.filter(p => added.has(p.id));
    const newRoute = {
      id: Date.now(),
      title: name,
      region: "ソウル",
      date: new Date().toLocaleDateString("ja-JP").replace(/\//g, "."),
      spots: selectedPlaces.length,
      places: selectedPlaces,
    };
    localStorage.setItem("myRoutes", JSON.stringify([...existing, newRoute]));
    setShowModal(false);
    navigate("/mypage");
  };

  const addedCount = added.size;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: C.bg, fontFamily: font, display: "flex", flexDirection: "column" }}>

      {/* ── 커스텀 탑바 ── */}
      <header style={{
        background: "rgba(255,255,255,0.97)",
        borderBottom: `1.5px solid ${C.border}`,
        padding: "0 40px",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}>
        {/* 좌: 로고 + 제목 */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={logoBlack} alt="Topaboda" style={{ height: 36, objectFit: "contain" }} />
          <div style={{ width: 1, height: 36, background: C.border }} />
          <span style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>私だけのルートを作る</span>
        </div>

        {/* 우: 탭 네비 + 닫기 */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {[
            { key: "bookmark", label: "ブックマークした場所", Icon: BookmarkFillIcon },
            { key: "routes",   label: "保存したルート",       Icon: RouteIcon },
            { key: "community",label: "コミュニティ",         Icon: UsersIcon },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setNavTab(key)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "none", border: "none", cursor: "pointer",
                fontSize: 15, fontWeight: navTab === key ? 700 : 400,
                color: navTab === key ? C.navy : C.gray3,
                padding: "4px 0",
                borderBottom: navTab === key ? `2px solid ${C.navy}` : "2px solid transparent",
                transition: "all 0.15s",
                fontFamily: font,
              }}
            >
              <Icon />
              {label}
            </button>
          ))}

          {/* 닫기 버튼 */}
          <button
            onClick={() => navigate("/mypage")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: `1.5px solid ${C.border}`, borderRadius: 10,
              padding: "8px 16px", cursor: "pointer", color: C.gray3, fontSize: 14, fontWeight: 500,
              fontFamily: font, transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = C.navy; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = C.gray3; }}
          >
            <ArrowLeftIcon />
            マイページに戻る
          </button>
        </div>
      </header>

      {/* ── 메인 영역: 사이드바 + 지도 ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── 좌: 북마크 사이드바 ── */}
        <aside style={{
          width: 380,
          background: C.white,
          borderRight: `1.5px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}>
          {/* 사이드바 헤더 */}
          <div style={{ padding: "28px 28px 20px", borderBottom: `1.5px solid ${C.border}` }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: "0 0 6px" }}>ブックマークした場所</h2>
            <p style={{ fontSize: 14, color: C.gray4, margin: 0 }}>ルートに追加する場所を選んでください</p>
          </div>

          {/* 장소 목록 (스크롤) */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {BOOKMARKED.map(place => (
              <PlaceCard
                key={place.id}
                place={place}
                added={added.has(place.id)}
                onToggle={() => toggle(place.id)}
              />
            ))}
          </div>

          {/* 하단 저장 버튼 */}
          <div style={{ padding: "20px", borderTop: `1.5px solid ${C.border}`, background: C.bg }}>
            <button
              onClick={() => addedCount > 0 && setShowModal(true)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 14,
                border: "none",
                background: addedCount > 0 ? C.navy : "#c8ccd8",
                color: "white",
                fontSize: 16,
                fontWeight: 700,
                cursor: addedCount > 0 ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                fontFamily: font,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { if (addedCount > 0) e.currentTarget.style.background = "#001080"; }}
              onMouseLeave={e => { if (addedCount > 0) e.currentTarget.style.background = C.navy; }}
            >
              <SaveIcon />
              ルートを保存 ({addedCount})
            </button>
          </div>
        </aside>

        {/* ── 우: 지도 영역 ── */}
        <div style={{ flex: 1, background: "#e5e7eb", position: "relative", overflow: "hidden" }}>
          {/* 지도 그리드 패턴 배경 */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

          {/* 지도 플레이스홀더 */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontSize: 80 }}>🗺️</div>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: C.navy, margin: 0 }}>地図 API 連動エリア</h3>
            <p style={{ fontSize: 16, color: C.gray4, margin: 0 }}>Google Maps / T-Map Integration Area</p>
            {addedCount > 0 && (
              <div style={{ marginTop: 12, background: "rgba(255,255,255,0.9)", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "12px 24px", backdropFilter: "blur(8px)" }}>
                <p style={{ fontSize: 14, color: C.navy, fontWeight: 700, margin: 0 }}>📍 {addedCount}か所の場所を選択中</p>
              </div>
            )}
          </div>

          {/* 줌 컨트롤 */}
          <div style={{ position: "absolute", right: 24, bottom: 100, display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ icon: <LayersIcon />, title: "レイヤー" }, { icon: <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>, title: "ズームイン" }, { icon: <span style={{ fontSize: 24, lineHeight: 1 }}>−</span>, title: "ズームアウト" }].map(({ icon, title }, i) => (
              <button
                key={i}
                title={title}
                style={{
                  width: 48, height: 48,
                  background: "white",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 14,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  color: C.gray3,
                  fontSize: 18,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 저장 모달 ── */}
      {showModal && (
        <SaveModal
          count={addedCount}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
