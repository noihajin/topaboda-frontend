import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

import icSearch  from "../assets/community/icon_search_navy_c.svg";
import icPen     from "../assets/community/icon_pen_c.svg";
import icEye     from "../assets/community/icon_eye_c.svg";
import icComment from "../assets/community/icon_comment_c.svg";
import icHeart   from "../assets/community/icon_heart_c_2.svg";

/* ── 색상 ── */
const C = {
  navy:   "#000d57",
  red:    "#6e0000",
  gold:   "#caca00",
  goldD:  "#a0a000",
  bg:     "#f8f9fc",
  white:  "#ffffff",
  gray1:  "#4a5565",
  gray2:  "#6a7282",
  gray3:  "#99a1af",
  border: "#e5e7eb",
};

/* ── 폰트 ── */
const fBase   = "'Noto Sans JP', 'Noto Sans KR', 'Roboto', sans-serif";
const fJP     = "'Noto Sans JP', sans-serif";
const fJPSerif= "'Noto Serif JP', serif";
const fKR     = "'Noto Sans KR', sans-serif";

/* ── 카테고리 색상 ── */
const CAT = {
  "レビュー":     { bg: "#dbeafe", color: "#1447e6" },
  "ヒント":       { bg: "#ffedd4", color: "#ca3500" },
  "フリートーク": { bg: "#f3e8ff", color: "#8200db" },
  "質問":         { bg: "#dcfce7", color: "#008236" },
};

const CATEGORIES = ["すべて", "レビュー", "ヒント", "フリートーク", "質問"];
const POSTS_PER_PAGE = 10;

