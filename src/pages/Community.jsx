import React, { useState } from "react";
// ★ 에셋 임포트 (하진님의 assets/community 폴더 구조)
import icTrending from "src/assets/community/icon_trending_c.svg";
// import icFilter from "../assets/community/icon_filter_c.svg";
import icSearch from "src/assets/community/icon_search_navy_c.svg";
import icPen from "src/assets/community/icon_pen_c.svg";
import icEye from "src/assets/community/icon_eye_c.svg";
import icHeart from "src/assets/community/icon_heart_c.svg";
import icChevLeft from "src/assets/community/icon_chevron_left_c.svg";
import icChevRight from "src/assets/community/icon_chevron_right_c.svg";
import icComment from "src/assets/community/icon_comment_c.svg";

// ── Design Tokens ──────────────────────────────────────────────────────────
const C = {
  navy: "#000d57",
  red: "#6e0000",
  redL: "#8e0000",
  gold: "#caca00",
  goldD: "#a0a000",
  bg: "#f3f4f6",
  white: "#ffffff",
  gray1: "#4a5565",
  gray2: "#6a7282",
  gray3: "#99a1af",
  border: "#e5e7eb",
  borderL: "#f3f4f6",
};

const font = "'Noto Sans KR', 'Noto Sans JP', sans-serif";

// ── Mock Data (일반 게시글만 구성) ──────────────────────────────────────────
const popularPosts = [
  { rank: 1, category: "리뷰", title: "景福宮の夜間開放 - 星明かりの下를 걷다", author: "문화유산러버", comments: "45" },
  { rank: 2, category: "탐방로", title: "경주 1박 2일 완벽 코스 공유", author: "여행작가김", comments: "62" },
  { rank: 3, category: "사진", title: "한옥의 미학 - 촬영 팁", author: "포토그래퍼박", comments: "38" },
];

const boardPosts = [
  { id: 1, no: 1, category: "리뷰", title: "창덕궁 후원 예약 팁과 숨은 포인트 공유", comments: 23, author: "궁궐마니아", date: "2024.03.05", views: 542, likes: 87 },
  { id: 2, no: 2, category: "질문", title: "수원 화성 관람 소요시간이 궁금합니다", comments: 8, author: "여행준비중", date: "2024.03.05", views: 234, likes: 12 },
  { id: 3, no: 3, category: "탐방로", title: "강화도 역사 기행 1일 코스 추천", comments: 34, author: "역사기행러", date: "2024.03.04", views: 892, likes: 156 },
  { id: 4, no: 4, category: "팁/정보", title: "안동 하회마을 가을 풍경 사진", comments: 41, author: "가을여행", date: "2024.03.04", views: 1124, likes: 203 },
];

const popularTags = ["#경복궁", "#경주", "#부산", "#전주한옥마을", "#야간개장"];

// ── Main Component ──────────────────────────────────────────────────────────
export default function Community() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: font }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 48px" }}>
        
        {/* 1. Page Heading */}
        <div style={{ marginBottom: 36, textAlign: "left" }}>
          <h1 style={{ color: C.navy, fontSize: 40, fontWeight: 700, margin: "0 0 10px" }}>커뮤니티</h1>
          <p style={{ color: C.gray1, fontSize: 18, margin: 0 }}>국가유산 탐험의 경험을 공유하고 소통해보세요</p>
        </div>

        {/* 2. Popular Posts */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: `linear-gradient(to bottom, ${C.gold}, ${C.goldD})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src={icTrending} alt="" style={{ width: 26, height: 26 }} />
            </div>
            <div style={{ textAlign: "left" }}>
              <h2 style={{ color: C.navy, fontSize: 26, fontWeight: 700, margin: 0 }}>인기 게시글</h2>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {popularPosts.map(p => <PopularCard key={p.rank} post={p} />)}
          </div>
        </section>

        {/* 3. Search Bar */}
        <div style={{
          background: C.white, borderRadius: 14, padding: "24px 28px 18px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.07)", marginBottom: 24,
        }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="제목, 내용, 작성자로 검색하세요"
                style={{
                  width: "100%", height: 52, padding: "0 48px 0 20px",
                  border: `2px solid ${C.border}`, borderRadius: 12, fontSize: 15, outline: "none",
                }}
              />
              <img src={icSearch} alt="" style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 22 }} />
            </div>
            <button style={{
              background: `linear-gradient(to bottom, ${C.red}, ${C.redL})`,
              color: C.white, borderRadius: 12, height: 52, padding: "0 24px",
              display: "flex", alignItems: "center", gap: 8, fontWeight: 700, border: "none", cursor: "pointer"
            }}>
              <img src={icPen} alt="" style={{ width: 20 }} /> 글쓰기
            </button>
          </div>
        </div>

        {/* 4. Board Table */}
        <div style={{ background: C.white, borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <div style={{ background: C.navy, padding: "18px 24px", textAlign: "left" }}>
            <span style={{ color: C.white, fontWeight: 700, fontSize: 18 }}>전체 게시글</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: `1px solid ${C.border}` }}>
                <th style={{ padding: "16px", textAlign: "center", color: C.navy, fontSize: 13, width: 70 }}>No</th>
                <th style={{ padding: "16px", color: C.navy, fontSize: 13, width: 130 }}>카테고리</th>
                <th style={{ padding: "16px", color: C.navy, fontSize: 13 }}>제목</th>
                <th style={{ padding: "16px", color: C.navy, fontSize: 13, width: 120 }}>작성자</th>
                <th style={{ padding: "16px", textAlign: "center", color: C.navy, fontSize: 13, width: 150 }}>통계</th>
              </tr>
            </thead>
            <tbody>
              {boardPosts.map((post) => (
                <BoardRow key={post.id} post={post} />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 30 }}>
            <img src={icChevLeft} style={{ width: 24, cursor: "pointer", opacity: 0.5 }} alt="" />
            <span style={{ fontWeight: 700, color: C.red }}>1</span>
            <img src={icChevRight} style={{ width: 24, cursor: "pointer" }} alt="" />
        </div>
      </div>
    </div>
  );
}

// ── Sub Components ──────────────────────────────────────────────────────────

function PopularCard({ post }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden", flex: 1, textAlign: "left" }}>
      <div style={{ height: 160, background: "#eee", position: "relative" }}>
        <div style={{ position: "absolute", top: 12, left: 12, width: 36, height: 36, borderRadius: "50%", background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{post.rank}</div>
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
  return (
    <tr style={{ borderBottom: `1px solid ${C.borderL}`, background: C.white }}>
      <td style={{ padding: 16, textAlign: "center", color: C.gray1, fontSize: 13 }}>{post.no}</td>
      <td style={{ padding: 16 }}>
        <span style={{ background: "#dbeafe", color: "#1447e6", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{post.category}</span>
      </td>
      <td style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 700, color: C.navy, cursor: "pointer" }}>{post.title}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 1, color: C.red, fontSize: 12, fontWeight: 700 }}>
             <img src={icComment} style={{ width: 14, opacity: 0.6 }} alt="" /> [{post.comments}]
          </div>
        </div>
      </td>
      <td style={{ padding: 16, color: C.gray1, fontSize: 13 }}>{post.author}</td>
      <td style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.gray2 }}>
            <img src={icEye} style={{ width: 14, opacity: 0.5 }} alt="" /> {post.views}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.red, fontWeight: 700 }}>
            <img src={icHeart} style={{ width: 13 }} alt="" /> {post.likes}
          </span>
        </div>
      </td>
    </tr>
  );
}