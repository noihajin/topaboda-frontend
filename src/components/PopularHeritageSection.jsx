import React, { useState } from "react";
// ★ 1. 피그마에서 추출한 로컬 아이콘 임포트
import imgIconHeart from "../assets/icon_heart.svg";       // 하트 (북마크)
import imgIconLocation from "../assets/icon_location.svg"; // 위치 핀
import imgIconStar from "../assets/icon_star.svg";         // 별점
import imgIconEye from "../assets/icon_heart_2.svg";           // 조회수

export default function PopularHeritageSection() {
  const [sortType, setSortType] = useState("인기순");

  // 테스트용 임시 데이터
  const MOCK_DATA = [
    { id: 1, name: "불국사", location: "경주, 경북", rating: 4.9, views: 1234, badge: "국보", imageUrl: "https://via.placeholder.com/400x300" },
    { id: 2, name: "경복궁", location: "서울", rating: 4.8, views: 2567, badge: "국보", imageUrl: "https://via.placeholder.com/400x300" },
    { id: 3, name: "한옥마을", location: "전주, 전북", rating: 4.7, views: 987, badge: "사적", imageUrl: "https://via.placeholder.com/400x300" },
    { id: 4, name: "석굴암", location: "경주, 경북", rating: 4.9, views: 1456, badge: "국보", imageUrl: "https://via.placeholder.com/400x300" },
    { id: 5, name: "청자 도자기", location: "국립박물관", rating: 4.6, views: 678, badge: "보물", imageUrl: "https://via.placeholder.com/400x300" },
    { id: 6, name: "수원 화성", location: "수원, 경기", rating: 4.8, views: 1823, badge: "사적", imageUrl: "https://via.placeholder.com/400x300" },
  ];

  return (
    <section className="w-full bg-white py-20 px-[10%]">
      {/* 헤더 영역 */}
      <div className="flex flex-col items-center mb-16 relative">
        <span className="bg-[#CACA00]/10 text-[#CACA00] px-5 py-1.5 rounded-full text-sm font-bold mb-4">
        キュレーション
        </span>
        <h2 className="text-4xl font-bold text-[#000D57] font-title mb-4">
        人気の国の遺産
        </h2>
        <p className="text-gray-500 mb-8">多くの人が訪れる韓国の代表的な文化遺産に出会いましょう</p>
        
        {/* 정렬 버튼 */}
        <div className="lg:absolute right-0 bottom-0 flex gap-3 mt-6 lg:mt-0">
          {["리뷰순", "조회순"].map((type) => (
            <button
              key={type}
              onClick={() => setSortType(type)}
              className={`px-6 py-2 rounded-lg border-2 font-bold transition-all ${
                sortType === type 
                ? "bg-[#CACA00] border-[#CACA00] text-[#000D57]" 
                : "border-[#CACA00] text-[#CACA00] hover:bg-yellow-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
        {MOCK_DATA.map((item) => (
          <HeritageCard key={item.id} data={item} />
        ))}
      </div>

      {/* 더보기 버튼 */}
      <div className="flex justify-center">
        <button className="bg-[#000D57] text-white px-16 py-4 rounded-xl font-bold hover:bg-[#00158a] transition-all shadow-lg hover:scale-105 active:scale-95">
        もっと多くの遺産を見る
        </button>
      </div>
    </section>
  );
}

// ─── 개별 카드 컴포넌트 ───
function HeritageCard({ data }) {
  const [isLiked, setIsLiked] = useState(false);

  // 배지 색상 결정 로직
  const badgeColor = data.badge === "국보" ? "bg-[#CACA00]" : data.badge === "보물" ? "bg-[#6E0000]" : "bg-[#000D57]";

  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
      {/* 이미지 영역 */}
      <div className="relative h-[320px] overflow-hidden">
        <img 
          src={data.imageUrl} 
          alt={data.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* ★ 배지 */}
        <span className={`absolute top-5 left-5 ${badgeColor} text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md`}>
          {data.badge}
        </span>
        {/* ★ 북마크(하트) 아이콘 적용 */}
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-5 right-5 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all active:scale-90"
        >
          <img 
            src={imgIconHeart} 
            alt="favorite" 
            className={`w-5 h-5 transition-all ${isLiked ? "invert-[20%] sepia-[90%] saturate-[5000%] hue-rotate-[340deg]" : "opacity-40"}`} 
            /* 하트 클릭 시 빨간색으로 변하게 필터 적용 */
          />
        </button>
      </div>

      {/* 정보 영역 */}
      <div className="p-7">
        <h3 className="text-2xl font-bold text-[#000D57] mb-3">{data.name}</h3>
        
        {/* ★ 위치 아이콘 적용 */}
        <div className="flex items-center gap-2 text-gray-500 mb-8">
          <img src={imgIconLocation} alt="" className="w-4 h-4 opacity-60" />
          <span className="text-[15px] font-medium">{data.location}</span>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          <div className="flex items-center gap-5">
            {/* ★ 별점 아이콘 적용 */}
            <div className="flex items-center gap-1.5">
              <img src={imgIconStar} alt="" className="w-4 h-4" />
              <span className="font-bold text-[#000D57]">{data.rating}</span>
            </div>
            {/* ★ 조회수 아이콘 적용 */}
            <div className="flex items-center gap-1.5 text-gray-400">
              <img src={imgIconEye} alt="" className="w-4 h-4 opacity-50" />
              <span className="text-sm font-medium">{data.views.toLocaleString()}</span>
            </div>
          </div>
          
          <button className="text-[#6E0000] font-bold text-[15px] hover:underline transition-all">
            자세히 보기 →
          </button>
        </div>
      </div>
    </div>
  );
}