import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

// ── フィグマメダル画像 (node 1857-2258より) ──
const MEDAL_IMG_GOLD   = "https://www.figma.com/api/mcp/asset/957a3774-c31f-43e0-954d-aab098bc294c";
const MEDAL_IMG_SILVER = "https://www.figma.com/api/mcp/asset/701eea58-d86c-4cc1-b8da-deb09d7d608a";
const MEDAL_IMG_BRONZE = "https://www.figma.com/api/mcp/asset/6001625a-0a5c-44ae-908d-a9f8aa3bdb36";

// ── カラートークン ──
const C = {
  navy:    "#000D57",
  red:     "#6E0000",
  gold:    "#CACA00",
  goldDark:"#DAA520",
  silver:  "#C0C0C0",
  bronze:  "#CD7F32",
  bg:      "#F3F3F5",
  white:   "#FFFFFF",
  border:  "#E5E7EB",
  text:    "#1A1A2E",
  sub:     "#6B7280",
};

const font      = "'Noto Sans JP', 'Roboto', sans-serif";
const fontSerif = "'Noto Serif JP', serif";

function getMedalImg(grade) {
  if (grade === "金") return MEDAL_IMG_GOLD;
  if (grade === "銀") return MEDAL_IMG_SILVER;
  return MEDAL_IMG_BRONZE;
}
function getMedalColor(grade) {
  if (grade === "金") return C.gold;
  if (grade === "銀") return C.silver;
  return C.bronze;
}

