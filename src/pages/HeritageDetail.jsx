import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ── 색상 / 폰트 ───────────────────────────────────────────────────────
const C = {
  navy:        "#000d57",
  navyGrad:    "linear-gradient(180deg,#000d57 0%,#001070 100%)",
  red:         "#6e0000",
  yellow:      "#caca00",
  yellowGrad:  "linear-gradient(180deg,#caca00 0%,#a0a000 100%)",
  yellowDark:  "#a0a000",
  white:       "#ffffff",
  bg:          "#f8f9fc",
  bgSection:   "#eeeeee",
  textDark:    "#364153",
  textMedium:  "#4a5565",
  gray:        "#99a1af",
  border:      "#e2e8f0",
};
const font       = "'Roboto','Noto Sans JP','Noto Sans KR',sans-serif";
const fontSerif  = "'Noto Serif JP','Georgia',serif";

// ── 목 데이터 (API 연동 전 임시) ──────────────────────────────────────
const MOCK_HERITAGE = {
  id: "heritage-001",
  nameKo: "숭례문",
  nameJa: "崇礼門",
  nameJaReading: "スンネムン（南大門）",
  gcodeName: "国宝",
  number: "第1号",
  region: "ソウル",
  location: "ソウル特別市中区南大門路4街29",
  type: "史跡・城郭",
  era: "朝鮮時代（1398年）",
  thumbnail: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1920&auto=format&fit=crop",
  likeCount: 1248,
  content: [
    {
      title: "歴史的背景",
      paragraphs: [
        "崇礼門は、朝鮮王朝の都であったソウルを囲む城壁の南側に位置する門で、韓国で最も古い木造建築物の一つです。1398年に太祖李成桂の命により建てられ、「南大門」の通称で親しまれています。二層の楼閣構造を持ち、重厚な石造の基壇の上に木造の建物が載っています。",
        "門の名前は儒教の五常のうち「礼」を意味し、南の方角を象徴しています。朝鮮時代において、崇礼門は首都漢城（現在のソウル）を守る四大門の一つとして、重要な役割を果たしてきました。その堅固な構造は、都市の防衛機能だけでなく、王朝の威厳を示す象徴的な存在でもありました。",
        "600年以上の歴史を持つこの門は、幾多の試練を乗り越えてきました。朝鮮戦争時には奇跡的に破壊を免れましたが、2008年2月10日に放火により焼失するという悲劇に見舞われました。この出来事は韓国国民に大きな衝撃を与え、文化財保護の重要性を改めて認識させる契機となりました。",
      ],
    },
    {
      title: "建築的特徴",
      paragraphs: [
        "崇礼門の建築様式は、朝鮮時代の伝統的な木造建築技術の粋を集めたものです。石造の基壇は高さ約6メートルで、中央にアーチ型の門が設けられています。この基壇の上に建つ二層の楼閣は、入母屋造りの屋根を持ち、優美な曲線を描いています。",
        "屋根の構造は「多包式」と呼ばれる複雑な組物によって支えられており、その精緻な木工技術は現代の建築家をも魅了しています。屋根瓦は伝統的な製法で作られた青瓦が使用され、その深い色合いが建物全体に重厚感を与えています。",
        "2008年の焼失後、韓国政府は伝統的な工法を忠実に再現する復元事業を開始しました。5年の歳月と約270億ウォンをかけて、可能な限り創建当時の姿を取り戻すことを目指しました。",
      ],
    },
    {
      title: "文化的意義",
      paragraphs: [
        "崇礼門は単なる歴史的建造物ではなく、韓国人のアイデンティティと深く結びついた文化的象徴です。1962年に韓国初の国宝第1号に指定されたことは、この門が持つ歴史的・文化的価値の高さを物語っています。",
        "現在、崇礼門は年間数百万人の観光客が訪れるソウルの代表的な観光地となっています。周辺には南大門市場という伝統的な市場があり、現代と伝統が融合した独特の雰囲気を作り出しています。",
        "また、崇礼門は韓国の伝統文化を学ぶ重要な教育の場としても機能しています。定期的に開催されるガイドツアーや文化イベントを通じて、次世代に朝鮮時代の歴史と建築技術が継承されています。",
      ],
    },
  ],
  images: [
    "https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=600",
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=600",
    "https://images.unsplash.com/photo-1590603740183-980e7f6920eb?q=80&w=600",
    "https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600",
    "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=600",
    "https://images.unsplash.com/photo-1618176729090-253077a8f948?q=80&w=600",
  ],
};

