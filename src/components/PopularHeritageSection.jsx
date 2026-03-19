import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// ★ 아이콘 임포트
import imgIconHeart from "../assets/icon_heart.svg";
import imgIconBookmark from "../assets/icon_bookmark.svg";
import imgIconLocation from "../assets/icon_location.svg";
import imgIconEye from "../assets/icon_heart_2.svg";
// 애니메이션 Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};
const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
export default function PopularHeritageSection() {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("レビュー順");
  // nameKr(한국어 이름) 필드 포함
  const MOCK_DATA = [
    {
      id: 1,
      name: "仏国寺",
      nameKr: "불국사",
      location: "慶州, 慶尚北道",
      views: 1234,
      badge: "国宝",
      imageUrl:
        "https://images.unsplash.com/photo-1590603740183-980e7f6920eb?q=80&w=600",
    },
    {
      id: 2,
      name: "景福宮",
      nameKr: "경복궁",
      location: "ソウル",
      views: 2567,
      badge: "国宝",
      imageUrl:
        "https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=600",
    },
    {
      id: 3,
      name: "韓屋村",
      nameKr: "전주 한옥마을",
      location: "全州, 全羅北道",
      views: 987,
      badge: "史跡",
      imageUrl:
        "https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600",
    },
    {
      id: 4,
      name: "石窟庵",
      nameKr: "석굴암",
      location: "慶州, 慶尚北道",
      views: 1456,
      badge: "国宝",
      imageUrl:
        "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=600",
    },
    {
      id: 5,
      name: "青磁 象嵌",
      nameKr: "청자 상감",
      location: "国立中央博物館",
      views: 678,
      badge: "宝物",
      imageUrl:
        "https://images.unsplash.com/photo-1618176729090-253077a8f948?q=80&w=600",
    },
    {
      id: 6,
      name: "水原華城",
      nameKr: "수원 화성",
      location: "水原, 京畿道",
      views: 1823,
      badge: "史跡",
      imageUrl:
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=600",
    },
  ];
  return (
    <motion.section
      className="w-full bg-[#F8F9FC] py-24 px-[10%]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* 헤더 영역 */}
      <div className="flex flex-col items-center mb-20 text-center">
        <motion.span
          variants={itemVariants}
          className="bg-[#CACA00]/15 text-[#A0A000] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6"
        >
          CURATION
        </motion.span>
        <motion.h2
          variants={itemVariants}
          className="text-4xl lg:text-5xl font-bold text-[#000D57] mb-6 tracking-tight"
          style={{ fontFamily: "serif" }}
        >
          人気の国の遺産
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-gray-500 text-lg max-w-2xl"
        >
          많은 사람들이 찾는 한국의 대표적인 문화유산을 만나보세요
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="flex bg-white p-1.5 rounded-full shadow-sm border border-gray-100 mt-12"
        >
          {["レビュー順", "閲覧順"].map((type) => (
            <button
              key={type}
              onClick={() => setSortType(type)}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                sortType === type
                  ? "bg-[#000D57] text-white shadow-md scale-105"
                  : "text-gray-400 hover:text-[#000D57]"
              }`}
            >
              {type}
            </button>
          ))}
        </motion.div>
      </div>
      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
        {MOCK_DATA.map((item) => (
          <HeritageCard key={item.id} data={item} />
        ))}
      </div>
      {/* 더보기 버튼 */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <button
          onClick={() => navigate("/heritage")}
          className="group bg-white border-2 border-[#000D57] text-[#000D57] px-12 py-4 rounded-full font-bold hover:bg-[#000D57] hover:text-white transition-all duration-300 shadow-sm flex items-center gap-2"
        >
          もっと多くの遺産を見る
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </motion.div>
    </motion.section>
  );
}
// ─── 개별 카드 컴포넌트 ───
function HeritageCard({ data }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const badgeStyle =
    data.badge === "国宝"
      ? "bg-[#CACA00] text-[#000D57]"
      : data.badge === "宝物"
        ? "bg-[#6E0000] text-white"
        : "bg-[#000D57] text-white";
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-3 transition-all duration-500 border border-gray-50 group cursor-pointer"
    >
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        {/* 배지 */}
        <span
          className={`absolute top-6 left-6 ${badgeStyle} px-4 py-1.5 rounded-lg text-xs font-black shadow-sm`}
        >
          {data.badge}
        </span>
        {/* ── 우측 상단 버튼 그룹 (가로 정렬) ── */}
        <div className="absolute top-6 right-6 flex flex-row gap-2 z-10">
          {/* 하트 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center hover:bg-white transition-all active:scale-90"
          >
            <img
              src={imgIconHeart}
              alt="like"
              className="w-5 h-5 transition-all duration-300"
              style={{
                filter: isLiked
                  ? "invert(11%) sepia(82%) saturate(3945%) hue-rotate(346deg) brightness(85%) contrast(110%)"
                  : "grayscale(1) opacity(0.3)",
              }}
            />
          </button>
          {/* 북마크 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }}
            className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center hover:bg-white transition-all active:scale-90"
          >
            <img
              src={imgIconBookmark}
              alt="bookmark"
              className="w-5 h-5 transition-all duration-300"
              style={{
                filter: isBookmarked
                  ? "invert(76%) sepia(85%) saturate(442%) hue-rotate(12deg) brightness(95%) contrast(89%)"
                  : "grayscale(1) opacity(0.3)",
              }}
            />
          </button>
        </div>
      </div>
      <div className="p-8">
        <div className="flex items-baseline gap-2 mb-3">
          <h3 className="text-2xl font-black text-[#000D57] tracking-tight">
            {data.name}
          </h3>
          <span className="text-sm text-gray-400 font-medium">
            | {data.nameKr}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 mb-8">
          <img
            src={imgIconLocation}
            alt=""
            className="w-3.5 h-3.5 opacity-50"
          />
          <span className="text-sm font-bold">{data.location}</span>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-gray-400">
            <img src={imgIconEye} alt="" className="w-4.5 h-4.5 opacity-50" />
            <span className="text-sm font-bold ml-1">
              {data.views.toLocaleString()}{" "}
              <span className="text-[10px] opacity-70 ml-1">VIEWS</span>
            </span>
          </div>
          <button
            onClick={() => navigate(`/heritage/${data.id}`)}
            className="flex items-center gap-1 text-[#6E0000] font-black text-xs tracking-tighter hover:text-[#000D57] transition-all group/btn"
          >
            詳細を見る
            <span className="group-hover/btn:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