// ── モックデータ 16件 ──
const MOCK_ACHIEVEMENTS = [
  {
    id: 1,
    title: "国宝探訪者",
    description: "国宝に指定された文化遺産を50か所訪問した達成者に贈られる称号です。",
    grade: "金",
    criteriaLabel: "国宝訪問",
    current: 50, total: 50,
    achieved: true,
    date: "2024.08.15",
  },
  {
    id: 2,
    title: "遺産の守護者",
    description: "ユネスコ世界遺産に登録された韓国の遺産をすべて訪問した方に授与されます。",
    grade: "金",
    criteriaLabel: "世界遺産訪問",
    current: 16, total: 16,
    achieved: true,
    date: "2024.06.03",
  },
  {
    id: 3,
    title: "文化探求者",
    description: "宝物に指定された文化遺産を30か所訪問した達成者に贈られる称号です。",
    grade: "銀",
    criteriaLabel: "宝物訪問",
    current: 30, total: 30,
    achieved: true,
    date: "2024.05.20",
  },
  {
    id: 4,
    title: "首都の歴史人",
    description: "ソウルにある主要な文化遺産を20か所訪問した達成者に贈られます。",
    grade: "銀",
    criteriaLabel: "ソウル遺産訪問",
    current: 20, total: 20,
    achieved: true,
    date: "2024.04.11",
  },
  {
    id: 5,
    title: "慶州の旅人",
    description: "慶州にある文化遺産を15か所以上訪問した達成者に贈られる称号です。",
    grade: "銀",
    criteriaLabel: "慶州遺産訪問",
    current: 15, total: 15,
    achieved: true,
    date: "2024.03.29",
  },
  {
    id: 6,
    title: "自然の守り人",
    description: "天然記念物に指定された自然遺産を10か所訪問した達成者に授与されます。",
    grade: "銀",
    criteriaLabel: "天然記念物訪問",
    current: 10, total: 10,
    achieved: true,
    date: "2024.02.14",
  },
  {
    id: 7,
    title: "朝鮮王朝の探検家",
    description: "朝鮮時代の宮殿と王陵をすべて訪問した達成者に贈られる称号です。",
    grade: "銀",
    criteriaLabel: "朝鮮遺産訪問",
    current: 25, total: 25,
    achieved: true,
    date: "2024.01.07",
  },
  {
    id: 8,
    title: "初めての一歩",
    description: "初めて文化遺産を訪問した全てのユーザーに贈られる記念バッジです。",
    grade: "銅",
    criteriaLabel: "初回訪問",
    current: 1, total: 1,
    achieved: true,
    date: "2023.11.02",
  },
  {
    id: 9,
    title: "無形文化の継承者",
    description: "無形文化遺産を20か所訪問すると獲得できます。まだ道半ばです。",
    grade: "金",
    criteriaLabel: "無形遺産訪問",
    current: 12, total: 20,
    achieved: false,
    date: null,
  },
  {
    id: 10,
    title: "全国制覇の旅人",
    description: "韓国全17の広域市・道の文化遺産を訪問した達成者に授与される最高の称号。",
    grade: "金",
    criteriaLabel: "全地域訪問",
    current: 9, total: 17,
    achieved: false,
    date: null,
  },
  {
    id: 11,
    title: "コミュニティリーダー",
    description: "コミュニティ投稿を100件以上作成した達成者に贈られるバッジです。",
    grade: "金",
    criteriaLabel: "投稿作成",
    current: 32, total: 100,
    achieved: false,
    date: null,
  },
  {
    id: 12,
    title: "民俗文化の探求者",
    description: "民俗文化財に指定された遺産を15か所訪問すると獲得できます。",
    grade: "銀",
    criteriaLabel: "民俗文化財訪問",
    current: 7, total: 15,
    achieved: false,
    date: null,
  },
  {
    id: 13,
    title: "史跡踏破者",
    description: "史跡に指定された遺産を40か所訪問した達成者に贈られます。",
    grade: "銀",
    criteriaLabel: "史跡訪問",
    current: 18, total: 40,
    achieved: false,
    date: null,
  },
  {
    id: 14,
    title: "週末の冒険家",
    description: "週末に10回以上文化遺産を訪問した達成者に贈られる称号です。",
    grade: "銅",
    criteriaLabel: "週末訪問",
    current: 6, total: 10,
    achieved: false,
    date: null,
  },
  {
    id: 15,
    title: "写真記録者",
    description: "訪問した文化遺産の写真を30枚以上投稿した達成者に贈られます。",
    grade: "銅",
    criteriaLabel: "写真投稿",
    current: 15, total: 30,
    achieved: false,
    date: null,
  },
  {
    id: 16,
    title: "レビュー貢献者",
    description: "文化遺産のレビューを20件以上投稿した達成者に贈られる称号です。",
    grade: "銅",
    criteriaLabel: "レビュー投稿",
    current: 8, total: 20,
    achieved: false,
    date: null,
  },
];

const ITEMS_PER_PAGE = 4;

// ── 円形プログレスリング ──
function CircleProgress({ percent = 70, size = 160, strokeWidth = 12 }) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.red} />
          <stop offset="100%" stopColor="#DAA520" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} />
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

// ── バッジ統計ミニカード ──
function BadgeStat({ label, count, color, borderColor, bgGrad }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, background: bgGrad,
      borderRadius: 12, padding: "12px 18px",
      border: `1px solid ${borderColor}`,
      minWidth: 60,
    }}>
      <span style={{ fontSize: 22, fontWeight: 900, color, fontFamily: font, lineHeight: 1 }}>{count}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.sub, fontFamily: font }}>{label}</span>
    </div>
  );
}

// ── 進捗バー ──
function ProgressBar({ current, total }) {
  const pct = Math.min((current / total) * 100, 100);
  const done = pct >= 100;
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: C.sub, fontFamily: font, fontWeight: 600 }}>進行度</span>
        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: font, color: done ? "#DAA520" : C.red }}>
          {Math.round(pct)}%
        </span>
      </div>
      <div style={{ height: 10, borderRadius: 99, background: "#E5E7EB", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: done
            ? "linear-gradient(90deg, #6E0000 0%, #8B1A1A 20%, #B05A1A 60%, #DAA520 100%)"
            : "linear-gradient(90deg, #6E0000, #B03010)",
          borderRadius: 99,
          boxShadow: done ? "0 0 8px rgba(218,165,32,0.4)" : "none",
          transition: "width 0.6s ease",
        }} />
      </div>
      <div style={{ marginTop: 5, fontSize: 12, color: C.red, fontWeight: 700, fontFamily: font }}>
        {current} / {total}
      </div>
    </div>
  );
}

