import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── [1] 에셋 임포트 (하진님 로컬 경로 확인) ────────────────────────────────────────
import imgIconHeart from "../assets/icon_heart.svg";
import imgIconBookmark from "../assets/icon_bookmark.svg";
import imgIconLocation from "../assets/icon_location.svg";
import imgIconEye from "../assets/icon_heart_2.svg";

// ── [2] Design Tokens ─────────────────────────────────────────────────────────
const C = {
  navy: "#000d57",
  red: "#6e0000",
  gold: "#caca00",
  goldD: "#a0a000",
  bg: "#eeeeeeee",
  white: "#ffffff",
  gray1: "#364153",
  gray2: "#4a5565",
  gray3: "#6a7282",
  border: "#e5e7eb",
};
const fontSans = "'Noto Sans JP', 'Noto Sans KR', sans-serif";
const fontSerif = "'Shippori Mincho', serif";

// ── [3] 보조 컴포넌트: 별점 ───────────────────────────────────────────────────────────
function Stars({ score }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = score >= i ? 1 : score >= i - 0.5 ? 0.5 : 0;
        return (
          <div key={i} style={{ position: "relative", width: 12, height: 12 }}>
            <svg viewBox="0 0 12 12" width="12" height="12" style={{ position: "absolute" }}>
              <path d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8 3.4 9.2l.5-3L1.7 4.1l3-.4z" fill="#e5e7eb" />
            </svg>
            <div style={{ position: "absolute", width: `${filled * 100}%`, overflow: "hidden" }}>
              <svg viewBox="0 0 12 12" width="12" height="12">
                <path d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8 3.4 9.2l.5-3L1.7 4.1l3-.4z" fill="#f59e0b" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── [4] 보조 컴포넌트: 리뷰 카드 ───────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div style={{
      background: C.white, borderRadius: 10, padding: "20px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 14
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", background: C.navy,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <span style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>{review.initial}</span>
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 13, color: C.navy, margin: "0 0 2px" }}>{review.name}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Stars score={review.stars} />
            <span style={{ fontSize: 10, color: C.gray3 }}>{review.date}</span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: C.gray1, lineHeight: 1.6, margin: "0 0 10px" }}>{review.text}</p>
    </div>
  );
}

