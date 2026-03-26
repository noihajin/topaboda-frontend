import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import imgIconLocation from "../../assets/icon_location.svg";
import imgIconHeart from "../../assets/icon_heart_2.svg";

/* 인라인 SVG: 클릭 시 브랜드 컬러로 fill 제어 */
function HeartIcon({ filled }) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.55 9.83333C13.5185 8.86 14.5 7.69333 14.5 6.16667C14.5 5.19421 14.1233 4.26158 13.4529 3.57394C12.7825 2.88631 11.8731 2.5 10.925 2.5C9.781 2.5 8.975 2.83333 8 3.83333C7.025 2.83333 6.219 2.5 5.075 2.5C4.12685 2.5 3.21754 2.88631 2.54709 3.57394C1.87665 4.26158 1.5 5.19421 1.5 6.16667C1.5 7.7 2.475 8.86667 3.45 9.83333L8 14.5L12.55 9.83333Z" fill={filled ? "#6E0000" : "none"} stroke={filled ? "#6E0000" : "#6E0000"} strokeOpacity={filled ? 1 : 0.35} strokeWidth="1.47215" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "fill 0.2s, stroke 0.2s" }} />
        </svg>
    );
}

function BookmarkIcon({ filled }) {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.2505 15.75L9.00049 12.75L3.75049 15.75V3.75C3.75049 3.35218 3.90852 2.97064 4.18983 2.68934C4.47113 2.40804 4.85266 2.25 5.25049 2.25H12.7505C13.1483 2.25 13.5298 2.40804 13.8111 2.68934C14.0925 2.97064 14.2505 3.35218 14.2505 3.75V15.75Z" fill={filled ? "#000D57" : "none"} stroke={filled ? "#000D57" : "#000D57"} strokeOpacity={filled ? 1 : 0.35} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "fill 0.2s, stroke 0.2s" }} />
        </svg>
    );
}