// ── 業績カード ──
function AchievementCard({ item }) {
  const medalColor = getMedalColor(item.grade);
  const medalImg   = getMedalImg(item.grade);

  const cardBg = item.achieved
    ? "linear-gradient(90deg, #FFFEF5 0%, #FFFEF8 33%, #FFFFFA 66%, #FFFFFF 100%)"
    : C.white;
  const borderColor = item.achieved ? C.gold : C.border;

  return (
    <div
      style={{
        background: cardBg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 16,
        padding: "26px 28px",
        display: "flex", gap: 28, alignItems: "flex-start",
        boxShadow: item.achieved
          ? "0 8px 16px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.06)"
          : "none",
        transition: "transform 0.25s, box-shadow 0.25s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = item.achieved
          ? "0 14px 28px rgba(202,202,0,0.18), 0 6px 12px rgba(0,0,0,0.08)"
          : "0 6px 18px rgba(0,0,0,0.09)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = item.achieved
          ? "0 8px 16px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.06)"
          : "none";
      }}
    >
      {/* メダル画像 */}
      <div style={{
        width: 140, height: 140, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: item.achieved ? 1 : 0.5,
      }}>
        <img
          src={medalImg}
          alt={`${item.grade}メダル`}
          style={{
            width: "100%", height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* コンテンツ */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* タイトル行 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
          <h3 style={{
            margin: 0, fontSize: 18, fontWeight: 900,
            fontFamily: fontSerif,
            color: item.achieved ? C.navy : C.sub,
          }}>
            {item.title}
          </h3>
          {item.achieved && (
            <span style={{
              background: C.gold, color: C.navy,
              fontSize: 11, fontWeight: 900,
              padding: "3px 11px", borderRadius: 99, fontFamily: font,
            }}>
              獲得済み
            </span>
          )}
        </div>

        {/* メダル種別 + 日付 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 13, fontWeight: 700, fontFamily: font,
            color: item.achieved ? medalColor : "#B0B0B0",
          }}>
            {item.grade === "金" ? "🥇" : item.grade === "銀" ? "🥈" : "🥉"} {item.grade}メダル
          </span>
          {item.achieved && item.date && (
            <span style={{ fontSize: 12, color: C.sub, fontFamily: font }}>
              📅 {item.date} 獲得
            </span>
          )}
        </div>

        {/* 説明文 */}
        <p style={{
          margin: "0 0 14px", fontSize: 13.5, lineHeight: 1.7,
          color: item.achieved ? "#4A5565" : C.sub,
          fontFamily: font,
        }}>
          {item.description}
        </p>

        {/* 進捗バー */}
        <ProgressBar current={item.current} total={item.total} />
      </div>
    </div>
  );
}

// ── メインページ ──
export default function Achievement() {
  const navigate  = useNavigate();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(MOCK_ACHIEVEMENTS.length / ITEMS_PER_PAGE);
  const paginated  = MOCK_ACHIEVEMENTS.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const achievedCount = MOCK_ACHIEVEMENTS.filter(a => a.achieved).length;
  const totalCount    = MOCK_ACHIEVEMENTS.length;
  const progressPct   = Math.round((achievedCount / totalCount) * 100);
  const goldCount     = MOCK_ACHIEVEMENTS.filter(a => a.achieved && a.grade === "金").length;
  const silverCount   = MOCK_ACHIEVEMENTS.filter(a => a.achieved && a.grade === "銀").length;
  const bronzeCount   = MOCK_ACHIEVEMENTS.filter(a => a.achieved && a.grade === "銅").length;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: font }}>

      {/* ── ヒーローバナー ── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, #001a6e 50%, #0a2280 100%)`,
        paddingTop: 140, paddingBottom: 72,
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
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
          textTransform: "uppercase", marginBottom: 18,
          border: `1px solid ${C.gold}40`,
        }}>
          ACHIEVEMENTS
        </span>
        <h1 style={{
          color: C.white, fontSize: 42, fontWeight: 900,
          fontFamily: fontSerif, margin: "0 0 12px", letterSpacing: -0.5,
        }}>
          全ての業績
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, margin: 0, fontFamily: font }}>
          文化遺産探訪の記録と達成度
        </p>
      </div>

      {/* ── コンテンツ ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px 80px" }}>

        {/* ── サマリーカード ── */}
        <div style={{
          background: C.white,
          borderRadius: 20,
          boxShadow: "0 2px 6px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
          padding: "36px 44px",
          display: "flex", alignItems: "center", gap: 48,
          flexWrap: "wrap",
          marginBottom: 40,
        }}>
          {/* タイトル + 円形プログレス */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            <p style={{ margin: "0 0 4px", fontSize: 13, color: C.sub, fontWeight: 600, fontFamily: font }}>
              達成度
            </p>
            <div style={{ position: "relative" }}>
              <CircleProgress percent={progressPct} size={160} strokeWidth={12} />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
              }}>
                <span style={{
                  fontSize: 34, fontWeight: 900, fontFamily: font, lineHeight: 1,
                  background: "linear-gradient(155deg, #DAA520, #FFD700)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  {progressPct}%
                </span>
                <span style={{ fontSize: 11, color: C.sub, fontWeight: 600, marginTop: 4, fontFamily: font }}>
                  達成度
                </span>
              </div>
            </div>
          </div>

          {/* 区切り線 */}
          <div style={{ width: 1, height: 120, background: C.border, flexShrink: 0 }} />

          {/* バッジ統計 */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: C.red, fontFamily: font, lineHeight: 1 }}>
                {achievedCount}
              </span>
              <span style={{ fontSize: 15, color: C.sub, fontWeight: 600, fontFamily: font, marginLeft: 10 }}>
                獲得バッジ
              </span>
              <span style={{ fontSize: 13, color: C.sub, fontFamily: font, marginLeft: 8 }}>
                / 全 {totalCount} 業績
              </span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <BadgeStat
                label="金"
                count={goldCount}
                color="#FFD700"
                borderColor="rgba(255,215,0,0.25)"
                bgGrad="linear-gradient(135deg, #FFF9E6 0%, #FFF 100%)"
              />
              <BadgeStat
                label="銀"
                count={silverCount}
                color={C.silver}
                borderColor="rgba(192,192,192,0.25)"
                bgGrad="linear-gradient(135deg, #F5F5F5 0%, #FFF 100%)"
              />
              <BadgeStat
                label="銅"
                count={bronzeCount}
                color={C.bronze}
                borderColor="rgba(205,127,50,0.25)"
                bgGrad="linear-gradient(135deg, #FFF4E6 0%, #FFF 100%)"
              />
            </div>
          </div>

          {/* マイページボタン */}
          <button
            onClick={() => navigate("/mypage")}
            style={{
              background: "transparent", border: `2px solid ${C.navy}`,
              color: C.navy, padding: "11px 22px", borderRadius: 10,
              fontWeight: 700, fontSize: 14, fontFamily: font,
              cursor: "pointer", flexShrink: 0, transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.navy; e.currentTarget.style.color = C.white; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.navy; }}
          >
            ← マイページに戻る
          </button>
        </div>

        {/* ── 業績詳細 見出し ── */}
        <h2 style={{
          fontSize: 20, fontWeight: 900, color: C.navy,
          fontFamily: font, margin: "0 0 20px",
        }}>
          業績詳細
        </h2>

        {/* ── 業績リスト ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          {paginated.map(item => (
            <AchievementCard key={item.id} item={item} />
          ))}
        </div>

        {/* ── ページネーション ── */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
