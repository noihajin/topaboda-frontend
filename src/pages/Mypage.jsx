import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── 디자인 토큰 ────────────────────────────────────────────────────
const C = {
  navy: "#000d57",
  red: "#6e0000",
  redHover: "#8a0000",
  gold: "#caca00",
  white: "#ffffff",
  bg: "#f4f4f7",
  gray1: "#364153",
  gray2: "#4a5565",
  gray3: "#6a7282",
  gray4: "#99a1af",
  border: "#e5e7eb",
  borderD: "#d1d5dc",
  bgLight: "#f8fafc",
  redBg: "#fff1f1",
};

const font = "'Noto Sans JP', 'Noto Sans KR', sans-serif";

// ── 데이터 ─────────────────────────────────────────────────────────
const ROUTES = [
  {
    id: 1,
    title: "ソウル宮殿ツアー",
    region: "ソウル",
    date: "2024.02.15",
    spots: 5,
  },
  {
    id: 2,
    title: "慶州の歴史探訪",
    region: "慶尚北道",
    date: "2024.02.15",
    spots: 4,
  },
  {
    id: 3,
    title: "扶余の百済遺跡",
    region: "忠清南道",
    date: "2024.02.15",
    spots: 6,
  },
];

const ACHIEVEMENTS = [
  {
    id: 1,
    title: "最初の一歩",
    medal:
      "https://www.figma.com/api/mcp/asset/10cbf9d5-6802-4b32-96a5-56132b61aaa3",
    achieved: true,
    progress: 100,
  },
  {
    id: 2,
    title: "国宝征服者",
    medal:
      "https://www.figma.com/api/mcp/asset/3b7b88af-7e3e-455e-8742-548cee70092d",
    achieved: true,
    progress: 100,
  },
  {
    id: 3,
    title: "朝鮮王朝探検家",
    medal:
      "https://www.figma.com/api/mcp/asset/10cbf9d5-6802-4b32-96a5-56132b61aaa3",
    achieved: true,
    progress: 100,
  },
  {
    id: 8,
    title: "百済文化の道",
    medal:
      "https://www.figma.com/api/mcp/asset/c8ea0fa8-d4b2-4bf7-a663-fdb8102a4ab9",
    achieved: false,
    progress: 67,
  },
  {
    id: 9,
    title: "ユネスコマスター",
    medal:
      "https://www.figma.com/api/mcp/asset/10cbf9d5-6802-4b32-96a5-56132b61aaa3",
    achieved: false,
    progress: 53,
  },
  {
    id: 10,
    title: "レビューマスター",
    medal:
      "https://www.figma.com/api/mcp/asset/c8ea0fa8-d4b2-4bf7-a663-fdb8102a4ab9",
    achieved: false,
    progress: 68,
  },
  {
    id: 11,
    title: "連続訪問者",
    medal:
      "https://www.figma.com/api/mcp/asset/c8ea0fa8-d4b2-4bf7-a663-fdb8102a4ab9",
    achieved: false,
    progress: 42,
  },
  {
    id: 12,
    title: "コミュニティリーダー",
    medal:
      "https://www.figma.com/api/mcp/asset/3b7b88af-7e3e-455e-8742-548cee70092d",
    achieved: false,
    progress: 32,
  },
];

const POSTS = [
  {
    id: 1,
    title: "景福宮の隠れた美しさを求めて",
    desc: "景福宮を訪問して感じた魅力や、おすすめの観覧コースを詳しく共有します。",
    date: "2024.02.20",
    views: 342,
    likes: 12,
  },
  {
    id: 2,
    title: "仏国寺の夜景撮影チップス",
    desc: "仏国寺の夜景を撮影するのに適した時間帯や場所をまとめました。",
    date: "2024.02.10",
    views: 521,
    likes: 23,
  },
  {
    id: 3,
    title: "瞻星台（チョムソンデ）訪問記",
    desc: "新羅時代の天文台、瞻星台に行ってきました。",
    date: "2024.01.28",
    views: 287,
    likes: 8,
  },
  {
    id: 4,
    title: "昌徳宮・後苑（秘苑）散策コース",
    desc: "昌徳宮・後苑の美しい散策路を紹介します。",
    date: "2024.01.15",
    views: 456,
    likes: 15,
  },
  {
    id: 5,
    title: "海印寺・八万大蔵経ガイド",
    desc: "ユネスコ世界文化遺産である八万大蔵経を保管する海印寺を訪問しました。",
    date: "2024.01.05",
    views: 398,
    likes: 18,
  },
  {
    id: 6,
    title: "水原華城の散策",
    desc: "城壁に沿って歩く歴史の道。",
    date: "2023.12.20",
    views: 150,
    likes: 5,
  },
];

