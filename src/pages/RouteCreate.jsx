import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import logoBlack from "../assets/logo_black.svg";

const API_MAP_CONFIG = "/api/maps/config";
const API_HERITAGE_BOOKMARKS = "/api/heritages/bookmarks";
const API_ROUTE = "/api/route";
const DEFAULT_MAP_ID = "DEMO_MAP_ID";
const ROUTE_MAP_DEFAULT_CENTER = { lat: 36.5, lng: 127.8 };
const GOOGLE_MAP_LIBRARIES = ["marker"];

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
  "国宝":         { bg: "rgba(202,202,0,0.15)", color: "#a08c00" },
  "史跡":         { bg: "#e2e8f0", color: "#6a7282" },
  "博物館":       { bg: "#e2e8f0", color: "#6a7282" },
  "ランドマーク": { bg: "#e2e8f0", color: "#6a7282" },
  "伝統市場":     { bg: "#e2e8f0", color: "#6a7282" },
  "文化通り":     { bg: "#e2e8f0", color: "#6a7282" },
  "文化財":       { bg: "rgba(0,13,87,0.1)", color: "#000d57" },
};

function formatBookmarkDate(iso) {
  if (iso == null) return "";
  try {
    const d = typeof iso === "string" ? new Date(iso) : new Date();
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("ja-JP");
  } catch {
    return "";
  }
}

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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>
);
const RouteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/>
    <path d="M9 6h5.5A2.5 2.5 0 0117 8.5v0A2.5 2.5 0 0114.5 11H9.5A2.5 2.5 0 007 13.5v0A2.5 2.5 0 009.5 16H15"/>
  </svg>
);
const ChevronDownIcon = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const MapPinSmallIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

// ── 저장 모달 ──────────────────────────────────────────────────
function SaveModal({ count, onClose, onSave, saving }) {
  const [routeName, setRouteName] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          onKeyDown={e => e.key === "Enter" && routeName.trim() && !saving && onSave(routeName.trim())}
        />
        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" onClick={onClose} disabled={saving} style={{ flex: 1, padding: "12px", border: `1.5px solid ${C.border}`, borderRadius: 10, background: "white", color: C.gray3, fontWeight: 600, fontSize: 15, cursor: saving ? "default" : "pointer", fontFamily: font, opacity: saving ? 0.6 : 1 }}>キャンセル</button>
          <button
            type="button"
            onClick={() => routeName.trim() && onSave(routeName.trim())}
            disabled={!routeName.trim() || saving}
            style={{ flex: 2, padding: "12px", border: "none", borderRadius: 10, background: routeName.trim() && !saving ? C.navy : C.border, color: "white", fontWeight: 700, fontSize: 15, cursor: routeName.trim() && !saving ? "pointer" : "default", fontFamily: font, transition: "background 0.2s" }}
          >{saving ? "保存中…" : "保存する"}</button>
        </div>
      </div>
    </div>
  );
}

