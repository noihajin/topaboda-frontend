import React, { useEffect, useState, useRef, useCallback } from "react";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import { MarkerClusterer, SuperClusterAlgorithm } from "@googlemaps/markerclusterer";
// ✅ 파일을 따로 찾지 않도록 데이터를 코드 내부에 직접 정의합니다. (에러 해결 핵심)
const mapFocusPreset = {
  "INITIAL": { "center": { "lat": 36.5, "lng": 127.8 }, "zoom": 8 },
  "Seoul": { "center": { "lat": 37.5665, "lng": 126.9780 }, "zoom": 12 },
  "Busan": { "center": { "lat": 35.1796, "lng": 129.0756 }, "zoom": 12 },
  "Daegu": { "center": { "lat": 35.8714, "lng": 128.6014 }, "zoom": 11 },
  "Incheon": { "center": { "lat": 37.4563, "lng": 126.7052 }, "zoom": 11 },
  "Gwangju": { "center": { "lat": 35.1595, "lng": 126.8526 }, "zoom": 12 },
  "Daejeon": { "center": { "lat": 36.3504, "lng": 127.3845 }, "zoom": 12 },
  "Ulsan": { "center": { "lat": 35.5389, "lng": 129.3114 }, "zoom": 12 },
  "Sejong": { "center": { "lat": 36.48, "lng": 127.289 }, "zoom": 12 },
  "Gyeonggi-do": { "center": { "lat": 37.2752, "lng": 127.0095 }, "zoom": 10 },
  "Gangwon-do": { "center": { "lat": 37.8853, "lng": 127.7298 }, "zoom": 9 },
  "Chungcheongbuk-do": { "center": { "lat": 36.6353, "lng": 127.4914 }, "zoom": 10 },
  "Chungcheongnam-do": { "center": { "lat": 36.6588, "lng": 126.6728 }, "zoom": 10 },
  "Jeollabuk-do": { "center": { "lat": 35.8204, "lng": 127.1087 }, "zoom": 10 },
  "Jeollanam-do": { "center": { "lat": 34.8161, "lng": 126.4629 }, "zoom": 10 },
  "Gyeongsangbuk-do": { "center": { "lat": 36.576, "lng": 128.5058 }, "zoom": 9 },
  "Gyeongsangnam-do": { "center": { "lat": 35.2376, "lng": 128.6919 }, "zoom": 10 },
  "Jeju": { "center": { "lat": 33.489, "lng": 126.4983 }, "zoom": 11 },
};

const API_URL = "/api/maps/config";
const HERITAGE_SESSION_CACHE_PREFIX = "map-heritage-pins-theme-";
const GOOGLE_MAP_LIBRARIES = ["marker"];
const DEFAULT_MAP_ID = "DEMO_MAP_ID";
const FIT_PAD = { top: 0, right: 0, bottom: 0, left: 0 };
const INIT_ZOOM = 8;          // 초기 표시 줌
const MIN_ZOOM = 8;           // 미선택 시 허용 최소 줌
const OVERLAY_HIDE_ZOOM = 13;
const CLUSTER_EXPAND_ZOOM = 17;
const CLICK_FOCUS_DELAY_MS = 100;
const ZOOM_SYNC_DEBOUNCE_MS = 80;
const INITIAL_FOCUS_KEY = "INITIAL";
const INITIAL_EXTRA_REGIONS = ["Gunwi"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1.5rem",
};

const sectionClass = "w-full px-[10%] pt-24 pb-0 scroll-mt-[11.9rem]";

const COLOR_DEFAULT = "#b8d4f0";
const COLOR_SELECTED = "#1e3a8a";
const COLOR_UNSELECTED = "#f3f4f6";
const STROKE_COLOR = "#ffffff";
const STROKE_WEIGHT = 1.5;
const COUNTRY_METRO_OVERRIDE = { Gunwi: "Daegu" };
const REGION_NAME_TO_CODE = {
  Seoul: "11",
  Busan: "21",
  Daegu: "22",
  Incheon: "23",
  Gwangju: "24",
  Daejeon: "25",
  Ulsan: "26",
  "Gyeonggi-do": "31",
  "Gangwon-do": "32",
  "Chungcheongbuk-do": "33",
  "Chungcheongnam-do": "34",
  "Jeollabuk-do": "35",
  "Jeollanam-do": "36",
  "Gyeongsangbuk-do": "37",
  "Gyeongsangnam-do": "38",
  Sejong: "45",
  Jeju: "50",
};
const METRO_REGION_KEYS = new Set(["Seoul", "Busan", "Daegu", "Incheon", "Gwangju", "Daejeon", "Ulsan"]);
const TAG_COLORS = {
  navy: "#000d57",
  border: "#d1d5db",
  gray2: "#4b5563",
  gray3: "#6b7280",
};
const TAGS = [
  { id: "tag-1", label: "테마 1", count: 54 },
  { id: "tag-2", label: "테마 2", count: 12 },
  { id: "tag-3", label: "테마 3", count: 8 },
  { id: "tag-4", label: "테마 4", count: 15 },
  { id: "tag-5", label: "테마 5", count: 23 },
  { id: "tag-6", label: "테마 6", count: 9 },
  { id: "tag-7", label: "테마 7", count: 17 },
  { id: "tag-8", label: "테마 8", count: 4 },
  { id: "tag-9", label: "테마 9", count: 19 },
  { id: "tag-10", label: "테마 10", count: 6 },
  { id: "tag-11", label: "테마 11", count: 14 },
  { id: "tag-12", label: "테마 12", count: 27 },
  { id: "tag-13", label: "테마 13", count: 5 },
  { id: "tag-14", label: "테마 14", count: 31 },
  { id: "tag-15", label: "테마 15", count: 11 },
  { id: "tag-16", label: "테마 16", count: 20 },
];

function coordsToPath(rings) {
  const ring = rings?.[0] || rings || [];
  if (ring.length < 3) return null;
  return ring.map((c) => ({ lat: c[1], lng: c[0] }));
}

function getPathsFromGeometry(geometry) {
  if (!geometry) return [];
  const { type, coordinates } = geometry;
  if (type === "Polygon") {
    const path = coordsToPath(coordinates);
    return path ? [path] : [];
  }
  if (type === "MultiPolygon") {
    return (coordinates || []).map(coordsToPath).filter(Boolean);
  }
  return [];
}

