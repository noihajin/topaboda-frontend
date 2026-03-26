import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { API_URL } from "../config/config";
import TopaModal from "../components/TopaModal";
import { MODAL } from "../constants/modalConfigs";
import PopularCard from "../components/community/PopularCard";
import BoardRow from "../components/community/BoardRow";

import icSearch from "../assets/community/icon_search_navy_c.svg";
import icPen from "../assets/community/icon_pen_c.svg";

/* ── 색상 ── */
const C = {
    navy: "#000d57",
    red: "#6e0000",
    gold: "#caca00",
    goldD: "#a0a000",
    bg: "#f8f9fc",
    white: "#ffffff",
    gray1: "#4a5565",
    gray2: "#6a7282",
    gray3: "#99a1af",
    border: "#e5e7eb",
};

/* ── 폰트 ── */
const fBase = "'Noto Sans JP', 'Noto Sans KR', 'Roboto', sans-serif";
const fJP = "'Noto Sans JP', sans-serif";
const fJPSerif = "'Noto Serif JP', serif";
const fKR = "'Noto Sans KR', sans-serif";

/* ── 카테고리 색상 ── */
const CAT = {
    レビュー: { bg: "#dbeafe", color: "#1447e6" },
    ヒント: { bg: "#ffedd4", color: "#ca3500" },
    フリートーク: { bg: "#f3e8ff", color: "#8200db" },
    質問: { bg: "#dcfce7", color: "#008236" },
};

const CATEGORIES = ["すべて", "レビュー", "ヒント", "フリートーク", "質問"];
const POSTS_PER_PAGE = 10;