// ── 장소 카드 (GET /api/heritages/bookmarks 응답 기준) ────────────
/** 카드 전체 클릭 = + 버튼과 동일(ルートに追加/外す). +는 시각·터치 타깃용으로 동일 핸들러 */
function BookmarkPlaceCard({ place, added, onToggle, isHighlightedOnMap }) {
  const [hovered, setHovered] = useState(false);
  const badge = BADGE["文化財"] || { bg: "#e2e8f0", color: "#6a7282" };
  const title = place.heritageName || place.heritageId;
  const subLine =
    typeof place.latitude === "number" && typeof place.longitude === "number"
      ? `${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}`
      : "";
  const dateLine = formatBookmarkDate(place.createdAt);
  const mapRing = isHighlightedOnMap ? `2px solid ${C.navy}` : null;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={added}
      aria-label={added ? "ルートから外す" : "ルートに追加"}
      onClick={() => onToggle()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: mapRing || `2px solid ${added ? C.navy : hovered ? "#c0c4d0" : C.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        background: added ? "rgba(0,13,87,0.03)" : C.white,
        transition: "all 0.18s",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        cursor: "pointer",
        outline: "none",
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          pointerEvents: "none",
        }}
      >
        {place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt=""
            style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", flexShrink: 0, background: C.border }}
          />
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.navy, wordBreak: "break-word" }}>{title}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: badge.bg, color: badge.color, whiteSpace: "nowrap" }}>文化財</span>
          </div>
          {subLine ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, color: C.gray3 }}>
              <PinIcon />
              <span style={{ fontSize: 12, color: C.gray3, wordBreak: "break-all" }}>{subLine}</span>
            </div>
          ) : null}
          {dateLine ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: C.gray3 }}>
              <ClockIcon />
              <span style={{ fontSize: 12, color: C.gray3 }}>ブックマーク {dateLine}</span>
            </div>
          ) : null}
        </div>
      </div>
      <span
        role="presentation"
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          flexShrink: 0,
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          background: added ? C.navy : C.border,
          color: added ? C.white : C.gray3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
        aria-hidden
      >
        {added ? <CheckIcon /> : <PlusIcon />}
      </span>
    </div>
  );
}

// ── 경로 만들기: Google 지도 + 우측 원형 컨트롤 ─────────────────
/** 루트에 추가한 북마크 전부 핀 표시. 각 핀 호버/클릭 시 InfoWindow(MapSection 유사) */
function RouteMapPane({
  apiKey,
  mapId,
  routePins,
  lonelyHeritageId,
  nameFromUrl,
  selectedCount,
  onMarkerSelect,
}) {
  const mapRef = useRef(null);
  const lockedHeritageIdRef = useRef(null);
  const [center, setCenter] = useState(ROUTE_MAP_DEFAULT_CENTER);
  const [zoom, setZoom] = useState(8);
  const [lonelyPin, setLonelyPin] = useState(null);
  const [lonelyFetchedName, setLonelyFetchedName] = useState("");
  /** 어느 핀에 마우스가 올라가 있는지 — 포커스(detail)와 무관하게 전 핀에서 호버 가능 */
  const [hoveredHeritageId, setHoveredHeritageId] = useState(null);
  /** 클릭으로 고정된 미리보기(지도 빈 곳 클릭 시 해제) */
  const [lockedHeritageId, setLockedHeritageId] = useState(null);
  lockedHeritageIdRef.current = lockedHeritageId;

  /** MapSection.jsx と同一 id（同一 SPA 内で useJsApiLoader はオプション一致必須） */
  const { isLoaded, loadError } = useJsApiLoader({
    id: "topaboda-map",
    googleMapsApiKey: apiKey || "",
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  useEffect(() => {
    if (document.getElementById("heritage-pin-style")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "heritage-pin-style";
    styleEl.textContent = `
      .gm-style .gm-style-iw-c {
        padding: 0 !important;
        border-radius: 16px !important;
        box-shadow: none !important;
        background: transparent !important;
        overflow: hidden !important;
      }
      .gm-style .gm-style-iw-d {
        overflow: hidden !important;
        padding: 0 !important;
      }
      .gm-style .gm-style-iw-t::after {
        display: none !important;
      }
      .gm-style .gm-style-iw-tc {
        display: none !important;
      }
      .gm-style-iw-chr {
        display: none !important;
      }
    `;
    document.head.appendChild(styleEl);
  }, []);

  useEffect(() => {
    if (!lonelyHeritageId) {
      setLonelyPin(null);
      setLonelyFetchedName("");
      return;
    }
    let cancelled = false;
    fetch(`/api/maps/heritages/${encodeURIComponent(lonelyHeritageId)}/panel`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setLonelyFetchedName(data.ccceNameSimple || "");
        const lat = data.latitude;
        const lng = data.longitude;
        if (typeof lat === "number" && typeof lng === "number" && !Number.isNaN(lat) && !Number.isNaN(lng)) {
          setLonelyPin({ lat, lng });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lonelyHeritageId]);

  const allMarkers = useMemo(() => {
    const list = routePins.map((p) => ({
      heritageId: p.heritageId,
      position: { lat: p.latitude, lng: p.longitude },
      heritageName: p.heritageName,
      imageUrl: p.imageUrl,
    }));
    if (lonelyPin && lonelyHeritageId && !list.some((m) => m.heritageId === lonelyHeritageId)) {
      list.push({
        heritageId: lonelyHeritageId,
        position: lonelyPin,
        heritageName: lonelyFetchedName,
        imageUrl: null,
      });
    }
    return list;
  }, [routePins, lonelyPin, lonelyHeritageId, lonelyFetchedName]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || typeof google === "undefined") return;
    const map = mapRef.current;
    if (allMarkers.length === 0) {
      setCenter(ROUTE_MAP_DEFAULT_CENTER);
      setZoom(8);
      return;
    }
    if (allMarkers.length === 1) {
      const p = allMarkers[0].position;
      setCenter(p);
      setZoom(14);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    allMarkers.forEach((m) => bounds.extend(m.position));
    map.fitBounds(bounds, 48);
    requestAnimationFrame(() => {
      const c = map.getCenter();
      if (c) setCenter({ lat: c.lat(), lng: c.lng() });
      const z = map.getZoom();
      if (z != null) setZoom(z);
    });
  }, [allMarkers, isLoaded]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const zoomIn = () => {
    const m = mapRef.current;
    if (m) m.setZoom((m.getZoom() || 8) + 1);
  };
  const zoomOut = () => {
    const m = mapRef.current;
    if (m) m.setZoom(Math.max(3, (m.getZoom() || 8) - 1));
  };

  const cycleMapType = () => {
    const m = mapRef.current;
    if (!m) return;
    const t = m.getMapTypeId();
    m.setMapTypeId(t === "roadmap" ? "hybrid" : "roadmap");
  };

  if (loadError) {
    return (
      <div style={{ flex: 1, background: "#fee2e2", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <p style={{ fontSize: 14, color: C.red, margin: 0, textAlign: "center", fontFamily: font }}>地図の読み込みに失敗しました。</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, background: "#e5e7eb", position: "relative", overflow: "hidden" }}>
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#e5e7eb",
          }}
        >
          <p style={{ fontSize: 14, color: C.gray3, margin: 0, fontFamily: font }}>地図を読み込み中…</p>
        </div>
      )}
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={zoom}
          onLoad={onMapLoad}
          onClick={() => {
            setLockedHeritageId(null);
            lockedHeritageIdRef.current = null;
            setHoveredHeritageId(null);
          }}
          options={{
            mapId: mapId || DEFAULT_MAP_ID,
            backgroundColor: "#e8f4ff",
            disableDefaultUI: true,
            gestureHandling: "greedy",
          }}
        >
          {allMarkers.map((m) => {
            const previewOpen =
              hoveredHeritageId === m.heritageId || lockedHeritageId === m.heritageId;
            const previewName =
              (m.heritageName || "").trim() ||
              (lonelyHeritageId === m.heritageId ? (nameFromUrl || "").trim() : "") ||
              m.heritageId ||
              "";
            const previewImage = m.imageUrl || null;
            const showCard = previewOpen && (previewName || previewImage);
            return (
              <Marker
                key={m.heritageId}
                position={m.position}
                onMouseOver={() => setHoveredHeritageId(m.heritageId)}
                onMouseOut={() => {
                  setHoveredHeritageId((prev) => {
                    if (prev !== m.heritageId) return prev;
                    if (lockedHeritageIdRef.current === m.heritageId) return prev;
                    return null;
                  });
                }}
                onClick={() => {
                  onMarkerSelect?.(m.heritageId);
                  setLockedHeritageId((cur) => {
                    const next = cur === m.heritageId ? null : m.heritageId;
                    lockedHeritageIdRef.current = next;
                    return next;
                  });
                  setHoveredHeritageId(m.heritageId);
                }}
              >
                {showCard && (
                  <InfoWindow
                    onCloseClick={() => {
                      setLockedHeritageId(null);
                      lockedHeritageIdRef.current = null;
                      setHoveredHeritageId(null);
                    }}
                  >
                    <div
                      style={{
                        width: 280,
                        background: "#ffffff",
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)",
                        border: "1px solid #f0f0f0",
                        fontFamily: "'Noto Sans JP', 'Noto Sans KR', sans-serif",
                      }}
                    >
                      {previewImage ? (
                        <div style={{ width: "100%", height: 160, overflow: "hidden" }}>
                          <img
                            src={previewImage}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        </div>
                      ) : null}
                      <div style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#1a1a1a",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.4,
                            margin: 0,
                            wordBreak: "break-word",
                          }}
                        >
                          {previewName}
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            );
          })}
        </GoogleMap>
      )}

      {selectedCount > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 28,
            zIndex: 5,
            background: "rgba(255,255,255,0.95)",
            border: `1.5px solid ${C.border}`,
            borderRadius: 14,
            padding: "10px 20px",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ fontSize: 14, color: C.navy, fontWeight: 700, margin: 0, fontFamily: font }}>
            {selectedCount}か所の場所を選択中
          </p>
        </div>
      )}

      <div style={{ position: "absolute", right: 24, bottom: 100, display: "flex", flexDirection: "column", gap: 8, zIndex: 5 }}>
        {[
          { icon: <LayersIcon />, title: "地図 / 航空写真", onClick: cycleMapType },
          { icon: <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>, title: "ズームイン", onClick: zoomIn },
          { icon: <span style={{ fontSize: 24, lineHeight: 1 }}>−</span>, title: "ズームアウト", onClick: zoomOut },
        ].map(({ icon, title, onClick }, i) => (
          <button
            key={i}
            type="button"
            title={title}
            onClick={onClick}
            style={{
              width: 48,
              height: 48,
              background: "white",
              border: `1.5px solid ${C.border}`,
              borderRadius: 14,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: C.gray3,
              fontSize: 18,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 저장된 루트 카드 (루트 탭) ────────────────────────────────
function SavedRouteCard({ route, isOpen, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", border: `2px solid ${isOpen ? C.navy : hovered ? "#c0c4d0" : C.border}`, transition: "border-color 0.18s" }}>
      {/* 루트 헤더 */}
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "14px 16px",
          background: isOpen ? "rgba(0,13,87,0.04)" : C.white,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.18s",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{route.title}</span>
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "rgba(0,13,87,0.08)", color: C.navy, fontWeight: 600, whiteSpace: "nowrap" }}>{route.spots}か所</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.gray3 }}>
              <MapPinSmallIcon /> {route.region}
            </span>
            <span style={{ fontSize: 12, color: C.gray4 }}>{route.date}</span>
          </div>
        </div>
        <ChevronDownIcon open={isOpen} />
      </div>

      {/* 포함 장소 목록 (펼쳐짐) */}
      {isOpen && route.places && route.places.length > 0 && (
        <div style={{ background: "#f8fafc", borderTop: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.gray3, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>含まれる場所</p>
          {route.places.map((place, i) => {
            const badge = BADGE[place.category] || { bg: "#e2e8f0", color: "#6a7282" };
            return (
              <div key={place.id ?? i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: C.white, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#a08c00", minWidth: 18, textAlign: "center" }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{place.nameJa}</span>
                    <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: badge.bg, color: badge.color, whiteSpace: "nowrap" }}>{place.category}</span>
                  </div>
                  <span style={{ fontSize: 11, color: C.gray4 }}>{place.duration}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isOpen && (!route.places || route.places.length === 0) && (
        <div style={{ background: "#f8fafc", borderTop: `1px solid ${C.border}`, padding: "16px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: C.gray4, margin: 0 }}>場所情報がありません</p>
        </div>
      )}
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────
export default function RouteCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const heritageIdFromMap = searchParams.get("heritageId");
  const heritageNameFromMap = searchParams.get("heritageName") || "";
  const routeIdFromQuery = searchParams.get("routeId");
  const appliedRouteIdQueryRef = useRef(null);

  useEffect(() => {
    if (!routeIdFromQuery) appliedRouteIdQueryRef.current = null;
  }, [routeIdFromQuery]);

  useEffect(() => {
    if (heritageIdFromMap) {
      try {
        sessionStorage.setItem(
          "routeCreateFromMap",
          JSON.stringify({ heritageId: heritageIdFromMap, heritageName: heritageNameFromMap }),
        );
      } catch {
        /* ignore */
      }
    }
  }, [heritageIdFromMap, heritageNameFromMap]);

  const [added, setAdded] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [navTab, setNavTab] = useState("bookmark"); // "bookmark" | "routes"
  const [openRouteId, setOpenRouteId] = useState(null);
  const [mapConfig, setMapConfig] = useState(null);
  const [bookmarkPlaces, setBookmarkPlaces] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(() => !!localStorage.getItem("token"));
  const [bookmarksError, setBookmarksError] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(() => !!localStorage.getItem("token"));
  const [routesError, setRoutesError] = useState(false);
  const [saveSubmitting, setSaveSubmitting] = useState(false);
  /** 사이드바에서 선택 시 지도 핀( URL ?heritageId 보다 우선 ) */
  const [mapFocusHeritageId, setMapFocusHeritageId] = useState(null);

  useEffect(() => {
    setMapFocusHeritageId(null);
  }, [heritageIdFromMap]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setBookmarkPlaces([]);
      setBookmarksLoading(false);
      setBookmarksError(false);
      return;
    }
    let cancelled = false;
    setBookmarksLoading(true);
    setBookmarksError(false);
    fetch(`${API_HERITAGE_BOOKMARKS}?page=0&size=500`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("unauthorized");
        if (!res.ok) throw new Error("fail");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.content) ? data.content : [];
        setBookmarkPlaces(list);
      })
      .catch(() => {
        if (!cancelled) {
          setBookmarkPlaces([]);
          setBookmarksError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setBookmarksLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSavedRoutes([]);
      setRoutesLoading(false);
      setRoutesError(false);
      return;
    }
    let cancelled = false;
    setRoutesLoading(true);
    setRoutesError(false);
    fetch(API_ROUTE, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401) throw new Error("unauthorized");
        if (!res.ok) throw new Error("fail");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setSavedRoutes(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) {
          setSavedRoutes([]);
          setRoutesError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setRoutesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** 마이페이지 등에서 ?routeId= 로 진입 시: 저장 루트 탭 + 해당 카드 펼침(동일 쿼리로는 한 번만) */
  useEffect(() => {
    if (!routeIdFromQuery || routesLoading) return;
    const id = Number(routeIdFromQuery);
    if (Number.isNaN(id)) return;
    if (!savedRoutes.some((r) => r.id === id)) return;
    if (appliedRouteIdQueryRef.current === routeIdFromQuery) return;
    appliedRouteIdQueryRef.current = routeIdFromQuery;
    setNavTab("routes");
    setOpenRouteId(id);
  }, [routeIdFromQuery, routesLoading, savedRoutes]);

  useEffect(() => {
    if (!heritageIdFromMap || bookmarkPlaces.length === 0) return;
    const has = bookmarkPlaces.some((p) => p.heritageId === heritageIdFromMap);
    if (!has) return;
    setAdded((prev) => {
      if (prev.has(heritageIdFromMap)) return prev;
      const next = new Set(prev);
      next.add(heritageIdFromMap);
      return next;
    });
  }, [heritageIdFromMap, bookmarkPlaces]);

  useEffect(() => {
    let cancelled = false;
    fetch(API_MAP_CONFIG)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setMapConfig(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (id) => {
    setAdded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        queueMicrotask(() => {
          setMapFocusHeritageId((cur) => (cur === id ? null : cur));
        });
      } else {
        next.add(id);
        queueMicrotask(() => setMapFocusHeritageId(id));
      }
      return next;
    });
  };

  const handleSave = async (name) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const selected = bookmarkPlaces.filter((p) => added.has(p.heritageId));
    const heritageIds = selected.map((p) => p.heritageId);
    setSaveSubmitting(true);
    try {
      const res = await fetch(API_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          directionName: name,
          transportType: 0,
          heritageIds,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        window.alert("ログインの有効期限が切れた可能性があります。再度ログインしてください。");
        return;
      }
      if (!res.ok) {
        const msg = typeof data?.message === "string" ? data.message : "保存に失敗しました。";
        window.alert(msg);
        return;
      }
      setSavedRoutes((prev) => [data, ...prev]);
      setShowModal(false);
    } catch {
      window.alert("保存に失敗しました。ネットワークを確認してください。");
    } finally {
      setSaveSubmitting(false);
    }
  };

  const addedCount = added.size;

  const mapHeritageIdForMap = mapFocusHeritageId ?? heritageIdFromMap;

  /** 북마크 탭: 선택한 북마크 핀 / 保存ルート 탭: 펼친 카드 1件の places だけ */
  const routePins = useMemo(() => {
    if (navTab === "routes" && openRouteId != null) {
      const r = savedRoutes.find((x) => x.id === openRouteId);
      if (!r?.places?.length) return [];
      return r.places
        .filter(
          (p) =>
            p != null &&
            typeof p.latitude === "number" &&
            typeof p.longitude === "number" &&
            !Number.isNaN(p.latitude) &&
            !Number.isNaN(p.longitude),
        )
        .map((p) => ({
          heritageId: String(p.id),
          latitude: p.latitude,
          longitude: p.longitude,
          heritageName: p.nameJa || String(p.id),
          imageUrl: p.imageUrl || null,
        }));
    }
    return bookmarkPlaces
      .filter(
        (p) =>
          added.has(p.heritageId) &&
          typeof p.latitude === "number" &&
          typeof p.longitude === "number",
      )
      .map((p) => ({
        heritageId: p.heritageId,
        latitude: p.latitude,
        longitude: p.longitude,
        heritageName: p.heritageName,
        imageUrl: p.imageUrl,
      }));
  }, [navTab, openRouteId, bookmarkPlaces, added, savedRoutes]);

  const lonelyUrlHeritage =
    navTab === "bookmark" &&
    heritageIdFromMap &&
    !routePins.some((p) => p.heritageId === heritageIdFromMap)
      ? heritageIdFromMap
      : null;

  useEffect(() => {
    if (navTab === "bookmark") {
      setOpenRouteId(null);
    }
  }, [navTab]);

  useEffect(() => {
    if (navTab !== "routes") return;
    if (openRouteId == null) {
      setMapFocusHeritageId(null);
      return;
    }
    const r = savedRoutes.find((x) => x.id === openRouteId);
    const first = r?.places?.find(
      (p) =>
        p != null &&
        typeof p.latitude === "number" &&
        typeof p.longitude === "number",
    );
    if (first) setMapFocusHeritageId(String(first.id));
    else setMapFocusHeritageId(null);
  }, [navTab, openRouteId, savedRoutes]);

  const mapPinHighlightId = mapFocusHeritageId ?? heritageIdFromMap;

  // 탭 설정 (커뮤니티 제거)
  const TABS = [
    { key: "bookmark", label: "ブックマークした場所", Icon: BookmarkFillIcon },
    { key: "routes",   label: "保存したルート",       Icon: RouteIcon },
  ];

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
          {/* 로고 크게 + 클릭시 홈으로 */}
          <img
            src={logoBlack}
            alt="Topaboda"
            onClick={() => navigate("/")}
            style={{ height: 48, objectFit: "contain", cursor: "pointer", transition: "opacity 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          />
          <div style={{ width: 1, height: 40, background: C.border }} />
          {/* 제목: 브랜드 골드 컬러 */}
          <span style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>私だけのルートを作る</span>
        </div>

        {/* 우: 탭 네비 (밑줄 없음, 색상만 변화) + 닫기 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {TABS.map(({ key, label, Icon }) => {
            const isActive = navTab === key;
            return (
              <button
                key={key}
                onClick={() => setNavTab(key)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: isActive ? "rgba(0,13,87,0.06)" : "none",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? C.navy : C.gray3,
                  padding: "8px 14px",
                  transition: "all 0.15s",
                  fontFamily: font,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f3f4f6"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "none"; }}
              >
                <Icon />
                {label}
              </button>
            );
          })}

          {/* 구분선 */}
          <div style={{ width: 1, height: 28, background: C.border, margin: "0 8px" }} />

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

        {/* ── 좌: 사이드바 (탭에 따라 내용 변경) ── */}
        <aside style={{
          width: 380,
          background: C.white,
          borderRight: `1.5px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}>

          {/* ── 탭: 북마크한 장소 ── */}
          {navTab === "bookmark" && (
            <>
              <div style={{ padding: "28px 28px 20px", borderBottom: `1.5px solid ${C.border}` }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: "0 0 6px" }}>ブックマークした場所</h2>
                <p style={{ fontSize: 14, color: C.gray4, margin: 0 }}>ルートに追加する場所を選んでください</p>
                {heritageIdFromMap && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: "12px 14px",
                      background: "rgba(0,13,87,0.06)",
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <p style={{ fontSize: 12, fontWeight: 700, color: C.navy, margin: "0 0 4px", fontFamily: font }}>地図から選択した文化遺産</p>
                    <p style={{ fontSize: 14, color: C.gray3, margin: 0, lineHeight: 1.5, fontFamily: font, wordBreak: "break-word" }}>
                      {heritageNameFromMap || heritageIdFromMap}
                    </p>
                    <p style={{ fontSize: 12, color: C.gray4, margin: "8px 0 0", lineHeight: 1.45, fontFamily: font }}>
                      下のリストから他の場所を追加してルートを保存できます。
                    </p>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {!localStorage.getItem("token") ? (
                  <div style={{ padding: "24px 12px", textAlign: "center" }}>
                    <p style={{ fontSize: 14, color: C.gray3, margin: "0 0 16px", lineHeight: 1.6 }}>
                      ブックマーク一覧を表示するにはログインが必要です。
                    </p>
                    <Link
                      to="/login"
                      style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        borderRadius: 10,
                        background: C.navy,
                        color: C.white,
                        fontWeight: 700,
                        fontSize: 14,
                        textDecoration: "none",
                        fontFamily: font,
                      }}
                    >
                      ログインへ
                    </Link>
                  </div>
                ) : bookmarksLoading ? (
                  <p style={{ fontSize: 14, color: C.gray4, margin: 0, padding: "8px 4px" }}>読み込み中…</p>
                ) : bookmarksError ? (
                  <p style={{ fontSize: 14, color: C.red, margin: 0, padding: "8px 4px" }}>
                    ブックマークの取得に失敗しました。しばらくしてから再度お試しください。
                  </p>
                ) : bookmarkPlaces.length === 0 ? (
                  <p style={{ fontSize: 14, color: C.gray4, margin: 0, padding: "8px 4px", lineHeight: 1.6 }}>
                    ブックマークした文化財はまだありません。地図や詳細画面からブックマークを追加してください。
                  </p>
                ) : (
                  bookmarkPlaces.map((place) => (
                    <BookmarkPlaceCard
                      key={place.heritageId}
                      place={place}
                      added={added.has(place.heritageId)}
                      onToggle={() => toggle(place.heritageId)}
                      isHighlightedOnMap={mapPinHighlightId === place.heritageId}
                    />
                  ))
                )}
              </div>
              <div style={{ padding: "20px", borderTop: `1.5px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
                <button
                  onClick={() => addedCount > 0 && setShowModal(true)}
                  style={{
                    width: "100%", padding: "16px", borderRadius: 14, border: "none",
                    background: addedCount > 0 ? C.navy : "#c8ccd8",
                    color: "white", fontSize: 16, fontWeight: 700,
                    cursor: addedCount > 0 ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    fontFamily: font, transition: "background 0.2s",
                  }}
                  onMouseEnter={e => { if (addedCount > 0) e.currentTarget.style.background = "#001080"; }}
                  onMouseLeave={e => { if (addedCount > 0) e.currentTarget.style.background = C.navy; }}
                >
                  <SaveIcon />
                  ルートを保存 ({addedCount})
                </button>
              </div>
            </>
          )}

          {/* ── 탭: 저장된 루트 ── */}
          {navTab === "routes" && (
            <>
              <div style={{ padding: "28px 28px 20px", borderBottom: `1.5px solid ${C.border}`, flexShrink: 0 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: "0 0 6px" }}>保存したルート</h2>
                <p style={{ fontSize: 14, color: C.gray4, margin: 0 }}>ルートをタップして場所を確認</p>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {!localStorage.getItem("token") ? (
                  <div style={{ padding: "24px 12px", textAlign: "center" }}>
                    <p style={{ fontSize: 14, color: C.gray3, margin: "0 0 16px", lineHeight: 1.6 }}>
                      保存ルートを表示するにはログインが必要です。
                    </p>
                    <Link
                      to="/login"
                      style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        borderRadius: 10,
                        background: C.navy,
                        color: C.white,
                        fontWeight: 700,
                        fontSize: 14,
                        textDecoration: "none",
                        fontFamily: font,
                      }}
                    >
                      ログインへ
                    </Link>
                  </div>
                ) : routesLoading ? (
                  <p style={{ fontSize: 14, color: C.gray4, margin: 0, padding: "8px 4px" }}>読み込み中…</p>
                ) : routesError ? (
                  <p style={{ fontSize: 14, color: C.red, margin: 0, padding: "8px 4px" }}>
                    ルート一覧の取得に失敗しました。しばらくしてから再度お試しください。
                  </p>
                ) : savedRoutes.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "40px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: 48 }}>🗺️</div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: C.gray3, margin: 0 }}>保存したルートがありません</p>
                    <p style={{ fontSize: 13, color: C.gray4, margin: 0 }}>「ブックマークした場所」から<br/>ルートを作って保存しましょう</p>
                    <button
                      onClick={() => setNavTab("bookmark")}
                      style={{ marginTop: 8, padding: "10px 20px", border: `1.5px solid ${C.navy}`, borderRadius: 10, background: "white", color: C.navy, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: font }}
                    >ブックマークへ戻る</button>
                  </div>
                ) : (
                  savedRoutes.map(route => (
                    <SavedRouteCard
                      key={route.id}
                      route={route}
                      isOpen={openRouteId === route.id}
                      onClick={() => setOpenRouteId(prev => prev === route.id ? null : route.id)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </aside>

        {/* ── 우: Google Maps + 원형 컨트롤 (RouteMapPane) ── */}
        {mapConfig?.apiKey ? (
          <RouteMapPane
            apiKey={mapConfig.apiKey}
            mapId={mapConfig.mapId}
            routePins={routePins}
            lonelyHeritageId={lonelyUrlHeritage}
            nameFromUrl={heritageNameFromMap || ""}
            selectedCount={navTab === "bookmark" ? addedCount : 0}
            onMarkerSelect={(id) => setMapFocusHeritageId(id)}
          />
        ) : (
          <div
            style={{
              flex: 1,
              background: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: 14, color: C.gray3, margin: 0, fontFamily: font }}>地図設定を読み込み中…</p>
          </div>
        )}
      </div>

      {/* ── 저장 모달 ── */}
      {showModal && (
        <SaveModal
          count={addedCount}
          onClose={() => !saveSubmitting && setShowModal(false)}
          onSave={handleSave}
          saving={saveSubmitting}
        />
      )}
    </div>
  );
}
