import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ★ [추가] 페이지 이동을 위한 임포트

// 아이콘 임포트
import imgIconHeart from "../assets/icon_heart.svg";
import imgIconBookmark from "../assets/icon_bookmark.svg";
import imgIconLocation from "../assets/icon_location.svg";
import imgIconEye from "../assets/icon_heart_2.svg";
import icComment from "../assets/community/icon_comment_c.svg"; // 댓글 아이콘 등

const C = {
  navy: "#000d57", red: "#6e0000", gold: "#caca00", goldD: "#a0a000",
  bg: "#f3f4f6", white: "#ffffff", gray1: "#364153", gray2: "#4a5565",
  gray3: "#6a7282", border: "#e5e7eb",
};

const fontSans = "'Noto Sans JP', 'Noto Sans KR', sans-serif";
const fontSerif = "'Shippori Mincho', serif";

export default function MapSection() {
  const navigate = useNavigate(); // ★ [추가] 네비게이트 함수 생성
  
  const [hoveredPin, setHoveredPin] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  
  const constraintsRef = useRef(null);
  const isZoomedIn = zoomLevel > 1.5;

  const MOCK_MAP_DATA = [
    { id: 1, name: "崇礼門 (南대문)", x: "45%", y: "20%", count: 12, category: "建造物", badge: "国宝第1号", image: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1000&auto=format&fit=crop", desc: "ソウル駅の近くに位置する、朝鮮時代に創建されたソウルの正門です。" },
    { id: 2, name: "慶州 仏国寺", x: "70%", y: "65%", count: 8, category: "寺院", badge: "国宝", image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=1000&auto=format&fit=crop", desc: "ユネスコ世界文化遺産にも登録されている新羅時代の代表的な寺院です。" }
  ];

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
    }
  };

  return (
    <section className="relative w-full h-screen bg-[#F0F2F5] overflow-hidden flex">
      
      {/* ── [A] 지도 캔버스 영역 ── */}
      <div ref={constraintsRef} className="relative flex-1 h-full overflow-hidden bg-[#E3E7ED]" onWheel={handleWheel}>
        <motion.div 
          drag dragConstraints={constraintsRef} dragMomentum={true}
          animate={{ scale: zoomLevel }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {/* 지도 배경 및 핀 렌더링 (기존 로직 동일) */}
          <div className="relative w-[1200px] h-[1600px] bg-white/40 border-2 border-dashed border-gray-300 rounded-[80px] flex items-center justify-center shadow-inner select-none">
             {MOCK_MAP_DATA.map((pin) => (
              <div key={pin.id} className="absolute z-20" style={{ left: pin.x, top: pin.y }}>
                <motion.div 
                  onMouseEnter={() => setHoveredPin(pin)} onMouseLeave={() => setHoveredPin(null)}
                  onPointerDown={(e) => e.stopPropagation()} 
                  onClick={() => setSelectedPlace(pin)}
                  className="relative cursor-pointer"
                >
                  {/* 줌 레벨에 따른 핀/클러스터 전환 로직 (생략 없이 사용) */}
                  {!isZoomedIn ? (
                    <div className="w-14 h-14 bg-[#000D57] text-white rounded-full flex items-center justify-center shadow-2xl border-[3px] border-[#CACA00] font-black text-lg">{pin.count}</div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="bg-white px-3 py-1 rounded-full shadow-md mb-1"><span className="text-[11px] font-black text-[#000D57]">{pin.name}</span></div>
                      <img src={imgIconLocation} alt="pin" className="w-10 h-10 drop-shadow-lg" />
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* 줌 컨트롤 */}
        <div className="absolute bottom-10 left-10 flex flex-col gap-3 z-30">
          <button onClick={() => setZoomLevel(p => Math.min(p + 0.2, 3))} className="w-14 h-14 bg-white/90 rounded-2xl shadow-xl font-bold text-3xl">+</button>
          <button onClick={() => setZoomLevel(p => Math.max(p - 0.2, 0.5))} className="w-14 h-14 bg-white/90 rounded-2xl shadow-xl font-bold text-3xl">-</button>
        </div>
      </div>

      {/* ── [B] 우측 상세 사이드바 (글쓰기 버튼 추가) ── */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.aside 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="w-[500px] h-full bg-white z-40 shadow-[-20px_0_60px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden border-l border-gray-100"
          >
            <button onClick={() => setSelectedPlace(null)} className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center bg-black/40 text-white rounded-full z-50">✕</button>

            <div className="flex-1 overflow-y-auto no-scrollbar" style={{ background: "#f8f9fc" }}>
              {/* 히어로 이미지 영역 */}
              <div style={{ position: "relative", height: 320, background: "#101828" }}>
                <img src={selectedPlace.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)" }} />
                
                {/* 좋아요/저장 버튼 */}
                <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 10 }}>
                  <button onClick={() => setSaved(!saved)} style={{ width: 42, height: 42, borderRadius: "50%", background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? C.navy : "none"} stroke={C.navy} strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </button>
                  <button onClick={() => setLiked(!liked)} style={{ padding: "0 14px", height: 42, borderRadius: 999, background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill={liked ? "#e11d48" : "none"} stroke={liked ? "#e11d48" : C.gray2} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>248</span>
                  </button>
                </div>
              </div>

              {/* 본문 콘텐츠 */}
              <div style={{ padding: "28px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ background: C.red, color: "white", borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>{selectedPlace.category}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>{selectedPlace.badge}</span>
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: C.navy, fontFamily: fontSerif, marginBottom: 24 }}>{selectedPlace.name}</h1>
                
                {/* ★ [수정] 액션 버튼: 글쓰기 연결 및 디자인 최적화 */}
                <div style={{ display: "flex", gap: 14, marginBottom: 36 }}>
                  <button 
                    onClick={() => navigate("/community/write")} // ★ 글쓰기 페이지로 이동
                    style={{ 
                      flex: 1, height: 52, background: C.navy, color: "white", 
                      borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: "pointer",
                      border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                    }}
                  >
                    📝 レビューを書く
                  </button>
                  <button style={{ 
                    flex: 1, height: 52, background: "white", color: C.navy, 
                    borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: "pointer",
                    border: `1.5px solid ${C.navy}`
                  }}>
                    🗺️ 経路に追加
                  </button>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: C.navy, fontFamily: fontSerif }}>口コミ</h2>
                </div>
                {/* 리뷰 카드 (생략 가능) */}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </section>
  );
}