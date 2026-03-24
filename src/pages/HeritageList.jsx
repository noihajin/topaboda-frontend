import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import { C, font, PAGE_SIZE } from "../components/heritagelist/constants";
import HeritageHero    from "../components/heritagelist/HeritageHero";
import HeritageFilters from "../components/heritagelist/HeritageFilters";
import HeritageCard    from "../components/heritagelist/HeritageCard";

export default function HeritageList() {
  const [searchInput, setSearchInput]       = useState("");
  const [query, setQuery]                   = useState("");
  const [activeCategory, setActiveCategory] = useState("すべて");
  const [activeRegion, setActiveRegion]     = useState("すべての地域");
  const [currentPage, setCurrentPage]       = useState(0);
  const [heritages, setHeritages]           = useState([]);

  useEffect(() => {
  const fetchHeritages = async () => {
    try {
      const response = await axios.get("http://localhost:9990/topaboda/api/heritages", {
        params: {
          page: 0,
          size: 100,
        },
      });
      setHeritages(response.data);
    } catch (e) {
      console.error("국가유산 리스트 불러오기 실패:", e);
    }
  };

  fetchHeritages();
  }, []);

  const filtered = useMemo(() => {
    return heritages.filter(h => {
      const matchCat    = activeCategory === "すべて" || h.type === activeCategory;
      const matchRegion = activeRegion === "すべての地域" || h.region === activeRegion;
      const matchQuery  =
        !query ||
        h.nameKo?.includes(query) ||
        h.nameJa?.includes(query);

      return matchCat && matchRegion && matchQuery;
  });
  }, [heritages, activeCategory, activeRegion, query]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const displayed  = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const handleSearch   = () => { setQuery(searchInput); setCurrentPage(0); };
  const handleKeyDown  = (e) => { if (e.key === "Enter") handleSearch(); };
  const handleCategory = (cat) => { setActiveCategory(cat); setCurrentPage(0); };
  const handleRegion   = (reg) => { setActiveRegion(reg); setCurrentPage(0); };

  return (
    <div style={{ minHeight: "100vh", fontFamily: font, background: C.bg }}>

      <HeritageHero
        searchInput={searchInput}
        onSearchChange={e => setSearchInput(e.target.value)}
        onSearch={handleSearch}
        onKeyDown={handleKeyDown}
      />

      <HeritageFilters
        activeCategory={activeCategory}
        onCategoryChange={handleCategory}
        activeRegion={activeRegion}
        onRegionChange={handleRegion}
      />

      {/* 카드 그리드 */}
      <div style={{ padding: "40px 6% 60px", maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 24, fontFamily: font }}>
          {filtered.length}<span style={{ fontWeight: 400, color: C.textSub }}>件の遺産</span>
        </p>
        {displayed.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {displayed.map(item => <HeritageCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0", color: C.textSub, fontSize: 16, fontFamily: font }}>
            検索結果がありません。
          </div>
        )}

        {/* ── 페이지네이션 ── */}
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p - 1)}
        />
      </div>
    </div>
  );
}
