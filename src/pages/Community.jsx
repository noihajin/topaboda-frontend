import React, { useState } from "react";
import icTrending  from "../assets/community/icon_trending_c.svg";
import icFilter    from "../assets/community/icon_filter_c.svg";
import icSearch    from "../assets/community/icon_search_navy_c.svg";
import icPen       from "../assets/community/icon_pen_c.svg";
import icEye       from "../assets/community/icon_eye_c.svg";
import icChevLeft  from "../assets/community/icon_chevron_left_c.svg";
import icChevRight from "../assets/community/icon_chevron_right_c.svg";
import icComment   from "../assets/community/icon_comment_c.svg";

const C = {
  navy:    "#000d57",
  red:     "#6e0000",
  redL:    "#8e0000",
  gold:    "#caca00",
  goldD:   "#a0a000",
  bg:      "#f3f4f6",
  white:   "#ffffff",
  gray1:   "#4a5565",
  gray2:   "#6a7282",
  gray3:   "#99a1af",
  border:  "#e5e7eb",
  borderL: "#f3f4f6",
};

const font = "'Noto Sans KR', 'Noto Sans JP', sans-serif";

const CAT_COLORS = {
  "お知らせ": { bg: "#fef9c3", color: "#92400e" },
  "レビュー": { bg: "#dbeafe", color: "#1447e6" },
  "質問":     { bg: "#dcfce7", color: "#008236" },
  "탐방로":   { bg: "#f3e8ff", color: "#8200db" },
  "ヒント":   { bg: "#ffedd4", color: "#ca3500" },
  "写真":     { bg: "#fce7f3", color: "#9d174d" },
};

const popularPosts = [
  { rank: 1, category: "レビュー", title: "景福宮の夜間開放 - 星明かりの下を歩く",     author: "文化遺産ラバー", comments: "45" },
  { rank: 2, category: "탐방로",   title: "慶州1泊2日の完璧なコース",                  author: "旅行作家キム",   comments: "62" },
  { rank: 3, category: "写真",     title: "韓屋の美学 - 撮影のヒント",                  author: "フォトグラファーパク", comments: "38" },
];

const boardPosts = [
  { id: 1, no: 1, category: "レビュー", title: "昌徳宮後苑の予約のヒントと隠れたスポット",  comments: 23, author: "宮殿マニア",   date: "2024.03.05", views: 542  },
  { id: 2, no: 2, category: "質問",     title: "水原華城の観覧所要時間を教えてください",    comments: 8,  author: "旅行準備中",   date: "2024.03.05", views: 234  },
  { id: 3, no: 3, category: "탐방로",   title: "江華島歴史紀行1日コースのおすすめ",         comments: 34, author: "歴史旅行好き", date: "2024.03.04", views: 892  },
  { id: 4, no: 4, category: "ヒント",   title: "安東河回村の秋の風景写真",                  comments: 41, author: "秋の旅行",     date: "2024.03.04", views: 1124 },
];

