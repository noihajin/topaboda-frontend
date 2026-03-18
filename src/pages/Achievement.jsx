import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── カラートークン ──
const C = {
  navy: "#000D57",
  red: "#6E0000",
  gold: "#CACA00",
  goldDark: "#DAA520",
  silver: "#A0A0A0",
  bronze: "#CD7F32",
  bg: "#F3F3F5",
  white: "#FFFFFF",
  border: "#E5E7EB",
  text: "#1A1A2E",
  sub: "#6B7280",
};

const font = "'Noto Sans JP', 'Roboto', sans-serif";
const fontSerif = "'Noto Serif JP', serif";

// ── モックデータ ──
const MOCK_ACHIEVEMENTS = [
  {
    id: 1,
    title: "国宝探訪者",
    description: "国宝に指定された文化遺産を50か所訪問した達成者に贈られる称号です。",
    grade: "金",
    criteria: "国宝訪問",
    current: 50,
    total: 50,
    achieved: true,
    date: "2024.08.15",
    emoji: "🥇",
  },
  {
    id: 2,
    title: "遺産の守護者",
    description: "ユネスコ世界遺産に登録された韓国の遺産をすべて訪問した方に授与されます。",
    grade: "金",
    criteria: "世界遺産訪問",
    current: 16,
    total: 16,
    achieved: true,
    date: "2024.06.03",
    emoji: "🥇",
  },
  {
    id: 3,
    title: "文化探求者",
    description: "宝物に指定された文化遺産を30か所訪問した達成者に贈られる称号です。",
    grade: "銀",
    criteria: "宝物訪問",
    current: 30,
    total: 30,
    achieved: true,
    date: "2024.05.20",
    emoji: "🥈",
  },
  {
    id: 4,
    title: "首都の歴史人",
    description: "ソウルにある主要な文化遺産を20か所訪問した達成者に贈られます。",
    grade: "銀",
    criteria: "ソウル遺産訪問",
    current: 20,
    total: 20,
    achieved: true,
    date: "2024.04.11",
    emoji: "🥈",
  },
  {
    id: 5,
    title: "慶州の旅人",
    description: "慶州にある文化遺産を15か所以上訪問した達成者に贈られる称号です。",
    grade: "銀",
    criteria: "慶州遺産訪問",
    current: 15,
    total: 15,
    achieved: true,
    date: "2024.03.29",
    emoji: "🥈",
  },
  {
    id: 6,
    title: "自然の守り人",
    description: "天然記念物に指定された自然遺産を10か所訪問した達成者に授与されます。",
    grade: "銀",
    criteria: "天然記念物訪問",
    current: 10,
    total: 10,
    achieved: true,
    date: "2024.02.14",
    emoji: "🥈",
  },
  {
    id: 7,
    title: "初めての一歩",
    description: "初めて文化遺産を訪問した全てのユーザーに贈られる記念バッジです。",
    grade: "銅",
    criteria: "初回訪問",
    current: 1,
    total: 1,
    achieved: true,
    date: "2023.11.02",
    emoji: "🥉",
  },
  {
    id: 8,
    title: "無形文化の継承者",
    description: "無形文化遺産を20か所訪問した達成者に贈られます。まだ道半ばです。",
    grade: "金",
    criteria: "無形遺産訪問",
    current: 12,
    total: 20,
    achieved: false,
    date: null,
    emoji: "🥇",
  },
  {
    id: 9,
    title: "全国制覇の旅人",
    description: "韓国全17の広域市・道の文化遺産を訪問した達成者に授与される最高の称号。",
    grade: "金",
    criteria: "全地域訪問",
    current: 9,
    total: 17,
    achieved: false,
    date: null,
    emoji: "🥇",
  },
  {
    id: 10,
    title: "民俗文化の探求者",
    description: "民俗文化財に指定された遺産を15か所訪問すると獲得できます。",
    grade: "銀",
    criteria: "民俗文化財訪問",
    current: 7,
    total: 15,
    achieved: false,
    date: null,
    emoji: "🥈",
  },
  {
    id: 11,
    title: "史跡踏破者",
    description: "史跡に指定された遺産を40か所訪問した達成者に贈られます。",
    grade: "銀",
    criteria: "史跡訪問",
    current: 18,
    total: 40,
    achieved: false,
    date: null,
    emoji: "🥈",
  },
  {
    id: 12,
    title: "週末の冒険家",
    description: "週末に10回以上文化遺産を訪問した達成者に贈られる称号です。",
    grade: "銅",
    criteria: "週末訪問",
    current: 6,
    total: 10,
    achieved: false,
    date: null,
    emoji: "🥉",
  },
];

