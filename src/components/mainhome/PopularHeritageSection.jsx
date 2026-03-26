import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HeritageCard from "./HeritageCard";
import axios from "axios";

export default function PopularHeritageSection() {
    const SORT_OPTIONS = [
        { key: "BOOKMARK", label: "ブックマーク順" },
        { key: "LIKE", label: "いいね順" },
    ];

    const navigate = useNavigate();
    const [sortType, setSortType] = useState("BOOKMARK");

    // ── 캐러셀 상태 ──
    const CARDS_PER_VIEW = 3;
    const [carouselIdx, setCarouselIdx] = useState(0);
    const [direction, setDirection] = useState(1);

    // JS scroll animation
    const sectionRef = useRef(null);
    const [sectionVisible, setSectionVisible] = useState(false);
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setSectionVisible(true); observer.disconnect(); } },
            { threshold: 0.05 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const [herBookmark, setHerBookmark] = useState({ contents: [] });
    const [herLike, setHerLike] = useState({ contents: [] });
    const [herBookmarkStatus, setHerBookmarkStatus] = useState({});
    const [herLikeStatus, setHerLikeStatus] = useState({});

    const currentHtData = sortType === "BOOKMARK" ? herBookmark.contents : herLike.contents;
    const currentHtStatus = sortType === "BOOKMARK" ? herBookmarkStatus : herLikeStatus;
    const displayedHt = currentHtData;
    const displayedHtStatus = currentHtStatus;

    // 정렬 변경 시 캐러셀 초기화
    useEffect(() => { setCarouselIdx(0); }, [sortType]);

    const fetchRankingData = async (criteria, limit, setData, setStatus) => {
        try {
            const responseHeritage = await axios.get(`http://localhost:9990/topaboda/api/rankings/heritages?criteria=${criteria}&limit=${limit}`);

            setData(responseHeritage.data);

            const id = localStorage.getItem("id");
            const token = localStorage.getItem("token");

            if (!id || !token) return;

            const heritageIds = responseHeritage.data.contents.map((item) => item.id);
            const idsString = heritageIds.join(",");

            const responseLike = await axios.get(`http://localhost:9990/topaboda/api/heritages/likes/status?heritageIds=${idsString}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const responseBookmark = await axios.get(`http://localhost:9990/topaboda/api/heritages/bookmarks/status?heritageIds=${idsString}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setStatus({
                like: responseLike.data.contents,
                bookmark: responseBookmark.data.contents,
            });
        } catch (error) {
            console.error(`[${criteria}/${limit}]데이터 로드 실패:`, error);
        }
    };

    useEffect(() => {
        const initFetch = async () => {
            await Promise.all([fetchRankingData("BOOKMARK", 6, setHerBookmark, setHerBookmarkStatus), fetchRankingData("LIKE", 6, setHerLike, setHerLikeStatus)]);
        };
        initFetch();
    }, []);

    // ── 캐러셀 계산 ──
    const totalSlides = Math.max(1, Math.ceil(displayedHt.length / CARDS_PER_VIEW));
    const visibleCards = displayedHt.slice(carouselIdx * CARDS_PER_VIEW, (carouselIdx + 1) * CARDS_PER_VIEW);

    const handlePrev = () => {
        if (carouselIdx === 0) return;
        setDirection(-1);
        setCarouselIdx((i) => i - 1);
    };
    const handleNext = () => {
        if (carouselIdx >= totalSlides - 1) return;
        setDirection(1);
        setCarouselIdx((i) => i + 1);
    };

    // 슬라이드 애니메이션 variants
    const variants = {
        enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
        exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }),
    };

    return (
        <section
            ref={sectionRef}
            className="w-full bg-[#F8F9FC] pt-32 pb-20 px-[10%]"
            style={{
                opacity: sectionVisible ? 1 : 0,
                transition: "opacity 0.8s ease",
                fontFamily: "'Noto Sans JP', 'Noto Sans KR', 'Roboto', sans-serif",
            }}
        >
            {/* 헤더 영역 */}
            <div className="flex items-end justify-between mb-12">
                {/* 왼쪽: 뱃지 + 타이틀 + 서브 */}
                <div className="flex flex-col items-start">
                    <span className="bg-[#CACA00]/15 text-[#A0A000] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-5" style={{ fontFamily: "'Roboto', sans-serif" }}>
                        CURATION
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-[#000D57] mb-4 tracking-tight" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                        人気の国の遺産
                    </h2>
                    <p className="text-gray-500 text-base" style={{ fontFamily: "'Noto Sans JP', 'Noto Sans KR', sans-serif" }}>
                        多くの人々に愛される、韓国を代表する文化遺産をご紹介します
                    </p>
                </div>

                {/* 오른쪽: 정렬 탭 + 화살표 */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* 정렬 탭 */}
                    <div className="flex items-center gap-1 bg-white rounded-full border border-[#CACA00]/40 shadow-sm p-1">
                        {SORT_OPTIONS.map((option) => (
                            <button
                                key={option.key}
                                onClick={() => setSortType(option.key)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-250 ${
                                    sortType === option.key
                                        ? "bg-[#CACA00] text-[#000D57] shadow-sm"
                                        : "text-gray-400 hover:text-[#A0A000]"
                                }`}
                                style={{ fontFamily: "'Noto Sans JP', 'Noto Sans KR', sans-serif" }}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {/* 화살표 버튼 */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={carouselIdx === 0}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                ${carouselIdx === 0
                                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                    : "border-[#000D57] text-[#000D57] hover:bg-[#000D57] hover:text-white"
                                }`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={carouselIdx >= totalSlides - 1}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                ${carouselIdx >= totalSlides - 1
                                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                                    : "border-[#000D57] text-[#000D57] hover:bg-[#000D57] hover:text-white"
                                }`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 캐러셀 카드 영역 */}
            <div className="overflow-hidden mb-8">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={`${sortType}-${carouselIdx}`}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {visibleCards.map((item) => (
                            <HeritageCard
                                key={`${item.id}`}
                                heritageData={item}
                                status={{
                                    like: displayedHtStatus?.like?.[item.id] || false,
                                    bookmark: displayedHtStatus?.bookmark?.[item.id] || false,
                                }}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 도트 인디케이터 */}
            {totalSlides > 1 && (
                <div className="flex justify-center items-center gap-2 mb-10">
                    {Array.from({ length: totalSlides }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { setDirection(i > carouselIdx ? 1 : -1); setCarouselIdx(i); }}
                            className={`rounded-full transition-all duration-300 ${
                                i === carouselIdx
                                    ? "w-6 h-2 bg-[#000D57]"
                                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* 더보기 버튼 */}
            <div className="flex justify-center">
                <button onClick={() => navigate("/heritage")} className="group bg-white border-2 border-[#000D57] text-[#000D57] px-12 py-4 rounded-full font-bold hover:bg-[#000D57] hover:text-white transition-all duration-300 shadow-sm flex items-center gap-2" style={{ fontFamily: "'Noto Sans JP', 'Noto Sans KR', sans-serif" }}>
                    もっと多くの遺産を見る
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </section>
    );
}