export default function Community() {
  const [search, setSearch] = useState("");
  const [sort,   setSort]   = useState("新着順");

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: font, paddingTop: "11.9rem" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 48px" }}>

        {/* ページ見出し */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ color: C.navy, fontSize: 40, fontWeight: 700, margin: "0 0 10px" }}>コミュニティ</h1>
          <p style={{ color: C.gray1, fontSize: 18, margin: 0 }}>国家遺産探訪の体験を共有し、交流しましょう</p>
        </div>

        {/* 人気投稿 */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(to bottom, ${C.gold}, ${C.goldD})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src={icTrending} alt="" style={{ width: 26, height: 26 }} />
            </div>
            <h2 style={{ color: C.navy, fontSize: 26, fontWeight: 700, margin: 0 }}>人気投稿</h2>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {popularPosts.map(p => <PopularCard key={p.rank} post={p} />)}
          </div>
        </section>

        {/* 検索バー */}
        <div style={{
          background: C.white, borderRadius: 14, padding: "20px 28px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.07)", marginBottom: 24,
        }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "0 16px", height: 52,
              border: `1.5px solid ${C.navy}`, borderRadius: 10,
              background: "#eee", cursor: "pointer", flexShrink: 0,
            }}>
              <span style={{ fontWeight: 500, color: C.navy, fontSize: 14 }}>すべて</span>
              <img src={icFilter} alt="" style={{ width: 16, height: 16 }} />
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="タイトル・内容・投稿者で検索"
                style={{
                  width: "100%", height: 52, padding: "0 48px 0 20px",
                  border: `2px solid ${C.border}`, borderRadius: 12,
                  fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: font,
                }}
                onFocus={e => e.target.style.borderColor = C.navy}
                onBlur={e  => e.target.style.borderColor = C.border}
              />
              <img src={icSearch} alt="" style={{
                position: "absolute", right: 16, top: "50%",
                transform: "translateY(-50%)", width: 22,
              }} />
            </div>
            <button style={{
              background: C.navy, color: C.white, border: "none",
              borderRadius: 12, padding: "0 28px", height: 52,
              fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: font,
            }}>検索</button>
            <button style={{
              background: `linear-gradient(to bottom, ${C.red}, ${C.redL})`,
              color: C.white, border: "none", borderRadius: 12,
              height: 52, padding: "0 24px",
              display: "flex", alignItems: "center", gap: 8,
              fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: font,
            }}>
              <img src={icPen} alt="" style={{ width: 20 }} />
              投稿する
            </button>
          </div>
        </div>

        {/* 掲示板テーブル */}
        <div style={{ background: C.white, borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <div style={{
            background: C.navy, display: "flex",
            justifyContent: "space-between", alignItems: "center",
            padding: "0 24px", height: 66,
          }}>
            <span style={{ color: C.white, fontWeight: 700, fontSize: 18 }}>すべての投稿</span>
            <div style={{ display: "flex", gap: 8 }}>
              {["新着順", "閲覧順"].map(s => (
                <button key={s} onClick={() => setSort(s)} style={{
                  background: sort === s ? C.gold : "rgba(255,255,255,0.12)",
                  color:      sort === s ? C.navy : C.white,
                  border: "none", borderRadius: 6,
                  padding: "6px 16px", fontWeight: 500, fontSize: 13,
                  cursor: "pointer", fontFamily: font,
                }}>{s}</button>
              ))}
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: `1px solid ${C.border}` }}>
                <th style={{ padding: 16, textAlign: "center", color: C.navy, fontSize: 13, width: 70 }}>No</th>
                <th style={{ padding: 16, color: C.navy, fontSize: 13, width: 130 }}>カテゴリー</th>
                <th style={{ padding: 16, color: C.navy, fontSize: 13 }}>タイトル</th>
                <th style={{ padding: 16, color: C.navy, fontSize: 13, width: 120 }}>投稿者</th>
                <th style={{ padding: 16, color: C.navy, fontSize: 13, width: 120 }}>投稿日</th>
                <th style={{ padding: 16, textAlign: "center", color: C.navy, fontSize: 13, width: 100 }}>閲覧数</th>
              </tr>
            </thead>
            <tbody>
              {boardPosts.map(post => <BoardRow key={post.id} post={post} />)}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 30 }}>
          <img src={icChevLeft}  style={{ width: 24, cursor: "pointer", opacity: 0.5 }} alt="" />
          <span style={{ fontWeight: 700, color: C.red, padding: "0 8px", lineHeight: "24px" }}>1</span>
          <img src={icChevRight} style={{ width: 24, cursor: "pointer" }} alt="" />
        </div>

      </div>
    </div>
  );
}

function PopularCard({ post }) {
  return (
    <div style={{
      background: C.white, borderRadius: 14,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      overflow: "hidden", flex: 1, textAlign: "left",
    }}>
      <div style={{ height: 160, background: "#e5e7eb", position: "relative" }}>
        <div style={{
          position: "absolute", top: 12, left: 12,
          width: 36, height: 36, borderRadius: "50%",
          background: `linear-gradient(to bottom, ${C.gold}, ${C.goldD})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 16, color: C.navy,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}>{post.rank}</div>
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: C.red, color: C.white,
          borderRadius: 999, padding: "3px 12px", fontSize: 12,
        }}>{post.category}</div>
      </div>
      <div style={{ padding: 16 }}>
        <h4 style={{ margin: "0 0 8px", color: C.navy, fontWeight: 700, fontSize: 15 }}>{post.title}</h4>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.gray2 }}>
          <span>{post.author}</span>
          <span style={{ color: C.red }}>💬 {post.comments}</span>
        </div>
      </div>
    </div>
  );
}

function BoardRow({ post }) {
  const [hovered, setHovered] = useState(false);
  const cat = CAT_COLORS[post.category] || { bg: "#eee", color: "#555" };

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: `1px solid ${C.borderL}`,
        background: hovered ? "#f9fafb" : C.white,
        cursor: "pointer", transition: "background 0.12s",
      }}
    >
      <td style={{ padding: 16, textAlign: "center", color: C.gray1, fontSize: 13 }}>{post.no}</td>
      <td style={{ padding: 16 }}>
        <span style={{
          background: cat.bg, color: cat.color,
          borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 700,
        }}>{post.category}</span>
      </td>
      <td style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 700, color: C.navy, textDecoration: hovered ? "underline" : "none" }}>{post.title}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 2, color: C.red, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            <img src={icComment} style={{ width: 13, opacity: 0.7 }} alt="" />
            [{post.comments}]
          </div>
        </div>
      </td>
      <td style={{ padding: 16, color: C.gray1, fontSize: 13, whiteSpace: "nowrap" }}>{post.author}</td>
      <td style={{ padding: 16, color: C.gray2, fontSize: 12, whiteSpace: "nowrap" }}>{post.date}</td>
      <td style={{ padding: 16, textAlign: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: C.gray2 }}>
          <img src={icEye} style={{ width: 14, opacity: 0.6 }} alt="" /> {post.views}
        </span>
      </td>
    </tr>
  );
} 