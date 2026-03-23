import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// 아이콘 임포트
import imgIconSearchNavy from "../assets/icon_search_navy.svg";
import imgIconChevron from "../assets/icon_chevron_down.svg";
import imgIconSearchWht from "../assets/icon_search_white.svg";

const TYPE_OPTIONS = [
  { value: "all",               label: "タイプ (全体)" },
  { value: "national-treasure", label: "国宝" },
  { value: "treasure",          label: "宝物" },
  { value: "historic-site",     label: "史跡" },
];
const THEME_OPTIONS = [
  { value: "all",          label: "テーマ (全体)" },
  { value: "architecture", label: "建築" },
  { value: "royal",        label: "王室" },
  { value: "nature",       label: "自然" },
];

function SearchFilter() {
  const [isVisible, setIsVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [heritageType, setHeritageType] = useState("all");
  const [theme, setTheme] = useState("all");
  const [isTypeOpen, setIsTypeOpen]   = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const typeRef  = useRef(null);
  const themeRef = useRef(null);

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

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (typeRef.current  && !typeRef.current.contains(e.target))  setIsTypeOpen(false);
      if (themeRef.current && !themeRef.current.contains(e.target)) setIsThemeOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <div className="w-full bg-white rounded-[32px] lg:rounded-[999px] p-4 lg:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-gray-100 transition-all">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-4 px-2 lg:px-2">
            
            {/* 검색어 입력창 */}
            <div className="flex-1 relative w-full">
              <img
                src={imgIconSearchNavy}
                alt=""
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 pointer-events-none"
              />
              <input
                type="text"
                placeholder="国家遺産を検索（例：景福宮、慶州）"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 h-12 text-[15px] border-none bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#000D57]/10 rounded-[999px] outline-none transition-all"
              />
            </div>

            {/* 필터 세트 */}
            <div className="grid grid-cols-2 lg:flex lg:flex-row items-center gap-3 w-full lg:w-auto">

              {/* 타입 드롭다운 */}
              <div ref={typeRef} className="relative">
                <button
                  onClick={() => { setIsTypeOpen(!isTypeOpen); setIsThemeOpen(false); }}
                  className="w-full h-12 pl-6 pr-10 bg-gray-50/50 rounded-[999px] outline-none cursor-pointer text-xs font-bold flex items-center justify-between whitespace-nowrap border border-gray-100 hover:bg-white transition-all"
                >
                  <span className="text-[#000D57]">
                    {TYPE_OPTIONS.find(o => o.value === heritageType)?.label}
                  </span>
                  <img
                    src={imgIconChevron}
                    alt=""
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 transition-transform duration-300"
                    style={{ transform: `translateY(-50%) rotate(${isTypeOpen ? 180 : 0}deg)` }}
                  />
                </button>
                <AnimatePresence>
                  {isTypeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: "absolute", top: "calc(100% + 8px)", left: 0,
                        minWidth: "100%", background: "white", borderRadius: 16,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                        border: "1px solid #e5e7eb", overflow: "hidden", zIndex: 100,
                      }}
                    >
                      {TYPE_OPTIONS.map(opt => (
                        <div
                          key={opt.value}
                          onClick={() => { setHeritageType(opt.value); setIsTypeOpen(false); }}
                          className="hover:bg-gray-50 transition-colors"
                          style={{
                            padding: "13px 22px", fontSize: 13, fontWeight: 700,
                            color: heritageType === opt.value ? "#000D57" : "#4a5565",
                            cursor: "pointer", whiteSpace: "nowrap",
                            background: heritageType === opt.value ? "rgba(0,13,87,0.05)" : undefined,
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 테마 드롭다운 */}
              <div ref={themeRef} className="relative">
                <button
                  onClick={() => { setIsThemeOpen(!isThemeOpen); setIsTypeOpen(false); }}
                  className="w-full h-12 pl-6 pr-10 bg-gray-50/50 rounded-[999px] outline-none cursor-pointer text-xs font-bold flex items-center justify-between whitespace-nowrap border border-gray-100 hover:bg-white transition-all"
                >
                  <span className="text-[#000D57]">
                    {THEME_OPTIONS.find(o => o.value === theme)?.label}
                  </span>
                  <img
                    src={imgIconChevron}
                    alt=""
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 transition-transform duration-300"
                    style={{ transform: `translateY(-50%) rotate(${isThemeOpen ? 180 : 0}deg)` }}
                  />
                </button>
                <AnimatePresence>
                  {isThemeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: "absolute", top: "calc(100% + 8px)", left: 0,
                        minWidth: "100%", background: "white", borderRadius: 16,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                        border: "1px solid #e5e7eb", overflow: "hidden", zIndex: 100,
                      }}
                    >
                      {THEME_OPTIONS.map(opt => (
                        <div
                          key={opt.value}
                          onClick={() => { setTheme(opt.value); setIsThemeOpen(false); }}
                          className="hover:bg-gray-50 transition-colors"
                          style={{
                            padding: "13px 22px", fontSize: 13, fontWeight: 700,
                            color: theme === opt.value ? "#000D57" : "#4a5565",
                            cursor: "pointer", whiteSpace: "nowrap",
                            background: theme === opt.value ? "rgba(0,13,87,0.05)" : undefined,
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* 검색 버튼 */}
            <button className="w-full lg:w-14 h-12 bg-[#6E0000] hover:bg-[#000D57] text-white rounded-[999px] lg:rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl group">
              <img src={imgIconSearchWht} alt="search" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="lg:hidden ml-2 font-bold text-sm">検索する</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SearchFilter;