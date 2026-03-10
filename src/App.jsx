import { useState } from "react";
// 분리한 컴포넌트들을 임포트
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";

export default function App() {
  return (
    <div className="w-full min-h-screen">
      
      <Navbar />
      <HeroSection />
    </div>
  );
}


// // ─── 데이터 ────────────────────────────────────────────────────────────────────
// const HERITAGE_DATA = [
//   {
//     id: 1,
//     name: "불국사",
//     nameEn: "Bulguksa Temple",
//     location: "경주, 경북",
//     rating: 4.9,
//     views: 1234,
//     badge: "국보",
//     badgeColor: "#CACA00",
//     badgeTextColor: "#000D57",
//     image: "https://placehold.co/452x339",
//   },
//   {
//     id: 2,
//     name: "경복궁",
//     nameEn: "Gyeongbokgung Palace",
//     location: "서울",
//     rating: 4.8,
//     views: 2567,
//     badge: "국보",
//     badgeColor: "#CACA00",
//     badgeTextColor: "#000D57",
//     image: "https://placehold.co/452x339",
//   },
//   {
//     id: 3,
//     name: "한옥마을",
//     nameEn: "Traditional Hanok Village",
//     location: "전주, 전북",
//     rating: 4.7,
//     views: 987,
//     badge: "사적",
//     badgeColor: "#000D57",
//     badgeTextColor: "#ffffff",
//     image: "https://placehold.co/452x339",
//   },
//   {
//     id: 4,
//     name: "석굴암",
//     nameEn: "Seokguram Grotto",
//     location: "경주, 경북",
//     rating: 4.9,
//     views: 1456,
//     badge: "국보",
//     badgeColor: "#CACA00",
//     badgeTextColor: "#000D57",
//     image: "https://placehold.co/452x339",
//   },
//   {
//     id: 5,
//     name: "청자 도자기",
//     nameEn: "Celadon Pottery",
//     location: "국립중앙박물관",
//     rating: 4.6,
//     views: 678,
//     badge: "보물",
//     badgeColor: "#6E0000",
//     badgeTextColor: "#ffffff",
//     image: "https://placehold.co/452x339",
//   },
//   {
//     id: 6,
//     name: "수원 화성",
//     nameEn: "Hwaseong Fortress",
//     location: "수원, 경기",
//     rating: 4.8,
//     views: 1823,
//     badge: "사적",
//     badgeColor: "#000D57",
//     badgeTextColor: "#ffffff",
//     image: "https://placehold.co/452x339",
//   },
// ];

// const FOOTER_LINKS = {
//   サービス: ["国の遺産リスト", "遺産 詳細を見る", "コミュニティ"],
//   関連サイト: ["国家遺産庁", "国立中央博物館", "韓国文化財財団"],
//   톺아보다: ["紹介", "チーム", "お知らせ"],
// };

// // ─── 서브 컴포넌트 ──────────────────────────────────────────────────────────────
// function Badge({ text, bgColor, textColor }) {
//   return (
//     <span
//       style={{ background: bgColor, color: textColor }}
//       className="px-3 py-1 rounded-full text-xs font-normal leading-none"
//     >
//       {text}
//     </span>
//   );
// }

// // 변경완 
// function HeritageCard({ item }) {
//   const [liked, setLiked] = useState(false);

//   return (
//     <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col hover:shadow-xl transition-shadow duration-300">
//       {/* 이미지 영역 */}
//       <div className="relative bg-gray-200 overflow-hidden" style={{ aspectRatio: "452/339" }}>
//         <img
//           src={item.image}
//           alt={item.name}
//           className="w-full h-full object-cover"
//         />
//         {/* 배지 */}
//         <div className="absolute top-3 left-3">
//           <Badge text={item.badge} bgColor={item.badgeColor} textColor={item.badgeTextColor} />
//         </div>
//         {/* 즐겨찾기 버튼 (이미지로 교체) */}
//         <button
//           onClick={() => setLiked((v) => !v)}
//           className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
//         >
//           <img 
//             src={liked ? heartFullImg : heartEmptyImg} 
//             alt="favorite" 
//             className="w-4 h-4 object-contain"
//           />
//         </button>
//       </div>

