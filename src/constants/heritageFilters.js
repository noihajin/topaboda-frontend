/**
 * 遺産リスト・ルート作成などで共有 — heritagelist/constants と同一の地域・分類コード
 */
import { REGION_CODE_MAP, TYPE_CODE_MAP_R } from "../components/heritagelist/constants.js";

export { REGIONS, REGION_CODE_MAP, CATEGORIES, TYPE_CODE_MAP, TYPE_CODE_MAP_R } from "../components/heritagelist/constants.js";

/**
 * GET /api/maps/heritage の themeCode（DB heritage.theme 単一値）と一致するか。
 * 旧レスポンスの themeMask 名は後方互換のため参照するが、値はビットマスクではない。
 */
export function matchesThemeCode(place, themeIndex) {
  if (themeIndex == null || themeIndex === "" || Number(themeIndex) < 1) return true;
  const want = Number(themeIndex);
  if (Number.isNaN(want)) return true;
  const code = Number(place?.themeCode ?? place?.themeMask ?? 0);
  return code === want;
}

/** 地域コード(例 11) → フィルタ用ラベル(例 ソウル)。一致しなければ null */
export function regionLabelFromRegionCode(code) {
  const c = String(code ?? "").trim();
  if (!c) return null;
  const found = Object.entries(REGION_CODE_MAP).find(([, v]) => v === c);
  return found ? found[0] : null;
}

/** ccba_kdcd(例 "11") → 種別ラベル(例 国宝)。一致しなければ null */
export function categoryLabelFromKdcd(kd) {
  const k = String(kd ?? "").trim();
  if (!k) return null;
  return TYPE_CODE_MAP_R[k] ?? null;
}
