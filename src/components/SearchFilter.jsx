import React, { useState, useEffect } from "react";
// 아이콘 임포트
import imgIconSearchNavy from "../assets/icon_search_navy.svg";
import imgIconFilter from "../assets/icon_filter.svg";
import imgIconChevron from "../assets/icon_chevron_down.svg";
import imgIconSearchWht from "../assets/icon_search_white.svg";

export default function SearchFilter() {
  const [isSticky, setIsSticky] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [heritageType, setHeritageType] = useState("all");
  const [theme, setTheme] = useState("all");

  useEffect(() => {
    const handleScroll = () => {
      // 600px 이상 스크롤되면 오른쪽 하단 플로팅 버튼으로 변신
      if (window.scrollY > 600) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
        setIsExpanded(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    /* 고스트 박스: 원래 자리를 유지하여 레이아웃 흔들림 방지 */
    <div className="relative w-full px-[10%] lg:px-[13.2%] z-50">
      <section
        className={`transition-all duration-500 + cubic-bezier(0.68, -0.6, 0.32, 1.6)
          ${isSticky
            ? "fixed bottom-10 right-[5%] lg:right-[8%] flex justify-end pointer-events-none"
            : "relative -mt-12 pointer-events-auto w-full" /* ★ 스크롤 전: 배너 하단에 겹쳐진 원래 위치 */
          }`}
      >
        <div
          className={`shadow-2xl transition-all duration-700 ease-in-out pointer-events-auto
    ${isSticky && !isExpanded
              ? "w-16 h-16 rounded-full flex flex-col items-center justify-center !bg-[#6E0000] cursor-pointer hover:scale-110 border-none shadow-[0_10px_30px_rgba(110,0,0,0.4)]"
              : "w-full rounded-3xl p-4 md:p-5 bg-white" /* 스크롤 전에는 다시 하얀색 배경 */
            } 
    ${isExpanded ? "w-[90vw] max-w-[1000px] !bg-white border-2 border-[#000D57]/20" : ""}`}
          onClick={() => isSticky && !isExpanded && setIsExpanded(true)}
        >

          {/* 1. 축소 모드: 지도 위를 떠다니는 빨간 돋보기 버튼 */}
          {isSticky && !isExpanded ? (
            <div className="flex flex-col items-center justify-center">
              <img src={imgIconSearchWht} alt="search" className="w-6 h-6" />
              
            </div>
          ) : (

            /* 2. 전체 검색필드 모드: 원래 형태 및 확장된 형태 */
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 animate-fadeIn">

              {/* 검색어 입력창 */}
              <div className="flex-1 relative w-full">
                <img
                  src={imgIconSearchNavy}
                  alt=""
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="国家遺産検索（例：景福宮, 慶州）"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 h-10 text-[16px] border-2 border-[#000D57]/10 focus:border-[#000D57] rounded-3xl outline-none font-sans"
                />
              </div>

              {/* 유산 유형 필터 */}
              <div className="w-full lg:w-[200px] relative">
                <img src={imgIconFilter} alt="" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60 z-10 pointer-events-none" />
                <select
                  value={heritageType}
                  onChange={(e) => setHeritageType(e.target.value)}
                  className="w-full h-10 pl-10 pr-10 border-2 border-[#000D57]/10 rounded-3xl appearance-none outline-none focus:border-[#000D57] bg-white cursor-pointer"
                >
                  <option value="all">全体 (タイプ)</option>
                  <option value="national-treasure">国宝</option>
                  <option value="treasure">宝物</option>
                  <option value="historic-site">史跡</option>
                </select>
                <img src={imgIconChevron} alt="" className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none" />
              </div>

              {/* 테마 필터 */}
              <div className="w-full lg:w-[200px] relative">
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full h-10 pl-4 pr-10 border-2 border-[#000D57]/10 rounded-3xl appearance-none outline-none focus:border-[#000D57] bg-white cursor-pointer"
                >
                  <option value="all">全体 (テーマ)</option>
                  <option value="architecture">建築</option>
                  <option value="royal">王室</option>
                  <option value="nature">自然</option>
                </select>
                <img src={imgIconChevron} alt="" className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none" />
              </div>

              {/* 검색 버튼 영역 */}
              <div className="flex items-center gap-2">
                <button className="w-full lg:w-auto h-10 px-6 bg-[#6E0000] hover:bg-[#000D57] text-white font-medium rounded-3xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                  <img src={imgIconSearchWht} alt="" className="w-5 h-5" />
                  検索
                </button>

                {/* 확장된 상태에서만 보이는 닫기 버튼 */}
                {isExpanded && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}