/* ════════════════════════════════════════════════
   메인 컴포넌트
════════════════════════════════════════════════ */
export default function Community() {
  const navigate = useNavigate();

  const [posts, setPosts]                   = useState([]);
  const [currentPage, setCurrentPage]       = useState(1);
  const [totalPages, setTotalPages]         = useState(0);
  const [totalElements, setTotalElements]   = useState(0);
  const [searchInput, setSearchInput]       = useState("");
  const [keyword, setKeyword]               = useState("");
  const [selectedCat, setSelectedCat]       = useState("すべて");
  const [isCatOpen, setIsCatOpen]           = useState(false);
  const [sortType, setSortType]             = useState("latest");
  const [windowWidth, setWindowWidth]       = useState(window.innerWidth);
  const catRef = useRef(null);

  const isMobile = windowWidth <= 768;

  /* 리사이즈 */
  useEffect(() => {
    const h = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  /* 검색 */
  const handleSearch = () => { setCurrentPage(1); setKeyword(searchInput.trim()); };
  const handleKeyDown = (e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(); } };

  /* 카테고리 드롭다운 외부 클릭 닫기 */
  useEffect(() => {
    const handler = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setIsCatOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* 카테고리 변경 시 검색 초기화 */
  useEffect(() => { setSearchInput(""); setKeyword(""); }, [selectedCat]);

  /* 데이터 fetch */
  useEffect(() => {
    const params = {
      page: currentPage - 1,
      size: POSTS_PER_PAGE,
      sort: sortType === "views" ? "boardStatus.viewCount,desc" : "id,desc",
    };
    if (selectedCat !== "すべて") params.category = selectedCat;
    if (keyword) params.keyword = keyword;

    axios.get("http://localhost:9990/topaboda/api/boards", { params })
      .then(res => {
        const mapped = res.data.content.map(item => ({
          id:           item.id,
          category:     item.categories,
          title:        item.title,
          author:       item.nickname,
          date:         item.createdAt.slice(0, 10),
          views:        item.viewCount,
          likes:        item.likeCount  ?? 0,
          comments:     item.commentCount ?? 0,
          thumbnailUrl: item.thumbnailUrl ?? null,
        }));
        setPosts(mapped);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      })
      .catch(err => console.error("API 실패", err));
  }, [currentPage, selectedCat, keyword, sortType]);

  /* 인기 리뷰 (좋아요 top 3) */
  const popularPosts = useMemo(() =>
    [...posts].filter(p => p.category === "レビュー").sort((a, b) => b.likes - a.likes).slice(0, 3),
    [posts]
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingTop: isMobile ? "8rem" : "11.9rem", paddingBottom: "8rem", fontFamily: fBase }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px" }}>

        {/* ── 헤더 ── */}
        <header style={{ marginBottom: isMobile ? 48 : 80 }}>
          <div>
            <span style={{
              display: "inline-block",
              background: `${C.gold}22`, color: C.goldD,
              fontSize: 11, fontWeight: 900, letterSpacing: "0.12em",
              padding: "5px 14px", borderRadius: 999, marginBottom: 16,
              fontFamily: "'Roboto', sans-serif",
            }}>
              COMMUNITY
            </span>
            <h1 style={{
              color: C.navy, fontFamily: fJPSerif,
              fontSize: isMobile ? 34 : 52, fontWeight: 900,
              margin: "0 0 12px", lineHeight: 1.15, letterSpacing: "-0.02em",
            }}>
              コミュニティ
            </h1>
            <p style={{ color: C.gray2, fontSize: isMobile ? 14 : 17, fontFamily: fJP, margin: 0, lineHeight: 1.7 }}>
              国家遺産探訪の体験を共有し、交流しましょう
            </p>
          </div>
        </header>

        {/* ── 인기 리뷰 ── */}
        {popularPosts.length > 0 && (
          <section style={{ marginBottom: isMobile ? 56 : 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{
                width: 6, height: 28, borderRadius: 3,
                background: `linear-gradient(to bottom, ${C.gold}, ${C.goldD})`,
              }} />
              <h2 style={{ color: C.navy, fontSize: isMobile ? 20 : 24, fontWeight: 900, margin: 0, fontFamily: fJP }}>
                人気のレビュー
              </h2>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: 20,
            }}>
              {popularPosts.map((p, i) => <PopularCard key={p.id} post={p} rank={i + 1} />)}
            </div>
          </section>
        )}

        {/* ── 컨트롤 바: 카테고리 드롭다운 + 검색바 + 정렬 토글 + 투고하기 ── */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: 10, marginBottom: 24,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}>
          {/* 카테고리 드롭다운 — SearchFilter 스타일 */}
          <div ref={catRef} style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setIsCatOpen(v => !v)}
              style={{
                height: 48, padding: "0 40px 0 18px",
                background: C.white, border: `1.5px solid ${C.border}`,
                borderRadius: 999, outline: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, fontFamily: fJP,
                color: C.gray1, whiteSpace: "nowrap",
                display: "flex", alignItems: "center",
                transition: "border-color 0.2s",
                position: "relative",
              }}
            >
              {selectedCat}
              {/* chevron */}
              <svg
                style={{
                  position: "absolute", right: 14, top: "50%",
                  transform: `translateY(-50%) rotate(${isCatOpen ? 180 : 0}deg)`,
                  transition: "transform 0.3s", opacity: 0.4, pointerEvents: "none",
                }}
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={C.gray3} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {isCatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: "absolute", top: "calc(100% + 8px)", left: 0,
                    minWidth: "100%", background: C.white,
                    borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                    border: `1px solid ${C.border}`, overflow: "hidden", zIndex: 100,
                  }}
                >
                  {CATEGORIES.map(cat => (
                    <div
                      key={cat}
                      onClick={() => { setSelectedCat(cat); setCurrentPage(1); setIsCatOpen(false); }}
                      style={{
                        padding: "13px 22px", fontSize: 13, fontWeight: 700,
                        fontFamily: fJP, cursor: "pointer", whiteSpace: "nowrap",
                        color: selectedCat === cat ? C.navy : C.gray1,
                        background: selectedCat === cat ? "rgba(0,13,87,0.05)" : "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => { if (selectedCat !== cat) e.currentTarget.style.background = "#f9fafb"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = selectedCat === cat ? "rgba(0,13,87,0.05)" : "transparent"; }}
                    >
                      {cat}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 검색바 */}
          <div style={{ flex: 1, position: "relative", minWidth: isMobile ? "100%" : 0 }}>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="キーワードで検索..."
              style={{
                width: "100%", height: 48, boxSizing: "border-box",
                padding: "0 56px 0 22px",
                border: `1.5px solid ${C.border}`, borderRadius: 999,
                background: C.white, fontSize: 14, fontFamily: fJP,
                outline: "none", color: C.gray1,
                transition: "border-color 0.2s",
              }}
              onFocus={e  => e.target.style.borderColor = C.navy}
              onBlur={e   => e.target.style.borderColor = C.border}
            />
            <button
              onClick={handleSearch}
              style={{
                position: "absolute", right: 6, top: 6, bottom: 6, width: 38,
                background: C.navy, border: "none", borderRadius: 999,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.red}
              onMouseLeave={e => e.currentTarget.style.background = C.navy}
            >
              <img src={icSearch} alt="" style={{ width: 16, filter: "brightness(0) invert(1)" }} />
            </button>
          </div>

          {/* 투고 버튼 */}
          <button
            onClick={() => navigate("/community/write")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: C.red, color: C.white, border: "none",
              borderRadius: 999, height: 48, padding: "0 24px",
              fontWeight: 800, fontSize: 14, cursor: "pointer",
              transition: "all 0.2s", flexShrink: 0, fontFamily: fJP,
              boxShadow: "0 4px 14px rgba(110,0,0,0.22)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#8e0000"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.red;    e.currentTarget.style.transform = "none"; }}
          >
            <img src={icPen} alt="" style={{ width: 16 }} />
            投稿する
          </button>
        </div>

        {/* ── 정렬 토글 (오른쪽 정렬) ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            background: C.white, border: "1px solid rgba(202,202,0,0.4)",
            borderRadius: 999, padding: "4px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            {[{ key: "latest", label: "最新" }, { key: "views", label: "閲覧" }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setSortType(key); setCurrentPage(1); }}
                style={{
                  padding: "6px 16px", borderRadius: 999, border: "none",
                  background: sortType === key ? "#caca00" : "transparent",
                  color: sortType === key ? C.navy : C.gray3,
                  fontWeight: 700, fontSize: 12, cursor: "pointer",
                  transition: "all 0.2s", fontFamily: fJP,
                  boxShadow: sortType === key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 게시글 리스트 ── */}
        <div style={{
          background: C.white, borderRadius: 20,
          border: `1px solid ${C.border}`,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}>
          {/* 리스트 헤더 */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "60px 110px 1fr 100px 96px 70px",
            padding: "0 20px",
            background: C.navy,
            borderBottom: `1px solid rgba(255,255,255,0.1)`,
          }}>
            {["No", "カテゴリ", "タイトル", "投稿者", "日付", "閲覧"].map((h, i) => (
              <div key={i} style={{
                padding: "14px 8px",
                fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.85)",
                fontFamily: fJP,
                textAlign: i === 0 || i === 5 ? "center" : "left",
              }}>{h}</div>
            ))}
          </div>

          {/* 게시글 행 */}
          <AnimatePresence mode="wait">
            {posts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: C.gray3, fontFamily: fJP, fontSize: 14 }}>
                投稿がありません
              </div>
            ) : posts.map((post, idx) => (
              <BoardRow
                key={post.id}
                post={post}
                displayNo={totalElements - ((currentPage - 1) * POSTS_PER_PAGE + idx)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* ── 페이지네이션 ── */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   인기 리뷰 카드
════════════════════════════════════════════════ */
function PopularCard({ post, rank }) {
  const navigate = useNavigate();
  const RANK_COLORS = ["#caca00", "#b0b8c8", "#c8926a"];
  const rankColor   = RANK_COLORS[rank - 1] ?? C.gold;

  return (
    <div
      onClick={() => navigate(`/community/${post.id}`)}
      style={{
        borderRadius: 18, overflow: "hidden",
        background: C.white, border: `1px solid ${C.border}`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.10)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none";             e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
    >
      {/* 썸네일 */}
      <div style={{ position: "relative", height: 160, background: "#eef1f6", overflow: "hidden" }}>
        <img
          src={post.thumbnailUrl || "http://localhost:9990/topaboda/boards/default-board-thumbnail.png"}
          alt={post.title}
          onError={e => { e.currentTarget.src = "http://localhost:9990/topaboda/boards/default-board-thumbnail.png"; }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* 순위 배지 */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          width: 36, height: 36, borderRadius: 10,
          background: rankColor, color: rank === 1 ? C.navy : C.white,
          fontSize: 17, fontWeight: 900,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
          fontFamily: "'Roboto', sans-serif",
        }}>
          {rank}
        </div>
      </div>

      {/* 텍스트 */}
      <div style={{ padding: "16px 18px 18px" }}>
        <span style={{
          display: "inline-block",
          fontSize: 11, fontWeight: 800,
          color: "#1447e6", background: "#dbeafe",
          padding: "3px 10px", borderRadius: 6, marginBottom: 10,
          fontFamily: fJP,
        }}>
          レビュー
        </span>
        <p style={{
          fontSize: 15, fontWeight: 800, color: C.navy,
          lineHeight: 1.4, margin: "0 0 12px",
          fontFamily: fJP,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 42,
        }}>
          {post.title}
        </p>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 12, color: C.gray3, fontFamily: fKR }}>
            {post.author} · {post.date}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: C.gray3, fontFamily: "'Roboto', sans-serif" }}>
              <img src={icHeart}   alt="" style={{ width: 12, opacity: 0.5 }} /> {post.likes}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: C.gray3, fontFamily: "'Roboto', sans-serif" }}>
              <img src={icComment} alt="" style={{ width: 12, opacity: 0.5 }} /> {post.comments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   게시글 행
════════════════════════════════════════════════ */
function BoardRow({ post, displayNo }) {
  const navigate = useNavigate();
  const cat = CAT[post.category] || { bg: "#eee", color: "#555" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/community/${post.id}`)}
      style={{
        display: "grid",
        gridTemplateColumns: "60px 110px 1fr 100px 96px 70px",
        padding: "0 20px",
        borderBottom: `1px solid ${C.border}`,
        cursor: "pointer", transition: "background 0.15s",
        background: "transparent",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "#f8f9ff"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      {/* No */}
      <div style={{ padding: "16px 8px", textAlign: "center", color: C.gray3, fontSize: 13, fontFamily: "'Roboto', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {displayNo}
      </div>

      {/* 카테고리 */}
      <div style={{ padding: "16px 8px", display: "flex", alignItems: "center" }}>
        <span style={{
          background: cat.bg, color: cat.color,
          borderRadius: 7, padding: "4px 10px",
          fontSize: 11, fontWeight: 800, whiteSpace: "nowrap",
          fontFamily: fJP,
        }}>
          {post.category}
        </span>
      </div>

      {/* 제목 */}
      <div style={{ padding: "16px 8px", display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span style={{
          fontWeight: 700, color: C.navy, fontSize: 14,
          fontFamily: fJP, lineHeight: 1.4,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {post.title}
        </span>
        {post.comments > 0 && (
          <span style={{ color: C.red, fontSize: 12, fontWeight: 800, flexShrink: 0, fontFamily: "'Roboto', sans-serif" }}>
            [{post.comments}]
          </span>
        )}
      </div>

      {/* 작성자 */}
      <div style={{ padding: "16px 8px", display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: C.gray1, fontFamily: fKR, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {post.author}
        </span>
      </div>

      {/* 날짜 */}
      <div style={{ padding: "16px 8px", display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: C.gray2, fontFamily: "'Roboto', sans-serif" }}>
          {post.date}
        </span>
      </div>

      {/* 조회수 */}
      <div style={{ padding: "16px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.gray3, fontFamily: "'Roboto', sans-serif" }}>
          <img src={icEye} alt="" style={{ width: 13, opacity: 0.4 }} />
          {post.views}
        </span>
      </div>
    </motion.div>
  );
}
