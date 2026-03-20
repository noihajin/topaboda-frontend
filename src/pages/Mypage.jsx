import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../components/Pagination";
import icPen from "../assets/community/icon_pen_c.svg";

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
    { id: 1, title: "ソウル宮殿ツアー", region: "ソウル", date: "2024.02.15", spots: 5 },
    { id: 2, title: "慶州の歴史探訪", region: "慶尚北道", date: "2024.02.15", spots: 4 },
    { id: 3, title: "扶余の百済遺跡", region: "忠清南道", date: "2024.02.15", spots: 6 },
];

// ── 피그마 메달 이미지 ────────────────────────────────────────────
const MEDAL_GOLD   = "https://www.figma.com/api/mcp/asset/957a3774-c31f-43e0-954d-aab098bc294c";
const MEDAL_SILVER = "https://www.figma.com/api/mcp/asset/701eea58-d86c-4cc1-b8da-deb09d7d608a";
const MEDAL_BRONZE = "https://www.figma.com/api/mcp/asset/6001625a-0a5c-44ae-908d-a9f8aa3bdb36";

const ACHIEVEMENTS = [
    { id:  1, title: "国宝探訪者",        grade: "金", medal: MEDAL_GOLD,   achieved: true  },
    { id:  2, title: "遺産の守護者",      grade: "金", medal: MEDAL_GOLD,   achieved: true  },
    { id:  3, title: "文化探求者",        grade: "銀", medal: MEDAL_SILVER, achieved: true  },
    { id:  4, title: "首都の歴史人",      grade: "銀", medal: MEDAL_SILVER, achieved: true  },
    { id:  5, title: "慶州の旅人",        grade: "銀", medal: MEDAL_SILVER, achieved: true  },
    { id:  6, title: "自然の守り人",      grade: "銀", medal: MEDAL_SILVER, achieved: true  },
    { id:  7, title: "朝鮮王朝の探検家",  grade: "銀", medal: MEDAL_SILVER, achieved: true  },
    { id:  8, title: "初めての一歩",      grade: "銅", medal: MEDAL_BRONZE, achieved: true  },
    { id:  9, title: "無形文化の継承者",  grade: "金", medal: MEDAL_GOLD,   achieved: false },
    { id: 10, title: "全国制覇の旅人",    grade: "金", medal: MEDAL_GOLD,   achieved: false },
    { id: 11, title: "コミュニティリーダー", grade: "金", medal: MEDAL_GOLD, achieved: false },
    { id: 12, title: "民俗文化の探求者",  grade: "銀", medal: MEDAL_SILVER, achieved: false },
    { id: 13, title: "史跡踏破者",        grade: "銀", medal: MEDAL_SILVER, achieved: false },
    { id: 14, title: "週末の冒険家",      grade: "銅", medal: MEDAL_BRONZE, achieved: false },
    { id: 15, title: "写真記録者",        grade: "銅", medal: MEDAL_BRONZE, achieved: false },
    { id: 16, title: "レビュー貢献者",    grade: "銅", medal: MEDAL_BRONZE, achieved: false },
];

const POSTS = [
    { id: 1, category: "レビュー",     title: "景福宮の隠れた美しさを求めて", desc: "景福宮を訪問して感じた魅力や、おすすめの観覧コースを詳しく共有します。", date: "2024.02.20", views: 342, likes: 12 },
    { id: 2, category: "ヒント",       title: "仏国寺の夜景撮影チップス",   desc: "仏国寺の夜景を撮影するのに適した時間帯や場所をまとめました。",         date: "2024.02.10", views: 521, likes: 23 },
    { id: 3, category: "レビュー",     title: "瞻星台（チョムソンデ）訪問記",desc: "新羅時代の天文台、瞻星台に行ってきました。",                           date: "2024.01.28", views: 287, likes: 8  },
    { id: 4, category: "フリートーク", title: "昌徳宮・後苑（秘苑）散策コース",desc: "昌徳宮・後苑の美しい散策路を紹介します。",                           date: "2024.01.15", views: 456, likes: 15 },
    { id: 5, category: "質問",         title: "海印寺・八万大蔵経ガイド",   desc: "ユネスコ世界文化遺産である八万大蔵経を保管する海印寺を訪問しました。", date: "2024.01.05", views: 398, likes: 18 },
    { id: 6, category: "レビュー",     title: "水原華城の散策",             desc: "城壁に沿って歩く歴史の道。",                                             date: "2023.12.20", views: 150, likes: 5  },
];