const COMMENTS = [
  {
    id: 1,
    postTitle: "景福宮の隠れた美しさ",
    content: "写真スポットの情報ありがとうございます！",
    date: "2024.02.21",
  },
  {
    id: 6,
    postTitle: "水原華城",
    content: "夜間開場も綺麗ですよ！",
    date: "2023.12.22",
  },
];

const REVIEWS = [
  {
    id: 1,
    heritageName: "景福宮",
    content: "案内が詳細で分かりやすかったです。",
    date: "2024.02.20",
  },
  {
    id: 6,
    heritageName: "海印寺",
    content: "歴史の重みを感じました。",
    date: "2023.12.25",
  },
];

const BOOKMARK_DATA = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=400",
    name: "景福宮",
    region: "ソウル",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=400",
    name: "仏国寺",
    region: "慶州",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=400",
    name: "水原華城",
    region: "水原",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=400",
    name: "昌徳宮",
    region: "ソウル",
  },
];

const LIKE_DATA = [
  {
    id: 10,
    img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=400",
    name: "石窟庵",
    region: "慶州",
  },
];

// ── SVG 아이콘 ─────────────────────────────────────────────────────
const EditIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const NavIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);
const CalendarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const MapPinIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={C.red}
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ChevronLeft = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── 서브 컴포넌트: 업적/탐방로 복구 ──────────────────────────────────────
function AchievementProgressBar({ progress }) {
  return (
    <div style={{ marginTop: 8, width: 140 }}>
      <div
        style={{
          height: 6,
          background: C.border,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(to right, ${C.red}, ${C.gold})`,
            borderRadius: 999,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <p
        style={{
          fontSize: 11,
          color: C.gray3,
          textAlign: "center",
          marginTop: 4,
        }}
      >
        {progress}%
      </p>
    </div>
  );
}

function AchievementCard({ item }) {
  return (
    <div
      style={{
        width: 160,
        textAlign: "center",
        animation: "fadeSlideIn 0.3s ease both",
      }}
    >
      <div
        style={{
          opacity: item.achieved ? 1 : 0.4,
          filter: item.achieved ? "none" : "grayscale(0.5)",
          transition: "all 0.3s",
        }}
      >
        <img
          src={item.medal}
          alt={item.title}
          style={{
            width: 130,
            height: 130,
            objectFit: "contain",
            margin: "0 auto",
          }}
        />
      </div>
      <p
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: item.achieved ? C.navy : C.gray4,
          marginTop: 8,
        }}
      >
        {item.title}
      </p>
      {!item.achieved && <AchievementProgressBar progress={item.progress} />}
    </div>
  );
}

function RouteCard({ route }) {
  return (
    <div
      style={{
        border: `1.5px solid ${C.border}`,
        borderRadius: 12,
        padding: "16px",
        background: C.white,
        transition: "all 0.2s",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 700, color: C.navy }}>{route.title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <CalendarIcon />
          <span style={{ fontSize: 12, color: C.gray3 }}>{route.date}</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, color: C.gray2 }}>{route.region}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <MapPinIcon />
          <span style={{ fontWeight: 700, color: C.red, fontSize: 13 }}>
            {route.spots}か所
          </span>
        </div>
      </div>
    </div>
  );
}

// ── 리스트 행: 수정/삭제 버튼 유지 ───────────────────────────────────────
function ListRow({ title, desc, meta, onEdit, onDelete }) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${C.border}`,
        padding: "20px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: C.navy,
            margin: "0 0 6px",
          }}
        >
          {title}
        </h4>
        {desc && (
          <p
            style={{
              fontSize: 14,
              color: C.gray2,
              margin: "0 0 8px",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {desc}
          </p>
        )}
        <span style={{ fontSize: 12, color: C.gray4 }}>{meta}</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginLeft: 20 }}>
        <button
          onClick={onEdit}
          style={{
            background: C.bgLight,
            border: `1px solid ${C.border}`,
            padding: "8px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          編集
        </button>
        <button
          onClick={onDelete}
          style={{
            background: C.redBg,
            border: `1px solid ${C.red}33`,
            color: C.red,
            padding: "8px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          削除
        </button>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────
export default function MyPage() {
  const navigate = useNavigate();
  const [postTab, setPostTab] = useState("posts");
  const [actPage, setActPage] = useState(0);
  const [heritageTab, setHeritageTab] = useState("bookmark");
  const [htPage, setHtPage] = useState(0);

  const PAGE_SIZE = 5;
  const HT_SIZE = 3;

  const currentActData =
    postTab === "posts" ? POSTS : postTab === "comments" ? COMMENTS : REVIEWS;
  const totalActPages = Math.ceil(currentActData.length / PAGE_SIZE);
  const displayedAct = currentActData.slice(
    actPage * PAGE_SIZE,
    (actPage + 1) * PAGE_SIZE
  );

  const currentHtData = heritageTab === "bookmark" ? BOOKMARK_DATA : LIKE_DATA;
  const totalHtPages = Math.ceil(currentHtData.length / HT_SIZE);
  const displayedHt = currentHtData.slice(
    htPage * HT_SIZE,
    (htPage + 1) * HT_SIZE
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: font,
        paddingBottom: 100,
      }}
    >
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .ht-card .overlay { opacity: 0; transition: opacity 0.3s ease; background: rgba(0,0,0,0.75); }
        .ht-card:hover .overlay { opacity: 1; }
      `}</style>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "140px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* ── 1. 프로필 ── */}
        <div
          style={{
            background: C.white,
            borderRadius: 24,
            padding: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: `4px solid ${C.red}`,
                overflow: "hidden",
              }}
            >
              <img
                src="https://www.figma.com/api/mcp/asset/0464130a-49a3-4a59-b0d0-3bb1d69fb641"
                alt="profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: C.navy,
                  margin: "0 0 4px",
                }}
              >
                文化遺産探検家
              </h1>
              <p style={{ fontSize: 15, color: C.gray3, marginBottom: 16 }}>
                explorer@topaboda.jp
              </p>
              <div style={{ display: "flex", gap: 24 }}>
                <div>
                  <p style={{ fontSize: 12, color: C.gray4, margin: 0 }}>
                    登録日
                  </p>
                  <p style={{ fontWeight: 700 }}>2024.01.15</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: C.gray4, margin: 0 }}>
                    訪問済み
                  </p>
                  <p style={{ fontWeight: 700, color: C.red }}>47 か所</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/mypage/edit")}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: "none",
              background: C.red,
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            プロフィール編集
          </button>
        </div>

        {/* ── 2. 탐방로 & 북마크 (2열 레이아웃) ── */}
        <div
          style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}
        >
          {/* 나의 탐방로 */}
          <div
            style={{
              background: C.white,
              borderRadius: 24,
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: C.navy,
                  margin: 0,
                }}
              >
                私の探訪路
              </h3>
              <NavIcon />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {ROUTES.map((r) => (
                <RouteCard key={r.id} route={r} />
              ))}
            </div>
            <button
              style={{
                border: `2px solid ${C.red}`,
                borderRadius: 12,
                padding: "14px",
                background: "white",
                color: C.red,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + 新しい探訪路を作る
            </button>
          </div>

          {/* 북마크 & 좋아요 (호버 효과 + 화살표 페이지네이션) */}
          <div
            style={{
              background: C.white,
              borderRadius: 24,
              padding: "28px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", gap: 24 }}>
                <button
                  onClick={() => {
                    setHeritageTab("bookmark");
                    setHtPage(0);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 18,
                    fontWeight: 800,
                    color: heritageTab === "bookmark" ? C.navy : C.gray4,
                    cursor: "pointer",
                    paddingBottom: 4,
                    borderBottom:
                      heritageTab === "bookmark"
                        ? `3px solid ${C.navy}`
                        : "3px solid transparent",
                  }}
                >
                  ブックマーク
                </button>
                <button
                  onClick={() => {
                    setHeritageTab("like");
                    setHtPage(0);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 18,
                    fontWeight: 800,
                    color: heritageTab === "like" ? C.navy : C.gray4,
                    cursor: "pointer",
                    paddingBottom: 4,
                    borderBottom:
                      heritageTab === "like"
                        ? `3px solid ${C.navy}`
                        : "3px solid transparent",
                  }}
                >
                  いいね
                </button>
              </div>
              {totalHtPages > 1 && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    disabled={htPage === 0}
                    onClick={() => setHtPage((p) => p - 1)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: `1px solid ${C.border}`,
                      background: "white",
                      cursor: "pointer",
                      opacity: htPage === 0 ? 0.3 : 1,
                    }}
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    disabled={htPage >= totalHtPages - 1}
                    onClick={() => setHtPage((p) => p + 1)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: `1px solid ${C.border}`,
                      background: "white",
                      cursor: "pointer",
                      opacity: htPage >= totalHtPages - 1 ? 0.3 : 1,
                    }}
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
              }}
            >
              {displayedHt.map((item) => (
                <div
                  key={item.id}
                  className="ht-card"
                  style={{
                    position: "relative",
                    borderRadius: 16,
                    overflow: "hidden",
                    height: 140,
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={item.img}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    className="overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    <p
                      style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}
                    >
                      {item.name}
                    </p>
                    <p style={{ fontSize: 12, opacity: 0.8 }}>{item.region}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. 활동 리스트 (5개 이상 시 페이지네이션) ── */}
        <div
          style={{
            background: C.white,
            borderRadius: 24,
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", gap: 16 }}>
              {["posts", "comments", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setPostTab(tab);
                    setActPage(0);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 16,
                    fontWeight: 700,
                    color: postTab === tab ? C.red : C.gray3,
                    cursor: "pointer",
                    paddingBottom: 8,
                    borderBottom:
                      postTab === tab
                        ? `3px solid ${C.red}`
                        : "3px solid transparent",
                  }}
                >
                  {tab === "posts"
                    ? "投稿"
                    : tab === "comments"
                      ? "コメント"
                      : "レビュー"}
                </button>
              ))}
            </div>
            <button
              style={{
                background: C.navy,
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + 新規投稿
            </button>
          </div>
          <div style={{ minHeight: 450 }}>
            {displayedAct.map((item) => (
              <ListRow
                key={item.id}
                title={
                  postTab === "posts"
                    ? item.title
                    : postTab === "comments"
                      ? item.postTitle
                      : item.heritageName
                }
                desc={postTab === "posts" ? item.desc : item.content}
                meta={
                  postTab === "posts"
                    ? `${item.date} · 閲覧 ${item.views} · いいね ${item.likes}`
                    : item.date
                }
                onEdit={() => console.log("Edit", item.id)}
                onDelete={() => confirm("削除しますか？")}
              />
            ))}
          </div>
          {totalActPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 24,
                marginTop: 32,
              }}
            >
              <button
                disabled={actPage === 0}
                onClick={() => setActPage((p) => p - 1)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  opacity: actPage === 0 ? 0.2 : 1,
                }}
              >
                <ChevronLeft />
              </button>
              <span style={{ fontWeight: 700, color: C.gray2 }}>
                {actPage + 1} / {totalActPages}
              </span>
              <button
                disabled={actPage >= totalActPages - 1}
                onClick={() => setActPage((p) => p + 1)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  opacity: actPage >= totalActPages - 1 ? 0.2 : 1,
                }}
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>

        {/* ── 4. 업적 갤러리 (도넛 차트 포함) ── */}
        <div
          style={{
            background: C.white,
            borderRadius: 24,
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 40,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: C.navy,
                  margin: "0 0 6px",
                }}
              >
                業績ギャラリー
              </h2>
              <p style={{ fontSize: 14, color: C.gray2 }}>
                探検の足跡を記録してください
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative", width: 100, height: 100 }}>
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 100 100"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={C.border}
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={C.red}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42 * 0.69} ${2 * Math.PI * 42 * 0.31}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    color: C.red,
                    fontSize: 20,
                  }}
                >
                  69%
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.red }}>
                  7 <span style={{ fontSize: 14, color: C.gray4 }}>/ 16</span>
                </div>
                <p style={{ fontSize: 12, color: C.gray3, marginTop: 4 }}>
                  達成済み
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "24px",
            }}
          >
            {ACHIEVEMENTS.map((item) => (
              <AchievementCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
