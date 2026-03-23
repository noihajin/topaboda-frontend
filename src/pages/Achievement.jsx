import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { C, font, fontSerif, MOCK_ACHIEVEMENTS, ITEMS_PER_PAGE } from "../components/achievement/constants";
import AchievementSummary from "../components/achievement/AchievementSummary";
import AchievementCard from "../components/achievement/AchievementCard";
import axios from "axios";

export default function Achievement() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [achievements, setAchievements] = useState({ contents: [] });

    const totalPages = Math.ceil(achievements.contents.length / ITEMS_PER_PAGE);
    const paginated = achievements.contents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const achievedCount = achievements.contents.filter((a) => a.achieved).length;
    const totalCount = achievements.contents.length;
    const progressPct = Math.round((achievedCount / totalCount) * 100);
    const goldCount = achievements.contents.filter((a) => a.achieved && a.grade === "金").length;
    const silverCount = achievements.contents.filter((a) => a.achieved && a.grade === "銀").length;
    const bronzeCount = achievements.contents.filter((a) => a.achieved && a.grade === "銅").length;
    /*
    { 
      id:1,  
      title:"国宝探訪者",       
      description:"国宝に指定された文化遺産を50か所訪問した達成者に贈られる称号です。",               
      grade:"金", 
      criteriaLabel:"国宝訪問",      
      current:50, 
      total:50,  
      achieved:true,  
      date:"2024.08.15" 
    },
    */
    useEffect(() => {
        const fetchAchievements = async () => {
            const id = localStorage.getItem("id");
            const token = localStorage.getItem("token");

            if (!id || !token) return;

            try {
                const response = await axios.get(`http://localhost:9990/topaboda/api/users/achievements`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const rawData = response.data.contents || response.data;

                rawData.sort((a, b) => {
                    if (a.achieved !== b.achieved) {
                        return b.achieved - a.achieved;
                    }

                    const aRatio = (Number(a.current) || 0) / (Number(a.total) || 1);
                    const bRatio = (Number(b.current) || 0) / (Number(b.total) || 1);

                    return bRatio - aRatio;
                });

                setAchievements({ contents: rawData });
            } catch (error) {
                console.error("업적 로드 실패:", error);
            }
        };

        fetchAchievements();
    }, []);

    return (
        <div style={{ background: C.bg, minHeight: "100vh", fontFamily: font }}>
            {/* ヒーローバナー */}
            <div
                style={{
                    background: `linear-gradient(135deg, ${C.navy} 0%, #001a6e 50%, #0a2280 100%)`,
                    paddingTop: 140,
                    paddingBottom: 72,
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: `${C.gold}08`, pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: `${C.red}10`, pointerEvents: "none" }} />
                <span
                    style={{
                        display: "inline-block",
                        background: `${C.gold}20`,
                        color: C.gold,
                        padding: "6px 20px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 900,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        marginBottom: 18,
                        border: `1px solid ${C.gold}40`,
                    }}
                >
                    ACHIEVEMENTS
                </span>
                <h1 style={{ color: C.white, fontSize: 42, fontWeight: 900, fontFamily: fontSerif, margin: "0 0 12px", letterSpacing: -0.5 }}>全ての業績</h1>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, margin: 0, fontFamily: font }}>文化遺産探訪の記録と達成度</p>
            </div>

            {/* コンテンツ */}
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 40px 80px" }}>
                <AchievementSummary achievedCount={achievedCount} totalCount={totalCount} progressPct={progressPct} goldCount={goldCount} silverCount={silverCount} bronzeCount={bronzeCount} onBack={() => navigate("/mypage")} />

                <h2 style={{ fontSize: 20, fontWeight: 900, color: C.navy, fontFamily: font, margin: "0 0 20px" }}>業績詳細</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
                    {paginated.map((item) => (
                        <AchievementCard key={item.id} item={item} />
                    ))}
                </div>

                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
        </div>
    );
}
