import React from "react";
import heroBg from "../assets/hero_background.png";
import SearchFilter from "./SearchFilter";

export default function HeroSection() {
  return (
    <div style={{ position: "relative" }}>
      {/* ── 메인 히어로 섹션 ── */}
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "820px",
          margin: 0,
          padding: 0,
          overflow: "hidden",
          zIndex: 1,
          // 배경 이미지 설정: 즉시 전체 화면에 보이도록 적용
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* ── 텍스트 영역 (주석 해제 필요 시 h1 부분의 주석을 푸세요) ── */}
        <div
          className="hidden md:block font-title"
          style={{
            position: "absolute",
            top: "350px",
            left: "10%",
            zIndex: 10,
            opacity: 1, // 애니메이션 없이 즉시 표시
            transform: "translateY(0)", // 고정 위치
          }}
        >
          {/* <h1 style={{
            fontSize: "clamp(40px, 5vw, 60px)",
            color: "#000D57",
            fontFamily: "'Noto Serif JP', serif",
            fontWeight: "500",
            margin: 0, 
            lineHeight: "1.2",
          }}>
            韓国の宝を<br />隅々とトパボダ
          </h1> 
          */}
        </div>
      </section>

      {/* ── 하단 검색 필터 컴포넌트 ── */}
      <SearchFilter />
    </div>
  );
}