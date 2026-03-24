import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeritageCard from "./HeritageCard";
import axios from "axios";

export default function PopularHeritageSection() {
    const SORT_OPTIONS = [
        { key: "BOOKMARK", label: "ブックマーク順" },
        { key: "LIKE", label: "いいね順" },
    ];

    const navigate = useNavigate();
    const [sortType, setSortType] = useState("BOOKMARK");

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

    return (
        <section
            ref={sectionRef}
            className="w-full bg-[#F8F9FC] pt-44 pb-32 px-[10%]"
            style={{
                opacity: sectionVisible ? 1 : 0,
                transition: "opacity 0.8s ease",
            }}
        >
            {/* 헤더 영역 */}
            <div className="flex flex-col items-center mb-20 text-center">
                <span className="bg-[#CACA00]/15 text-[#A0A000] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6">
                    CURATION
                </span>
                <h2 className="text-4xl lg:text-5xl font-bold text-[#000D57] mb-6 tracking-tight" style={{ fontFamily: "serif" }}>
                    人気の国の遺産
                </h2>
                <p className="text-gray-500 text-lg max-w-2xl">
                    多くの人々に愛される、韓国を代表する文化遺産をご紹介します
                </p>
                <div className="flex bg-white p-1.5 rounded-full shadow-sm border border-gray-100 mt-12">
                    {SORT_OPTIONS.map((option) => (
                        <button key={option.key} onClick={() => setSortType(option.key)} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${sortType === option.key ? "bg-[#000D57] text-white shadow-md scale-105" : "text-gray-400 hover:text-[#000D57]"}`}>
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
            {/* 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
                {displayedHt.map((item) => (
                    <HeritageCard
                        key={`${item.id}`}
                        heritageData={item}
                        status={{
                            like: displayedHtStatus?.like?.[item.id] || false,
                            bookmark: displayedHtStatus?.bookmark?.[item.id] || false,
                        }}
                    />
                ))}
            </div>
            {/* 더보기 버튼 */}
            <div className="flex justify-center">
                <button onClick={() => navigate("/heritage")} className="group bg-white border-2 border-[#000D57] text-[#000D57] px-12 py-4 rounded-full font-bold hover:bg-[#000D57] hover:text-white transition-all duration-300 shadow-sm flex items-center gap-2">
                    もっと多くの遺産を見る
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </section>
    );
}
