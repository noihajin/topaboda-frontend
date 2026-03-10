import React, { useState } from "react";
// ★ 1. 피그마에서 추출한 로컬 아이콘 임포트
import imgIconSearchNavy from "../assets/icon_search_navy.svg"; // 입력창용 남색 돋보기
import imgIconFilter from "../assets/icon_filter.svg";          // 필터 아이콘
import imgIconChevron from "../assets/icon_chevron_down.svg";  // 화살표 아이콘
import imgIconSearchWht from "../assets/icon_search_white.svg"; // 버튼용 흰색 돋보기

export default function SearchFilter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [heritageType, setHeritageType] = useState("all");
  const [theme, setTheme] = useState("all");

  return (
    <section className="relative z-10 -mt-12">
      <div className="w-full px-[10%] lg:px-[13.2%]">
        <div className="bg-white rounded-3xl  shadow-2xl p-4">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            
            {/* 1. 검색어 입력창 */}
            <div className="flex-1 relative w-full">
              {/* ★ 2. 기존 SVG 대신 img 태그 사용, imported 변수 적용 */}
              <img 
                src={imgIconSearchNavy} 
                alt="" 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 pointer-events-none" 
              />
              <input
                type="text"
                placeholder="国家遺産検索（例：景福宮、石窟庵、天文台）"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 h-10 text-[16px] border-2 border-[#000D57]/10 focus:border-[#000D57] rounded-3xl outline-none transition-colors font-sans"
              />
            </div>

            {/* 2. 유산 유형 필터 */}
            <div className="w-full lg:w-[240px] relative">
              {/* ★ 3. 필터 아이콘 적용 */}
              <img 
                src={imgIconFilter} 
                alt="" 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60 z-10 pointer-events-none" 
              />
              <select 
                value={heritageType} 
                onChange={(e) => setHeritageType(e.target.value)}
                className="w-full h-10 pl-10 pr-10 border-2 border-[#000D57]/10 rounded-3xl appearance-none outline-none focus:border-[#000D57] bg-white cursor-pointer font-sans"
              >
                <option value="all">全体</option>
                <option value="national-treasure">국보</option>
                <option value="treasure">보물</option>
                <option value="historic-site">사적</option>
                <option value="natural-monument">천연기념물</option>
                <option value="intangible">무형문화재</option>
              </select>
              {/* ★ 4. 화살표 아이콘 적용 */}
              <img 
                src={imgIconChevron} 
                alt="" 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none" 
              />
            </div>

            {/* 3. 테마 필터 */}
            <div className="w-full lg:w-[240px] relative">
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="w-full h-10 pl-4 pr-10 border-2 border-[#000D57]/10 rounded-3xl appearance-none outline-none focus:border-[#000D57] bg-white cursor-pointer font-sans"
              >
                <option value="all">全体テーマ</option>
                <option value="architecture">건축</option>
                <option value="religion">종교</option>
                <option value="royal">왕실</option>
                <option value="nature">자연</option>
                <option value="art">예술</option>
                <option value="archaeology">고고학</option>
              </select>
              {/* ★ 5. 여기도 화살표 아이콘 적용 */}
              <img 
                src={imgIconChevron} 
                alt="" 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none" 
              />
            </div>

            {/* 4. 검색 버튼 */}
            <button className="w-full lg:w-auto h-10 px-6 bg-[#6E0000] hover:bg-[#000D57] text-white font-medium rounded-3xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
              {/* ★ 6. 흰색 검색 아이콘 적용 */}
              <img src={imgIconSearchWht} alt="" className="w-5 h-5" />
              検索
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}