const COMMENTS = [
    { id: 1, postTitle: "景福宮の隠れた美しさ", content: "写真スポットの情報ありがとうございます！", date: "2024.02.21" },
    { id: 6, postTitle: "水原華城", content: "夜間開場も綺麗ですよ！", date: "2023.12.22" },
];

const REVIEWS = [
    { id: 1, heritageName: "景福宮", content: "案内が詳細で分かりやすかったです。", date: "2024.02.20" },
    { id: 6, heritageName: "海印寺", content: "歴史の重みを感じました。", date: "2023.12.25" },
];

const BOOKMARK_DATA = [
    { id: 1, img: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=400", name: "景福宮", region: "ソウル" },
    { id: 2, img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=400", name: "仏国寺", region: "慶州" },
    { id: 3, img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=400", name: "水原華城", region: "水原" },
    { id: 4, img: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=400", name: "昌徳宮", region: "ソウル" },
];

const LIKE_DATA = [{ id: 10, img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=400", name: "石窟庵", region: "慶州" }];

// ── SVG 아이콘 ─────────────────────────────────────────────────────
const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const NavIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
);
const CalendarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const MapPinIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);
const ChevronLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);
const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);
const BookmarkIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
);
const HeartIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);
const EyeIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);
const MsgIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
);
const SmallHeartIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);
const TrashIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4h6v2" />
    </svg>
);
const PenWriteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);

