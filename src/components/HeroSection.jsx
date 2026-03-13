import React, { useState, useEffect, useRef } from "react";
import heroBg from "../assets/hero_background.png";
import SearchFilter from "./SearchFilter";

export default function HeroSection() {
  const sectionRef  = useRef(null);
  const progressRef = useRef(0);        // 0 ~ 1 (ref로 관리해 이벤트 핸들러에서 최신값 참조)
  const lockedRef   = useRef(true);     // 스크롤 잠금 여부
  const [clipSize, setClipSize] = useState(0); // 렌더링용 state

  useEffect(() => {
    // ── 휠 이벤트 가로채기 ──────────────────────────────────────
    const handleWheel = (e) => {
      if (!lockedRef.current) return; // 이미 해제됐으면 통과

      e.preventDefault(); // 페이지 스크롤 차단

      const delta    = e.deltaY;
      const SPEED    = 0.0015; // 휠 한 틱당 진행 속도 (조절 가능)
      const next     = Math.min(1, Math.max(0, progressRef.current + delta * SPEED));
      progressRef.current = next;

      const size = next * 150;
      setClipSize(size);

      // 완전히 열리면 잠금 해제
      if (next >= 1) {
        lockedRef.current = false;
        document.body.style.overflow = "";
      }
    };

    // ── 터치 지원 ────────────────────────────────────────────────
    let touchStartY = 0;
    const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove  = (e) => {
      if (!lockedRef.current) return;
      e.preventDefault();

      const delta = touchStartY - e.touches[0].clientY; // 위로 스와이프 = 양수
      const SPEED = 0.003;
      const next  = Math.min(1, Math.max(0, progressRef.current + delta * SPEED));
      progressRef.current = next;
      touchStartY = e.touches[0].clientY;

      setClipSize(next * 150);

      if (next >= 1) {
        lockedRef.current = false;
        document.body.style.overflow = "";
      }
    };

    // 잠금 초기화
    document.body.style.overflow = "hidden";
    lockedRef.current = true;
    progressRef.current = 0;
    setClipSize(0);

    window.addEventListener("wheel",      handleWheel,      { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove",  handleTouchMove,  { passive: false });

    return () => {
      // 언마운트 시 반드시 잠금 해제
      document.body.style.overflow = "";
      window.removeEventListener("wheel",      handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove",  handleTouchMove);
    };
  }, []);

  const clipPath    = `circle(${clipSize}% at 50% 40%)`;
  const textOpacity = Math.min(1, Math.max(0, (clipSize - 60) / 60));
  const textY       = Math.max(0, 20 - (clipSize - 60) / 3);

  return (
    <div style={{ position: "relative" }}>

      {/* 원이 열리기 전 보이는 네이비 배경 */}
      <div style={{
        position: "absolute", inset: 0,
        width: "100%", height: "820px",
        background: "#ffffff", zIndex: 0,
      }} />

      <section
        ref={sectionRef}
        style={{
          position: "relative",
          width: "100%", height: "820px",
          margin: 0, padding: 0,
          overflow: "hidden", zIndex: 1,
        }}
      >
        {/* 원형으로 열리는 배경 이미지 */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          clipPath,
          transition: "clip-path 0.06s linear",
          willChange: "clip-path",
        }} />

        {/* 진행률 힌트: 하단 중앙 화살표 (완전히 열리면 사라짐) */}
        <div style={{
          position: "absolute",
          bottom: 40, left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          opacity: Math.max(0, 1 - clipSize / 30), // 처음에만 보임
          transition: "opacity 0.3s ease",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          color: "#ffffff", fontSize: 13, fontFamily: "sans-serif",
          pointerEvents: "none",
        }}>
          <span>スクロールして探索する</span>
          {/* 아래로 튀는 화살표 */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            style={{ animation: "bounce 1.4s infinite" }}>
            <path d="M12 5v14M5 12l7 7 7-7" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50%       { transform: translateY(6px); }
            }
          `}</style>
        </div>

        {/* 텍스트: clipSize 60~120 구간에서 페이드인 */}
        <div
          className="hidden md:block font-title"
          style={{
            position: "absolute",
            top: "350px", left: "10%",
            zIndex: 10,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            transition: "opacity 0.1s ease, transform 0.1s ease",
          }}
        >
          {/* <h1 style={{
            fontSize: "clamp(40px, 5vw, 60px)",
            color: "#000D57",
            fontFamily: "'Noto Serif JP', serif",
            fontWeight: "500",
            margin: 0, lineHeight: "1.2",
          }}>
            韓国の宝を<br />隅々とトパボダ
          </h1> */}
        </div>
      </section>

      <SearchFilter />
    </div>
  );
}