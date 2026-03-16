import React, { useEffect, useState, useRef, useCallback } from "react";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import mapFocusPreset from "../data/mapFocusPreset.json";

const API_URL = "/api/maps/config";
const FIT_PAD = { top: 0, right: 0, bottom: 0, left: 0 };
const INIT_ZOOM = 8;
const DO8_SELECT_ZOOM = 10;
const METRO_SELECT_ZOOM = 12;
const TEST_AUTO_FOCUS_CYCLE = false;
const TEST_AUTO_FOCUS_INTERVAL_MS = 1000;
const CLICK_FOCUS_DELAY_MS = 180;
const INITIAL_FOCUS_KEY = "INITIAL";
const INITIAL_EXTRA_REGIONS = ["Gunwi"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1.5rem",
};

const sectionClass = "w-full px-[10%] pt-24 pb-0 scroll-mt-[11.9rem]";

const COLOR_DEFAULT = "#b8d4f0";
const COLOR_SELECTED = "#4da6ff";
const COLOR_UNSELECTED = "#d0d0d0";
const STROKE_COLOR = "#ffffff";
const STROKE_WEIGHT = 1.5;
const COUNTRY_METRO_OVERRIDE = { Gunwi: "Daegu" };

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

function sendMapDebugClick(payload) {
  // 프론트 디버그 로그 (브라우저 콘솔)
  console.log("[MAP_DEBUG_CLICK]", payload);
}
// 대하진
function parseBounds(r) {
  return {
    north: Number(r.north),
    south: Number(r.south),
    east: Number(r.east),
    west: Number(r.west),
  };
}

