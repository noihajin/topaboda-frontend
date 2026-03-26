import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Pagination from "../components/Pagination";
import { C, font, PAGE_SIZE, TYPE_CODE_MAP, REGION_CODE_MAP, TYPE_CODE_MAP_R } from "../components/heritagelist/constants";
import HeritageHero from "../components/heritagelist/HeritageHero";
import HeritageFilters from "../components/heritagelist/HeritageFilters";
import HeritageCard from "../components/heritagelist/HeritageCard";
import { API_URL } from "../config/config";

export default function HeritageList() {
    const location = useLocation();
    const searchState = location.state;

    const [activeRegion, setActiveRegion] = useState("すべての地域");
    const [currentPage, setCurrentPage] = useState(0);
    const [heritages, setHeritages] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    const [query, setQuery] = useState(searchState?.search || "");
    const [searchInput, setSearchInput] = useState(searchState?.search || "");
    const [activeCategory, setActiveCategory] = useState(searchState?.type ? TYPE_CODE_MAP_R[searchState.type] : "すべて");

    useEffect(() => {
        const fetchHeritages = async () => {
            try {
                setLoading(true);

                const response = await axios.get(`${API_URL}/topaboda/api/heritages`, {
                    params: {
                        page: currentPage,
                        size: PAGE_SIZE,
                        keyword: query || undefined,
                        region: activeRegion === "すべての地域" ? undefined : REGION_CODE_MAP[activeRegion],
                        type: activeCategory === "すべて" ? undefined : TYPE_CODE_MAP[activeCategory],
                    },
                });

                setHeritages(response.data.content ?? []);
                setTotalPages(response.data.totalPages ?? 0);
                setTotalElements(response.data.totalElements ?? 0);
            } catch (e) {
                console.error("국가유산 리스트 불러오기 실패:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchHeritages();
    }, [currentPage, query, activeCategory, activeRegion]);

    const handleSearch = () => {
        setQuery(searchInput);
        setCurrentPage(0);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };
    const handleCategory = (cat) => {
        setActiveCategory(cat);
        setCurrentPage(0);
    };
    const handleRegion = (reg) => {
        setActiveRegion(reg);
        setCurrentPage(0);
    };

    return (
        <div style={{ minHeight: "100vh", fontFamily: font, background: C.bg }}>
            <HeritageHero searchInput={searchInput} onSearchChange={(e) => setSearchInput(e.target.value)} onSearch={handleSearch} onKeyDown={handleKeyDown} />

            <HeritageFilters activeCategory={activeCategory} onCategoryChange={handleCategory} activeRegion={activeRegion} onRegionChange={handleRegion} />

            {/* 카드 그리드 */}
            <div style={{ padding: "40px 6% 60px", maxWidth: 1280, margin: "0 auto" }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 24, fontFamily: font }}>
                    {totalElements}
                    <span style={{ fontWeight: 400, color: C.textSub }}>件の遺産</span>
                </p>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "80px 0", color: C.textSub, fontSize: 16, fontFamily: font }}>読み込み中です。</div>
                ) : heritages.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                        {heritages.map((item) => (
                            <HeritageCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "80px 0", color: C.textSub, fontSize: 16, fontFamily: font }}>検索結果がありません。</div>
                )}

                {/* ── 페이지네이션 ── */}
                <Pagination currentPage={currentPage + 1} totalPages={totalPages} onPageChange={(p) => setCurrentPage(p - 1)} />
            </div>
        </div>
    );
}