const MOCK_REVIEWS = [
  { id: 1, initial: "田", name: "田中太郎", date: "2026.02.28", text: "ソウル駅からすぐの場所にあり、アクセスが非常に便利です。夜のライトアップも美しく、写真撮影にも最適でした。周辺には伝統市場もあり、韓国の文化を存分に楽しめます。復元された建築物ですが、伝統工法への敬意が感じられます。" },
  { id: 2, initial: "山", name: "山田花子", date: "2026.02.20", text: "朝鮮時代の建築様式を間近で見ることができる貴重な文化財です。特に屋根の曲線美と装飾の細やかさに感動しました。ガイドツアーに参加すると、より深く理解できるのでおすすめです。" },
  { id: 3, initial: "佐", name: "佐藤健",  date: "2026.02.15", text: "韓国の象徴的な文化財として、一度は訪れるべき場所です。周辺の都市化が進む中で、歴史の重みを感じさせる存在感があります。近くの南大門市場と合わせて訪問するのが効率的です。" },
  { id: 4, initial: "鈴", name: "鈴木美咲", date: "2026.02.10", text: "復元の経緯を知ると、より深く理解できます。伝統的な工法で丁寧に再建されたことがよくわかり、韓国の文化財保護への情熱を感じました。内部の展示も充実しています。" },
  { id: 5, initial: "高", name: "高橋一郎", date: "2026.02.05", text: "夕暮れ時の訪問がおすすめです。日中とは違った雰囲気を楽しめます。600年以上の歴史を持つ門が、現代の都市の中に堂々と立つ姿は圧巻です。" },
];

// ── 아이콘 SVG ────────────────────────────────────────────────────────
const IconMapPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconBookmark = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? C.navy : "none"} stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>
);
const IconHeart = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#e53e3e" : "none"} stroke={active ? "#e53e3e" : C.textDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const IconShare = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.textDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconTag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const IconMapPinSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconExternalLink = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const IconAward = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IconChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ── 섹션 헤딩 컴포넌트 ───────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <div style={{ borderBottom: `3px solid ${C.yellow}`, paddingBottom: 14, marginBottom: 24 }}>
      <h2 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 700, color: C.navy, margin: 0 }}>
        {children}
      </h2>
    </div>
  );
}

// ── 사이드바 정보 행 컴포넌트 ────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: "rgba(255,255,255,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: "0 0 4px", fontFamily: font }}>{label}</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: "white", margin: 0, fontFamily: font, lineHeight: 1.5 }}>{value}</p>
      </div>
    </div>
  );
}

