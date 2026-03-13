import React from "react";

import HeroSection from "../components/HeroSection"; 
import MapSection from "../components/MapSection";
import PopularHeritageSection from "../components/PopularHeritageSection";
export default function MainHome() {
  return (
    <main className="w-full bg-[#F8F9FC]">
      {/* 1. 히어로 섹션 (스크롤 잠금 및 원형 확장 효과) */}
      <HeroSection />

      {/* 2. 브릿지 & 지도 섹션 
         HeroSection 내부의 SearchFilter가 절대 위치로 떠 있으므로, 
         그 아래로 자연스럽게 이어지는 여백과 디자인을 추가합니다.
      */}
      <div className="relative pt-32 lg:pt-48">
        <MapSection />
      </div>

      {/* 3. 인기 유산 섹션 */}
      <PopularHeritageSection />
      
      {/* 푸터 등 추가... */}
    </main>
  );
}