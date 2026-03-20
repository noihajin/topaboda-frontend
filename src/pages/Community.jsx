import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

// 아이콘 임포트 (기존과 동일)
import icTrending  from "../assets/community/icon_trending_c.svg";
import icFilter    from "../assets/community/icon_filter_c.svg";
import icSearch    from "../assets/community/icon_search_navy_c.svg";
import icPen       from "../assets/community/icon_pen_c.svg";
import icEye       from "../assets/community/icon_eye_c.svg";
import icChevLeft  from "../assets/community/icon_chevron_left_c.svg";
import icChevRight from "../assets/community/icon_chevron_right_c.svg";
import icComment   from "../assets/community/icon_comment_c.svg";
import icHeart     from "../assets/community/icon_heart_c_2.svg"; 

const C = {
  navy:    "#000d57",
  red:     "#6e0000",
  redL:    "#8e0000",
  gold:    "#caca00",
  goldD:   "#a0a000",
  bg:      "#f8f9fc",
  white:   "#ffffff",
  gray1:   "#4a5565",
  gray2:   "#6a7282",
  gray3:   "#99a1af",
  border:  "#e5e7eb",
};

// ★ 컴포넌트 내부의 별도 font 변수 선언을 제거하고 index.css의 설정을 따릅니다.

const CAT_COLORS = {
  "レビュー": { bg: "#dbeafe", color: "#1447e6" },
  "ヒント":   { bg: "#ffedd4", color: "#ca3500" },
  "フリートーク": { bg: "#f3e8ff", color: "#8200db" },
  "質問": { bg: "#dcfce7", color: "#008236" },
};

const initialPosts = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  category: ["レビュー", "ヒント", "フリートーク", "質問"][i % 4],
  title: `${["景福宮", "仏国寺", "石窟庵", "昌徳宮"][i % 4]} 探訪の記録 ${i + 1}`,
  comments: Math.floor(Math.random() * 50),
  author: `ユーザー${i + 1}`,
  date: `2026.03.13`,
  views: Math.floor(Math.random() * 2000),
  likes: Math.floor(Math.random() * 300),
}));