// ── 리뷰 카드 컴포넌트 ───────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div style={{
      background: "#eeeeee", borderRadius: 14, padding: "24px",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
          background: C.navyGrad,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 700, color: "white", fontFamily: font,
        }}>
          {review.initial}
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: font }}>{review.name}</span>
      </div>
      <p style={{ fontSize: 15, color: C.textDark, lineHeight: 1.8, margin: 0, fontFamily: font }}>
        {review.text}
      </p>
      {review.date && (
        <p style={{ fontSize: 12, color: C.gray, margin: 0, fontFamily: font }}>{review.date}</p>
      )}
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────
export default function HeritageDetail() {
  const { heritageId } = useParams();
  const navigate = useNavigate();
  const galleryRef = useRef(null);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(MOCK_HERITAGE.likeCount);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");

  // GET /api/haritages/{heritageId}/medias  ← API 연동 시 사용
  const data = MOCK_HERITAGE;

  const handleLike = () => {
    // POST/DELETE /api/heritages/{heritageId}/likes
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };
  const handleBookmark = () => {
    // POST/DELETE /api/bookmarks/{heritageId}
    setIsBookmarked((prev) => !prev);
  };
  const scrollGallery = (dir) => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
    }
  };

  return (
    <div style={{ fontFamily: font, background: C.bg, minHeight: "100vh" }}>

      {/* ── 히어로 섹션 ── */}
      <div style={{ position: "relative", height: "75vh", minHeight: 560 }}>
        <img
          src={data.thumbnail}
          alt={data.nameJa}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* 그라디언트 오버레이 */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.05) 100%)",
        }} />

        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute", top: 100, left: 44,
            display: "flex", alignItems: "center", gap: 8,
            background: "white", border: "none", borderRadius: 100,
            padding: "10px 20px 10px 14px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            cursor: "pointer", color: C.navy,
            fontSize: 15, fontWeight: 700, fontFamily: font,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)"; }}
        >
          <IconArrowLeft /> 戻る
        </button>

        {/* 유산 정보 (좌하단) */}
        <div style={{ position: "absolute", bottom: 56, left: 72 }}>
          {/* 배지 */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <span style={{
              background: data.gcodeName === "国宝" ? C.yellowGrad : data.gcodeName === "宝物" ? C.red : C.navy,
              color: data.gcodeName === "国宝" ? C.navy : "white",
              fontWeight: 700, fontSize: 13, borderRadius: 100, padding: "6px 18px",
              fontFamily: font, letterSpacing: "0.02em",
            }}>
              {data.gcodeName}
            </span>
            <span style={{ color: C.yellow, fontWeight: 700, fontSize: 18, fontFamily: font }}>
              {data.number}
            </span>
          </div>
          {/* 제목 */}
          <h1 style={{
            fontFamily: fontSerif, fontSize: "clamp(52px, 6vw, 80px)",
            color: "white", margin: "0 0 8px", lineHeight: 1.1, fontWeight: 700,
          }}>
            {data.nameJa}
          </h1>
          <p style={{
            fontSize: "clamp(16px, 2vw, 24px)", color: "rgba(255,255,255,0.88)",
            margin: "0 0 18px", fontFamily: font, fontWeight: 400,
          }}>
            {data.nameJaReading}
          </p>
          {/* 위치 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconMapPin />
            <span style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", fontFamily: font }}>
              {data.location}
            </span>
          </div>
        </div>

        {/* 액션 버튼 (우하단) */}
        <div style={{
          position: "absolute", bottom: 56, right: 72,
          display: "flex", gap: 16, alignItems: "center",
        }}>
          {[
            { icon: <IconBookmark active={isBookmarked} />, label: "保存", onClick: handleBookmark },
            { icon: <IconHeart active={isLiked} />, label: likeCount.toLocaleString(), onClick: handleLike },
            { icon: <IconShare />, label: "共有", onClick: () => {} },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.onClick}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                width: 68, height: 68, borderRadius: "50%",
                background: "white", border: "none", cursor: "pointer",
                boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.25)"; }}
            >
              {btn.icon}
              <span style={{ fontSize: 11, fontWeight: 600, color: C.textDark, fontFamily: font }}>
                {btn.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{
        background: "#eeeeee", padding: "60px 72px",
        display: "flex", gap: 48, alignItems: "flex-start",
        maxWidth: 1920, margin: "0 auto",
      }}>

        {/* ── 왼쪽 콘텐츠 영역 ── */}
        <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 40 }}>

          {/* 텍스트 섹션들 */}
          {data.content.map((section) => (
            <div
              key={section.title}
              style={{
                background: "white", borderRadius: 18, padding: "48px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <SectionTitle>{section.title}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {section.paragraphs.map((para, i) => (
                  <p key={i} style={{
                    fontSize: 16, lineHeight: 2, color: C.textDark,
                    margin: 0, fontFamily: font,
                  }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* 포토 갤러리 */}
          <div style={{
            background: "white", borderRadius: 18, padding: "48px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
              <h2 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 700, color: C.navy, margin: 0 }}>
                フォトギャラリー
              </h2>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ dir: -1, icon: <IconChevronLeft /> }, { dir: 1, icon: <IconChevronRight /> }].map(({ dir, icon }) => (
                  <button
                    key={dir}
                    onClick={() => scrollGallery(dir)}
                    style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: C.navy, border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div
              ref={galleryRef}
              style={{
                display: "flex", gap: 16, overflowX: "auto",
                scrollbarWidth: "none", paddingBottom: 4,
              }}
            >
              {data.images.map((src, i) => (
                <div
                  key={i}
                  style={{
                    flexShrink: 0, width: 300, height: 220, borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={src}
                    alt={`${data.nameJa} ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
                      transition: "transform 0.4s", cursor: "pointer",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "none"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 리뷰 섹션 */}
          <div style={{
            background: "white", borderRadius: 18, padding: "48px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
              <div>
                <h2 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 700, color: C.navy, margin: "0 0 6px" }}>
                  訪問者の声
                </h2>
                <p style={{ fontSize: 14, color: C.textMedium, margin: 0, fontFamily: font }}>
                  実際に訪問した方々のレビュー
                </p>
              </div>
              <button
                onClick={() => setShowReviewForm((v) => !v)}
                style={{
                  background: C.red, color: "white", border: "none", borderRadius: 10,
                  padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: font, transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                レビューを書く
              </button>
            </div>

            {/* 리뷰 작성 폼 */}
            {showReviewForm && (
              <div style={{
                background: "#f8f9fc", borderRadius: 14, padding: "24px",
                marginBottom: 24, border: `1px solid ${C.border}`,
              }}>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="この文化遺産についての感想を書いてください..."
                  rows={4}
                  style={{
                    width: "100%", borderRadius: 10, border: `1px solid ${C.border}`,
                    padding: "14px 16px", fontSize: 15, fontFamily: font,
                    resize: "none", outline: "none", boxSizing: "border-box",
                    lineHeight: 1.7,
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    style={{ padding: "10px 20px", borderRadius: 8, border: `1px solid ${C.border}`, background: "white", cursor: "pointer", fontFamily: font, fontSize: 14 }}
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => { /* POST /api/heritages/{id}/reviews */ setShowReviewForm(false); setReviewText(""); }}
                    style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: C.navy, color: "white", cursor: "pointer", fontFamily: font, fontSize: 14, fontWeight: 700 }}
                  >
                    投稿する
                  </button>
                </div>
              </div>
            )}

            {/* 리뷰 목록 */}
            {/* GET /api/heritages/{heritageId}/reviews */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {MOCK_REVIEWS.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>

        {/* ── 오른쪽 스티키 사이드바 ── */}
        <div style={{ width: 360, flexShrink: 0 }}>
          <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 24 }}>

            {/* 기본 정보 카드 (navy 그라디언트) */}
            <div style={{
              background: C.navyGrad, borderRadius: 18, padding: "36px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              display: "flex", flexDirection: "column", gap: 24,
            }}>
              <h3 style={{ fontFamily: fontSerif, fontSize: 22, color: "white", margin: 0 }}>
                基本情報
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <InfoRow icon={<IconClock />}       label="時代"   value={data.era} />
                <InfoRow icon={<IconTag />}          label="分類"   value={data.type} />
                <InfoRow icon={<IconMapPinSmall />}  label="所在地" value={data.location} />
              </div>

              {/* 버튼 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
                <button style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  background: "white", border: "none", borderRadius: 14,
                  padding: "16px", cursor: "pointer", fontFamily: font,
                  fontSize: 15, fontWeight: 700, color: C.navy,
                  transition: "transform 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}
                >
                  <IconPlus /> ルートに追加
                </button>
                <button style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)",
                  borderRadius: 14, padding: "16px", cursor: "pointer", fontFamily: font,
                  fontSize: 15, fontWeight: 700, color: "white",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                >
                  <IconExternalLink /> Googleマップでナビ
                </button>
              </div>
            </div>

            {/* 업적 카드 (yellow 그라디언트) */}
            <div style={{
              background: C.yellowGrad, borderRadius: 18, padding: "36px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              display: "flex", flexDirection: "column", gap: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <IconAward />
                <h3 style={{ fontFamily: fontSerif, fontSize: 20, color: C.navy, margin: 0 }}>
                  実績を解除
                </h3>
              </div>
              <p style={{ fontSize: 15, color: C.navy, margin: 0, fontFamily: font, lineHeight: 1.7 }}>
                この遺産を訪問してバッジを獲得しましょう
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconCheck />
                <span style={{ fontSize: 13, color: `rgba(0,13,87,0.8)`, fontFamily: font }}>
                  訪問認証で特別なバッジを獲得
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