// ── 서브 컴포넌트: 업적/탐방로 복구 ──────────────────────────────────────
function AchievementProgressBar({ progress }) {
    return (
        <div style={{ marginTop: 8, width: 140 }}>
            <div style={{ height: 6, background: C.border, borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(to right, ${C.red}, ${C.gold})`, borderRadius: 999, transition: "width 0.4s ease" }} />
            </div>
            <p style={{ fontSize: 11, color: C.gray3, textAlign: "center", marginTop: 4 }}>{progress}%</p>
        </div>
    );
}

function AchievementCard({ item }) {
    return (
        <div style={{ width: 160, textAlign: "center", animation: "fadeSlideIn 0.3s ease both" }}>
            <div style={{ opacity: item.achieved ? 1 : 0.4, filter: item.achieved ? "none" : "grayscale(0.5)", transition: "all 0.3s" }}>
                <img src={item.medal} alt={item.title} style={{ width: 130, height: 130, objectFit: "contain", margin: "0 auto" }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: item.achieved ? C.navy : C.gray4, marginTop: 8 }}>{item.title}</p>
            {!item.achieved && <AchievementProgressBar progress={item.progress} />}
        </div>
    );
}

function RouteCard({ route }) {
    return (
        <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "16px", background: C.white, transition: "all 0.2s", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: C.navy }}>{route.title}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <CalendarIcon />
                    <span style={{ fontSize: 12, color: C.gray3 }}>{route.date}</span>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: C.gray2 }}>{route.region}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPinIcon />
                    <span style={{ fontWeight: 700, color: C.red, fontSize: 13 }}>{route.spots}か所</span>
                </div>
            </div>
        </div>
    );
}

// ── 카테고리 컬러 ─────────────────────────────────────────────────
const CAT_COLORS = {
    "レビュー":     { bg: "#dbeafe", color: "#1447e6" },
    "ヒント":       { bg: "#ffedd4", color: "#ca3500" },
    "フリートーク": { bg: "#f3e8ff", color: "#8200db" },
    "質問":         { bg: "#dcfce7", color: "#008236" },
};

// ── 리스트 행: 카드형 ─────────────────────────────────────────────
function ListRow({ category, title, desc, date, views, likes, onEdit, onDelete }) {
    const cat = CAT_COLORS[category];
    return (
        <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "20px 22px", background: C.white, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* 카테고리 배지 */}
                    {cat && (
                        <span style={{ display: "inline-block", background: cat.bg, color: cat.color, padding: "3px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, marginBottom: 8, fontFamily: font }}>
                            {category}
                        </span>
                    )}
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: "0 0 6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: font }}>{title}</h4>
                    {desc && <p style={{ fontSize: 13, color: C.gray2, margin: "0 0 10px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", fontFamily: font }}>{desc}</p>}
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.gray3 }}>
                            <CalendarIcon /> {date}
                        </span>
                        {views !== undefined && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.gray3 }}>
                                <EyeIcon /> {views}
                            </span>
                        )}
                        {likes !== undefined && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.gray3 }}>
                                <SmallHeartIcon /> {likes}
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "flex-start" }}>
                    <button onClick={onEdit} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f3f4f6", border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 500, fontSize: 14, color: C.gray1, transition: "background 0.2s", fontFamily: font }} onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")} onMouseLeave={(e) => (e.currentTarget.style.background = "#f3f4f6")}>
                        <EditIcon /> 編集
                    </button>
                    <button onClick={onDelete} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff0f0", border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 500, fontSize: 14, color: C.red, transition: "background 0.2s", fontFamily: font }} onMouseEnter={(e) => (e.currentTarget.style.background = "#ffe0e0")} onMouseLeave={(e) => (e.currentTarget.style.background = "#fff0f0")}>
                        <TrashIcon /> 削除
                    </button>
                </div>
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
    const [routePage, setRoutePage] = useState(0);

    const [user, setUser] = useState({
        id: "",
        email: "",
        nickname: "",
        icon: "",
        createdAt: "",
        visitCount: 0,
    });

    const [heritageBookmark, setHeritageBookmark] = useState({
        name: "",
        region: "",
        image: "",
    });
    const [htBkPage, setHtBkPage] = useState(0);

    const [heritageLike, setHeritageLike] = useState({
        name: "",
        region: "",
        image: "",
    });
    const [htLkPage, setHtLkPage] = useState(0);

    const PAGE_SIZE = 5;
    const HT_SIZE = 3;
    const ROUTE_SIZE = 2;

    // localStorage에서 사용자 저장 루트 불러오기
    const savedRoutes = JSON.parse(localStorage.getItem("myRoutes") || "[]");
    const allRoutes = [...savedRoutes, ...ROUTES];
    const totalRoutePages = Math.ceil(allRoutes.length / ROUTE_SIZE);
    const displayedRoutes = allRoutes.slice(routePage * ROUTE_SIZE, (routePage + 1) * ROUTE_SIZE);

    const currentActData = postTab === "posts" ? POSTS : postTab === "comments" ? COMMENTS : REVIEWS;
    const totalActPages = Math.ceil(currentActData.length / PAGE_SIZE);
    const displayedAct = currentActData.slice(actPage * PAGE_SIZE, (actPage + 1) * PAGE_SIZE);

    const currentHtData = heritageTab === "bookmark" ? BOOKMARK_DATA : LIKE_DATA;
    const totalHtPages = Math.ceil(currentHtData.length / HT_SIZE);
    const displayedHt = currentHtData.slice(htPage * HT_SIZE, (htPage + 1) * HT_SIZE);

    // 페이지 로드 시 데이터 요청
    useEffect(() => {
        const fetchUserData = async () => {
            // 1. localStorage에서 ID를 직접 가져옵니다. (state에 저장하고 기다리면 늦음)
            const id = localStorage.getItem("id");

            if (!id) {
                console.error("저장된 ID가 없습니다.");
                return;
            }

            try {
                // 2. axios는 프로토콜(http://)을 반드시 붙여야 합니다.
                // 3. axios는 response.json() 과정이 필요 없습니다. (response.data에 이미 들어있음)
                const response = await axios.get(`http://localhost:9990/topaboda/api/users/profile/${id}`);

                if (response.status === 200) {
                    // response.data가 바로 백엔드에서 보낸 JSON 객체입니다.
                    setUser(response.data);
                    console.log("유저 데이터 로드 성공:", response.data);
                }
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            }
        };

        const fetchHeritageBookmarkData = async () => {};

        const fetchHeritageLikeData = async () => {};

        fetchUserData();
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font, paddingBottom: 100 }}>
            <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .ht-card .overlay { opacity: 0; transition: opacity 0.3s ease; background: rgba(0,0,0,0.75); }
        .ht-card:hover .overlay { opacity: 1; }
      `}</style>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "140px 20px", display: "flex", flexDirection: "column", gap: 32 }}>
                {/* ── 1. 프로필 ── */}
                <div style={{ background: C.white, borderRadius: 24, padding: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                        <div style={{ width: 120, height: 120, borderRadius: "50%", border: `4px solid ${C.red}`, overflow: "hidden" }}>
                            <img src={user?.icon || "/default-profile.png"} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 28, fontWeight: 900, color: C.navy, margin: "0 0 4px" }}>{user?.nickname || "ゲスト"}</h1>
                            <p style={{ fontSize: 15, color: C.gray3, marginBottom: 16 }}>{user?.email || "example@email.com"}</p>
                            <div style={{ display: "flex", gap: 24 }}>
                                <div>
                                    <p style={{ fontSize: 12, color: C.gray4, margin: 0 }}>登録日</p>
                                    <p style={{ fontWeight: 700 }}>{user?.createdAt ? user.createdAt.split("T")[0].replaceAll("-", ".") : "----.--.--"}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: 12, color: C.gray4, margin: 0 }}>訪問済み</p>
                                    <p style={{ fontWeight: 700, color: C.red, margin: 0 }}>{user?.visitCount ?? 0} か所</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => navigate("/mypage/edit")} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: C.red, color: "white", fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")} onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}>
                        プロフィール編集
                    </button>
                </div>

                {/* ── 2. 탐방로 & 북마크 (2열 레이아웃) ── */}
                <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>
                    {/* 나의 탐방로 */}
                    <div style={{ background: C.white, borderRadius: 24, padding: "28px", display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        {/* 헤더 + 화살표 페이지네이션 */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: C.navy, margin: 0 }}>私の探訪路</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <button disabled={routePage === 0} onClick={() => setRoutePage((p) => p - 1)} style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${C.border}`, background: "white", cursor: routePage === 0 ? "default" : "pointer", opacity: routePage === 0 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                                    <ChevronLeft />
                                </button>
                                <span style={{ fontSize: 12, color: C.gray3 }}>
                                    {routePage + 1} / {totalRoutePages}
                                </span>
                                <button disabled={routePage >= totalRoutePages - 1} onClick={() => setRoutePage((p) => p + 1)} style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${C.border}`, background: "white", cursor: routePage >= totalRoutePages - 1 ? "default" : "pointer", opacity: routePage >= totalRoutePages - 1 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                                    <ChevronRight />
                                </button>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {displayedRoutes.map((r) => (
                                <RouteCard key={r.id} route={r} />
                            ))}
                        </div>
                        <button
                            onClick={() => navigate("/route/create")}
                            style={{ border: `2px solid ${C.red}`, borderRadius: 12, padding: "14px", background: "white", color: C.red, fontWeight: 700, cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = C.red;
                                e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "white";
                                e.currentTarget.style.color = C.red;
                            }}
                        >
                            + 新しい探訪路を作る
                        </button>
                    </div>

                    {/* 북마크 & 좋아요 (호버 효과 + 화살표 페이지네이션) */}
                    <div style={{ background: C.white, borderRadius: 24, padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <div style={{ display: "flex", gap: 24 }}>
                                <button
                                    onClick={() => {
                                        setHeritageTab("bookmark");
                                        setHtPage(0);
                                    }}
                                    style={{ background: "none", border: "none", fontSize: 18, fontWeight: 800, color: heritageTab === "bookmark" ? C.navy : C.gray4, cursor: "pointer", paddingBottom: 4, borderBottom: heritageTab === "bookmark" ? `3px solid ${C.navy}` : "3px solid transparent", display: "flex", alignItems: "center", gap: 7 }}
                                >
                                    <BookmarkIcon active={heritageTab === "bookmark"} />
                                    ブックマーク
                                </button>
                                <button
                                    onClick={() => {
                                        setHeritageTab("like");
                                        setHtPage(0);
                                    }}
                                    style={{ background: "none", border: "none", fontSize: 18, fontWeight: 800, color: heritageTab === "like" ? C.navy : C.gray4, cursor: "pointer", paddingBottom: 4, borderBottom: heritageTab === "like" ? `3px solid ${C.navy}` : "3px solid transparent", display: "flex", alignItems: "center", gap: 7 }}
                                >
                                    <HeartIcon active={heritageTab === "like"} />
                                    いいね
                                </button>
                            </div>
                            {totalHtPages > 1 && (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button disabled={htPage === 0} onClick={() => setHtPage((p) => p - 1)} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, background: "white", cursor: "pointer", opacity: htPage === 0 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <ChevronLeft />
                                    </button>
                                    <button disabled={htPage >= totalHtPages - 1} onClick={() => setHtPage((p) => p + 1)} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, background: "white", cursor: "pointer", opacity: htPage >= totalHtPages - 1 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <ChevronRight />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                            {displayedHt.map((item) => (
                                <div key={item.id} className="ht-card" style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: 140, cursor: "pointer" }}>
                                    <img src={item.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    <div className="overlay" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white", textAlign: "center", padding: "10px" }}>
                                        <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{item.name}</p>
                                        <p style={{ fontSize: 12, opacity: 0.8 }}>{item.region}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── 3. 활동 리스트 ── */}
                <div style={{ background: C.white, borderRadius: 24, padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    {/* 탭 + 새 글 작성 버튼 */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                            {[
                                { key: "posts", label: "投稿した記事", count: POSTS.length },
                                { key: "comments", label: "コメント", count: COMMENTS.length },
                                { key: "reviews", label: "レビュー", count: REVIEWS.length },
                            ].map(({ key, label, count }) => {
                                const isActive = postTab === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setPostTab(key);
                                            setActPage(0);
                                        }}
                                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, border: "none", background: isActive ? C.navy : "white", color: isActive ? "white" : C.gray3, cursor: "pointer", fontWeight: 500, fontSize: 15, boxShadow: isActive ? "0 4px 12px rgba(0,13,87,0.2)" : "none", transition: "all 0.2s" }}
                                    >
                                        {label}
                                        <span style={{ background: isActive ? "rgba(255,255,255,0.2)" : "#f3f4f6", color: isActive ? "white" : C.gray3, borderRadius: 99, padding: "1px 8px", fontSize: 13 }}>{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => navigate("/community/write")}
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: C.red, color: "white", border: "none", borderRadius: 9999, height: 44, padding: "0 28px", fontWeight: 900, fontSize: 16, cursor: "pointer", whiteSpace: "nowrap", transition: "0.2s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#8e0000"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = C.red;     e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            <img src={icPen} alt="" style={{ width: 20 }} /> 投稿する
                        </button>
                    </div>

                    {/* 리스트 */}
                    <div style={{ minHeight: 400 }}>
                        {displayedAct.map((item) => (
                            <ListRow
                                key={item.id}
                                category={postTab === "posts" ? item.category : undefined}
                                title={postTab === "posts" ? item.title : postTab === "comments" ? item.postTitle : item.heritageName}
                                desc={postTab === "posts" ? item.desc : item.content}
                                date={item.date}
                                views={postTab === "posts" ? item.views : undefined}
                                likes={postTab === "posts" ? item.likes : undefined}
                                onEdit={() => navigate("/community/write", { state: { post: item, isEdit: true } })}
                                onDelete={() => confirm("削除しますか？")}
                            />
                        ))}
                    </div>

                    {/* 공용 페이지네이션 */}
                    {totalActPages > 1 && (
                        <Pagination
                            currentPage={actPage + 1}
                            totalPages={totalActPages}
                            onPageChange={(p) => setActPage(p - 1)}
                        />
                    )}
                </div>

                {/* ── 4. 업적 갤러리 ── */}
                <div style={{ background: C.white, borderRadius: 24, padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    {/* 헤더 */}
                    <div style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: "0 0 6px" }}>業績ギャラリー</h2>
                        <p style={{ fontSize: 14, color: C.gray2 }}>探検の足跡を記録してください</p>
                    </div>

                    {/* 16개 메달 그리드 */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "20px" }}>
                        {ACHIEVEMENTS.map((item) => (
                            <AchievementCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* 피그마 1767-2214 하단 바 */}
                    {(() => {
                        const achievedCount  = ACHIEVEMENTS.filter((a) => a.achieved).length;
                        const inProgressCount = ACHIEVEMENTS.filter((a) => !a.achieved && a.progress > 0).length;
                        const notStartedCount = ACHIEVEMENTS.filter((a) => !a.achieved && !a.progress).length;
                        return (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
                                {/* 범례 */}
                                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ width: 12, height: 12, borderRadius: "50%", background: `linear-gradient(135deg, ${C.gold}, ${C.red})`, flexShrink: 0, display: "inline-block" }} />
                                        <span style={{ fontSize: 13, color: C.gray2, fontWeight: 600 }}>達成した実績</span>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>{achievedCount}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#d1d5dc", flexShrink: 0, display: "inline-block" }} />
                                        <span style={{ fontSize: 13, color: C.gray2, fontWeight: 600 }}>進行中</span>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: C.gray1 }}>{inProgressCount}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#e5e7eb", border: `1px solid ${C.border}`, flexShrink: 0, display: "inline-block" }} />
                                        <span style={{ fontSize: 13, color: C.gray2, fontWeight: 600 }}>未開始</span>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: C.gray3 }}>{notStartedCount}</span>
                                    </div>
                                </div>

                                {/* 実績ページへ → ボタン */}
                                <button
                                    onClick={() => navigate("/achievements")}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "12px 28px",
                                        borderRadius: 12,
                                        border: "none",
                                        background: `linear-gradient(135deg, ${C.red}, ${C.navy})`,
                                        color: "white",
                                        fontWeight: 700,
                                        fontSize: 15,
                                        cursor: "pointer",
                                        fontFamily: font,
                                        transition: "0.2s",
                                        flexShrink: 0,
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                                >
                                    実績ページへ
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