//       {/* 정보 영역 */}
//       <div className="p-5 flex flex-col gap-2 flex-1">
//         {/* 이름 */}
//         <div>
//           <h3 className="text-lg font-medium" style={{ color: "#000D57" }}>
//             {item.name}
//           </h3>
//           <p className="text-xs" style={{ color: "rgba(0,13,87,0.5)" }}>
//             {item.nameEn}
//           </p>
//         </div>

//         {/* 위치 + 평점 (이미지로 교체) */}
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(0,13,87,0.7)" }}>
//             <img src={pinImg} alt="location" className="w-3.5 h-3.5 object-contain" />
//             <span>{item.location}</span>
//           </div>
//           <div className="flex items-center gap-1 text-xs">
//             <img src={starImg} alt="rating" className="w-3.5 h-3.5 object-contain" />
//             <span className="font-medium" style={{ color: "#000D57" }}>{item.rating}</span>
//           </div>
//         </div>

//         {/* 구분선 + 하단 (이미지로 교체) */}
//         <div
//           className="flex justify-between items-center pt-2 mt-auto"
//           style={{ borderTop: "1px solid rgba(0,13,87,0.1)" }}
//         >
//           <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(0,13,87,0.7)" }}>
//             <img src={eyeImg} alt="views" className="w-3.5 h-3.5 object-contain" />
//             <span>{item.views.toLocaleString()}</span>
//           </div>
//           <button
//             className="text-xs font-medium hover:underline transition-all"
//             style={{ color: "#6E0000" }}
//           >
//             자세히 보기 →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// // ─── 히어로 섹션 ───────────────────────────────────────────────────────────────

// function HeroSection() {
//   return (
//     <section className="relative w-full overflow-hidden" style={{ height: 820 }}>
//       {/* 1. 배경 이미지 교체 */}
//       <img
//         src={heroBg}
//         alt="hero"
//         className="absolute inset-0 w-full h-full object-cover"
//       />
      
//       {/* 배경 위가 너무 밝아 글자가 안 보인다면 투명도를 조절하세요 */}
//       <div className="absolute inset-0 bg-black/5" /> 
      
//       <Navbar />

//       {/* 히어로 텍스트 */}
//       <div className="absolute inset-0 flex items-center" style={{ paddingLeft: "13.2%" }}>
//         <div className="z-10">
//           <h1
//             style={{
//               color: "#000D57",
//               fontFamily: "Noto Serif SC, serif",
//               fontSize: 70,
//               fontWeight: 600,
//               lineHeight: 1.5,
//               letterSpacing: "0.025em",
//             }}
//           >
//             韓国の宝を<br />隅々とトパボダ
//           </h1>
//           <p
//             className="mt-3 text-lg"
//             style={{
//               color: "#000D57",
//               fontFamily: "Noto Sans KR, sans-serif",
//               textShadow: "0 2px 4px rgba(255,255,255,0.5)", // 배경에 따라 그림자 조절
//             }}
//           >
//             韓国の国家遺産を探検してみよう。
//           </p>
//         </div>
//       </div>

//       <SearchBar />
//     </section>
//   );
// }

// // Navbar 내부의 로고 이미지도 함께 수정해줍니다.
// function Navbar() {
//   return (
//     <nav className="absolute top-0 left-0 w-full z-20">
//       <div className="flex justify-center pt-4">
//         <img
//           src={logoMain} // 추출한 로고 이미지
//           alt="logo"
//           className="w-20 object-contain"
//         />
//       </div>
//       {/* ... 메뉴 버튼들 ... */}
//     </nav>
//   );
// }

