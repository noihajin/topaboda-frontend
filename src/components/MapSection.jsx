import React from "react";

export default function MapSection() {
  return (
    <section className="w-full px-[10%] py-40">
      <h2 className="text-2xl font-bold mb-20 font-title text-[#000D57] text-center">
      地域別の国宝探索
      </h2>
      
      {/* 실제 지도가 들어갈 자리입니다. */}
      <div 
        className="w-full h-[1000px] bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500"
      >
        여기에 지도가 렌더링될 예정입니다 (API 연동 대기 중)
      </div>
    </section>
  );
}