async function loadJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} 로드 실패`);
  return res.json();
}

function getRegionZoom(regionKey) {
  const effectiveKey = COUNTRY_METRO_OVERRIDE[regionKey] || regionKey;
  return mapFocusPreset[effectiveKey]?.zoom ?? mapFocusPreset[regionKey]?.zoom ?? MIN_ZOOM;
}

function getHeritageMinZoom(regionKey) {
  return getRegionZoom(regionKey);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getThemeIndexFromTagId(tagId) {
  const parsed = Number(String(tagId || "").replace("tag-", ""));
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 16 ? parsed : 1;
}

function getThemeIndexesFromTagIds(tagIds) {
  return Array.from(tagIds)
    .map(getThemeIndexFromTagId)
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .sort((a, b) => a - b);
}

function getSelectedRegionCode(selectedSet) {
  const selected = Array.from(selectedSet || []);
  if (selected.length === 0) return null;
  return REGION_NAME_TO_CODE[selected[0]] || null;
}

function getThemeCacheKey(regionCode, themeIndex) {
  return `${HERITAGE_SESSION_CACHE_PREFIX}${regionCode}-${themeIndex}`;
}

function hasThemeBit(pin, themeIndex) {
  const mask = Number(pin?.themeMask || 0);
  const bit = 1 << (themeIndex - 1);
  return (mask & bit) !== 0;
}

function dedupePinsById(pins) {
  const byId = new Map();
  (pins || []).forEach((pin) => {
    if (!pin?.id) return;
    byId.set(pin.id, pin);
  });
  return Array.from(byId.values());
}

function cleanupLegacyThemeComboCache(regionCode) {
  if (!regionCode) return;
  const keysToRemove = [];
  for (let i = 0; i < sessionStorage.length; i += 1) {
    const key = sessionStorage.key(i);
    if (!key || !key.startsWith(HERITAGE_SESSION_CACHE_PREFIX)) continue;
    const payload = key.slice(HERITAGE_SESSION_CACHE_PREFIX.length);
    const segments = payload.split("-");
    if (segments[0] !== regionCode) continue;
    // legacy combo cache example: 31-1-3-5 (segments length > 2)
    if (segments.length > 2) keysToRemove.push(key);
  }
  keysToRemove.forEach((k) => sessionStorage.removeItem(k));
}

function parseBounds(r) {
  return {
    north: Number(r.north),
    south: Number(r.south),
    east: Number(r.east),
    west: Number(r.west),
  };
}

function unionBounds(rows) {
  const b = {
    north: -Infinity,
    south: Infinity,
    east: -Infinity,
    west: Infinity,
  };
  rows.forEach((r) => {
    const x = parseBounds(r);
    if (x.north > b.north) b.north = x.north;
    if (x.south < b.south) b.south = x.south;
    if (x.east > b.east) b.east = x.east;
    if (x.west < b.west) b.west = x.west;
  });
  return b;
}

function computeBoundsFromGeometry(geometry) {
  const paths = getPathsFromGeometry(geometry);
  if (paths.length === 0) return null;
  const b = { north: -Infinity, south: Infinity, east: -Infinity, west: Infinity };
  paths.forEach((path) => {
    path.forEach((point) => {
      if (point.lat > b.north) b.north = point.lat;
      if (point.lat < b.south) b.south = point.lat;
      if (point.lng > b.east) b.east = point.lng;
      if (point.lng < b.west) b.west = point.lng;
    });
  });
  if (!Number.isFinite(b.north) || !Number.isFinite(b.south) || !Number.isFinite(b.east) || !Number.isFinite(b.west)) {
    return null;
  }
  if (b.north <= b.south || b.east <= b.west) return null;
  return b;
}

// 오버레이 PNG 이미지를 브라우저 캐시에 미리 로드
function preloadOverlayImages(bbox, imagesBase) {
  const base = (imagesBase || "/img/korea").replace(/\/$/, "");
  const { do8 = [], metro = [], country = [] } = bbox;
  [...do8, ...metro, ...country].forEach((r) => {
    const name = (r.name || "").trim();
    if (!name || !/\.png$/i.test(name)) return;
    const rawCategory = (r.category || "do8").trim();
    const category = rawCategory === "county" ? "country" : rawCategory;
    const img = new Image();
    img.src = `${base}/${category}/${name}`;
  });
}

// easeInOutQuad 보간으로 부드러운 줌+이동 애니메이션
// isAnimatingRef: 애니메이션 중 overlay/marker sync 억제용 플래그
// onComplete: 애니메이션 완료 후 콜백
function smoothMoveTo(map, targetCenter, targetZoom, animFrameRef, durationMs = 500, isAnimatingRef = null, onComplete = null) {
  if (animFrameRef.current) {
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = null;
  }
  const startZoom = map.getZoom() ?? targetZoom;
  const startCenter = map.getCenter();
  if (!startCenter) {
    map.setCenter(targetCenter);
    map.setZoom(targetZoom);
    if (isAnimatingRef) isAnimatingRef.current = false;
    if (onComplete) onComplete();
    return;
  }
  const startLat = startCenter.lat();
  const startLng = startCenter.lng();
  const startTime = performance.now();
  const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
  if (isAnimatingRef) isAnimatingRef.current = true;

  const step = (now) => {
    const t = Math.min((now - startTime) / durationMs, 1);
    const e = ease(t);
    map.setZoom(startZoom + (targetZoom - startZoom) * e);
    map.setCenter({
      lat: startLat + (targetCenter.lat - startLat) * e,
      lng: startLng + (targetCenter.lng - startLng) * e,
    });
    if (t < 1) {
      animFrameRef.current = requestAnimationFrame(step);
    } else {
      animFrameRef.current = null;
      if (isAnimatingRef) isAnimatingRef.current = false;
      if (onComplete) onComplete();
    }
  };
  animFrameRef.current = requestAnimationFrame(step);
}

function setupBlankMapType(map) {
  if (map.mapTypes.get("blank")) return;
  map.mapTypes.set("blank", {
    getTile: (coord, zoom, doc) => {
      const d = doc.createElement("div");
      d.style.background = "#e8f4ff";
      return d;
    },
    releaseTile: () => {},
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 21,
    minZoom: 0,
    name: "Blank",
    alt: "Blank",
  });
  map.setMapTypeId("blank");
}

// POI(음식점·가게 등 구글 핀) 숨기고 도로·지형·지명만 표시하는 커스텀 맵 타입
function setupCleanRoadmapType(map) {
  if (map.mapTypes.get("clean_roadmap")) return;
  const cleanStyle = new google.maps.StyledMapType(
    [
      // 모든 POI 아이콘·라벨 숨김
      { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "poi.business", elementType: "all", stylers: [{ visibility: "off" }] },
      { featureType: "poi.attraction", elementType: "all", stylers: [{ visibility: "off" }] },
      { featureType: "poi.government", elementType: "all", stylers: [{ visibility: "off" }] },
      { featureType: "poi.medical", elementType: "all", stylers: [{ visibility: "off" }] },
      { featureType: "poi.place_of_worship", elementType: "all", stylers: [{ visibility: "off" }] },
      { featureType: "poi.school", elementType: "all", stylers: [{ visibility: "off" }] },
      { featureType: "poi.sports_complex", elementType: "all", stylers: [{ visibility: "off" }] },
      // 공원 녹지 면적은 유지, 아이콘·라벨만 숨김
      { featureType: "poi.park", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ visibility: "on" }] },
      // 대중교통 아이콘 숨김 (역 이름 라벨은 유지)
      { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    ],
    { name: "Clean Roadmap" }
  );
  map.mapTypes.set("clean_roadmap", cleanStyle);
}

function MapWithGoogle({ apiKey, mapConfig }) {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const overlaysRef = useRef([]);
  const provincePolygonsRef = useRef([]);
  const muniPolygonsRef = useRef([]);
  const heritageMarkersRef = useRef([]);
  const heritageZoomListenerRef = useRef(null);
  const heritageInfoWindowRef = useRef(null);
  const markerClustererRef = useRef(null);

  // selectedSet의 최신 값을 클릭 핸들러에서 읽기 위한 ref (stale closure 방지)
  const selectedSetRef = useRef(new Set());
  const focusTimerRef = useRef(null);
  const animFrameRef = useRef(null);
  const isAnimatingRef = useRef(false);
  // 애니메이션 완료 후 overlay/marker 동기화를 호출하기 위한 ref
  const applyOverlayModeRef = useRef(null);
  const applyMarkersRef = useRef(null);
  const regionFocusRef = useRef(mapFocusPreset);

  const [selectedSet, setSelectedSet] = useState(new Set());
  const [selectedPin, setSelectedPin] = useState(null);
  const setSelectedPinRef = useRef(setSelectedPin);
  const [clusterListPins, setClusterListPins] = useState([]);
  const setClusterListPinsRef = useRef(setClusterListPins);
  const [geoData, setGeoData] = useState({
    bbox: null,
    provinces: null,
    municipalities: null,
  });
  const [geoError, setGeoError] = useState(null);
  const [useGoogleBaseMap, setUseGoogleBaseMap] = useState(false);
  const [showTagBar, setShowTagBar] = useState(false);
  const [activeTagIds, setActiveTagIds] = useState(new Set());
  const [heritagePins, setHeritagePins] = useState([]);
  const themeIndexes = getThemeIndexesFromTagIds(activeTagIds);
  const selectedRegionCode = getSelectedRegionCode(selectedSet);

  useEffect(() => {
    setClusterListPinsRef.current = setClusterListPins;
  }, []);
  useEffect(() => {
    // 지역이 선택된 경우 항상 테마 바 표시
    setShowTagBar(selectedSet.size > 0);
  }, [selectedSet]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: "topaboda-map",
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  // GeoJSON + bbox 로드
  useEffect(() => {
    if (!mapConfig?.endpoints) return;
    let cancelled = false;
    const ep = mapConfig.endpoints;
    Promise.all([
      loadJson(ep.bbox || "/api/maps/bbox"),
      loadJson(ep.provinces || "/api/maps/provinces"),
      loadJson(ep.municipalities || "/api/maps/municipalities"),
    ])
      .then(([bbox, provinces, municipalities]) => {
        if (!cancelled) {
          preloadOverlayImages(bbox, ep.imagesBase || "/img/korea");
          setGeoData({ bbox, provinces, municipalities });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setGeoError(err.message);
        console.error("[MapSection] GeoJSON 로드 실패:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [mapConfig?.endpoints]);

  useEffect(() => {
    if (!mapConfig?.endpoints) return;
    const hasSelectedRegion = Boolean(selectedRegionCode);
    const hasSelectedTheme = themeIndexes.length > 0;
    if (!hasSelectedRegion || !hasSelectedTheme) {
      setHeritagePins([]);
      return;
    }

    let cancelled = false;
    cleanupLegacyThemeComboCache(selectedRegionCode);

    const cachedByTheme = new Map();
    const missingThemes = [];
    themeIndexes.forEach((themeIndex) => {
      const key = getThemeCacheKey(selectedRegionCode, themeIndex);
      try {
        const raw = sessionStorage.getItem(key);
        if (!raw) {
          missingThemes.push(themeIndex);
          return;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          cachedByTheme.set(themeIndex, parsed);
        } else {
          missingThemes.push(themeIndex);
        }
      } catch (e) {
        console.warn("[MapSection] session cache parse 실패:", e);
        missingThemes.push(themeIndex);
      }
    });

    const cachedPins = dedupePinsById(Array.from(cachedByTheme.values()).flat());
    setHeritagePins(cachedPins);

    if (missingThemes.length === 0) {
      return () => { cancelled = true; };
    }

    const baseHeritageUrl = mapConfig.endpoints.heritage || "/api/maps/heritage";
    const params = new URLSearchParams({
      regionCode: selectedRegionCode,
      themeIndexes: missingThemes.join(","),
    });
    const heritageUrl = `${baseHeritageUrl}?${params.toString()}`;

    loadJson(heritageUrl)
      .then((rows) => {
        if (cancelled) return;
        const fetchedPins = Array.isArray(rows) ? rows : [];
        const fetchedByTheme = new Map(missingThemes.map((t) => [t, []]));
        fetchedPins.forEach((pin) => {
          missingThemes.forEach((themeIndex) => {
            if (hasThemeBit(pin, themeIndex)) {
              fetchedByTheme.get(themeIndex).push(pin);
            }
          });
        });

        fetchedByTheme.forEach((pins, themeIndex) => {
          const deduped = dedupePinsById(pins);
          try {
            sessionStorage.setItem(getThemeCacheKey(selectedRegionCode, themeIndex), JSON.stringify(deduped));
          } catch (e) {
            console.warn("[MapSection] session cache 저장 실패:", e);
          }
          cachedByTheme.set(themeIndex, deduped);
        });

        const mergedPins = dedupePinsById(Array.from(cachedByTheme.values()).flat());
        setHeritagePins(mergedPins);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[MapSection] Heritage 핀 로드 실패:", err);
      });

    return () => { cancelled = true; };
  }, [mapConfig?.endpoints, selectedRegionCode, themeIndexes.join(",")]);

  // selectedSetRef를 state와 동기화해 클릭 핸들러에서 최신 값 사용
  const selectSingleRegionByName = useCallback((rname) => {
    setSelectedSet((prev) => {
      const isSameOnlySelected = prev.size === 1 && prev.has(rname);
      const next = isSameOnlySelected ? new Set() : new Set([rname]);
      selectedSetRef.current = next;
      return next;
    });
  }, []);

  // key(region명/INITIAL) 기준 지연 포커싱 (부드러운 애니메이션)
  const scheduleFocusByRegionKey = useCallback(
    (regionKey, fallbackZoom = MIN_ZOOM) => {
      if (!regionKey || !mapRef.current) return;
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      focusTimerRef.current = setTimeout(() => {
        const map = mapRef.current;
        if (!map) return;
        const focus = regionFocusRef.current?.[regionKey];
        if (!focus?.center) return;
        const targetZoom = focus.zoom ?? fallbackZoom;
        // 목표 줌 기준으로 오버레이 모드를 애니메이션 시작 전에 미리 적용 (mid-animation 플래시 방지)
        if (applyOverlayModeRef.current) {
          applyOverlayModeRef.current(targetZoom >= OVERLAY_HIDE_ZOOM);
        }
        smoothMoveTo(map, focus.center, targetZoom, animFrameRef, 500, isAnimatingRef, () => {
          if (applyMarkersRef.current) applyMarkersRef.current();
        });
      }, CLICK_FOCUS_DELAY_MS);
    },
    []
  );

  const handleClusterItemClick = useCallback((pin) => {
    setClusterListPins([]);
    setSelectedPin(pin);
    const map = mapRef.current;
    if (!map || !Number.isFinite(pin?.latitude) || !Number.isFinite(pin?.longitude)) return;
    if (applyOverlayModeRef.current) applyOverlayModeRef.current(true);
    smoothMoveTo(
      map,
      { lat: Number(pin.latitude), lng: Number(pin.longitude) },
      CLUSTER_EXPAND_ZOOM,
      animFrameRef,
      500,
      isAnimatingRef,
      () => { if (applyMarkersRef.current) applyMarkersRef.current(); }
    );
  }, []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setupBlankMapType(map);
    setupCleanRoadmapType(map);
    map.setOptions({
      backgroundColor: "#e8f4ff",
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: "greedy",
      disableDefaultUI: true,
      isFractionalZoomEnabled: true,
      minZoom: MIN_ZOOM,
      mapId: mapConfig?.mapId || DEFAULT_MAP_ID,
    });
    setMapReady(true);
  }, [mapConfig?.mapId]);

  // GroundOverlay 생성 + bbox 기반 포커스 맵 구성
  useEffect(() => {
    if (!isLoaded || !mapReady || !mapRef.current || !geoData.bbox) return;
    const map = mapRef.current;
    const { do8 = [], metro = [], country = [] } = geoData.bbox;
    const imagesBase = (mapConfig?.endpoints?.imagesBase || "/img/korea").replace(/\/$/, "");
    const gunwiFromCountry = country.filter((r) => INITIAL_EXTRA_REGIONS.includes(r.region_name));
    const hasGunwi = gunwiFromCountry.length > 0;
    const gunwiFallback = !hasGunwi
      ? (geoData.municipalities?.features || [])
          .filter((f) => (f?.properties?.NAME_2 || "") === "Gunwi")
          .map((f) => {
            const bounds = computeBoundsFromGeometry(f.geometry);
            if (!bounds) return null;
            return {
              region_name: "Gunwi",
              category: "country",
              name: "Gunwi.png",
              north: bounds.north,
              south: bounds.south,
              east: bounds.east,
              west: bounds.west,
            };
          })
          .filter(Boolean)
      : [];
    const extraRows = [...gunwiFromCountry, ...gunwiFallback];
    const initialRows = [...do8, ...metro, ...extraRows];

    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    initialRows.forEach((r) => {
      const name = (r.name || "").trim();
      const rawCategory = (r.category || "do8").trim();
      const category = rawCategory === "county" ? "country" : rawCategory;
      const isGunwiOverlay = r.region_name === "Gunwi";
      if (!name || !/\.png$/i.test(name)) return;
      const { north, south, east, west } = parseBounds(r);
      if (
        !Number.isFinite(north) ||
        !Number.isFinite(south) ||
        !Number.isFinite(east) ||
        !Number.isFinite(west)
      )
        return;
      if (north <= south || east <= west) return;
      const bounds = new google.maps.LatLngBounds(
        { lat: south, lng: west },
        { lat: north, lng: east }
      );
      const overlay = new google.maps.GroundOverlay(
        `${imagesBase}/${category}/${name}`,
        bounds,
        {
          map,
          opacity: 0.9,
          clickable: false,
          zIndex: isGunwiOverlay ? 9 : 5,
        }
      );
      overlay.region_name = r.region_name;
      overlaysRef.current.push(overlay);
    });

    let overlayModeDebounceTimer = null;
    let lastOverlayMode = null;
    let overlayFadeFrame = null;
    let overlayIsAttached = false;
    let overlayCurrentOpacity = 0;
    const TARGET_OPACITY = 0.9;
    const OVERLAY_FADE_MS = 160;

    const applyOverlayMode = (useGoogleBaseMap) => {
      setUseGoogleBaseMap(useGoogleBaseMap);
      map.setMapTypeId(useGoogleBaseMap ? "clean_roadmap" : "blank");

      if (overlayFadeFrame) {
        cancelAnimationFrame(overlayFadeFrame);
        overlayFadeFrame = null;
      }

      const targetOpacity = useGoogleBaseMap ? 0 : TARGET_OPACITY;

      // 페이드 인: 아직 붙어있지 않으면 opacity 0으로 먼저 map에 붙임
      if (targetOpacity > 0 && !overlayIsAttached) {
        overlayIsAttached = true;
        overlaysRef.current.forEach((o) => {
          o.setOpacity(overlayCurrentOpacity);
          o.setMap(map);
        });
      }

      const startOpacity = overlayCurrentOpacity;
      const startTime = performance.now();

      const step = (now) => {
        const raw = Math.min((now - startTime) / OVERLAY_FADE_MS, 1);
        const ease = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw;
        overlayCurrentOpacity = startOpacity + (targetOpacity - startOpacity) * ease;
        overlaysRef.current.forEach((o) => o.setOpacity(overlayCurrentOpacity));

        if (raw < 1) {
          overlayFadeFrame = requestAnimationFrame(step);
        } else {
          overlayFadeFrame = null;
          overlayCurrentOpacity = targetOpacity;
          if (targetOpacity === 0) {
            overlayIsAttached = false;
            overlaysRef.current.forEach((o) => {
              o.setMap(null);
              o.setOpacity(TARGET_OPACITY); // 다음 페이드 인 준비
            });
            overlayCurrentOpacity = 0;
          }
        }
      };
      overlayFadeFrame = requestAnimationFrame(step);
    };
    applyOverlayModeRef.current = applyOverlayMode;

    const syncOverlayModeByZoom = () => {
      if (isAnimatingRef.current) return; // 애니메이션 중 억제
      const currentZoom = map.getZoom() ?? INIT_ZOOM;
      const useGoogleBaseMap = currentZoom >= OVERLAY_HIDE_ZOOM;
      if (lastOverlayMode === useGoogleBaseMap) return;
      lastOverlayMode = useGoogleBaseMap;
      if (overlayModeDebounceTimer) clearTimeout(overlayModeDebounceTimer);
      const run = () => {
        overlayModeDebounceTimer = null;
        applyOverlayMode(lastOverlayMode);
      };
      overlayModeDebounceTimer = setTimeout(run, ZOOM_SYNC_DEBOUNCE_MS);
    };

    const zoomListener = map.addListener("zoom_changed", syncOverlayModeByZoom);
    lastOverlayMode = (map.getZoom() ?? INIT_ZOOM) >= OVERLAY_HIDE_ZOOM;
    applyOverlayMode(lastOverlayMode);

    return () => {
      if (overlayFadeFrame) cancelAnimationFrame(overlayFadeFrame);
      if (overlayModeDebounceTimer) clearTimeout(overlayModeDebounceTimer);
      google.maps.event.removeListener(zoomListener);
      overlaysRef.current.forEach((o) => o.setMap(null));
      overlaysRef.current = [];
    };
  }, [isLoaded, mapReady, geoData.bbox, geoData.municipalities, mapConfig?.endpoints?.imagesBase]);

  useEffect(() => {
    if (!isLoaded || !mapReady || !mapRef.current) return;
    const map = mapRef.current;

    if (!heritageInfoWindowRef.current) {
      heritageInfoWindowRef.current = new google.maps.InfoWindow();
    }

    if (heritageZoomListenerRef.current) {
      google.maps.event.removeListener(heritageZoomListenerRef.current);
      heritageZoomListenerRef.current = null;
    }

    heritageMarkersRef.current.forEach((item) => {
      item.marker.map = null;
      item.domListeners?.forEach((off) => off());
    });
    heritageMarkersRef.current = [];
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
      markerClustererRef.current.setMap(null);
      markerClustererRef.current = null;
    }

    const AdvancedMarkerElement = google.maps.marker?.AdvancedMarkerElement;
    if (!AdvancedMarkerElement) {
      console.error("[MapSection] AdvancedMarkerElement 로드 실패");
      return;
    }

    // 펄스 애니메이션 CSS 한 번만 주입
    if (!document.getElementById("heritage-pin-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "heritage-pin-style";
      styleEl.textContent = `
        /* InfoWindow 기본 스타일 제거 */
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
        /* 핀 상세 패널 슬라이드 애니메이션 */
        @keyframes pinPanelIn {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .pin-detail-panel {
          animation: pinPanelIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `;
      document.head.appendChild(styleEl);
    }

    const nextMarkers = heritagePins
      .filter((pin) => Number.isFinite(pin?.latitude) && Number.isFinite(pin?.longitude))
      .map((pin) => {
        const markerEl = document.createElement("div");
        markerEl.style.cssText = `
          position: relative;
          width: 36px; height: 46px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          cursor: pointer;
          transition: transform 0.2s ease;
        `;
        markerEl.innerHTML = `
          <svg viewBox="0 0 384 512" style="width:100%;height:100%;">
            <path
              fill="##000D57"
              stroke="#FFFFFF"
              stroke-width="15"
              d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"
            />
            <circle cx="192" cy="192" r="50" fill="white" />
          </svg>
          <div style="
            position:absolute; bottom:-5px; left:50%;
            transform:translateX(-50%);
            width:12px; height:4px;
            background:rgba(0,0,0,0.2);
            border-radius:50%;
            z-index:-1;
          "></div>
        `;

        const marker = new AdvancedMarkerElement({
          position: { lat: Number(pin.latitude), lng: Number(pin.longitude) },
          map: null,
          title: pin.nameKo || pin.nameJa || "",
          content: markerEl,
        });
        marker.heritagePin = pin;
        const name = escapeHtml(pin.nameKo || pin.nameJa || "이름 없음");
        const thumbnail = escapeHtml(pin.thumbnail || "");
        const content = `
          <div style="
            width:280px;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 10px 25px rgba(0,0,0,0.1),0 4px 10px rgba(0,0,0,0.05);
            border:1px solid #f0f0f0;
            font-family:'Noto Sans KR',sans-serif;
          ">
            ${thumbnail ? `
            <div style="width:100%;height:160px;overflow:hidden;">
              <img src="${thumbnail}" alt="${name}"
                style="width:100%;height:100%;object-fit:cover;display:block;" />
            </div>` : ""}
            <div style="padding:14px 16px;">
              <div style="
                font-size:15px;
                font-weight:700;
                color:#1a1a1a;
                letter-spacing:-0.02em;
                line-height:1.4;
                margin:0;
              ">${name}</div>
            </div>
          </div>
        `;
        const onMouseEnter = () => {
          heritageInfoWindowRef.current.setContent(content);
          heritageInfoWindowRef.current.open({
            map,
            anchor: marker,
            shouldFocus: false,
          });
        };
        const onMouseLeave = () => {
          heritageInfoWindowRef.current.close();
        };
        const onClick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          heritageInfoWindowRef.current.close();
          setClusterListPinsRef.current([]);
          setSelectedPinRef.current(pin);
        };
        markerEl.addEventListener("mouseenter", onMouseEnter);
        markerEl.addEventListener("mouseleave", onMouseLeave);
        markerEl.addEventListener("click", onClick);

        return {
          pin,
          marker,
          minZoom: getHeritageMinZoom(pin.regionKey),
          domListeners: [
            () => markerEl.removeEventListener("mouseenter", onMouseEnter),
            () => markerEl.removeEventListener("mouseleave", onMouseLeave),
            () => markerEl.removeEventListener("click", onClick),
          ],
        };
      });

    let markerSyncDebounceTimer = null;
    let lastCandidateKey = null;
    const applyMarkerVisibility = () => {
      lastCandidateKey = null; // 강제 재렌더 허용
      const currentZoom = map.getZoom() ?? INIT_ZOOM;
      const candidates = nextMarkers.filter((item) => currentZoom >= item.minZoom);
      const candidateKey = candidates.map((c) => c.pin?.id).join(",");
      if (lastCandidateKey === candidateKey && markerClustererRef.current) return;
      lastCandidateKey = candidateKey;
      const candidateMarkers = candidates.map((item) => item.marker);

      if (markerClustererRef.current) {
        markerClustererRef.current.clearMarkers();
        markerClustererRef.current.addMarkers(candidateMarkers);
      } else {
        const clusterer = new MarkerClusterer({
          map,
          markers: candidateMarkers,
          algorithm: new SuperClusterAlgorithm({ radius: 900, maxZoom: 16 }),
          renderer: {
            render({ count, position }) {
              const size = count >= 50 ? 144 : count >= 20 ? 120 : count >= 10 ? 104 : 88;
              const fontSize = size >= 120 ? 28 : size >= 100 ? 24 : 20;
              const wrap = document.createElement("div");
              wrap.style.cssText = `
                position:relative;
                width:${size}px; height:${size}px;
                display:flex; align-items:center; justify-content:center;
                cursor:pointer;
              `;
              // 바깥 헤일로 테두리
              const halo = document.createElement("div");
              halo.style.cssText = `
                position:absolute; inset:-8px;
                border-radius:50%;
                border:6px solid rgba(202,202,0,0.3);
                pointer-events:none;
              `;
              // 원형 본체
              const circle = document.createElement("div");
              circle.style.cssText = `
                position:absolute; inset:0;
                border-radius:50%;
                background:rgba(202,202,0,0.9);
                box-shadow:0 4px 15px rgba(0,0,0,0.2);
                display:flex; flex-direction:column;
                align-items:center; justify-content:center;
              `;
              const numEl = document.createElement("span");
              numEl.style.cssText = `font-size:${fontSize}px; font-weight:700; color:#333; line-height:1;`;
              numEl.textContent = count;
              const unitEl = document.createElement("span");
              unitEl.style.cssText = `font-size:${Math.round(fontSize * 0.5)}px; color:#555; margin-top:2px;`;
              unitEl.textContent = "件";
              circle.appendChild(numEl);
              circle.appendChild(unitEl);
              wrap.appendChild(halo);
              wrap.appendChild(circle);
              return new google.maps.marker.AdvancedMarkerElement({ position, content: wrap });
            },
          },
          onClusterClick: (event, cluster, mapInstance) => {
            const pins = (cluster.markers || [])
              .map((m) => m.heritagePin)
              .filter(Boolean);
            if (pins.length > 0) {
              setSelectedPinRef.current(null);
              setClusterListPinsRef.current(pins);
            }
          },
        });
        markerClustererRef.current = clusterer;
      }
    };
    applyMarkersRef.current = applyMarkerVisibility;
    const syncMarkerVisibility = () => {
      if (isAnimatingRef.current) return; // 애니메이션 중 억제
      if (markerSyncDebounceTimer) clearTimeout(markerSyncDebounceTimer);
      markerSyncDebounceTimer = setTimeout(() => {
        markerSyncDebounceTimer = null;
        applyMarkerVisibility();
      }, ZOOM_SYNC_DEBOUNCE_MS);
    };

    heritageZoomListenerRef.current = map.addListener("zoom_changed", syncMarkerVisibility);
    applyMarkerVisibility();
    heritageMarkersRef.current = nextMarkers;

    return () => {
      if (markerSyncDebounceTimer) clearTimeout(markerSyncDebounceTimer);
      if (heritageZoomListenerRef.current) {
        google.maps.event.removeListener(heritageZoomListenerRef.current);
        heritageZoomListenerRef.current = null;
      }
      heritageMarkersRef.current.forEach((item) => {
        item.marker.map = null;
        item.domListeners?.forEach((off) => off());
      });
      heritageMarkersRef.current = [];
      if (markerClustererRef.current) {
        markerClustererRef.current.clearMarkers();
        markerClustererRef.current.setMap(null);
        markerClustererRef.current = null;
      }
      heritageInfoWindowRef.current?.close();
    };
  }, [isLoaded, mapReady, heritagePins]);

  // 폴리곤 표시/숨김 + 스타일 (selectedSet 변경 시)
  useEffect(() => {
    if (!isLoaded || !mapReady || !geoData.provinces || !geoData.municipalities)
      return;
    const map = mapRef.current;
    if (useGoogleBaseMap) {
      muniPolygonsRef.current.forEach((item) => item.poly.setMap(null));
      provincePolygonsRef.current.forEach((item) => item.poly.setMap(null));
      return;
    }
    const selected = selectedSet;
    const noneSelected = selected.size === 0;
    const coveredByMuni = new Set();

    muniPolygonsRef.current.forEach((item) => {
      let showMuni = false;
      let hideParent = true;
      if (COUNTRY_METRO_OVERRIDE[item.rname]) {
        if (selected.has(COUNTRY_METRO_OVERRIDE[item.rname])) {
          showMuni = true;
          hideParent = false;
        }
      } else if (selected.has(item.parent)) {
        showMuni = true;
      }
      if (showMuni) {
        if (hideParent) coveredByMuni.add(item.parent);
        item.poly.setMap(map);
        item.poly.setOptions({
          fillColor: COLOR_SELECTED,
          fillOpacity: 0.82,
          strokeColor: STROKE_COLOR,
          strokeWeight: STROKE_WEIGHT,
          strokeOpacity: 1,
        });
      } else {
        item.poly.setMap(null);
      }
    });

    provincePolygonsRef.current.forEach((item) => {
      const hideProvince = coveredByMuni.has(item.rname);
      const active =
        noneSelected || (selected.has(item.rname) && !hideProvince);
      if (hideProvince) {
        item.poly.setMap(null);
      } else {
        item.poly.setMap(map);
        item.poly.setOptions({
          fillColor: active ? (noneSelected ? COLOR_DEFAULT : COLOR_SELECTED) : COLOR_UNSELECTED,
          fillOpacity: active ? (noneSelected ? 0 : 0.8) : 0.03,
          strokeColor: active && selected.has(item.rname) ? STROKE_COLOR : "transparent",
          strokeWeight: STROKE_WEIGHT,
          strokeOpacity: 1,
        });
      }
    });
  }, [
    isLoaded,
    mapReady,
    geoData.provinces,
    geoData.municipalities,
    selectedSet,
    useGoogleBaseMap,
  ]);

  // 선택된 지역에 따라 map.minZoom / maxZoom 동적 변경
  // 미선택 시: MIN_ZOOM(8) ~ INIT_ZOOM+2(11) / 선택 시: preset zoom ~ 제한 없음
  useEffect(() => {
    if (!isLoaded || !mapReady || !mapRef.current) return;
    const selected = Array.from(selectedSet || []);
    if (selected.length > 0) {
      const effectiveKey = COUNTRY_METRO_OVERRIDE[selected[0]] || selected[0];
      const minZoom = mapFocusPreset[effectiveKey]?.zoom ?? mapFocusPreset[selected[0]]?.zoom ?? MIN_ZOOM;
      // maxZoom을 먼저 해제한 뒤 minZoom 적용 (순서 충돌 방지)
      mapRef.current.setOptions({ maxZoom: 21 });
      mapRef.current.setOptions({ minZoom });
    } else {
      // minZoom을 먼저 낮춘 뒤 maxZoom 적용
      mapRef.current.setOptions({ minZoom: MIN_ZOOM });
      mapRef.current.setOptions({ maxZoom: 9 });
    }
  }, [isLoaded, mapReady, selectedSet]);

  // province 폴리곤 생성
  useEffect(() => {
    if (!isLoaded || !mapReady || !mapRef.current || !geoData.provinces) return;
    const map = mapRef.current;
    const features = geoData.provinces?.features || [];
    provincePolygonsRef.current.forEach((item) => item.poly.setMap(null));
    provincePolygonsRef.current = [];

    features.forEach((f) => {
      const rname = f.properties?.NAME_1 || "";
      if (!rname) return;
      getPathsFromGeometry(f.geometry).forEach((path) => {
        const poly = new google.maps.Polygon({
          paths: path,
          map,
          fillColor: "transparent",
          fillOpacity: 0,
          strokeColor: "transparent",
          strokeWeight: 0,
          clickable: true,
          zIndex: 10,
        });
        poly.addListener("click", () => {
          const adding = !selectedSetRef.current.has(rname);
          selectSingleRegionByName(rname);
          if (adding) {
            scheduleFocusByRegionKey(rname, getRegionZoom(rname));
          } else {
            scheduleFocusByRegionKey(INITIAL_FOCUS_KEY, INIT_ZOOM);
          }
        });
        poly.addListener("mouseover", () =>
          document
            .getElementById("map-container")
            ?.style?.setProperty?.("cursor", "pointer")
        );
        poly.addListener("mouseout", () =>
          document
            .getElementById("map-container")
            ?.style?.setProperty?.("cursor", "")
        );
        provincePolygonsRef.current.push({ poly, rname });
      });
    });

    return () => {
      provincePolygonsRef.current.forEach((item) => item.poly.setMap(null));
      provincePolygonsRef.current = [];
    };
  }, [isLoaded, mapReady, geoData.provinces, selectSingleRegionByName, scheduleFocusByRegionKey]);

  // municipality 폴리곤 생성
  useEffect(() => {
    if (!isLoaded || !mapReady || !mapRef.current || !geoData.municipalities)
      return;
    const map = mapRef.current;
    const features = geoData.municipalities?.features || [];
    muniPolygonsRef.current.forEach((item) => item.poly.setMap(null));
    muniPolygonsRef.current = [];

    features.forEach((f) => {
      const p = f.properties;
      const parent = p?.NAME_1 || "";
      const rname = p?.NAME_2 || "";
      if (!parent || !rname) return;
      getPathsFromGeometry(f.geometry).forEach((path) => {
        const poly = new google.maps.Polygon({
          paths: path,
          map: null,
          fillColor: COLOR_SELECTED,
          fillOpacity: 0.5,
          strokeColor: STROKE_COLOR,
          strokeWeight: STROKE_WEIGHT,
          clickable: true,
          zIndex: 15,
        });
        poly.addListener("click", () => {
          const effectiveParent = COUNTRY_METRO_OVERRIDE[rname] || parent;
          const adding = !selectedSetRef.current.has(effectiveParent);
          selectSingleRegionByName(effectiveParent);
          if (adding) {
            scheduleFocusByRegionKey(effectiveParent, getRegionZoom(effectiveParent));
          } else {
            scheduleFocusByRegionKey(INITIAL_FOCUS_KEY, INIT_ZOOM);
          }
        });
        poly.addListener("mouseover", () =>
          document
            .getElementById("map-container")
            ?.style?.setProperty?.("cursor", "pointer")
        );
        poly.addListener("mouseout", () =>
          document
            .getElementById("map-container")
            ?.style?.setProperty?.("cursor", "")
        );
        muniPolygonsRef.current.push({ poly, rname, parent });
      });
    });

    return () => {
      muniPolygonsRef.current.forEach((item) => item.poly.setMap(null));
      muniPolygonsRef.current = [];
    };
  }, [isLoaded, mapReady, geoData.municipalities, selectSingleRegionByName, scheduleFocusByRegionKey]);

  useEffect(() => () => {
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (heritageZoomListenerRef.current) {
      google.maps.event.removeListener(heritageZoomListenerRef.current);
      heritageZoomListenerRef.current = null;
    }
    heritageMarkersRef.current.forEach((item) => {
      item.marker.map = null;
      item.domListeners?.forEach((off) => off());
    });
    heritageMarkersRef.current = [];
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
      markerClustererRef.current.setMap(null);
      markerClustererRef.current = null;
    }
    heritageInfoWindowRef.current?.close();
  }, []);

  // 초기 fitBounds — JSON 원본 bbox 그대로 사용
  useEffect(() => {
    if (!isLoaded || !mapReady || !mapRef.current || !geoData.bbox) return;
    const map = mapRef.current;
    const { do8 = [], metro = [] } = geoData.bbox;
    const cb = unionBounds([...do8, ...metro]);
    map.fitBounds(cb, FIT_PAD);
    google.maps.event.addListenerOnce(map, "idle", () => {
      map.setZoom(INIT_ZOOM);
    });
  }, [isLoaded, mapReady, geoData.bbox]);

  if (loadError) {
    return (
      <section className={sectionClass}>
        <h2 className="text-4xl lg:text-5xl font-bold font-title text-[#000D57] text-center tracking-tight mb-4">
          地域別の国宝探索
        </h2>
        <p className="text-gray-500 text-lg text-center mb-10">
          多くの人が訪れる韓国の代表的な文化遺産に出会いましょう
        </p>
        <div
          className="w-full bg-red-50 rounded-3xl border-2 border-red-200 flex items-center justify-center text-red-600"
          style={{ minHeight: 560, height: "80vh" }}
        >
          Google 地図の読み込みに失敗しました
        </div>
      </section>
    );
  }

  if (!isLoaded) {
    return (
      <section className={sectionClass}>
        <h2 className="text-4xl lg:text-5xl font-bold font-title text-[#000D57] text-center tracking-tight mb-4">
          地域別の国宝探索
        </h2>
        <p className="text-gray-500 text-lg text-center mb-10">
          多くの人が訪れる韓国の代表的な文化遺産に出会いましょう
        </p>
        <div
          className="w-full bg-gray-100 rounded-3xl flex items-center justify-center text-gray-600"
          style={{ minHeight: 560, height: "80vh" }}
        >
          Google 地図を読み込み中...
        </div>
      </section>
    );
  }

  if (geoError) {
    return (
      <section className={sectionClass}>
        <h2 className="text-4xl lg:text-5xl font-bold font-title text-[#000D57] text-center tracking-tight mb-4">
          地域別の国宝探索
        </h2>
        <p className="text-gray-500 text-lg text-center mb-10">
          多くの人が訪れる韓国の代表的な文化遺産に出会いましょう
        </p>
        <div
          className="w-full bg-amber-50 rounded-3xl border-2 border-amber-200 flex items-center justify-center text-amber-800 px-6 text-center"
          style={{ minHeight: 560, height: "80vh" }}
        >
          {geoError}
        </div>
      </section>
    );
  }

  return (
    <section className={sectionClass}>
      <h2 className="text-4xl lg:text-5xl font-bold font-title text-[#000D57] text-center tracking-tight mb-4">
        地域別の国宝探索
      </h2>
      <p className="text-gray-500 text-lg text-center mb-10">
        多くの人が訪れる韓国の代表的な文化遺産に出会いましょう
      </p>
      <div
        id="map-container"
        className="w-full rounded-3xl overflow-hidden border-2 border-gray-200 shadow-lg relative"
        style={{ minHeight: 560, height: "80vh" }}
      >
        {showTagBar && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-[92%] overflow-x-auto">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "max-content",
                minWidth: "100%",
                padding: "6px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.96)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              }}
            >
              {TAGS.map((tag) => {
                const isActive = activeTagIds.has(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() =>
                      setActiveTagIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(tag.id)) next.delete(tag.id);
                        else next.add(tag.id);
                        return next;
                      })
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 16px",
                      borderRadius: "99px",
                      border: isActive ? "none" : `1px solid ${TAG_COLORS.border}`,
                      background: isActive ? TAG_COLORS.navy : "white",
                      color: isActive ? "white" : TAG_COLORS.gray2,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>#{tag.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {/* 클러스터 클릭 시 목록 패널 */}
        {clusterListPins.length > 0 && (
          <div
            className="pin-detail-panel"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              bottom: "16px",
              width: "300px",
              zIndex: 40,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "rgba(255,255,255,0.97)",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
              backdropFilter: "blur(8px)",
              overflow: "hidden",
            }}
          >
            <div style={{
              padding: "14px 16px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#000D57" }}>
                {clusterListPins.length}件 の文化遺産
              </span>
              <button
                onClick={() => setClusterListPins([])}
                style={{
                  width: "28px", height: "28px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,0.45)",
                  color: "#fff",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", background: "#f9fafb" }}>
              {clusterListPins.map((pin) => (
                <button
                  key={pin.id}
                  onClick={() => handleClusterItemClick(pin)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    border: "none",
                    borderBottom: "1px solid #e5e7eb",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: "16px" }}>🗺️</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>
                      {pin.nameJa || pin.nameKo || "名称不明"}
                    </div>
                    {pin.nameKo && pin.nameJa && (
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                        {pin.nameKo}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 핀 클릭 상세 패널 */}
        {selectedPin && (
          <div
            key={selectedPin.id}
            className="pin-detail-panel"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              bottom: "16px",
              width: "300px",
              zIndex: 40,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "rgba(255,255,255,0.97)",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
              backdropFilter: "blur(8px)",
              overflow: "hidden",
            }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedPin(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 10,
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.45)",
                color: "#fff",
                fontSize: "14px",
                lineHeight: "1",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >✕</button>

            {/* 이미지 */}
            {selectedPin.thumbnail ? (
              <div style={{ width: "100%", height: "180px", flexShrink: 0, overflow: "hidden" }}>
                <img
                  src={selectedPin.thumbnail}
                  alt={selectedPin.nameKo || selectedPin.nameJa}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            ) : (
              <div style={{
                width: "100%", height: "120px", flexShrink: 0,
                background: "linear-gradient(135deg, #000D57 0%, #001a8c 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "36px" }}>📍</span>
              </div>
            )}

            {/* 본문 */}
            <div style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
              {/* 배지 */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "rgba(255,255,255,0.95)",
                padding: "4px 10px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e5e7eb",
                backdropFilter: "blur(8px)",
                marginBottom: "10px",
              }}>
                <span style={{ fontSize: "13px" }}>📍</span>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#000D57",
                  fontFamily: "'Noto Sans KR', sans-serif",
                }}>文化遺産</span>
              </div>

              {/* 제목 */}
              <h3 style={{
                fontSize: "17px",
                fontWeight: "700",
                color: "#1a1a1a",
                margin: "0 0 12px",
                letterSpacing: "-0.02em",
                lineHeight: "1.4",
                fontFamily: "'Noto Sans KR', sans-serif",
              }}>
                {selectedPin.nameJa || selectedPin.nameKo || "名称不明"}
              </h3>

              {selectedPin.nameKo && selectedPin.nameJa && (
                <p style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  margin: "0 0 14px",
                  fontFamily: "'Noto Sans KR', sans-serif",
                }}>{selectedPin.nameKo}</p>
              )}

              {/* 구분선 */}
              <div style={{ height: "1px", background: "#f0f0f0", margin: "0 0 14px" }} />

              {/* 지역 */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px" }}>🗺️</span>
                <span style={{
                  fontSize: "13px",
                  color: "#374151",
                  fontFamily: "'Noto Sans KR', sans-serif",
                }}>{selectedPin.regionKey || "—"}</span>
              </div>

              {/* 구분선 */}
              <div style={{ height: "1px", background: "#f0f0f0", margin: "0 0 16px" }} />

              {/* Google マップで開く 버튼 */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedPin.latitude},${selectedPin.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  width: "100%",
                  padding: "10px 0",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #000D57 0%, #001a8c 100%)",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                  fontFamily: "'Noto Sans KR', sans-serif",
                  boxShadow: "0 4px 12px rgba(0,13,87,0.25)",
                }}
              >
                <span>🗾</span> Googleマップで開く
              </a>
            </div>
          </div>
        )}

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={
            mapFocusPreset?.[INITIAL_FOCUS_KEY]?.center || {
              lat: 36.5,
              lng: 127.5,
            }
          }
          zoom={mapFocusPreset?.[INITIAL_FOCUS_KEY]?.zoom || INIT_ZOOM}
          options={{ backgroundColor: "#e8f4ff", mapId: mapConfig?.mapId || DEFAULT_MAP_ID }}
          onLoad={onMapLoad}
        />
      </div>
    </section>
  );
}

export default function MapSection() {
  const [apiKey, setApiKey] = useState("");
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState(null);
  const [mapConfig, setMapConfig] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const key = (data?.apiKey || "").trim();
        if (!key) {
          setConfigError("Google Maps API キーが設定されていません。");
        } else {
          setApiKey(key);
          setMapConfig({
            apiKey: key,
            mapId: (data?.mapId || "").trim() || DEFAULT_MAP_ID,
            endpoints: data?.endpoints || {
              bbox: "/api/maps/bbox",
              provinces: "/api/maps/provinces",
              municipalities: "/api/maps/municipalities",
              heritage: "/api/maps/heritage",
              imagesBase: "/img/korea",
            },
          });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setConfigError(
          "地図設定を取得できませんでした。バックエンドサーバーが起動しているか確認してください。"
        );
        console.error("[MapSection]", err);
      })
      .finally(() => {
        if (!cancelled) setConfigLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (configLoading) {
    return (
      <section className={sectionClass}>
        <h2 className="text-4xl lg:text-5xl font-bold font-title text-[#000D57] text-center tracking-tight mb-4">
          地域別の国宝探索
        </h2>
        <p className="text-gray-500 text-lg text-center mb-10">
          多くの人が訪れる韓国の代表的な文化遺産に出会いましょう
        </p>
        <div
          className="w-full bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500"
          style={{ minHeight: 560, height: "80vh" }}
        >
          地図を読み込み中...
        </div>
      </section>
    );
  }

  if (configError || !apiKey) {
    return (
      <section className={sectionClass}>
        <h2 className="text-4xl lg:text-5xl font-bold font-title text-[#000D57] text-center tracking-tight mb-4">
          地域別の国宝探索
        </h2>
        <p className="text-gray-500 text-lg text-center mb-10">
          多くの人が訪れる韓国の代表的な文化遺産に出会いましょう
        </p>
        <div
          className="w-full bg-amber-50 rounded-3xl border-2 border-amber-200 flex items-center justify-center text-amber-800 px-6 text-center"
          style={{ minHeight: 560, height: "80vh" }}
        >
          {configError}
        </div>
      </section>
    );
  }

  return <MapWithGoogle apiKey={apiKey} mapConfig={mapConfig} />;
}
