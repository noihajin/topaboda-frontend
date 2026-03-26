/**
 * 遺産リスト・ルート作成などで共有 — heritagelist/constants と同一の地域・分類コード
 */
import { REGION_CODE_MAP, TYPE_CODE_MAP_R } from "../components/heritagelist/constants.js";

export { REGIONS, REGION_CODE_MAP, CATEGORIES, TYPE_CODE_MAP, TYPE_CODE_MAP_R } from "../components/heritagelist/constants.js";

/**
 * heritage.theme は theme.id(ビット) の OR。themeIndex は選択した theme.id（文字列可）。
 * (placeMask & bit) !== 0 なら一致。
 */
export function matchesThemeCode(place, themeBit) {
  if (themeBit == null || themeBit === "") return true;
  const t = String(themeBit).trim();
  if (t === "" || t === "0") return true;
  try {
    const want = BigInt(t);
    if (want <= 0n) return true;
    const raw = place?.themeMask ?? place?.themeCode ?? 0;
    const code = BigInt(String(raw));
    return (code & want) !== 0n;
  } catch {
    return true;
  }
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