// // 변경완
// function SearchBar() {
//   return (
//     <div
//       className="absolute bottom-0 translate-y-1/2 bg-white rounded-2xl shadow-2xl flex items-center gap-3 px-7 py-5"
//       style={{ left: "13.2%", right: "13.2%" }}
//     >
//       {/* 검색 입력 */}
//       <div className="relative flex-1">
//         {/* 수정된 이미지 태그 */}
//         <img
//           src={searchImg}
//           alt="search"
//           className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 object-contain"
//           style={{ opacity: 0.6 }} // 피그마의 투명도 설정을 맞추기 위함
//         />
//         <input
//           type="text"
//           placeholder="国家遺産検索（例：景福宮、石窟庵、天文台）"
//           className="w-full bg-[#F3F3F5] rounded-xl pl-10 pr-4 py-3 text-xs outline-none border border-transparent focus:border-blue-200 transition-colors"
//           style={{ color: "#717182" }}
//         />
//       </div>
//       {/* 필터 드롭다운들 */}
//       {["全体", "全体テーマ"].map((label) => (
//         <button
//           key={label}
//           className="flex items-center gap-2 bg-[#F3F3F5] rounded-xl px-4 py-3 text-xs font-medium border border-[rgba(0,13,87,0.1)] hover:border-blue-300 transition-colors whitespace-nowrap"
//           style={{ color: "#0A0A0A" }}
//         >
//           {label}
//           <ChevronDown size={13} className="opacity-50" />
//         </button>
//       ))}
//       {/* 검색 버튼 */}
//       <button
//         className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
//         style={{ background: "#6E0000" }}
//       >
//         <img 
//           src={searchImg} 
//           alt="search" 
//           className="w-4 h-4 brightness-0 invert" // 빨간 배경 위에서 흰색으로 보이게 하는 필터
//         />
//         検索
//       </button>
//     </div>
//   );
// }

// // ─── 지역별 탐색 섹션 ──────────────────────────────────────────────────────────
// function RegionSection() {
//   return (
//     <section
//       className="w-full pt-32 pb-16 px-[13.2%]"
//       style={{ background: "#F8F8F8" }}
//     >
//       {/* 헤더 */}
//       <div className="text-center mb-14">
//         <h2
//           className="text-4xl font-medium mb-3"
//           style={{ color: "#000D57", fontFamily: "Noto Serif KR, serif" }}
//         >
//           地域別の国宝探索
//         </h2>
//         <p className="text-base" style={{ color: "rgba(0,13,87,0.7)" }}>
//           地図上で地域を選択し、その地域の国宝を確認してください。
//         </p>
//       </div>

//       {/* 지도 플레이스홀더 */}
//       <div className="relative flex justify-center">
//         <img
//           src="https://placehold.co/1226x1219"
//           alt="지도"
//           className="w-full max-w-5xl"
//         />
//         {/* 지역 버튼들 */}
//         <div className="absolute top-8 left-0 flex flex-col gap-3">
//           {["広域", "広域"].map((label, i) => (
//             <button
//               key={i}
//               className="bg-white rounded-2xl px-5 py-3 text-base shadow-md hover:shadow-lg transition-shadow"
//               style={{ color: "#6A7282", fontFamily: "Noto Sans JP, sans-serif" }}
//             >
//               {label}
//             </button>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── 인기 유산 섹션 ────────────────────────────────────────────────────────────


// function PopularSection() {
//   const [sortBy, setSortBy] = useState("인기순");

//   return (
//     <section className="w-full bg-white py-20 px-[13.2%]">
//       {/* 헤더: 큐레이션 배지 및 텍스트 */}
//       <div className="text-center mb-6">
//         <span
//           className="inline-block px-5 py-1.5 rounded-full text-sm mb-4 font-medium"
//           style={{ background: "rgba(202,202,0,0.1)", color: "#CACA00" }}
//         >
//           キュレーション
//         </span>
//         <h2
//           className="text-4xl font-medium mb-3"
//           style={{ color: "#000D57", fontFamily: "Noto Serif KR, serif" }}
//         >
//           人気の国の遺産
//         </h2>
//         <p className="text-base" style={{ color: "rgba(0,13,87,0.7)" }}>
//           多くの人が訪れる韓国의 대표적인 문화유산에 만나보세요.
//         </p>
//       </div>

//       {/* 정렬 버튼 영역 */}
//       <div className="flex justify-end gap-3 mb-8">
//         {["인기순", "조회순"].map((label) => {
//           const active = sortBy === label;
//           return (
//             <button
//               key={label}
//               onClick={() => setSortBy(label)}
//               className="px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
//               style={{
//                 background: active ? "#CACA00" : "transparent",
//                 color: "#000D57",
//                 border: "1.5px solid #CACA00",
//               }}
//             >
//               {/* 활성화 상태일 때 작은 체크 아이콘 이미지를 넣고 싶다면 아래 주석 해제 */}
//               {/* active && <img src={checkIconImg} alt="active" className="w-3 h-3" /> */}
//               {label}
//             </button>
//           );
//         })}
//       </div>

