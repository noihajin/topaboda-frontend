import React, { useState, useEffect } from "react";
// 아이콘 임포트
import imgIconSearchNavy from "../assets/icon_search_navy.svg";
import imgIconFilter from "../assets/icon_filter.svg";
import imgIconChevron from "../assets/icon_chevron_down.svg";
import imgIconSearchWht from "../assets/icon_search_white.svg";

export default function SearchFilter() {
  const [isVisible, setIsVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [heritageType, setHeritageType] = useState("all");
  const [theme, setTheme] = useState("all");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 550) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full px-[10%] lg:px-[13.2%] z-50 h-20">
      <section
        className={`relative -mt-16 w-full transition-all duration-700 ease-in-out
          ${
            isVisible
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        style={{ fontFamily: "'Noto Sans JP', 'Noto Sans KR', sans-serif" }}
      >
        {/* ★ 수정 포인트 1: rounded-[999px]를 lg: 브레이크포인트 전용으로 변경 
          lg 미만(세로형)일 때는 rounded-[32px]를 적용하여 내부 요소 침범 방지
        */}
        <div className="w-full bg-white rounded-[32px] lg:rounded-[999px] p-4 lg:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-gray-100 transition-all">
          {/* ★ 수정 포인트 2: 모바일(flex-col)일 때 간격(gap)과 패딩(px-2) 조정
           */}
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-4 px-2 lg:px-2 animate-fadeIn">
            {/* 검색어 입력창 */}
            <div className="flex-1 relative w-full">
              <img
                src={imgIconSearchNavy}
                alt=""
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 pointer-events-none"
              />
              {/* 모바일에서도 개별 입력창은 둥근 형태 유지 */}
              <input
                type="text"
                placeholder="国家遺産を検索（例：景福宮、慶州）"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 h-12 text-[15px] border-none bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#000D57]/10 rounded-[999px] outline-none transition-all"
              />
            </div>

            {/* 필터 세트: 모바일에서 가로 2열로 배치하면 높이를 줄일 수 있어 더 세련되어 보입니다 */}
            <div className="grid grid-cols-2 lg:flex lg:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative">
                <select
                  value={heritageType}
                  onChange={(e) => setHeritageType(e.target.value)}
                  className="w-full h-12 pl-6 pr-10 border-none bg-gray-50/50 rounded-[999px] appearance-none outline-none focus:ring-2 focus:ring-[#000D57]/10 cursor-pointer text-xs font-bold"
                >
                  <option value="all">タイプ (全体)</option>
                  <option value="national-treasure">国宝</option>
                  <option value="treasure">宝物</option>
                  <option value="historic-site">史跡</option>
                </select>
                <img
                  src={imgIconChevron}
                  alt=""
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none"
                />
              </div>

              <div className="relative">
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full h-12 pl-6 pr-10 border-none bg-gray-50/50 rounded-[999px] appearance-none outline-none focus:ring-2 focus:ring-[#000D57]/10 cursor-pointer text-xs font-bold"
                >
                  <option value="all">テーマ (全体)</option>
                  <option value="architecture">建築</option>
                  <option value="royal">王室</option>
                  <option value="nature">自然</option>
                </select>
                <img
                  src={imgIconChevron}
                  alt=""
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none"
                />
              </div>
            </div>

            {/* 검색 버튼 */}
            <button className="w-full lg:w-14 h-12 bg-[#6E0000] hover:bg-[#000D57] text-white rounded-[999px] lg:rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl group">
              <img
                src={imgIconSearchWht}
                alt="search"
                className="w-5 h-5 group-hover:scale-110 transition-transform"
              />
              {/* PC에서는 돋보기만, 모바일에서는 텍스트도 노출 (선택 사항) */}
              <span className="lg:hidden ml-2 font-bold text-sm">検索する</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
