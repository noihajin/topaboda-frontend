import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HeritageCard from "./HeritageCard";
import { containerVariants, itemVariants, MOCK_DATA } from "./constants";
import axios from "axios";

export default function PopularHeritageSection() {
    const SORT_OPTIONS = [
        { key: "BOOKMARK", label: "ブックマーク順" },
        { key: "LIKE", label: "いいね順" },
    ];

    const navigate = useNavigate();
    const [sortType, setSortType] = useState("BOOKMARK");
    const [herBookmark, setHerBookmark] = useState({ contents: [] });
    const [herLike, setHerLike] = useState({ contents: [] });

    const currentHtData = sortType === "BOOKMARK" ? herBookmark.contents : herLike.contents;
    const displayedHt = currentHtData;

    const fetchRankingData = async (criteria, limit, setData) => {
        try {
            const response = await axios.get(`http://localhost:9990/topaboda/api/rankings/heritages?criteria=${criteria}&limit=${limit}`);

            setData(response.data);
        } catch (error) {
            console.error(`[${criteria}/${limit}]데이터 로드 실패:`, error);
        }
    };

    useEffect(() => {
        const initFetch = async () => {
            await Promise.all([fetchRankingData("BOOKMARK", 6, setHerBookmark), fetchRankingData("LIKE", 6, setHerLike)]);
        };
        initFetch();
    }, []);

    return (
        <motion.section className="w-full bg-[#F8F9FC] pt-44 pb-32 px-[10%]" initial="hidden" animate="visible" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants}>
            {/* 헤더 영역 */}
            <div className="flex flex-col items-center mb-20 text-center">
                <motion.span variants={itemVariants} className="bg-[#CACA00]/15 text-[#A0A000] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6">
                    CURATION
                </motion.span>
                <motion.h2 variants={itemVariants} className="text-4xl lg:text-5xl font-bold text-[#000D57] mb-6 tracking-tight" style={{ fontFamily: "serif" }}>
                    人気の国の遺産
                </motion.h2>
                <motion.p variants={itemVariants} className="text-gray-500 text-lg max-w-2xl">
                    多くの人々に愛される、韓国を代表する文化遺産をご紹介します
                </motion.p>
                <motion.div variants={itemVariants} className="flex bg-white p-1.5 rounded-full shadow-sm border border-gray-100 mt-12">
                    {SORT_OPTIONS.map((option) => (
                        <button key={option.key} onClick={() => setSortType(option.key)} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${sortType === option.key ? "bg-[#000D57] text-white shadow-md scale-105" : "text-gray-400 hover:text-[#000D57]"}`}>
                            {option.label}
                        </button>
                    ))}
                </motion.div>
            </div>
            {/* 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
                {displayedHt.map((item) => (
                    <HeritageCard key={`${sortType}-${item.id}`} data={item} />
                ))}
            </div>
            {/* 더보기 버튼 */}
            <motion.div variants={itemVariants} className="flex justify-center">
                <button onClick={() => navigate("/heritage")} className="group bg-white border-2 border-[#000D57] text-[#000D57] px-12 py-4 rounded-full font-bold hover:bg-[#000D57] hover:text-white transition-all duration-300 shadow-sm flex items-center gap-2">
                    もっと多くの遺産を見る
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </motion.div>
        </motion.section>
    );
}