const ITEMS_PER_PAGE = 6;

// ── 円形プログレスリング ──
function CircleProgress({ percent = 70, size = 140, strokeWidth = 10 }) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.red} />
          <stop offset="100%" stopColor={C.gold} />
        </linearGradient>
      </defs>
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="url(#progressGrad)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── 個別バッジ統計カード ──
function BadgeStat({ emoji, grade, count, color }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, background: "rgba(255,255,255,0.7)", borderRadius: 16,
      padding: "14px 22px", border: `1px solid ${color}30`,
    }}>
      <span style={{ fontSize: 28 }}>{emoji}</span>
      <span style={{ fontSize: 22, fontWeight: 900, color, fontFamily: font }}>{count}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.sub, fontFamily: font, letterSpacing: 1 }}>{grade}</span>
    </div>
  );
}

// ── 進捗バー ──
function ProgressBar({ current, total }) {
  const pct = Math.min((current / total) * 100, 100);
  const done = pct >= 100;
  return (
    <div style={{ width: "100%" }}>
      <div style={{
        height: 8, borderRadius: 99, background: "#E5E7EB", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: done
            ? `linear-gradient(90deg, ${C.red}, ${C.gold})`
            : `linear-gradient(90deg, ${C.red}, #e05c00)`,
          borderRadius: 99,
          transition: "width 0.6s ease",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
        <span style={{ fontSize: 12, color: C.sub, fontFamily: font, fontWeight: 600 }}>
          {current} / {total}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: font, color: done ? C.gold : C.red }}>
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

// ── メダルカラー取得 ──
function getMedalColor(grade) {
  if (grade === "金") return C.gold;
  if (grade === "銀") return C.silver;
  if (grade === "銅") return C.bronze;
  return C.sub;
}

// ── 業績カード ──
function AchievementCard({ item }) {
  const medalColor = getMedalColor(item.grade);
  const cardBg = item.achieved
    ? "linear-gradient(135deg, #fffdf0 0%, #fff8e1 60%, #fffde7 100%)"
    : C.white;
  const borderColor = item.achieved ? C.gold : C.border;

  return (
    <div style={{
      background: cardBg,
      border: `2px solid ${borderColor}`,
      borderRadius: 24,
      padding: "28px 28px 24px",
      display: "flex",
      gap: 24,
      alignItems: "flex-start",
      transition: "box-shadow 0.3s, transform 0.3s",
      boxShadow: item.achieved
        ? "0 4px 20px rgba(202,202,0,0.12)"
        : "0 2px 10px rgba(0,0,0,0.04)",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = item.achieved
        ? "0 8px 32px rgba(202,202,0,0.22)"
        : "0 6px 20px rgba(0,0,0,0.10)";
      e.currentTarget.style.transform = "translateY(-3px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = item.achieved
        ? "0 4px 20px rgba(202,202,0,0.12)"
        : "0 2px 10px rgba(0,0,0,0.04)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
    >
      {/* メダルアイコン */}
      <div style={{
        width: 72, height: 72, flexShrink: 0,
        borderRadius: 20,
        background: item.achieved
          ? `linear-gradient(135deg, ${medalColor}30, ${medalColor}10)`
          : "#F3F3F5",
        border: `2px solid ${item.achieved ? medalColor + "60" : C.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 36,
        opacity: item.achieved ? 1 : 0.45,
      }}>
        {item.emoji}
      </div>

      {/* コンテンツ */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* タイトル行 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
          <h3 style={{
            margin: 0, fontSize: 18, fontWeight: 900,
            fontFamily: fontSerif, color: C.navy,
            opacity: item.achieved ? 1 : 0.5,
          }}>
            {item.title}
          </h3>
          {item.achieved && (
            <span style={{
              background: `linear-gradient(90deg, ${C.gold}, ${C.goldDark})`,
              color: C.navy, fontSize: 11, fontWeight: 900,
              padding: "3px 12px", borderRadius: 99,
              fontFamily: font, letterSpacing: 0.5,
            }}>
              獲得済み
            </span>
          )}
          <span style={{
            background: item.achieved ? `${medalColor}20` : "#F3F3F5",
            color: item.achieved ? medalColor : C.sub,
            border: `1px solid ${item.achieved ? medalColor + "50" : C.border}`,
            fontSize: 12, fontWeight: 800,
            padding: "3px 10px", borderRadius: 99,
            fontFamily: font,
          }}>
            {item.emoji} {item.grade}メダル
          </span>
          {item.achieved && item.date && (
            <span style={{ fontSize: 12, color: C.sub, fontFamily: font, marginLeft: "auto" }}>
              {item.date} 獲得
            </span>
          )}
        </div>

        {/* 説明文 */}
        <p style={{
          margin: "0 0 14px", fontSize: 13.5, lineHeight: 1.7,
          color: item.achieved ? "#444" : C.sub,
          fontFamily: font,
        }}>
          {item.description}
        </p>

        {/* 達成基準 + 進捗バー */}
        <div style={{
          background: item.achieved ? "rgba(255,255,255,0.6)" : "#F8F9FC",
          border: `1px solid ${item.achieved ? C.gold + "40" : C.border}`,
          borderRadius: 12, padding: "12px 16px",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.sub, fontFamily: font, marginBottom: 8 }}>
            達成基準 ：{item.criteria} {item.current}/{item.total}
          </div>
          <ProgressBar current={item.current} total={item.total} />
        </div>
      </div>
    </div>
  );
}

// ── メインページ ──
export default function Achievement() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("すべて");

  const FILTERS = ["すべて", "獲得済み", "未獲得", "🥇 金", "🥈 銀", "🥉 銅"];

  const filtered = MOCK_ACHIEVEMENTS.filter((a) => {
    if (filter === "獲得済み") return a.achieved;
    if (filter === "未獲得") return !a.achieved;
    if (filter === "🥇 金") return a.grade === "金";
    if (filter === "🥈 銀") return a.grade === "銀";
    if (filter === "🥉 銅") return a.grade === "銅";
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const achievedCount = MOCK_ACHIEVEMENTS.filter((a) => a.achieved).length;
  const totalCount = MOCK_ACHIEVEMENTS.length;
  const progressPct = Math.round((achievedCount / totalCount) * 100);
  const goldCount = MOCK_ACHIEVEMENTS.filter((a) => a.achieved && a.grade === "金").length;
  const silverCount = MOCK_ACHIEVEMENTS.filter((a) => a.achieved && a.grade === "銀").length;
  const bronzeCount = MOCK_ACHIEVEMENTS.filter((a) => a.achieved && a.grade === "銅").length;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: font }}>
      {/* ── ヒーローヘッダー ── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, #001a6e 50%, #0a2280 100%)`,
        paddingTop: 140, paddingBottom: 80,
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* 装飾 */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: `${C.gold}08`, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 300, height: 300, borderRadius: "50%",
          background: `${C.red}10`, pointerEvents: "none",
        }} />

        <span style={{
          display: "inline-block",
          background: `${C.gold}20`, color: C.gold,
          padding: "6px 20px", borderRadius: 99,
          fontSize: 11, fontWeight: 900, letterSpacing: 2,
          textTransform: "uppercase", marginBottom: 18, border: `1px solid ${C.gold}40`,
        }}>
          ACHIEVEMENTS
        </span>
        <h1 style={{
          color: C.white, fontSize: 42, fontWeight: 900,
          fontFamily: fontSerif, margin: "0 0 12px",
          letterSpacing: -0.5,
        }}>
          全ての業績
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, margin: 0, fontFamily: font }}>
          文化遺産探訪の記録と達成度
        </p>
      </div>

      {/* ── サマリーカード ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
        <div style={{
          background: C.white, borderRadius: 28,
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          padding: "40px 48px",
          display: "flex", alignItems: "center", gap: 48,
          marginTop: -48, marginBottom: 48,
          flexWrap: "wrap",
        }}>
          {/* 円形プログレス */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <CircleProgress percent={progressPct} size={140} strokeWidth={12} />
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: C.navy, fontFamily: font, lineHeight: 1 }}>
                {progressPct}%
              </span>
              <span style={{ fontSize: 11, color: C.sub, fontWeight: 700, marginTop: 4, fontFamily: font }}>
                達成率
              </span>
            </div>
          </div>

          {/* 区切り線 */}
          <div style={{ width: 1, height: 80, background: C.border, flexShrink: 0 }} />

          {/* バッジ統計 */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 26, fontWeight: 900, color: C.navy, fontFamily: fontSerif }}>
                {achievedCount}
              </span>
              <span style={{ fontSize: 14, color: C.sub, fontWeight: 700, fontFamily: font, marginLeft: 8 }}>
                獲得バッジ
              </span>
              <span style={{ fontSize: 13, color: C.sub, fontFamily: font, marginLeft: 8 }}>
                / 全 {totalCount} 業績
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <BadgeStat emoji="🥇" grade="金メダル" count={goldCount} color={C.gold} />
              <BadgeStat emoji="🥈" grade="銀メダル" count={silverCount} color={C.silver} />
              <BadgeStat emoji="🥉" grade="銅メダル" count={bronzeCount} color={C.bronze} />
            </div>
          </div>

          {/* マイページボタン */}
          <button
            onClick={() => navigate("/mypage")}
            style={{
              background: "transparent", border: `2px solid ${C.navy}`,
              color: C.navy, padding: "12px 24px", borderRadius: 12,
              fontWeight: 700, fontSize: 14, fontFamily: font,
              cursor: "pointer", flexShrink: 0,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = C.navy;
              e.currentTarget.style.color = C.white;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = C.navy;
            }}
          >
            ← マイページに戻る
          </button>
        </div>

        {/* ── フィルター ── */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              style={{
                padding: "9px 20px", borderRadius: 99,
                border: `1.5px solid ${filter === f ? C.navy : C.border}`,
                background: filter === f ? C.navy : C.white,
                color: filter === f ? C.white : C.sub,
                fontWeight: 700, fontSize: 13, fontFamily: font,
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                if (filter !== f) {
                  e.currentTarget.style.borderColor = C.navy;
                  e.currentTarget.style.color = C.navy;
                }
              }}
              onMouseLeave={e => {
                if (filter !== f) {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.color = C.sub;
                }
              }}
            >
              {f}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 13, color: C.sub, fontFamily: font, alignSelf: "center" }}>
            {filtered.length} 件
          </span>
        </div>

        {/* ── 業績リスト ── */}
        {paginated.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 0",
            color: C.sub, fontSize: 16, fontFamily: font,
          }}>
            該当する業績はありません。
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 48 }}>
            {paginated.map((item) => (
              <AchievementCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* ── ページネーション ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, paddingBottom: 80 }}>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                border: `1.5px solid ${C.border}`,
                background: C.white, cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.4 : 1,
                fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                style={{
                  width: 38, height: 38, borderRadius: "50%",
                  border: `1.5px solid ${page === n ? C.navy : C.border}`,
                  background: page === n ? C.navy : C.white,
                  color: page === n ? C.white : C.sub,
                  fontWeight: 700, fontSize: 14, fontFamily: font,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                border: `1.5px solid ${C.border}`,
                background: C.white, cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.4 : 1,
                fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