function unionBounds(rows) {
  const b = { north: -Infinity, south: Infinity, east: -Infinity, west: Infinity };
  rows.forEach((r) => {
    const x = parseBounds(r);
    if (x.north > b.north) b.north = x.north;
    if (x.south < b.south) b.south = x.south;
    if (x.east > b.east) b.east = x.east;
    if (x.west < b.west) b.west = x.west;
  });
  return b;
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

function MapWithGoogle({ apiKey, mapConfig }) {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const overlaysRef = useRef([]);
  const provincePolygonsRef = useRef([]);
  const muniPolygonsRef = useRef([]);

  // selectedSet의 최신 값을 클릭 핸들러에서 읽기 위한 ref (stale closure 방지)
  const selectedSetRef = useRef(new Set());
  const focusTimerRef = useRef(null);
  // 프론트 고정 포커스 JSON { region_name: { center, zoom } }
  const regionFocusRef = useRef(mapFocusPreset);

  const [selectedSet, setSelectedSet] = useState(new Set());
  const [geoData, setGeoData] = useState({ bbox: null, provinces: null, municipalities: null });
  const [geoError, setGeoError] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: "topaboda-map",
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
        if (!cancelled) setGeoData({ bbox, provinces, municipalities });
      })
      .catch((err) => {
        if (cancelled) return;
        setGeoError(err.message);
        console.error("[MapSection] GeoJSON 로드 실패:", err);
      });
    return () => { cancelled = true; };
  }, [mapConfig?.endpoints]);

  // selectedSetRef를 state와 동기화해 클릭 핸들러에서 최신 값 사용
  const toggleRegionByName = useCallback((rname) => {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(rname)) next.delete(rname);
      else next.add(rname);
      selectedSetRef.current = next;
      return next;
    });
  }, []);

  // key(region명/INITIAL) 기준 지연 포커싱
  const scheduleFocusByRegionKey = useCallback((regionKey, fallbackZoom = DO8_SELECT_ZOOM) => {
    if (!regionKey || !mapRef.current) return;
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    focusTimerRef.current = setTimeout(() => {
      const map = mapRef.current;
      if (!map) return;
      const focus = regionFocusRef.current?.[regionKey];
      if (!focus?.center) {
        console.warn("[MAP_DEBUG_CLICK] focus preset missing:", regionKey);
        return;
      }
      map.panTo(focus.center);
      map.setZoom(focus.zoom ?? fallbackZoom);
    }, CLICK_FOCUS_DELAY_MS);
  }, []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setupBlankMapType(map);
    map.setOptions({
      backgroundColor: "#e8f4ff",
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: "greedy",
      disableDefaultUI: true,
      minZoom: INIT_ZOOM,
    });
    setMapReady(true);
  }, []);

  // GroundOverlay 생성 + bbox 기반 포커스 맵 구성
  useEffect(() => {
    if (!isLoaded || !mapReady || !mapRef.current || !geoData.bbox) return;
    const map = mapRef.current;
    const { do8 = [], metro = [], country = [] } = geoData.bbox;
    const imagesBase = (mapConfig?.endpoints?.imagesBase || "/img/korea").replace(/\/$/, "");
    const extraRows = country.filter((r) => INITIAL_EXTRA_REGIONS.includes(r.region_name));
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
      if (!Number.isFinite(north) || !Number.isFinite(south) || !Number.isFinite(east) || !Number.isFinite(west)) return;
      if (north <= south || east <= west) return;
      const bounds = new google.maps.LatLngBounds({ lat: south, lng: west }, { lat: north, lng: east });
      const overlay = new google.maps.GroundOverlay(`${imagesBase}/${category}/${name}`, bounds, {
        map,
        opacity: 0.9,
        clickable: false,
        zIndex: isGunwiOverlay ? 9 : 5,
      });
      overlay.region_name = r.region_name;
      overlaysRef.current.push(overlay);
    });

    return () => {
      overlaysRef.current.forEach((o) => o.setMap(null));
      overlaysRef.current = [];
    };
  }, [isLoaded, mapReady, geoData.bbox, mapConfig?.endpoints?.imagesBase]);

  // 폴리곤 표시/숨김 + 스타일 (selectedSet 변경 시)
  useEffect(() => {
    if (!isLoaded || !mapReady || !geoData.provinces || !geoData.municipalities) return;
    const map = mapRef.current;
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
          fillOpacity: 0.5,
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
      const active = noneSelected || (selected.has(item.rname) && !hideProvince);
      if (hideProvince) {
        item.poly.setMap(null);
      } else {
        item.poly.setMap(map);
        item.poly.setOptions({
          fillColor: active ? (noneSelected ? COLOR_DEFAULT : COLOR_SELECTED) : COLOR_UNSELECTED,
          fillOpacity: active ? (noneSelected ? 0 : 0.4) : 0.15,
          strokeColor: active && selected.has(item.rname) ? STROKE_COLOR : "transparent",
          strokeWeight: STROKE_WEIGHT,
          strokeOpacity: 1,
        });
      }
    });
  }, [isLoaded, mapReady, geoData.provinces, geoData.municipalities, selectedSet]);

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
        poly.addListener("click", (e) => {
          const adding = !selectedSetRef.current.has(rname);
          toggleRegionByName(rname);
          if (adding) {
            const focus = regionFocusRef.current[rname];
            const payload = {
              clickType: "province",
              clickedRegion: rname,
              parentRegion: rname,
              selectedBefore: Array.from(selectedSetRef.current),
              selectedAction: "add",
              focusSource: "mapFocusPreset(parentRegion)",
              focusCenter: focus?.center || null,
              focusZoom: focus?.zoom ?? DO8_SELECT_ZOOM,
            };
            sendMapDebugClick(payload);
            scheduleFocusByRegionKey(payload.parentRegion, DO8_SELECT_ZOOM);
          } else {
            sendMapDebugClick({
              clickType: "province",
              clickedRegion: rname,
              parentRegion: rname,
              selectedBefore: Array.from(selectedSetRef.current),
              selectedAction: "remove",
              resetTo: INITIAL_FOCUS_KEY,
            });
            scheduleFocusByRegionKey(INITIAL_FOCUS_KEY, INIT_ZOOM);
          }
        });
        poly.addListener("mouseover", () =>
          document.getElementById("map-container")?.style?.setProperty?.("cursor", "pointer")
        );
        poly.addListener("mouseout", () =>
          document.getElementById("map-container")?.style?.setProperty?.("cursor", "")
        );
        provincePolygonsRef.current.push({ poly, rname });
      });
    });

    return () => {
      provincePolygonsRef.current.forEach((item) => item.poly.setMap(null));
      provincePolygonsRef.current = [];
    };
  }, [isLoaded, mapReady, geoData.provinces, toggleRegionByName, scheduleFocusByRegionKey]);

  // municipality 폴리곤 생성
  useEffect(() => {
    if (!isLoaded || !mapReady || !mapRef.current || !geoData.municipalities) return;
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
          toggleRegionByName(effectiveParent);
          if (adding) {
            const focus = regionFocusRef.current[effectiveParent];
            const payload = {
              clickType: "municipality",
              clickedRegion: rname,
              parentRegion: parent,
              effectiveParentRegion: effectiveParent,
              selectedBefore: Array.from(selectedSetRef.current),
              selectedAction: "add",
              focusSource: "mapFocusPreset(parentRegion/effectiveParentRegion)",
              focusCenter: focus?.center || null,
              focusZoom: focus?.zoom ?? DO8_SELECT_ZOOM,
            };
            sendMapDebugClick(payload);
            scheduleFocusByRegionKey(payload.effectiveParentRegion || payload.parentRegion, DO8_SELECT_ZOOM);
          } else {
            sendMapDebugClick({
              clickType: "municipality",
              clickedRegion: rname,
              parentRegion: parent,
              effectiveParentRegion: effectiveParent,
              selectedBefore: Array.from(selectedSetRef.current),
              selectedAction: "remove",
              resetTo: INITIAL_FOCUS_KEY,
            });
            scheduleFocusByRegionKey(INITIAL_FOCUS_KEY, INIT_ZOOM);
          }
        });
        poly.addListener("mouseover", () =>
          document.getElementById("map-container")?.style?.setProperty?.("cursor", "pointer")
        );
        poly.addListener("mouseout", () =>
          document.getElementById("map-container")?.style?.setProperty?.("cursor", "")
        );
        muniPolygonsRef.current.push({ poly, rname, parent });
      });
    });

    return () => {
      muniPolygonsRef.current.forEach((item) => item.poly.setMap(null));
      muniPolygonsRef.current = [];
    };
  }, [isLoaded, mapReady, geoData.municipalities, toggleRegionByName, scheduleFocusByRegionKey]);

  useEffect(() => () => {
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
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

  // 테스트용: mapFocusPreset 좌표를 1초마다 순환 이동
  useEffect(() => {
    if (!TEST_AUTO_FOCUS_CYCLE || !isLoaded || !mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const targets = Object.entries(mapFocusPreset)
      .map(([region, cfg]) => ({
        region,
        center: cfg?.center,
        zoom: cfg?.zoom,
      }))
      .filter((x) =>
        Number.isFinite(x?.center?.lat) &&
        Number.isFinite(x?.center?.lng) &&
        Number.isFinite(x?.zoom)
      );
    if (targets.length === 0) return;

    let idx = 0;
    const moveTo = (target) => {
      map.panTo(target.center);
      map.setZoom(target.zoom);
      console.log("[MAP_TEST_AUTO_FOCUS]", target.region, target.center, target.zoom);
    };

    moveTo(targets[0]);
    const timer = setInterval(() => {
      idx = (idx + 1) % targets.length;
      moveTo(targets[idx]);
    }, TEST_AUTO_FOCUS_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isLoaded, mapReady]);

  if (loadError) {
    return (
      <section className={sectionClass}>
        <h2 className="text-4xl lg:text-5xl font-bold font-title text-[#000D57] text-center tracking-tight mb-4">地域別の国宝探索</h2>
        <p className="text-gray-500 text-lg text-center mb-10">多くの人が訪れる韓国の代表的な文化遺産に出会いましょう</p>
        <div className="w-full bg-red-50 rounded-3xl border-2 border-red-200 flex items-center justify-center text-red-600" style={{ minHeight: 560, height: "80vh" }}>
          Google 地図の読み込みに失敗しました
        </div>
      </section>
    );
  }

  if (!isLoaded) {
    return (
      <section className={sectionClass}>
        <h2 className="text-4xl lg:text-5xl font-bold font-title text-[#000D57] text-center tracking-tight mb-4">地域別の国宝探索</h2>
        <p className="text-gray-500 text-lg text-center mb-10">多くの人が訪れる韓国の代表的な文化遺産に出会いましょう</p>
        <div className="w-full bg-gray-100 rounded-3xl flex items-center justify-center text-gray-600" style={{ minHeight: 560, height: "80vh" }}>
          Google 地図を読み込み中...
        </div>
      </section>
    );
  }

  if (geoError) {
    return (
      <section className={sectionClass}>
        <h2 className="text-4xl lg:text-5xl font-bold font-title text-[#000D57] text-center tracking-tight mb-4">地域別の国宝探索</h2>
        <p className="text-gray-500 text-lg text-center mb-10">多くの人が訪れる韓国の代表的な文化遺産に出会いましょう</p>
        <div className="w-full bg-amber-50 rounded-3xl border-2 border-amber-200 flex items-center justify-center text-amber-800 px-6 text-center" style={{ minHeight: 560, height: "80vh" }}>
          {geoError}
        </div>
      </section>
    );
  }

  return (
    <section className={sectionClass}>
      <h2 className="text-4xl lg:text-5xl font-bold font-title text-[#000D57] text-center tracking-tight mb-4">地域別の国宝探索</h2>
      <p className="text-gray-500 text-lg text-center mb-10">多くの人が訪れる韓国の代表的な文化遺産に出会いましょう</p>
      <div
        id="map-container"
        className="w-full rounded-3xl overflow-hidden border-2 border-gray-200 shadow-lg relative"
        style={{ minHeight: 560, height: "80vh" }}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapFocusPreset?.[INITIAL_FOCUS_KEY]?.center || { lat: 36.5, lng: 127.5 }}
          zoom={mapFocusPreset?.[INITIAL_FOCUS_KEY]?.zoom || INIT_ZOOM}
          options={{ backgroundColor: "#e8f4ff" }}
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
            endpoints: data?.endpoints || {
              bbox: "/api/maps/bbox",
              provinces: "/api/maps/provinces",
              municipalities: "/api/maps/municipalities",
              imagesBase: "/img/korea",
            },
          });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setConfigError("地図設定を取得できませんでした。バックエンドサーバーが起動しているか確認してください。");
        console.error("[MapSection]", err);
      })
      .finally(() => {
        if (!cancelled) setConfigLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (configLoading) {
    return (
      <section className={sectionClass}>
        <h2 className="text-4xl lg:text-5xl font-bold font-title text-[#000D57] text-center tracking-tight mb-4">地域別の国宝探索</h2>
        <p className="text-gray-500 text-lg text-center mb-10">多くの人が訪れる韓国の代表的な文化遺産に出会いましょう</p>
        <div className="w-full bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500" style={{ minHeight: 560, height: "80vh" }}>
          地図を読み込み中...
        </div>
      </section>
    );
  }

  if (configError || !apiKey) {
    return (
      <section className={sectionClass}>
        <h2 className="text-4xl lg:text-5xl font-bold font-title text-[#000D57] text-center tracking-tight mb-4">地域別の国宝探索</h2>
        <p className="text-gray-500 text-lg text-center mb-10">多くの人が訪れる韓国の代表的な文化遺産に出会いましょう</p>
        <div className="w-full bg-amber-50 rounded-3xl border-2 border-amber-200 flex items-center justify-center text-amber-800 px-6 text-center" style={{ minHeight: 560, height: "80vh" }}>
          {configError}
        </div>
      </section>
    );
  }

  return <MapWithGoogle apiKey={apiKey} mapConfig={mapConfig} />;
}