// ── [5] 메인 지도 섹션 컴포넌트 ────────────────────────────────────────────────────────
export default function MapSection() {
  const [hoveredPin, setHoveredPin] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  
  const constraintsRef = useRef(null);

  // ★ 확대 기준점: 1.5배 초과 시 클러스터가 개별 핀으로 변함
  const isZoomedIn = zoomLevel > 1.5;

  const MOCK_MAP_DATA = [
    { 
      id: 1, name: "崇礼門 (南大門)", x: "45%", y: "20%", count: 12, 
      category: "建造物", badge: "国宝第1号", 
      image: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1000&auto=format&fit=crop",
      desc: "ソウル駅의 인접한 곳에 위치하며, 조선시대 성곽의 정문으로서 한국의 국보 제1호입니다."
    },
    { 
      id: 2, name: "慶州 仏国寺", x: "70%", y: "65%", count: 8, 
      category: "寺院", badge: "国宝", 
      image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=1000&auto=format&fit=crop",
      desc: "慶州에 위치한 신라 시대의 대표적인 사찰로, 불교 예술의 정수로 꼽히는 세계문화유산입니다."
    }
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
      
      {/* ── [A] 메인 지도 영역 ──────────────────────────────────────────────────────── */}
      <div 
        ref={constraintsRef}
        className="relative flex-1 h-full overflow-hidden bg-[#E3E7ED]"
        onWheel={handleWheel}
      >
        <motion.div 
          drag
          dragConstraints={constraintsRef}
          dragMomentum={true}
          animate={{ scale: zoomLevel }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {/* 지도 캔버스 (대한민국 누끼 이미지 배경용) */}
          <div className="relative w-[1200px] h-[1600px] bg-white/40 border-2 border-dashed border-gray-300 rounded-[80px] flex items-center justify-center shadow-inner select-none">
             <span className="text-8xl font-black text-gray-200 opacity-40 uppercase tracking-tighter">Korea Map Area</span>
             
             {/* 📍 가변 마커 (클러스터 ↔ 핀) */}
             {MOCK_MAP_DATA.map((pin) => (
              <div key={pin.id} className="absolute z-20" style={{ left: pin.x, top: pin.y }}>
                <motion.div 
                  onMouseEnter={() => setHoveredPin(pin)}
                  onMouseLeave={() => setHoveredPin(null)}
                  onPointerDown={(e) => e.stopPropagation()} 
                  onClick={() => setSelectedPlace(pin)}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="relative cursor-pointer"
                >
                  <AnimatePresence mode="wait">
                    {!isZoomedIn ? (
                      /* [상태 1] 클러스터 모드: 네이비 + 골드 테두리 */
                      <motion.div
                        key="cluster"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative w-14 h-14 bg-[#000D57] text-white rounded-full flex items-center justify-center shadow-2xl border-[3px] border-[#CACA00] font-black text-lg"
                      >
                        {pin.count}
                        <div className="absolute inset-0 bg-[#CACA00] rounded-full animate-ping opacity-10" />
                      </motion.div>
                    ) : (
                      /* [상태 2] 개별 핀 모드: 핀 아이콘 + 이름표 */
                      <motion.div
                        key="pin"
                        initial={{ scale: 0.8, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 10 }}
                        className="flex flex-col items-center"
                      >
                        <div className="bg-white px-3 py-1 rounded-full shadow-md mb-1 border border-gray-100">
                          <span className="text-[11px] font-black text-[#000D57] whitespace-nowrap uppercase tracking-tighter">{pin.name}</span>
                        </div>
                        <img src={imgIconLocation} alt="pin" className="w-10 h-10 drop-shadow-lg" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 호버 미리보기 (사이드바가 닫혀있을 때만 노출) */}
                  <AnimatePresence>
                    {hoveredPin?.id === pin.id && !selectedPlace && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, x: "-50%" }}
                        className="absolute bottom-full mb-6 left-1/2 w-64 bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.2)] p-4 z-50 pointer-events-none"
                      >
                        <img src={pin.image} className="w-full h-36 object-cover rounded-2xl mb-3" alt="" />
                        <div className="text-[#000D57] font-black text-lg text-center tracking-tight">{pin.name}</div>
                        <div className="text-xs text-[#CACA00] font-bold text-center mt-1">{pin.badge}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 줌 컨트롤 UI */}
        <div className="absolute bottom-10 left-10 flex flex-col gap-3 z-30">
          <button onClick={() => setZoomLevel(p => Math.min(p + 0.2, 3))} className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl font-bold text-3xl hover:bg-white transition-all text-[#000D57]">+</button>
          <button onClick={() => setZoomLevel(p => Math.max(p - 0.2, 0.5))} className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl font-bold text-3xl hover:bg-white transition-all text-[#000D57]">-</button>
        </div>
      </div>

      {/* ── [B] 우측 상세 사이드바 ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.aside 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="w-[500px] h-full bg-white z-40 shadow-[-15px_0_50px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden border-l border-gray-100"
          >
            {/* 상단 닫기 버튼 */}
            <button 
              onClick={() => setSelectedPlace(null)}
              className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center bg-black/40 text-white rounded-full z-50 hover:bg-black/60 transition-all"
            >✕</button>

            {/* 스크롤 본문 */}
            <div className="flex-1 overflow-y-auto no-scrollbar" style={{ background: C.bg }}>
              
              {/* 히어로 이미지 */}
              <div style={{ position: "relative", height: 320, background: "#101828" }}>
                <img src={selectedPlace.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)" }} />
                
                {/* 액션 버튼 그룹 */}
                <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 10 }}>
                  <button onClick={() => setSaved(!saved)} style={{ width: 42, height: 42, borderRadius: "50%", background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? C.navy : "none"} stroke={C.navy} strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </button>
                  <button onClick={() => setLiked(!liked)} style={{ padding: "0 14px", height: 42, borderRadius: 999, background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill={liked ? "#e11d48" : "none"} stroke={liked ? "#e11d48" : C.gray2} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.gray1 }}>248</span>
                  </button>
                </div>

                {/* 국보 배지 */}
                <div style={{ position: "absolute", bottom: 20, left: 20, background: `linear-gradient(to bottom, ${C.gold}, ${C.goldD})`, borderRadius: 8, padding: "6px 16px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: C.navy, fontFamily: fontSans }}>国宝</span>
                </div>
              </div>

              {/* 본문 콘텐츠 */}
              <div style={{ padding: "28px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ background: C.red, color: C.white, borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>{selectedPlace.category}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>{selectedPlace.badge}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <h1 style={{ fontSize: 32, fontWeight: 700, color: C.navy, fontFamily: fontSerif }}>{selectedPlace.name}</h1>
                </div>
                <p style={{ fontSize: 15, color: C.gray2, marginBottom: 24 }}>{selectedPlace.name} 상세 정보</p>

                {/* 정보 카드 그리드 */}
                <div style={{ background: C.white, borderRadius: 10, padding: "20px 24px", marginBottom: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                   {[
                     { label: "所在地", value: "ソウル特別市" },
                     { label: "時代", value: "朝鮮時代" },
                     { label: "分類", value: "史跡・城郭" },
                   ].map((item, i) => (
                     <div key={i} style={{ display: "flex", gap: 8, flexDirection: "column", borderRight: i < 2 ? `1px solid ${C.border}` : "none", paddingLeft: i > 0 ? 12 : 0 }}>
                       <p style={{ fontSize: 11, color: C.gray3, margin: 0 }}>{item.label}</p>
                       <p style={{ fontSize: 12, fontWeight: 700, color: C.navy, margin: 0, lineHeight: 1.4 }}>{item.value}</p>
                     </div>
                   ))}
                </div>

                {/* 액션 버튼 */}
                <div style={{ display: "flex", gap: 14, marginBottom: 36 }}>
                  <button style={{ flex: 1, height: 48, background: C.navy, color: C.white, borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>ルートに追加</button>
                  <button style={{ flex: 1, height: 48, background: C.white, border: `1px solid ${C.navy}`, color: C.navy, borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Googleマップ</button>
                </div>

                {/* 리뷰 섹션 */}
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: C.navy, fontFamily: fontSerif }}>口コミ</h2>
                  <button style={{ color: C.red, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>投稿</button>
                </div>
                {/* 리뷰 카드 예시 */}
                <ReviewCard review={{ initial: "田", name: "田中太郎", date: "2024.02.28", stars: 4.5, text: "アクセスが非常に便利です。夜のライトアップも美しく...", helpful: 24 }} />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </section>
  );
}