//       {/* 카드 그리드: HeritageCard 내부 이미지는 이미 수정했으므로 그대로 유지됩니다 */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {HERITAGE_DATA.map((item) => (
//           <HeritageCard key={item.id} item={item} />
//         ))}
//       </div>

//       {/* 더보기 버튼: 텍스트와 화살표 이미지 조합 */}
//       <div className="flex justify-center mt-14">
//         <button
//           className="px-10 py-3.5 rounded-xl text-white text-base font-medium hover:opacity-90 active:scale-95 transition-all flex items-center gap-3"
//           style={{ background: "#000D57" }}
//         >
//           もっと多くの遺産を見る
//           <img src={arrowRightWhiteImg} alt="arrow" className="w-4 h-4" />
//         </button>
//       </div>
//     </section>
//   );
// }

// // ─── 푸터 ──────────────────────────────────────────────────────────────────────
// function Footer() {
//   return (
//     <footer
//       className="w-full pt-16 pb-8 px-[7%] border-t"
//       style={{ borderColor: "#EEEEEE" }}
//     >
//       {/* 링크 그리드 */}
//       <div className="flex gap-16 mb-12 pl-[10%]">
//         {Object.entries(FOOTER_LINKS).map(([section, links]) => (
//           <div key={section} className="flex flex-col gap-5 min-w-[120px]">
//             <h4 className="text-sm font-medium" style={{ color: "#000D57" }}>
//               {section}
//             </h4>
//             <div className="flex flex-col gap-2.5">
//               {links.map((link) => (
//                 <a
//                   key={link}
//                   href="#"
//                   className="text-xs hover:underline transition-all"
//                   style={{ color: "rgba(0,13,87,0.7)" }}
//                 >
//                   {link}
//                 </a>
//               ))}
//             </div>
//           </div>
//         ))}
//         {/* 로고 */}
//         <div className="ml-auto">
//           <img src={searchImg}
//             alt="logo"
//             className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
//         </div>
//       </div>

//       {/* 구분선 */}
//       <div className="border-t mx-[10%]" style={{ borderColor: "rgba(0,13,87,0.1)" }} />

//       {/* 하단 바 */}
//       <div className="flex justify-between items-center pt-5 mx-[10%]">
//         <div className="flex items-center gap-5 text-xs" style={{ color: "rgba(0,13,87,0.7)" }}>
//           <span>© 2026 Topaboda. All rights reserved.</span>
//           {["個人情報処理方針", "利用規約", "クッキー設定"].map((t) => (
//             <a key={t} href="#" className="underline hover:opacity-80">
//               {t}
//             </a>
//           ))}
//         </div>
//         {/* 소셜 아이콘들 */}
//         <div className="flex items-center gap-3">
//           {["F", "IG", "TW", "YT"].map((icon) => (
//             <button
//               key={icon}
//               className="w-9 h-9 bg-[#EEEEEE] rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-300 transition-colors"
//               style={{ color: "#000D57" }}
//             >
//               {icon}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* 저작권 고지 */}
//       <div
//         className="pt-6 mt-4 mx-[10%] border-t text-center text-xs"
//         style={{ borderColor: "rgba(0,13,87,0.1)", color: "rgba(0,13,87,0.5)" }}
//       >
//         本サイトの国宝情報は、国宝庁（www.heritage.go.kr）の公共データを活用しています。
//       </div>
//     </footer>
//   );
// }


// // ─── 메인 페이지 ───────────────────────────────────────────────────────────────
// export default function KoreanHeritagePage() {
//   return (
//     <div className="w-full min-h-screen font-sans" style={{ fontFamily: "Noto Sans KR, sans-serif" }}>
//       <HeroSection />
//       <RegionSection />
//       <PopularSection />
//       <Footer />
//     </div>
//   );
// }