// ─── 개별 카드 컴포넌트 ───
export default function HeritageCard({ heritageData, status }) {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(status.like);
    const [isBookmarked, setIsBookmarked] = useState(status.bookmark);
    const [likesCount, setLikesCount] = useState(heritageData.likes ?? 0);
    const [isLiking, setIsLiking] = useState(false);
    const [isBookmarking, setIsBookmarking] = useState(false);
    const badgeStyle = heritageData.badge === "国宝" ? "bg-[#CACA00] text-[#000D57]" : heritageData.badge === "宝物" ? "bg-[#6E0000] text-white" : "bg-[#000D57] text-white";

    // JS scroll animation (IntersectionObserver)
    const cardRef = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.08 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleLikeClick = async (e) => {
        e.stopPropagation();
        if (isLiking) return;

        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
            alert("ログインが必要です。");
            return;
        }

        setIsLiking(true);

        const originalLiked = isLiked;
        const originalCount = likesCount;

        setIsLiked(!originalLiked);
        setLikesCount((prev) => (originalLiked ? prev - 1 : prev + 1));

        try {
            if (originalLiked) {
                await axios.delete(`http://localhost:9990/topaboda/api/heritages/${heritageData.id}/likes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(
                    `http://localhost:9990/topaboda/api/heritages/${heritageData.id}/likes`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
            }
        } catch (e) {
            console.error("에러 발생:", e);
            setIsLiked(originalLiked);
            setLikesCount(originalCount);
        } finally {
            setIsLiking(false);
        }
    };

    const handleBookmarkClick = async (e) => {
        e.stopPropagation();
        if (isBookmarking) return;

        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
            alert("ログインが必要です。");
            return;
        }

        setIsBookmarking(true);

        const originalBookmarked = isBookmarked;
        setIsBookmarked(!originalBookmarked);
        try {
            if (isBookmarked) {
                await axios.delete(`http://localhost:9990/topaboda/api/heritages/${heritageData.id}/bookmarks`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(
                    `http://localhost:9990/topaboda/api/heritages/${heritageData.id}/bookmarks`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
            }
        } catch (e) {
            console.error("에러 발생:", e);
            setIsBookmarked(originalBookmarked);
        } finally {
            setIsBookmarking(false);
        }
    };

    useEffect(() => {
        setIsLiked(status.like);
    }, [status.like]);

    useEffect(() => {
        setIsBookmarked(status.bookmark);
    }, [status.bookmark]);

    const cardFont = "'Noto Sans JP', 'Noto Sans KR', 'Roboto', sans-serif";

    return (
        <div
            ref={cardRef}
            onClick={() => navigate(`/heritage/${heritageData.id}`)}
            className="bg-white rounded-[20px] overflow-hidden hover:-translate-y-2 transition-all duration-500 border border-gray-200 group cursor-pointer flex flex-col"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: "opacity 0.65s ease, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
                fontFamily: cardFont,
            }}
        >
            <div className="relative h-[190px] overflow-hidden flex-shrink-0">
                <img src={heritageData.imageUrl || "/fallback.jpg"} alt={heritageData.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                {/* 배지 */}
                <span className={`absolute top-4 left-4 ${badgeStyle} px-3 py-1 rounded-md text-[11px] font-black shadow-sm`} style={{ fontFamily: cardFont }}>{heritageData.badge}</span>
                {/* ── 우측 상단 버튼 그룹 (가로 정렬) ── */}
                <div className="absolute top-4 right-4 flex flex-row gap-1.5 z-10">
                    {/* 북마크 버튼 */}
                    <button
                        disabled={isBookmarking}
                        onClick={handleBookmarkClick}
                        className={`w-8 h-8 bg-white/80 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center transition-all
    ${isBookmarking ? "opacity-50 cursor-not-allowed" : "hover:bg-white active:scale-90"}`}
                    >
                        <BookmarkIcon filled={isBookmarked} />
                    </button>
                    {/* 하트 버튼 */}
                    <button
                        disabled={isLiking}
                        onClick={handleLikeClick}
                        className={`w-8 h-8 bg-white/80 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center transition-all
    ${isLiking ? "opacity-50 cursor-not-allowed" : "hover:bg-white active:scale-90"}`}
                    >
                        <HeartIcon filled={isLiked} />
                    </button>
                </div>
            </div>
            {/* 카드 바디: flex-col로 하단 고정 */}
            <div className="p-5 flex flex-col flex-1">
                {/* 이름 + 주소: 고정 높이로 정렬 일정하게 유지 */}
                <div className="flex-1">
                    <div className="mb-2" style={{ minHeight: "2.6rem" }}>
                        <h3 className="text-base font-black text-[#000D57] tracking-tight" style={{ fontFamily: cardFont, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{heritageData.name}</h3>
                        <span className="text-xs text-gray-400 font-medium" style={{ fontFamily: cardFont }}>| {heritageData.nameKr}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400" style={{ height: 18, overflow: "hidden" }}>
                        <img src={imgIconLocation} alt="" className="w-3 h-3 opacity-50" style={{ flexShrink: 0 }} />
                        <span className="text-xs font-bold" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: cardFont }}>{heritageData.location}</span>
                    </div>
                </div>
                {/* 하단: 항상 하단 고정 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                    <div className="flex items-center gap-1 text-gray-400">
                        <img src={imgIconHeart} alt="" className="w-3.5 h-3.5 opacity-50" />
                        <span className="text-xs font-bold ml-0.5" style={{ fontFamily: cardFont }}>
                            {likesCount.toLocaleString()}
                            <span className="text-[10px] opacity-70 ml-1">LIKES</span>
                        </span>
                    </div>
                    <button onClick={() => navigate(`/heritage/${heritageData.id}`)} className="flex items-center gap-1 text-[#6E0000] font-black text-xs tracking-tighter hover:text-[#000D57] transition-all group/btn" style={{ fontFamily: cardFont }}>
                        詳細を見る
                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
