import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, useGoogleMap } from "@react-google-maps/api";
import logoBlack from "../assets/logo_black.svg";

const API_MAP_CONFIG = "/api/maps/config";
const API_TMAP_ROUTE = "/api/maps/tmap-route";
const API_HERITAGE_BOOKMARKS = "/api/heritages/bookmarks";
const API_ROUTES = "/api/routes";
const DEFAULT_MAP_ID = "DEMO_MAP_ID";
const ROUTE_MAP_DEFAULT_CENTER = { lat: 36.5, lng: 127.8 };
const GOOGLE_MAP_LIBRARIES = ["marker", "geometry"];

/** 루트 id는 API에 따라 number/string 혼재 — state 맵 키·조회를 통일 */
function routeKey(id) {
  return id == null ? "" : String(id);
}

/** Google Directions transitOptions — modes 未選択は全モード */
const TRANSIT_MODE_OPTIONS = [
  { key: "BUS", label: "バス" },
  { key: "SUBWAY", label: "地下鉄" },
  { key: "TRAIN", label: "電車" },
  { key: "RAIL", label: "鉄道" },
  { key: "TRAM", label: "路面電車" },
];

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
/** 저장 루트 카드: 이동 수단. 도보·차량=TMAP、대중교통=右パネル+Directions */
function TransportModeSegment({ value, onChange }) {
  const modes = [
    { v: 0, label: "도보" },
    { v: 1, label: "대중교통" },
    { v: 2, label: "차량" },
  ];
  return (
    <div
      role="group"
      aria-label="이동 수단"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        flexShrink: 0,
        flexWrap: "nowrap",
        justifyContent: "flex-end",
        minWidth: 0,
      }}
    >
      {modes.map(({ v, label }) => {
        const active = Number(value) === Number(v);
        return (
          <button
            key={v}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(v);
            }}
            style={{
              padding: "4px 7px",
              borderRadius: 8,
              border: `1.5px solid ${active ? C.navy : C.border}`,
              background: active ? "rgba(0,13,87,0.1)" : C.white,
              color: active ? C.navy : C.gray3,
              fontSize: 10,
              fontWeight: active ? 700 : 500,
              cursor: "pointer",
              fontFamily: font,
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

/** 장소 배열에서 해당 유산을 맨 앞(순서 1·최우선 경유)으로 옮긴 heritageId 배열 */
function moveHeritageIdsToTop(places, heritageId) {
  const ids = places.map((p) => p.id);
  const idx = ids.indexOf(heritageId);
  if (idx <= 0) return ids;
  const next = [...ids];
  next.splice(idx, 1);
  next.unshift(heritageId);
  return next;
}

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

/**
 * @react-google-maps/api의 Polyline 대신 Maps JS Polyline 직접 사용.
 * 언마운트 후에도 선이 남는 경우가 있어 cleanup·이펙트 시작 시 setMap(null)로 제거.
 */
function TmapPolylineOverlay({ path, strokeColor = C.navy, strokeOpacity = 0.88, strokeWeight = 5, zIndex = 0 }) {
  const map = useGoogleMap();
  const polyRef = useRef(null);
  useEffect(() => {
    if (polyRef.current) {
      polyRef.current.setMap(null);
      polyRef.current = null;
    }
    if (!map || typeof google === "undefined") return;
    if (!path?.length || path.length < 2) return;
    const poly = new google.maps.Polyline({
      path,
      map,
      strokeColor,
      strokeOpacity,
      strokeWeight,
      zIndex,
      geodesic: true,
    });
    polyRef.current = poly;
    return () => {
      poly.setMap(null);
      polyRef.current = null;
    };
  }, [map, path, strokeColor, strokeOpacity, strokeWeight, zIndex]);
  return null;
}

function stripHtml(html) {
  if (html == null || html === "") return "";
  const d = document.createElement("div");
  d.innerHTML = String(html);
  return (d.textContent || "").trim();
}

/** Directions API overview_path → { lat, lng }[] */
function directionsOverviewToPath(route) {
  if (!route?.overview_path) return null;
  const ov = route.overview_path;
  const pts = [];
  if (typeof ov.getArray === "function") {
    ov.getArray().forEach((p) => pts.push({ lat: p.lat(), lng: p.lng() }));
  } else if (Array.isArray(ov)) {
    ov.forEach((p) => pts.push({ lat: p.lat(), lng: p.lng() }));
  } else if (ov.length != null) {
    for (let i = 0; i < ov.length; i++) {
      const p = ov[i];
      if (p && typeof p.lat === "function") pts.push({ lat: p.lat(), lng: p.lng() });
    }
  }
  return pts.length >= 2 ? pts : null;
}

/** 구간별 path 이어붙이기 (경계 중복 제거) */
function mergePathChunks(chunks) {
  const out = [];
  for (const chunk of chunks) {
    if (!chunk?.length) continue;
    if (out.length === 0) {
      out.push(...chunk);
      continue;
    }
    const last = out[out.length - 1];
    const first = chunk[0];
    const d = Math.abs(last.lat - first.lat) + Math.abs(last.lng - first.lng);
    if (d < 1e-5) out.push(...chunk.slice(1));
    else out.push(...chunk);
  }
  return out.length >= 2 ? out : null;
}

/** 구간별 Directions 결과를 하나의 routes[0] + 합성 폴리라인으로 */
function mergeSegmentDirectionsResults(segmentResults) {
  const mergedLegs = [];
  const pathChunks = [];
  const summaries = [];
  for (const r of segmentResults) {
    const route0 = r.routes?.[0];
    if (!route0) continue;
    if (route0.summary) summaries.push(route0.summary);
    mergedLegs.push(...(route0.legs || []));
    pathChunks.push(directionsOverviewToPath(route0));
  }
  const mergedPolylinePath = mergePathChunks(pathChunks.filter(Boolean));
  const result = {
    routes: [
      {
        summary: summaries.filter(Boolean).join(" → ") || "公共交通（区間連結）",
        legs: mergedLegs,
      },
    ],
  };
  return { result, mergedPolylinePath };
}

function buildTransitOptsFromPrefs(p) {
  const transitOptions = {
    departureTime: p?.departureIso ? new Date(p.departureIso) : new Date(),
  };
  const TRP = typeof google !== "undefined" ? google.maps?.TransitRoutePreferences : null;
  if (TRP) {
    transitOptions.routingPreference =
      p?.routingPreference === "LESS_WALKING" ? TRP.LESS_WALKING : TRP.FEWER_TRANSFERS;
  }
  const TM = typeof google !== "undefined" ? google.maps?.TransitMode : null;
  if (TM && p?.modes?.length) {
    const mm = p.modes.map((k) => TM[k]).filter(Boolean);
    if (mm.length) transitOptions.modes = mm;
  }
  return transitOptions;
}

/** 1ステップごとの左アクセント色・背景（徒歩 / 車両種別）·地図ポリライン用 mapStroke */
function transitStepVisual(step) {
  const mode = step.travel_mode;
  if (mode === "WALKING") {
    return {
      bg: "#f0fdf4",
      accent: "#16a34a",
      badge: "徒歩",
      badgeColor: "#15803d",
      mapStroke: "#22c55e",
    };
  }
  if (mode === "TRANSIT") {
    const td = step.transit_details || step.transit;
    const v = td?.line?.vehicle?.type;
    const lineHex = td?.line?.color;
    const byVehicle = {
      BUS: { bg: "#fff7ed", accent: "#ea580c", badge: "バス", badgeColor: "#c2410c", mapStroke: "#4285f4" },
      SUBWAY: { bg: "#eff6ff", accent: "#2563eb", badge: "地下鉄", badgeColor: "#1d4ed8", mapStroke: "#2563eb" },
      TRAIN: { bg: "#eef2ff", accent: "#4f46e5", badge: "電車", badgeColor: "#4338ca", mapStroke: "#4f46e5" },
      TRAM: { bg: "#fdf4ff", accent: "#c026d3", badge: "路面電車", badgeColor: "#a21caf", mapStroke: "#c026d3" },
      RAIL: { bg: "#f5f3ff", accent: "#7c3aed", badge: "鉄道", badgeColor: "#6d28d9", mapStroke: "#7c3aed" },
      MONORAIL: { bg: "#ecfeff", accent: "#0891b2", badge: "モノレール", badgeColor: "#0e7490", mapStroke: "#0891b2" },
      FERRY: { bg: "#f0f9ff", accent: "#0284c7", badge: "フェリー", badgeColor: "#0369a1", mapStroke: "#0284c7" },
      CABLE_CAR: { bg: "#faf5ff", accent: "#9333ea", badge: "ケーブル", badgeColor: "#7e22ce", mapStroke: "#9333ea" },
      GONDOLA_LIFT: { bg: "#f5f5f4", accent: "#57534e", badge: "ロープウェイ", badgeColor: "#44403c", mapStroke: "#57534e" },
    };
    const base = byVehicle[v] || {
      bg: "#f1f5f9",
      accent: "#0f172a",
      badge: "公共交通",
      badgeColor: "#1e293b",
      mapStroke: "#0f172a",
    };
    if (typeof lineHex === "string" && /^#[0-9A-Fa-f]{6}$/.test(lineHex.trim())) {
      const h = lineHex.trim();
      return { ...base, accent: h, bg: `${h}14`, mapStroke: h };
    }
    return base;
  }
  return {
    bg: "#f8fafc",
    accent: "#64748b",
    badge: mode || "移動",
    badgeColor: "#475569",
    mapStroke: "#64748b",
  };
}

/** 各 step の polyline をデコードし、パネルと同じ mapStroke で地図用セグメントへ */
function buildTransitColoredSegmentsFromRoute(route) {
  if (!route?.legs?.length || typeof google === "undefined") return null;
  const enc = google.maps.geometry?.encoding;
  if (!enc?.decodePath) return null;
  const segments = [];
  for (let li = 0; li < route.legs.length; li++) {
    const leg = route.legs[li];
    const steps = leg.steps || [];
    for (let si = 0; si < steps.length; si++) {
      const step = steps[si];
      const encoded = step.polyline?.points;
      if (!encoded) continue;
      let pts;
      try {
        const path = enc.decodePath(encoded);
        pts = path.map((p) => ({ lat: p.lat(), lng: p.lng() }));
      } catch {
        continue;
      }
      if (pts.length < 2) continue;
      const vis = transitStepVisual(step);
      segments.push({ path: pts, strokeColor: vis.mapStroke || vis.accent, legIndex: li, stepIndex: si });
    }
  }
  return segments.length > 0 ? segments : null;
}

const TRANSIT_LEG_THEMES = [
  { strip: "#000d57", headBg: "rgba(0,13,87,0.07)" },
  { strip: "#0369a1", headBg: "rgba(3,105,161,0.08)" },
  { strip: "#6d28d9", headBg: "rgba(109,40,217,0.07)" },
  { strip: "#0f766e", headBg: "rgba(15,118,110,0.08)" },
];

/** Directions API の transitOptions（routingPreference / modes / departureTime）+ 候補一覧 */
function TransitRoutePanel({
  result,
  loading,
  error,
  selectedIndex,
  onSelectIndex,
  transitPrefs,
  onTransitPrefsChange,
  transitMeta,
  /** クリックした区間を地図で強調（null＝全区間同じ） */
  focusLegIndex,
  onFocusLegIndex,
}) {
  const routes = result?.routes ?? [];
  const selected = routes[selectedIndex];
  const rp = transitPrefs?.routingPreference ?? "FEWER_TRANSFERS";
  const modes = transitPrefs?.modes ?? [];
  const depIso = transitPrefs?.departureIso ?? "";

  const setRouting = (v) => onTransitPrefsChange?.({ ...transitPrefs, routingPreference: v });
  const toggleMode = (key) => {
    const next = modes.includes(key) ? modes.filter((k) => k !== key) : [...modes, key];
    onTransitPrefsChange?.({ ...transitPrefs, modes: next });
  };

  return (
    <aside
      style={{
        width: 340,
        flexShrink: 0,
        background: C.white,
        borderLeft: `1.5px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "14px 16px", borderBottom: `1.5px solid ${C.border}`, flexShrink: 0 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: C.navy, margin: "0 0 6px", fontFamily: font }}>
          公共交通ルート
        </h3>
        <p style={{ fontSize: 11, color: C.gray4, margin: "0 0 10px", lineHeight: 1.45, fontFamily: font }}>
          Google Directions API の公共交通オプション（優先・利用モード・出発時刻）を指定して再検索できます。
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.gray3, margin: "0 0 6px", fontFamily: font }}>優先（routingPreference）</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setRouting("FEWER_TRANSFERS")}
                style={{
                  padding: "6px 10px",
                  fontSize: 11,
                  borderRadius: 8,
                  border: `1.5px solid ${rp === "FEWER_TRANSFERS" ? C.navy : C.border}`,
                  background: rp === "FEWER_TRANSFERS" ? "rgba(0,13,87,0.08)" : C.white,
                  cursor: "pointer",
                  fontFamily: font,
                }}
              >
                乗換を減らす
              </button>
              <button
                type="button"
                onClick={() => setRouting("LESS_WALKING")}
                style={{
                  padding: "6px 10px",
                  fontSize: 11,
                  borderRadius: 8,
                  border: `1.5px solid ${rp === "LESS_WALKING" ? C.navy : C.border}`,
                  background: rp === "LESS_WALKING" ? "rgba(0,13,87,0.08)" : C.white,
                  cursor: "pointer",
                  fontFamily: font,
                }}
              >
                徒歩を減らす
              </button>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.gray3, margin: "0 0 6px", fontFamily: font }}>
              利用モード（未選択＝すべて / modes）
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {TRANSIT_MODE_OPTIONS.map(({ key, label }) => {
                const on = modes.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleMode(key)}
                    style={{
                      padding: "4px 8px",
                      fontSize: 10,
                      borderRadius: 6,
                      border: `1px solid ${on ? C.navy : C.border}`,
                      background: on ? "rgba(0,13,87,0.08)" : "#f8fafc",
                      cursor: "pointer",
                      fontFamily: font,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: C.gray3, display: "block", marginBottom: 6, fontFamily: font }}>
              出発日時（departureTime・空欄は現在）
            </label>
            <input
              type="datetime-local"
              value={depIso}
              onChange={(e) => onTransitPrefsChange?.({ ...transitPrefs, departureIso: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 10px",
                fontSize: 12,
                borderRadius: 8,
                border: `1.5px solid ${C.border}`,
                fontFamily: font,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
        {transitMeta?.mode === "segmented" ? (
          <p style={{ fontSize: 10, color: C.gray4, margin: "10px 0 0", lineHeight: 1.4, fontFamily: font }}>
            ※ 経由地が多いため、<strong>各区間を順に</strong>公共交通で検索し結果を連結しています（{transitMeta.segments ?? "?"}区間）。
          </p>
        ) : null}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
        {loading && (
          <p style={{ fontSize: 13, color: C.gray3, margin: 0, fontFamily: font }}>ルートを検索しています…</p>
        )}
        {!loading && error && (
          <p style={{ fontSize: 13, color: C.red, margin: 0, lineHeight: 1.5, fontFamily: font }}>
            ルートを取得できませんでした（{error}）。地域や時刻によっては公共交通ルートが無い場合があります。
          </p>
        )}
        {!loading && !error && routes.length === 0 && (
          <p style={{ fontSize: 13, color: C.gray4, margin: 0, fontFamily: font }}>候補がありません。</p>
        )}
        {!loading && routes.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.gray3, margin: 0, fontFamily: font }}>候補</p>
            {routes.map((route, i) => {
              const dur = route.legs?.reduce((s, leg) => s + (leg.duration?.value ?? 0), 0);
              const durText =
                route.legs?.map((l) => l.duration?.text).filter(Boolean).join(" → ") ||
                (dur != null ? `${Math.round(dur / 60)}分` : "");
              const active = i === selectedIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectIndex(i)}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: `1.5px solid ${active ? C.navy : C.border}`,
                    background: active ? "rgba(0,13,87,0.06)" : C.white,
                    cursor: "pointer",
                    fontFamily: font,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
                    {route.summary || `ルート ${i + 1}`}
                  </div>
                  {durText ? (
                    <div style={{ fontSize: 11, color: C.gray3 }}>{durText}</div>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
        {!loading && selected?.legs?.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.gray3, margin: "0 0 10px", fontFamily: font }}>
              区間・乗換
            </p>
            {selected.legs.map((leg, li) => {
              const theme = TRANSIT_LEG_THEMES[li % TRANSIT_LEG_THEMES.length];
              return (
                <div key={li}>
                  {li > 0 ? (
                    <div
                      role="separator"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        margin: "14px 0 12px",
                        fontFamily: font,
                      }}
                    >
                      <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: "#64748b",
                          letterSpacing: "0.06em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        乗換
                      </span>
                      <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                    </div>
                  ) : null}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onFocusLegIndex?.(focusLegIndex === li ? null : li)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onFocusLegIndex?.(focusLegIndex === li ? null : li);
                      }
                    }}
                    style={{
                      borderRadius: 12,
                      border:
                        focusLegIndex === li
                          ? `2px solid ${C.navy}`
                          : `1px solid ${C.border}`,
                      overflow: "hidden",
                      background: C.white,
                      boxShadow:
                        focusLegIndex === li
                          ? "0 4px 14px rgba(0,13,87,0.12)"
                          : "0 1px 2px rgba(15,23,42,0.04)",
                      cursor: onFocusLegIndex ? "pointer" : "default",
                      outline: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "stretch",
                        minHeight: 44,
                      }}
                    >
                      <div style={{ width: 5, flexShrink: 0, background: theme.strip }} />
                      <div
                        style={{
                          flex: 1,
                          padding: "10px 12px",
                          background: theme.headBg,
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 4, fontFamily: font }}>
                          区間 {li + 1}
                          {leg.duration?.text ? (
                            <span style={{ fontWeight: 600, fontSize: 11, color: C.gray3, marginLeft: 8 }}>
                              {leg.duration.text}
                            </span>
                          ) : null}
                          {onFocusLegIndex ? (
                            <span style={{ fontWeight: 600, fontSize: 9, color: C.gray4, marginLeft: 8 }}>
                              （地図で強調）
                            </span>
                          ) : null}
                        </div>
                        {leg.start_address ? (
                          <div style={{ fontSize: 11, color: C.gray4, lineHeight: 1.5, fontFamily: font }}>
                            {leg.start_address}
                            <span style={{ color: "#94a3b8", margin: "0 4px" }}>→</span>
                            {leg.end_address}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div style={{ padding: "10px 10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                      {(leg.steps || []).map((step, si) => {
                        const td = step.transit_details || step.transit;
                        const isTransit = step.travel_mode === "TRANSIT" && td;
                        const vis = transitStepVisual(step);
                        return (
                          <div
                            key={si}
                            role={onFocusLegIndex ? "button" : undefined}
                            tabIndex={onFocusLegIndex ? 0 : undefined}
                            onClick={(e) => {
                              e.stopPropagation();
                              onFocusLegIndex?.(focusLegIndex === li ? null : li);
                            }}
                            onKeyDown={
                              onFocusLegIndex
                                ? (e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      onFocusLegIndex?.(focusLegIndex === li ? null : li);
                                    }
                                  }
                                : undefined
                            }
                            style={{
                              borderRadius: 10,
                              background: vis.bg,
                              border: `1px solid rgba(0,0,0,0.06)`,
                              borderLeft: `4px solid ${vis.mapStroke || vis.accent}`,
                              padding: "10px 10px 10px 12px",
                              fontFamily: font,
                              cursor: onFocusLegIndex ? "pointer" : "default",
                              outline: "none",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                              <span
                                style={{
                                  fontSize: 9,
                                  fontWeight: 800,
                                  letterSpacing: "0.04em",
                                  color: vis.badgeColor,
                                  background: "rgba(255,255,255,0.9)",
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  border: `1px solid ${vis.accent}33`,
                                }}
                              >
                                {vis.badge}
                              </span>
                              {step.duration?.text ? (
                                <span style={{ fontSize: 10, fontWeight: 600, color: C.gray3 }}>{step.duration.text}</span>
                              ) : null}
                            </div>
                            {isTransit ? (
                              <div>
                                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 13, lineHeight: 1.35 }}>
                                  {td.line?.short_name || td.line?.name || "公共交通"}
                                  {td.line?.vehicle?.name ? (
                                    <span style={{ fontWeight: 600, fontSize: 11, color: C.gray3, marginLeft: 6 }}>
                                      {td.line.vehicle.name}
                                    </span>
                                  ) : null}
                                </div>
                                {td.headsign ? (
                                  <div style={{ fontSize: 11, color: C.gray4, marginTop: 4 }}>
                                    行先: {td.headsign}
                                  </div>
                                ) : null}
                                <div style={{ marginTop: 8, fontSize: 12, color: "#334155", lineHeight: 1.4 }}>
                                  {td.departure_stop?.name ? (
                                    <span>
                                      <span style={{ color: C.gray4, fontSize: 10, fontWeight: 700 }}>乗車</span>{" "}
                                      {td.departure_stop.name}
                                    </span>
                                  ) : null}
                                  {td.departure_stop?.name && td.arrival_stop?.name ? (
                                    <span style={{ color: "#94a3b8", margin: "0 6px" }}>→</span>
                                  ) : null}
                                  {td.arrival_stop?.name ? (
                                    <span>
                                      <span style={{ color: C.gray4, fontSize: 10, fontWeight: 700 }}>降車</span>{" "}
                                      {td.arrival_stop.name}
                                    </span>
                                  ) : null}
                                </div>
                                {td.num_stops != null ? (
                                  <div style={{ fontSize: 11, color: C.gray4, marginTop: 6, fontWeight: 600 }}>
                                    {td.num_stops}駅
                                  </div>
                                ) : null}
                              </div>
                            ) : (
                              <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.5 }}>
                                {stripHtml(step.html_instructions ?? step.instructions)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </aside>
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
  /** 사이드바·목록에서 선택한 문화재 id — 해당 좌표로 지도 이동 */
  focusHeritageId,
  /** 저장 루트 탭: 도보·차량일 때만 TMAP 폴리라인 (대중교통은 미표시). 좌표는 매번 API로 실시간 계산 */
  tmapRouteContext,
  /** 열린 루트의 이동 수단(0/1/2) — 폴리라인 세션 키에만 사용, 지도 뷰는 유지 */
  tmapTransportType,
  /** 열린 저장 루트 id — 폴리라인 세션 키에만 사용 */
  tmapOpenRouteId,
  /** 대중교통: Directions(TRANSIT) 사용 시 true */
  transitMode,
  /** 경유지 좌표열 (lat/lng) */
  transitPlaces,
  /** Google Directions 결과 (親 state) */
  transitDirectionsResult,
  /** 구간 연결 시 합성 폴리라인 (overview_path 없음) */
  transitMergedPolylinePath,
  transitSelectedRouteIndex,
  /** パネルで選んだ区間 — 該当 polyline を強調し範囲にズーム */
  transitFocusLegIndex = null,
  onTransitDirectionsChange,
  /** Google Directions transitOptions（routingPreference / modes / departureIso） */
  transitPrefs,
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

  const [tmapPolylinePath, setTmapPolylinePath] = useState(null);

  const transitPointsKey = useMemo(() => {
    if (!transitPlaces?.length) return "";
    return transitPlaces.map((p) => `${p.lat},${p.lng}`).join("|");
  }, [transitPlaces]);

  const transitOptsKey = useMemo(() => JSON.stringify(transitPrefs ?? {}), [transitPrefs]);

  const transitDirCbRef = useRef(onTransitDirectionsChange);
  transitDirCbRef.current = onTransitDirectionsChange;

  /** MapSection.jsx と同一 id（同一 SPA 内で useJsApiLoader はオプション一致必須） */
  const { isLoaded, loadError } = useJsApiLoader({
    id: "topaboda-map",
    googleMapsApiKey: apiKey || "",
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  const transitPolylinePath = useMemo(() => {
    if (!transitMode || !transitDirectionsResult?.routes?.length) return null;
    const routes = transitDirectionsResult.routes;
    const multiRoute = routes.length > 1;
    /** 候補が複数あるときは合成 merged ではなく選択ルートの overview を使う */
    if (transitMergedPolylinePath?.length >= 2 && !multiRoute) return transitMergedPolylinePath;
    const route = routes[transitSelectedRouteIndex];
    return directionsOverviewToPath(route);
  }, [transitMode, transitDirectionsResult, transitSelectedRouteIndex, transitMergedPolylinePath]);

  /** 徒歩・バス等パネル色と一致するセグメント別ポリライン（step の encoded polyline 使用） */
  const transitColoredSegments = useMemo(() => {
    if (!transitMode || !isLoaded || !transitDirectionsResult?.routes?.length) return null;
    const route = transitDirectionsResult.routes[transitSelectedRouteIndex];
    return buildTransitColoredSegmentsFromRoute(route);
  }, [transitMode, isLoaded, transitDirectionsResult, transitSelectedRouteIndex]);

  /** 폴리라인만 갈아끼울 때 쓰는 키(지도 컴포넌트 remount 없음 → 줌·위치 유지) */
  const tmapPolylineSessionKey = useMemo(() => {
    if (!tmapRouteContext?.points?.length) return "tmap-line-none";
    const pts = tmapRouteContext.points.map((p) => `${p.lat},${p.lng}`).join(";");
    const rid = tmapOpenRouteId != null ? routeKey(tmapOpenRouteId) : "x";
    return `tmap-line-${rid}-${tmapTransportType ?? "x"}-${tmapRouteContext.mode}-${pts}`;
  }, [tmapRouteContext, tmapTransportType, tmapOpenRouteId]);

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

  /** Google Directions — 대중교통: 경유지 waypoints 우선, 실패 시 구간별 연결 */
  useEffect(() => {
    if (!isLoaded || typeof google === "undefined") return;
    if (!transitMode || !transitPlaces?.length || transitPlaces.length < 2) {
      transitDirCbRef.current?.({
        result: null,
        error: null,
        loading: false,
        meta: null,
        mergedPolylinePath: null,
      });
      return;
    }
    let cancelled = false;
    transitDirCbRef.current?.({
      result: null,
      error: null,
      loading: true,
      meta: null,
      mergedPolylinePath: null,
    });
    const svc = new google.maps.DirectionsService();
    const p = transitPrefs ?? {};
    const transitOpts = buildTransitOptsFromPrefs(p);

    const run = async () => {
      const o = transitPlaces[0];
      const d = transitPlaces[transitPlaces.length - 1];
      const waypoints =
        transitPlaces.length > 2
          ? transitPlaces.slice(1, -1).map((pt) => ({
              location: { lat: pt.lat, lng: pt.lng },
              stopover: true,
            }))
          : [];

      const singleReq = {
        origin: { lat: o.lat, lng: o.lng },
        destination: { lat: d.lat, lng: d.lng },
        travelMode: google.maps.TravelMode.TRANSIT,
        provideRouteAlternatives: true,
        region: "KR",
        transitOptions: transitOpts,
      };
      if (waypoints.length) {
        singleReq.waypoints = waypoints;
      }

      const first = await new Promise((resolve) => {
        svc.route(singleReq, (res, status) => resolve({ res, status }));
      });
      if (cancelled) return;
      if (first.status === google.maps.DirectionsStatus.OK && first.res?.routes?.length) {
        transitDirCbRef.current?.({
          result: first.res,
          error: null,
          loading: false,
          meta: { mode: "single" },
          mergedPolylinePath: null,
        });
        return;
      }

      const segResults = [];
      for (let i = 0; i < transitPlaces.length - 1; i++) {
        const seg = await new Promise((resolve) => {
          svc.route(
            {
              origin: { lat: transitPlaces[i].lat, lng: transitPlaces[i].lng },
              destination: { lat: transitPlaces[i + 1].lat, lng: transitPlaces[i + 1].lng },
              travelMode: google.maps.TravelMode.TRANSIT,
              provideRouteAlternatives: false,
              region: "KR",
              transitOptions: transitOpts,
            },
            (res, status) => resolve({ res, status }),
          );
        });
        if (cancelled) return;
        if (seg.status !== google.maps.DirectionsStatus.OK || !seg.res?.routes?.[0]) {
          transitDirCbRef.current?.({
            result: null,
            error: String(seg.status),
            loading: false,
            meta: { mode: "segmented", segments: transitPlaces.length - 1 },
            mergedPolylinePath: null,
          });
          return;
        }
        segResults.push(seg.res);
      }

      const { result: mergedResult, mergedPolylinePath } = mergeSegmentDirectionsResults(segResults);
      if (cancelled) return;
      transitDirCbRef.current?.({
        result: mergedResult,
        error: null,
        loading: false,
        meta: { mode: "segmented", segments: transitPlaces.length - 1 },
        mergedPolylinePath,
      });
    };

    run().catch((e) => {
      if (!cancelled) {
        transitDirCbRef.current?.({
          result: null,
          error: e?.message ?? String(e),
          loading: false,
          meta: null,
          mergedPolylinePath: null,
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, transitMode, transitPointsKey, transitOptsKey]);

  /** 모드·루트·경유가 바뀌면 폴리라인 좌표만 먼저 비움(지도 뷰는 그대로) */
  useLayoutEffect(() => {
    setTmapPolylinePath(null);
  }, [tmapPolylineSessionKey]);

  useEffect(() => {
    if (!isLoaded || typeof google === "undefined") return;
    if (transitMode) return;
    if (!tmapRouteContext?.points?.length || tmapRouteContext.points.length < 2) {
      return;
    }
    const { mode, points } = tmapRouteContext;
    let cancelled = false;

    const applyPath = (data) => {
      const raw = data?.path;
      if (!Array.isArray(raw) || raw.length < 2) {
        setTmapPolylinePath(null);
        return;
      }
      setTmapPolylinePath(raw.map(([lng, lat]) => ({ lat, lng })));
    };

    /** 2곳만이면 시작·끝만 전달(백엔드가 한 구간 TMAP), 그 외에는 경유 순서대로 points */
    const body =
      points.length === 2
        ? { mode, start: points[0], end: points[1] }
        : { mode, points };
    fetch(API_TMAP_ROUTE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => {
        if (cancelled) return;
        applyPath(data);
      })
      .catch(() => {
        if (!cancelled) setTmapPolylinePath(null);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, tmapRouteContext, tmapTransportType, transitMode]);

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

  /** 大衆交通: 候補ルート変更・区間フォーカス時に路線に合わせて地図範囲を調整（マーカー fit の後に実行） */
  useEffect(() => {
    if (!isLoaded || !mapRef.current || typeof google === "undefined") return;
    if (!transitMode) return;
    const map = mapRef.current;
    const extendPath = (bounds, path) => {
      path.forEach((p) => bounds.extend(p));
    };
    if (transitFocusLegIndex != null && transitColoredSegments?.length) {
      const legSegs = transitColoredSegments.filter((s) => s.legIndex === transitFocusLegIndex);
      if (legSegs.length) {
        const bounds = new google.maps.LatLngBounds();
        legSegs.forEach((s) => extendPath(bounds, s.path));
        map.fitBounds(bounds, 72);
        return;
      }
    }
    if (transitColoredSegments?.length) {
      const bounds = new google.maps.LatLngBounds();
      transitColoredSegments.forEach((s) => extendPath(bounds, s.path));
      map.fitBounds(bounds, 52);
      return;
    }
    if (transitPolylinePath?.length >= 2) {
      const bounds = new google.maps.LatLngBounds();
      extendPath(bounds, transitPolylinePath);
      map.fitBounds(bounds, 52);
    }
  }, [
    isLoaded,
    transitMode,
    transitSelectedRouteIndex,
    transitColoredSegments,
    transitPolylinePath,
    transitFocusLegIndex,
    transitPointsKey,
  ]);

  /** 목록/마커에서 선택한 핀으로 지도 이동 (fitBounds 이후 사용자 조작용) */
  useEffect(() => {
    if (!isLoaded || !mapRef.current || focusHeritageId == null || focusHeritageId === "") return;
    const map = mapRef.current;
    const id = String(focusHeritageId);
    const marker = allMarkers.find((m) => String(m.heritageId) === id);
    if (!marker?.position) return;
    const { lat, lng } = marker.position;
    if (typeof lat !== "number" || typeof lng !== "number" || Number.isNaN(lat) || Number.isNaN(lng)) return;
    map.panTo(marker.position);
    const nextZoom = Math.max(map.getZoom() || 8, 15);
    map.setZoom(nextZoom);
    setCenter({ lat, lng });
    setZoom(nextZoom);
  }, [focusHeritageId, allMarkers, isLoaded]);

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
    <div style={{ flex: 1, minWidth: 0, background: "#e5e7eb", position: "relative", overflow: "hidden" }}>
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
          {transitMode &&
            (transitColoredSegments?.length
              ? transitColoredSegments.map((seg, i) => {
                  const focus = transitFocusLegIndex != null;
                  const dim = focus && seg.legIndex !== transitFocusLegIndex;
                  return (
                    <TmapPolylineOverlay
                      key={`tr-seg-${i}-r${transitSelectedRouteIndex}-${transitPointsKey}`}
                      path={seg.path}
                      strokeColor={seg.strokeColor}
                      strokeOpacity={dim ? 0.22 : 0.9}
                      strokeWeight={dim ? 3 : focus ? 7 : 5}
                      zIndex={dim ? 0 : 2}
                    />
                  );
                })
              : transitPolylinePath &&
                transitPolylinePath.length >= 2 && (
                  <TmapPolylineOverlay
                    key={`tr-fb-${transitSelectedRouteIndex}-${transitPointsKey}`}
                    path={transitPolylinePath}
                    strokeColor={C.navy}
                  />
                ))}
          {!transitMode && tmapPolylinePath && tmapPolylinePath.length >= 2 && (
            <TmapPolylineOverlay key={tmapPolylineSessionKey} path={tmapPolylinePath} />
          )}
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
function SavedRouteCard({
  route,
  isOpen,
  onClick,
  onDelete,
  deleting,
  onMovePlaceToTop,
  onOptimizeDistance,
  reordering,
  onPlaceFocusMap,
  focusedHeritageId,
  transportMode,
  onTransportChange,
}) {
  const [hovered, setHovered] = useState(false);
  /** 경유지 행 호버 — 클릭 가능 행만 시각 피드백 */
  const [hoveredPlaceId, setHoveredPlaceId] = useState(null);
  useEffect(() => {
    if (!isOpen) setHoveredPlaceId(null);
  }, [isOpen]);
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", border: `2px solid ${isOpen ? C.navy : hovered ? "#c0c4d0" : C.border}`, transition: "border-color 0.18s" }}>
      {/* 루트 헤더: 좌측=펼침, 우측=삭제+치브론 */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "12px 16px",
          background: isOpen ? "rgba(0,13,87,0.04)" : C.white,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          transition: "background 0.18s",
        }}
      >
        {/* 1행: 제목·뱃지 | 이동수단 | 삭제·펼침 · 2행: 날짜만(왼쪽 정렬) */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0 }}>
          <div
            style={{
              flex: "1 1 0%",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 4,
            }}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={onClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }}
              style={{
                cursor: "pointer",
                outline: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
                width: "100%",
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.navy,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {route.title}
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 99,
                  background: "rgba(0,13,87,0.08)",
                  color: C.navy,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {route.spots}か所
              </span>
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={onClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }}
              style={{
                fontSize: 12,
                color: C.gray4,
                lineHeight: 1.3,
                cursor: "pointer",
                outline: "none",
              }}
            >
              {route.date}
            </div>
          </div>
          <TransportModeSegment value={transportMode} onChange={onTransportChange} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button
            type="button"
            aria-label="ルートを削除"
            title="削除"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(e);
            }}
            disabled={deleting}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: `1.5px solid ${deleting ? C.border : "rgba(110,0,0,0.35)"}`,
              background: deleting ? "#f1f5f9" : "white",
              color: deleting ? C.gray4 : C.red,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: deleting ? "default" : "pointer",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!deleting) {
                e.currentTarget.style.background = "rgba(110,0,0,0.08)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = deleting ? "#f1f5f9" : "white";
            }}
          >
            <TrashIcon />
          </button>
          <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", color: C.navy, padding: 4 }}
          >
            <ChevronDownIcon open={isOpen} />
          </div>
        </div>
        </div>
      </div>

      {/* 포함 장소 목록 (펼쳐짐) */}
      {isOpen && route.places && route.places.length > 0 && (
        <div style={{ background: "#f8fafc", borderTop: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ marginBottom: 2 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.gray3, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>含まれる場所</p>
              {route.places.length >= 2 ? (
                <button
                  type="button"
                  title="1番目を出発点として、2番目以降を直線距離で近い順に並べ替え"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptimizeDistance?.();
                  }}
                  disabled={reordering}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: `1.5px solid ${reordering ? C.border : C.gold}`,
                    background: reordering ? "#f1f5f9" : "rgba(202,202,0,0.12)",
                    color: reordering ? C.gray4 : "#7a6f00",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: reordering ? "default" : "pointer",
                    fontFamily: font,
                    whiteSpace: "nowrap",
                  }}
                >
                  距離で最適化
                </button>
              ) : null}
            </div>
            <p style={{ fontSize: 11, color: C.gray4, margin: "6px 0 0", lineHeight: 1.45 }}>
              1番目はそのまま。2〜は直線距離の近い順（道路・交通は含みません）。
            </p>
          </div>
          {route.places.map((place, i) => {
            const badge = BADGE[place.category] || { bg: "#e2e8f0", color: "#6a7282" };
            const canFocusMap =
              onPlaceFocusMap &&
              place.id != null &&
              typeof place.latitude === "number" &&
              typeof place.longitude === "number" &&
              !Number.isNaN(place.latitude) &&
              !Number.isNaN(place.longitude);
            const pid = place.id != null ? String(place.id) : null;
            const isMapFocused = pid != null && focusedHeritageId != null && pid === String(focusedHeritageId);
            const isRowHovered = pid != null && hoveredPlaceId === pid;
            const rowBg = isMapFocused
              ? "rgba(0,13,87,0.14)"
              : isRowHovered && canFocusMap
                ? "rgba(0,13,87,0.06)"
                : C.white;
            const rowBorder = isMapFocused ? `1.5px solid ${C.navy}` : `1px solid ${C.border}`;
            return (
              <div
                key={place.id ?? i}
                role={canFocusMap ? "button" : undefined}
                tabIndex={canFocusMap ? 0 : undefined}
                title={canFocusMap ? "地図のこの位置へ移動" : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!canFocusMap) return;
                  onPlaceFocusMap(String(place.id));
                }}
                onKeyDown={(e) => {
                  if (!canFocusMap) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onPlaceFocusMap(String(place.id));
                  }
                }}
                onMouseEnter={() => {
                  if (pid != null) setHoveredPlaceId(pid);
                }}
                onMouseLeave={() => setHoveredPlaceId((cur) => (cur === pid ? null : cur))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  background: rowBg,
                  borderRadius: 10,
                  border: rowBorder,
                  cursor: canFocusMap ? "pointer" : "default",
                  outline: "none",
                  transition: "background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
                  boxShadow: isMapFocused ? "0 0 0 1px rgba(0,13,87,0.12)" : "none",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: "#a08c00", minWidth: 18, textAlign: "center" }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{place.nameJa}</span>
                    <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: badge.bg, color: badge.color, whiteSpace: "nowrap" }}>{place.category}</span>
                    {i === 0 ? (
                      <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: "rgba(0,13,87,0.1)", color: C.navy, fontWeight: 700, whiteSpace: "nowrap" }}>最優先</span>
                    ) : null}
                  </div>
                  <span style={{ fontSize: 11, color: C.gray4 }}>{place.duration}</span>
                </div>
                {i > 0 ? (
                  <button
                    type="button"
                    title="この場所を先頭（最優先）にする"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMovePlaceToTop?.(place.id);
                    }}
                    disabled={reordering}
                    style={{
                      flexShrink: 0,
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: `1.5px solid ${reordering ? C.border : C.navy}`,
                      background: reordering ? "#f1f5f9" : "white",
                      color: reordering ? C.gray4 : C.navy,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: reordering ? "default" : "pointer",
                      fontFamily: font,
                      whiteSpace: "nowrap",
                    }}
                  >
                    先頭へ
                  </button>
                ) : null}
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
  const [deletingRouteId, setDeletingRouteId] = useState(null);
  const [reorderingRouteId, setReorderingRouteId] = useState(null);
  /** 저장 루트 카드에서 선택한 이동 수단 (탭 내 로컬 상태; API 응답에는 미포함) */
  const [transportByRouteId, setTransportByRouteId] = useState({});
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
    fetch(API_ROUTES, { headers: { Authorization: `Bearer ${token}` } })
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
      const res = await fetch(API_ROUTES, {
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

  const handleDeleteRoute = async (routeId) => {
    if (!window.confirm("このルートを削除しますか？\n保存データから完全に削除されます。")) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    setDeletingRouteId(routeId);
    try {
      const res = await fetch(`${API_ROUTES}/${encodeURIComponent(routeId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        window.alert("ログインの有効期限が切れた可能性があります。再度ログインしてください。");
        return;
      }
      if (res.status === 404) {
        setSavedRoutes((prev) => prev.filter((r) => r.id !== routeId));
        setOpenRouteId((prev) => (prev === routeId ? null : prev));
        return;
      }
      if (!res.ok) {
        window.alert("削除に失敗しました。");
        return;
      }
      setSavedRoutes((prev) => prev.filter((r) => r.id !== routeId));
      setOpenRouteId((prev) => (prev === routeId ? null : prev));
    } catch {
      window.alert("削除に失敗しました。ネットワークを確認してください。");
    } finally {
      setDeletingRouteId(null);
    }
  };

  const handleMovePlaceToTop = async (routeId, heritageId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const route = savedRoutes.find((r) => r.id === routeId);
    if (!route?.places?.length) return;
    const heritageIds = moveHeritageIdsToTop(route.places, heritageId);
    const before = route.places.map((p) => p.id).join(",");
    const after = heritageIds.join(",");
    if (before === after) return;
    setReorderingRouteId(routeId);
    try {
      const res = await fetch(`${API_ROUTES}/${encodeURIComponent(routeId)}/order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ heritageIds }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        window.alert("ログインの有効期限が切れた可能性があります。再度ログインしてください。");
        return;
      }
      if (!res.ok) {
        const msg = typeof data?.message === "string" ? data.message : "順序の更新に失敗しました。";
        window.alert(msg);
        return;
      }
      setSavedRoutes((prev) => prev.map((r) => (r.id === routeId ? data : r)));
    } catch {
      window.alert("順序の更新に失敗しました。ネットワークを確認してください。");
    } finally {
      setReorderingRouteId(null);
    }
  };

  const handleOptimizeDistance = async (routeId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const route = savedRoutes.find((r) => r.id === routeId);
    if (!route?.places || route.places.length < 2) return;
    setReorderingRouteId(routeId);
    try {
      const res = await fetch(`${API_ROUTES}/${encodeURIComponent(routeId)}/optimize-distance`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        window.alert("ログインの有効期限が切れた可能性があります。再度ログインしてください。");
        return;
      }
      if (!res.ok) {
        const msg = typeof data?.message === "string" ? data.message : "距離最適化に失敗しました。";
        window.alert(msg);
        return;
      }
      setSavedRoutes((prev) => prev.map((r) => (r.id === routeId ? data : r)));
    } catch {
      window.alert("距離最適化に失敗しました。ネットワークを確認してください。");
    } finally {
      setReorderingRouteId(null);
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
    setMapFocusHeritageId(null);
  }, [openRouteId]);

  const mapPinHighlightId = mapFocusHeritageId ?? heritageIdFromMap;

  /** 열린 카드 기준 이동 수단 — id 타입 불일치로 맵 조회 실패하지 않도록 routeKey 사용 */
  const transportForOpenRoute = useMemo(() => {
    if (openRouteId == null) return null;
    return Number(transportByRouteId[routeKey(openRouteId)] ?? 0);
  }, [openRouteId, transportByRouteId]);

  const [transitDirections, setTransitDirections] = useState({
    result: null,
    error: null,
    loading: false,
    meta: null,
    mergedPolylinePath: null,
  });
  const [transitRouteIndex, setTransitRouteIndex] = useState(0);
  /** 区間カード／ステップクリックで地図強調（null＝全区間同じ強調） */
  const [transitFocusLegIndex, setTransitFocusLegIndex] = useState(null);
  const [transitPrefs, setTransitPrefs] = useState({
    routingPreference: "FEWER_TRANSFERS",
    modes: [],
    departureIso: "",
  });

  const transitPrefsKey = useMemo(() => JSON.stringify(transitPrefs), [transitPrefs]);

  const selectTransitRoute = useCallback((i) => {
    setTransitRouteIndex(i);
    setTransitFocusLegIndex(null);
  }, []);

  const handleTransitDirections = useCallback((payload) => {
    setTransitDirections({
      result: payload.result ?? null,
      error: payload.error ?? null,
      loading: payload.loading ?? false,
      meta: payload.meta ?? null,
      mergedPolylinePath: payload.mergedPolylinePath ?? null,
    });
  }, []);

  useEffect(() => {
    if (transportForOpenRoute !== 1) {
      setTransitDirections({
        result: null,
        error: null,
        loading: false,
        meta: null,
        mergedPolylinePath: null,
      });
      setTransitRouteIndex(0);
      setTransitFocusLegIndex(null);
      setTransitPrefs({ routingPreference: "FEWER_TRANSFERS", modes: [], departureIso: "" });
    }
  }, [transportForOpenRoute]);

  useEffect(() => {
    setTransitRouteIndex(0);
    setTransitFocusLegIndex(null);
  }, [openRouteId]);

  useEffect(() => {
    setTransitFocusLegIndex(null);
  }, [transitDirections.result]);

  useEffect(() => {
    const n = transitDirections.result?.routes?.length ?? 0;
    if (n > 0) setTransitRouteIndex((i) => Math.min(i, n - 1));
  }, [transitDirections.result]);

  useEffect(() => {
    setTransitRouteIndex(0);
    setTransitFocusLegIndex(null);
  }, [transitPrefsKey]);

  const openRoutePlacesForTransit = useMemo(() => {
    if (navTab !== "routes" || openRouteId == null) return null;
    const r = savedRoutes.find((x) => routeKey(x.id) === routeKey(openRouteId));
    if (!r?.places?.length || r.places.length < 2) return null;
    const pts = r.places
      .filter(
        (p) =>
          p != null &&
          typeof p.latitude === "number" &&
          typeof p.longitude === "number" &&
          !Number.isNaN(p.latitude) &&
          !Number.isNaN(p.longitude),
      )
      .map((p) => ({ lat: p.latitude, lng: p.longitude }));
    return pts.length >= 2 ? pts : null;
  }, [navTab, openRouteId, savedRoutes]);

  const transitUiActive =
    navTab === "routes" &&
    openRouteId != null &&
    transportForOpenRoute === 1 &&
    openRoutePlacesForTransit != null;

  /** 저장 루트 탭 + 해당 루트 2곳 이상: 도보·차량만 TMAP 폴리라인. 대중교통(1)은 추후 */
  const tmapRouteContext = useMemo(() => {
    if (navTab !== "routes" || openRouteId == null) return null;
    const r = savedRoutes.find((x) => routeKey(x.id) === routeKey(openRouteId));
    if (!r?.places?.length || r.places.length < 2) return null;
    const tt = transportForOpenRoute ?? 0;
    if (tt === 1) return null;
    const points = r.places
      .filter(
        (p) =>
          p != null &&
          typeof p.latitude === "number" &&
          typeof p.longitude === "number" &&
          !Number.isNaN(p.latitude) &&
          !Number.isNaN(p.longitude),
      )
      .map((p) => ({ lat: p.latitude, lng: p.longitude }));
    if (points.length < 2) return null;
    return {
      mode: tt === 2 ? "DRIVING" : "WALKING",
      points,
    };
  }, [navTab, openRouteId, savedRoutes, transportForOpenRoute]);

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
                      onDelete={() => handleDeleteRoute(route.id)}
                      deleting={deletingRouteId === route.id}
                      onMovePlaceToTop={(heritageId) => handleMovePlaceToTop(route.id, heritageId)}
                      onOptimizeDistance={() => handleOptimizeDistance(route.id)}
                      reordering={reorderingRouteId === route.id}
                      onPlaceFocusMap={(heritageId) => setMapFocusHeritageId(heritageId)}
                      focusedHeritageId={openRouteId === route.id ? mapFocusHeritageId : null}
                      transportMode={transportByRouteId[routeKey(route.id)] ?? 0}
                      onTransportChange={(v) =>
                        setTransportByRouteId((prev) => ({ ...prev, [routeKey(route.id)]: v }))
                      }
                    />
                  ))
                )}
              </div>
            </>
          )}
        </aside>

        {/* ── 우: Google Maps + (대중교통 시) 오른쪽 패널 ── */}
        {mapConfig?.apiKey ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              minWidth: 0,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <RouteMapPane
              apiKey={mapConfig.apiKey}
              mapId={mapConfig.mapId}
              routePins={routePins}
              lonelyHeritageId={lonelyUrlHeritage}
              nameFromUrl={heritageNameFromMap || ""}
              selectedCount={navTab === "bookmark" ? addedCount : 0}
              onMarkerSelect={(id) => setMapFocusHeritageId(id)}
              focusHeritageId={mapFocusHeritageId}
              tmapRouteContext={tmapRouteContext}
              tmapTransportType={navTab === "routes" && openRouteId != null ? transportForOpenRoute : null}
              tmapOpenRouteId={navTab === "routes" ? openRouteId : null}
              transitMode={transitUiActive}
              transitPlaces={openRoutePlacesForTransit}
              transitDirectionsResult={transitDirections.result}
              transitMergedPolylinePath={transitDirections.mergedPolylinePath}
              transitSelectedRouteIndex={transitRouteIndex}
              transitFocusLegIndex={transitFocusLegIndex}
              onTransitDirectionsChange={handleTransitDirections}
              transitPrefs={transitPrefs}
            />
            {transitUiActive && (
              <TransitRoutePanel
                result={transitDirections.result}
                loading={transitDirections.loading}
                error={transitDirections.error}
                selectedIndex={transitRouteIndex}
                onSelectIndex={selectTransitRoute}
                focusLegIndex={transitFocusLegIndex}
                onFocusLegIndex={setTransitFocusLegIndex}
                transitPrefs={transitPrefs}
                onTransitPrefsChange={setTransitPrefs}
                transitMeta={transitDirections.meta}
              />
            )}
          </div>
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
