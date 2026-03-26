import React from "react";

import HeroSection from "../components/HeroSection";
import MapSection from "../components/MapSection";
import PopularHeritageSection from "../components/mainhome/PopularHeritageSection";
export default function MainHome() {
    return (
        <main className="w-full bg-[#F8F9FC]">
            {/* 1. 히어로 섹션 */}
            <section id="section-hero">
                <HeroSection />
            </section>

            {/* 2. 지도 섹션 */}
            <section id="section-map" className="relative pt-32 lg:pt-48 mb-16">
                {<MapSection />}
            </section>

            {/* 3. 인기 유산 섹션 */}
            <section id="section-popular" className="sticky top-[5.5rem] z-10">
                <PopularHeritageSection />
            </section>

            {/* 푸터 등 추가... */}
        </main>
    );
}