export default function Community() {
  const navigate = useNavigate();
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("latest");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const postsPerPage = 10;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth <= 1024;

  const popularPosts = useMemo(() => {
    return [...initialPosts]
      .filter(p => p.category === "レビュー")
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);
  }, []);

  const processedPosts = useMemo(() => {
    let result = [...initialPosts];
    if (selectedCategory !== "すべて") {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (search) {
      result = result.filter(p => p.title.includes(search) || p.author.includes(search));
    }
    if (sortType === "latest") result.sort((a, b) => b.id - a.id);
    else if (sortType === "views") result.sort((a, b) => b.views - a.views);
    return result;
  }, [selectedCategory, sortType, search]);

  const totalPages = Math.ceil(processedPosts.length / postsPerPage);
  const currentPosts = processedPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const categories = ["すべて", "レビュー", "ヒント", "フリートーク", "質問"];

  return (
    /* index.css의 Roboto + Noto Sans JP가 자동 적용됨 */
    <div style={{ background: C.bg, minHeight: "100vh", paddingTop: isMobile ? "8rem" : "11.9rem", paddingBottom: "10rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px" }}>

        <div style={{ marginBottom: isMobile ? 40 : 80, textAlign: "center" }}>
          {/* 영문/숫자는 Roboto, 일문은 Noto Sans JP로 자동 렌더링 */}
          <h1 style={{ color: C.navy, fontSize: isMobile ? 32 : 48, fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.02em" }}>コミュニティ</h1>
          <p style={{ color: C.gray2, fontSize: isMobile ? 15 : 18, fontWeight: 500 }}>国家遺産探訪の体験を共有し、交流しましょう</p>
        </div>

        {/* 인기 리뷰 */}
        <section style={{ marginBottom: isMobile ? 60 : 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(to bottom, ${C.gold}, ${C.goldD})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={icTrending} alt="" style={{ width: 22 }} />
            </div>
            <h2 style={{ color: C.navy, fontSize: isMobile ? 22 : 28, fontWeight: 900 }}>人気のレビュー</h2>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 16 : 32, flexDirection: isMobile ? "column" : "row" }}>
            {popularPosts.map((p, index) => (
              <PopularCard key={p.id} post={p} rank={index + 1} />
            ))}
          </div>
        </section>

        {/* 필터 및 검색 바 */}
        <div style={{ display: "flex", flexDirection: isTablet ? "column" : "row", gap: 16, marginBottom: 20 }}>
          {/* 카테고리 드롭다운 - 완전 타원 */}
          <div style={{ position: "relative", zIndex: 50 }}>
            <div onClick={() => setIsCatOpen(!isCatOpen)} style={{
              width: isTablet ? "100%" : 220,
              height: 56, background: "#ffffff", borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", cursor: "pointer", border: `1px solid ${C.border}`, boxSizing: "border-box"
            }}>
              <span style={{ fontWeight: 800, color: C.navy, whiteSpace: "nowrap", fontSize: 14 }}>{selectedCategory}</span>
              <img src={icFilter} alt="" style={{ width: 16, transform: isCatOpen ? "rotate(180deg)" : "none", transition: "0.3s" }} />
            </div>
            <AnimatePresence>
              {isCatOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ position: "absolute", top: 64, left: 0, width: "100%", background: "white", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", overflow: "hidden", border: `1px solid ${C.border}` }}>
                  {categories.map(cat => (
                    <div key={cat} onClick={() => { setSelectedCategory(cat); setIsCatOpen(false); setCurrentPage(1); }} className="hover:bg-gray-50" style={{ padding: "14px 24px", fontSize: 14, fontWeight: 700, color: C.gray1, cursor: "pointer", whiteSpace: "nowrap" }}>{cat}</div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 검색바 - 완전 타원 + 호버 레드 */}
          <div style={{ flex: 1, position: "relative" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="検索ワードを入力..." style={{ width: "100%", height: 56, padding: "0 70px 0 28px", border: `1px solid ${C.border}`, borderRadius: 9999, background: "#ffffff", fontSize: 15, outline: "none", boxShadow: "none", boxSizing: "border-box", fontWeight: 500 }} />
            <button
              style={{ position: "absolute", right: 6, top: 6, bottom: 6, width: 44, background: C.navy, border: "none", borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#6E0000"}
              onMouseLeave={e => e.currentTarget.style.background = C.navy}
            >
              <img src={icSearch} alt="Search" style={{ width: 18, filter: "brightness(0) invert(1)" }} />
            </button>
          </div>

          {/* 투고 버튼 - 그라데이션 제거 + 완전 타원 */}
          <button
            onClick={() => navigate("/community/write")}
            style={{
              background: C.red,
              color: C.white, border: "none", borderRadius: 9999,
              height: 56, padding: "0 32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, fontWeight: 900, fontSize: 16, cursor: "pointer", whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#8e0000"}
            onMouseLeave={e => e.currentTarget.style.background = C.red}
          >
            <img src={icPen} alt="" style={{ width: 20 }} /> 投稿する
          </button>
        </div>

        {/* 정렬 버튼 */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setSortType("latest")} style={{ background: "none", border: "none", color: sortType === "latest" ? C.navy : C.gray3, fontWeight: 800, cursor: "pointer", fontSize: 13 }}>最新順</button>
          <span style={{ color: C.border }}>|</span>
          <button onClick={() => setSortType("views")} style={{ background: "none", border: "none", color: sortType === "views" ? C.navy : C.gray3, fontWeight: 800, cursor: "pointer", fontSize: 13 }}>閲覧順</button>
        </div>

        {/* 테이블 */}
        <div className="no-scrollbar" style={{ background: "rgba(255, 255, 255, 0.5)", backdropFilter: "blur(20px)", borderRadius: isMobile ? 20 : 32, border: "1px solid rgba(255, 255, 255, 0.4)", overflowX: "auto", boxShadow: "0 20px 50px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 700 : "auto" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid rgba(0,0,0,0.08)`, background: "#e9eaf0" }}>
                <th style={{ padding: "20px", color: C.navy, fontSize: 14, fontWeight: 900, width: 80, textAlign: "center" }}>No</th>
                <th style={{ padding: "20px", color: C.navy, fontSize: 14, fontWeight: 900, width: 140 }}>カテゴリ</th>
                <th style={{ padding: "24px", color: C.navy, fontSize: 14, fontWeight: 900, textAlign: "left" }}>タイトル</th>
                <th style={{ padding: "20px", color: C.navy, fontSize: 14, fontWeight: 900, width: 140 }}>投稿者</th>
                <th style={{ padding: "20px", color: C.navy, fontSize: 14, fontWeight: 900, width: 120 }}>日付</th>
                <th style={{ padding: "20px", color: C.navy, fontSize: 14, fontWeight: 900, width: 100, textAlign: "center" }}>閲覧</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post, idx) => (
                <BoardRow key={post.id} post={post} displayNo={processedPosts.length - ((currentPage - 1) * postsPerPage + idx)} />
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

function PopularCard({ post, rank }) {
  const navigate = useNavigate();
  return (
    <motion.div whileHover={{ y: -8 }} onClick={() => navigate(`/community/${post.id}`)} style={{ background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(15px)", borderRadius: 28, border: "1px solid rgba(255, 255, 255, 0.5)", boxShadow: "0 15px 35px rgba(0,0,0,0.06)", overflow: "hidden", flex: 1, cursor: "pointer" }}>
      <div style={{ height: 160, background: "#f1f3f7", position: "relative" }}>
        <div style={{ position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg, ${C.gold}, ${C.goldD})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: C.navy, letterSpacing: "-0.05em" }}>{rank}</div>
      </div>
      <div style={{ padding: 20 }}>
        <h4 style={{ margin: "0 0 12px", color: C.navy, fontWeight: 900, fontSize: 17, lineHeight: 1.5, letterSpacing: "-0.01em" }}>{post.title}</h4>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 13, color: C.gray2, fontWeight: 700 }}>{post.author}</span>
          <div style={{ display: "flex", gap: 10 }}>
            {/* 숫자는 Roboto 볼드체로 가독성 극대화 */}
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: C.red, fontWeight: 800 }}><img src={icHeart} style={{ width: 14 }} alt="" /> {post.likes}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: C.navy, fontWeight: 800 }}><img src={icComment} style={{ width: 13 }} alt="" /> {post.comments}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: C.gray2, fontWeight: 800 }}><img src={icEye} style={{ width: 15, opacity: 0.5 }} alt="" /> {post.views}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BoardRow({ post, displayNo }) {
  const navigate = useNavigate();
  const cat = CAT_COLORS[post.category] || { bg: "#eee", color: "#555" };
  return (
    <tr
      className="hover:bg-white/30"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.03)", transition: "background 0.2s", cursor: "pointer" }}
      onClick={() => navigate(`/community/${post.id}`)}
    >
      {/* 데이터(숫자/날짜)는 Roboto의 깔끔함이 강조되도록 세팅 */}
      <td style={{ padding: "18px", textAlign: "center", color: C.gray3, fontSize: 13, fontWeight: 600 }}>{displayNo}</td>
      <td style={{ padding: "18px" }}><span style={{ background: cat.bg, color: cat.color, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 900, whiteSpace: "nowrap" }}>{post.category}</span></td>
      <td style={{ padding: "18px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontWeight: 800, color: C.navy, fontSize: 15, letterSpacing: "-0.01em" }}>{post.title}</span><span style={{ color: C.red, fontSize: 12, fontWeight: 900 }}>[{post.comments}]</span></div></td>
      <td style={{ padding: "18px", color: C.gray1, fontSize: 13, fontWeight: 700 }}>{post.author}</td>
      <td style={{ padding: "18px", color: C.gray2, fontSize: 13, fontWeight: 500 }}>{post.date}</td>
      <td style={{ padding: "18px", textAlign: "center" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: C.gray3, fontWeight: 600 }}><img src={icEye} style={{ width: 15, opacity: 0.4 }} alt="" /> {post.views}</span></td>
    </tr>
  );
}