/* ════════════════════════════════════════════════
   메인 컴포넌트
════════════════════════════════════════════════ */
export default function Community() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [keyword, setKeyword] = useState("");
    const [selectedCat, setSelectedCat] = useState("すべて");
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [sortType, setSortType] = useState("latest");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [popularVisible, setPopularVisible] = useState(false);
    const [bannerLoaded, setBannerLoaded] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [popularPosts, setPopularPosts] = useState([]);
    const catRef = useRef(null);
    const popularRef = useRef(null);

    const isMobile = windowWidth <= 768;

    /* 리사이즈 */
    useEffect(() => {
        const h = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);

    /* 검색 */
    const handleSearch = () => {
        setCurrentPage(1);
        setKeyword(searchInput.trim());
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    /* 카테고리 드롭다운 외부 클릭 닫기 */
    useEffect(() => {
        const handler = (e) => {
            if (catRef.current && !catRef.current.contains(e.target)) setIsCatOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* 카테고리 변경 시 검색 초기화 */
    useEffect(() => {
        setSearchInput("");
        setKeyword("");
    }, [selectedCat]);

    /* 인기 리뷰 섹션 스크롤 감지 — popularPosts 로드 후 ref가 붙으면 observer 설정 */
    useEffect(() => {
        if (popularVisible) return; // 이미 보임 처리됐으면 스킵
        const el = popularRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setPopularVisible(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.1 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [posts.length, popularVisible]);

    /* 데이터 fetch */
    useEffect(() => {
        const params = {
            page: currentPage - 1,
            size: POSTS_PER_PAGE,
            sort: sortType === "views" ? "boardStatus.viewCount,desc" : "id,desc",
        };
        if (selectedCat !== "すべて") params.category = selectedCat;
        if (keyword) params.keyword = keyword;

        axios
            .get(`${API_URL}/topaboda/api/boards`, { params })
            .then((res) => {
                const mapped = res.data.content.map((item) => ({
                    id: item.id,
                    category: item.categories,
                    title: item.title,
                    author: item.nickname,
                    date: item.createdAt.slice(0, 10),
                    views: item.viewCount,
                    likes: item.likeCount ?? 0,
                    comments: item.commentCount ?? 0,
                    thumbnailUrl: item.thumbnailUrl ?? null,
                }));
                setPosts(mapped);
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.totalElements);
            })
            .catch((err) => console.error("API 실패", err));
    }, [currentPage, selectedCat, keyword, sortType]);

    useEffect(() => {
        axios
            .get(`${API_URL}/topaboda/api/rankings/boards`, {
                params: {
                    criteria: "LIKE",
                    limit: 3,
                },
            })
            .then((res) => {
                console.log(res);
                const mapped = res.data.boardListResponses.map((item) => ({
                    id: item.id,
                    category: item.categories,
                    title: item.title,
                    author: item.nickname,
                    date: item.createdAt.slice(0, 10),
                    views: item.viewCount,
                    likes: item.likeCount ?? 0,
                    comments: item.commentCount ?? 0,
                    thumbnailUrl: item.thumbnailUrl ?? null,
                }));
                setPopularPosts(mapped);
            })
            .catch((err) => console.error("인기글 로드 실패:", err));
    }, []);

    return (
        <>
        <div style={{ background: C.bg, minHeight: "100vh", fontFamily: fBase }}>
            {/* ── 배너 (전폭) ── */}
            <header
                style={{
                    position: "relative",
                    width: "100%",
                    height: isMobile ? "340px" : "460px",
                    overflow: "hidden",
                    background: "#dde4ec" /* 로드 전 플레이스홀더 */,
                }}
            >
                {/* 배경 이미지 */}
                <img
                    src="/community_banner.png"
                    alt=""
                    fetchPriority="high"
                    decoding="async"
                    onLoad={() => setBannerLoaded(true)}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        opacity: bannerLoaded ? 1 : 0,
                        transition: "opacity 0.6s ease",
                    }}
                />
                {/* 밝은 오버레이 */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(248,249,252,0.60)",
                    }}
                />
                {/* 텍스트 — 배너 이미지 전체 높이의 정중앙 */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: isMobile ? "0 20px" : "0 48px",
                    }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            background: `${C.gold}33`,
                            color: C.goldD,
                            fontSize: 11,
                            fontWeight: 900,
                            letterSpacing: "0.14em",
                            padding: "5px 16px",
                            borderRadius: 999,
                            marginBottom: 20,
                            fontFamily: "'Roboto', sans-serif",
                        }}
                    >
                        COMMUNITY
                    </span>
                    <h1
                        style={{
                            color: C.navy,
                            fontFamily: fJPSerif,
                            fontSize: isMobile ? 34 : 50,
                            fontWeight: 700,
                            margin: "0 0 16px",
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        コミュニティ
                    </h1>
                    <p
                        style={{
                            color: "#4a5565",
                            fontSize: isMobile ? 14 : 20,
                            fontFamily: fJP,
                            margin: 0,
                            lineHeight: 1.75,
                        }}
                    >
                        文化遺産探検の経験を共有し、交流しましょう
                    </p>
                </div>
            </header>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "64px 20px 64px" : "120px 48px 120px" }}>
                {/* ── 인기 리뷰 ── */}
                {popularPosts.length > 0 && (
                    <section ref={popularRef} style={{ marginBottom: isMobile ? 64 : 100 }}>
                        {/* 헤더 — 시간차 등장 */}
                        <motion.div initial={{ opacity: 0, y: 22 }} animate={popularVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                            {/* Figma 아이콘: 배경 없이 trending-up SVG만 */}
                            <img src="https://www.figma.com/api/mcp/asset/ebe89c18-df49-4fbf-a134-713f63c3818f" alt="" style={{ width: 28, height: 28, flexShrink: 0 }} />
                            <h2 style={{ color: C.navy, fontSize: isMobile ? 20 : 24, fontWeight: 900, margin: 0, fontFamily: fJP }}>人気のレビュー</h2>
                        </motion.div>

                        {/* 카드 그리드 — 카드별 시간차 등장 */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                                gap: 20,
                            }}
                        >
                            {popularPosts.map((p, i) => (
                                <motion.div key={p.id} initial={{ opacity: 0, y: 36 }} animate={popularVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.12 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}>
                                    <PopularCard post={p} rank={i + 1} />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── 컨트롤 바: 카테고리 드롭다운 + 검색바 + 정렬 토글 + 투고하기 ── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 24,
                        flexWrap: isMobile ? "wrap" : "nowrap",
                    }}
                >
                    {/* 카테고리 드롭다운 — SearchFilter 스타일 */}
                    <div ref={catRef} style={{ position: "relative", flexShrink: 0 }}>
                        <button
                            onClick={() => setIsCatOpen((v) => !v)}
                            style={{
                                height: 48,
                                padding: "0 40px 0 18px",
                                background: C.white,
                                border: `1.5px solid ${C.border}`,
                                borderRadius: 999,
                                outline: "none",
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 600,
                                fontFamily: fJP,
                                color: C.gray1,
                                whiteSpace: "nowrap",
                                display: "flex",
                                alignItems: "center",
                                transition: "border-color 0.2s",
                                position: "relative",
                            }}
                        >
                            {selectedCat}
                            {/* chevron */}
                            <svg
                                style={{
                                    position: "absolute",
                                    right: 14,
                                    top: "50%",
                                    transform: `translateY(-50%) rotate(${isCatOpen ? 180 : 0}deg)`,
                                    transition: "transform 0.3s",
                                    opacity: 0.4,
                                    pointerEvents: "none",
                                }}
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={C.gray3}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
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
                                        position: "absolute",
                                        top: "calc(100% + 8px)",
                                        left: 0,
                                        minWidth: "100%",
                                        background: C.white,
                                        borderRadius: 16,
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                                        border: `1px solid ${C.border}`,
                                        overflow: "hidden",
                                        zIndex: 100,
                                    }}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <div
                                            key={cat}
                                            onClick={() => {
                                                setSelectedCat(cat);
                                                setCurrentPage(1);
                                                setIsCatOpen(false);
                                            }}
                                            style={{
                                                padding: "13px 22px",
                                                fontSize: 13,
                                                fontWeight: 700,
                                                fontFamily: fJP,
                                                cursor: "pointer",
                                                whiteSpace: "nowrap",
                                                color: selectedCat === cat ? C.navy : C.gray1,
                                                background: selectedCat === cat ? "rgba(0,13,87,0.05)" : "transparent",
                                                transition: "background 0.15s",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedCat !== cat) e.currentTarget.style.background = "#f9fafb";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = selectedCat === cat ? "rgba(0,13,87,0.05)" : "transparent";
                                            }}
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
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="キーワードで検索..."
                            style={{
                                width: "100%",
                                height: 48,
                                boxSizing: "border-box",
                                padding: "0 56px 0 22px",
                                border: `1.5px solid ${C.border}`,
                                borderRadius: 999,
                                background: C.white,
                                fontSize: 14,
                                fontFamily: fJP,
                                outline: "none",
                                color: C.gray1,
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = C.navy)}
                            onBlur={(e) => (e.target.style.borderColor = C.border)}
                        />
                        <button
                            onClick={handleSearch}
                            style={{
                                position: "absolute",
                                right: 6,
                                top: 6,
                                bottom: 6,
                                width: 38,
                                background: C.navy,
                                border: "none",
                                borderRadius: 999,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = C.red)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = C.navy)}
                        >
                            <img src={icSearch} alt="" style={{ width: 16, filter: "brightness(0) invert(1)" }} />
                        </button>
                    </div>

                    {/* 투고 버튼 */}
                    <button
                        onClick={() => {
                            const token = localStorage.getItem("token");
                            if (!token) { setLoginModal(true); return; }
                            navigate("/community/write");
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: C.red,
                            color: C.white,
                            border: "none",
                            borderRadius: 999,
                            height: 48,
                            padding: "0 24px",
                            fontWeight: 800,
                            fontSize: 14,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            flexShrink: 0,
                            fontFamily: fJP,
                            boxShadow: "0 4px 14px rgba(110,0,0,0.22)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#8e0000";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = C.red;
                            e.currentTarget.style.transform = "none";
                        }}
                    >
                        <img src={icPen} alt="" style={{ width: 16 }} />
                        投稿する
                    </button>
                </div>

                {/* ── 정렬 토글 (오른쪽 정렬) ── */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "4px", background: "rgba(0,13,87,0.05)", borderRadius: 99 }}>
                        {[
                            { key: "latest", label: "最新" },
                            { key: "views", label: "閲覧" },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setSortType(key);
                                    setCurrentPage(1);
                                }}
                                style={{
                                    padding: "6px 16px",
                                    borderRadius: 999,
                                    border: "none",
                                    background: sortType === key ? "#caca00" : "transparent",
                                    color: sortType === key ? C.navy : C.gray3,
                                    fontWeight: 700,
                                    fontSize: 12,
                                    cursor: "pointer",
                                    transition: "all 0.25s",
                                    fontFamily: fJP,
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── 게시글 리스트 ── */}
                <div
                    style={{
                        background: C.white,
                        borderRadius: 20,
                        border: `1px solid ${C.border}`,
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    }}
                >
                    {/* 리스트 헤더 */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "60px 110px 1fr 100px 96px 70px",
                            padding: "0 20px",
                            background: C.navy,
                            borderBottom: `1px solid rgba(255,255,255,0.1)`,
                        }}
                    >
                        {["No", "カテゴリ", "タイトル", "投稿者", "日付", "閲覧"].map((h, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: "14px 8px",
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color: "rgba(255,255,255,0.85)",
                                    fontFamily: fJP,
                                    textAlign: i === 0 || i === 5 ? "center" : "left",
                                }}
                            >
                                {h}
                            </div>
                        ))}
                    </div>

                    {/* 게시글 행 */}
                    <AnimatePresence mode="wait">{posts.length === 0 ? <div style={{ textAlign: "center", padding: "60px 0", color: C.gray3, fontFamily: fJP, fontSize: 14 }}>投稿がありません</div> : posts.map((post, idx) => <BoardRow key={post.id} post={post} displayNo={totalElements - ((currentPage - 1) * POSTS_PER_PAGE + idx)} />)}</AnimatePresence>
                </div>

                {/* ── 페이지네이션 ── */}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>

        {/* 로그인 필요 모달 */}
        <TopaModal
            {...MODAL.LOGIN_REQUIRED}
            isOpen={loginModal}
            onClose={() => setLoginModal(false)}
            onConfirm={() => { setLoginModal(false); navigate("/login"); }}
        />
        </>
    );
}
