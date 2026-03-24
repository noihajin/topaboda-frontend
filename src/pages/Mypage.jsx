import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../components/Pagination";
import icPen from "../assets/community/icon_pen_c.svg";
import { C, font } from "../components/mypage/theme";
import { ChevronLeft, ChevronRight, BookmarkIcon, HeartIcon, CalendarIcon, MapPinIcon } from "../components/mypage/Icons";
import HeritageCard from "../components/mypage/HeritageCard";
import CommentRow from "../components/mypage/CommentRow";
import ReviewRow from "../components/mypage/ReviewRow";
import PostRow from "../components/mypage/PostRow";
import PostSaveCard from "../components/mypage/PostSaveCard";
import TopaModal from "../components/TopaModal";

const API_ROUTES = "/api/routes";

// ── 피그마 메달 이미지 ────────────────────────────────────────────
const MEDAL_GOLD = "https://www.figma.com/api/mcp/asset/957a3774-c31f-43e0-954d-aab098bc294c";
const MEDAL_SILVER = "https://www.figma.com/api/mcp/asset/701eea58-d86c-4cc1-b8da-deb09d7d608a";
const MEDAL_BRONZE = "https://www.figma.com/api/mcp/asset/6001625a-0a5c-44ae-908d-a9f8aa3bdb36";

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
        <div style={{ textAlign: "center", animation: "fadeSlideIn 0.3s ease both" }}>
            <div style={{ opacity: item.achieved ? 1 : 0.4, filter: item.achieved ? "none" : "grayscale(0.5)", transition: "all 0.3s" }}>
                <img src={item.medal} alt={item.title} style={{ width: 130, height: 130, objectFit: "contain", margin: "0 auto" }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: item.achieved ? C.navy : C.gray4, marginTop: 8 }}>{item.title}</p>
            {!item.achieved && <AchievementProgressBar progress={item.progress} />}
        </div>
    );
}

function AddSlot({ type, onClick }) {
    const [hovered, setHovered] = React.useState(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderRadius: 16,
                height: 170,
                cursor: "pointer",
                background: hovered
                    ? "linear-gradient(135deg, rgba(202,202,0,0.10) 0%, rgba(202,202,0,0.05) 100%)"
                    : "#f5f5f5",
                border: `2px dashed ${hovered ? "#caca00" : "#d1d5db"}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "all 0.25s ease",
                transform: hovered ? "scale(1.02)" : "scale(1)",
            }}
        >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke={hovered ? "#caca00" : "#b0b0b0"} strokeWidth="1.5" strokeDasharray="4 2" />
                <path d="M16 9v14M9 16h14" stroke={hovered ? "#caca00" : "#b0b0b0"} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{
                fontSize: 12, fontWeight: 700,
                color: hovered ? "#9a9a00" : "#9ca3af",
                letterSpacing: "0.5px",
                transition: "color 0.25s ease",
            }}>
                {type === "bookmark" ? "ブックマーク追加" : "いいね追加"}
            </span>
        </div>
    );
}

function RouteCard({ route, onClick }) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "16px", background: C.white, transition: "all 0.2s", cursor: onClick ? "pointer" : "default" }}
        >
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

// ── 메인 컴포넌트 ──────────────────────────────────────────────────
export default function MyPage() {
    const navigate = useNavigate();
    const [postTab, setPostTab] = useState("posts");
    const [heritageTab, setHeritageTab] = useState("bookmark");
    const [routePage, setRoutePage] = useState(0);

    const [user, setUser] = useState({
        id: "",
        email: "",
        nickname: "",
        icon: "",
        createdAt: "",
        visitCount: 0,
    });

    const initialPageData = {
        contents: [],
        currentPage: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
    };

    const [htBkData, setHtBkData] = useState(initialPageData);
    const [htBkPage, setHtBkPage] = useState(0);

    const [htLkData, setHtLkData] = useState(initialPageData);
    const [htLkPage, setHtLkPage] = useState(0);

    const [postData, setPostData] = useState(initialPageData);
    const [postPage, setPostPage] = useState(0);

    const [postBkData, setPostBkData] = useState(initialPageData);
    const [postBkPage, setPostBkPage] = useState(0);
    const [postLkData, setPostLkData] = useState(initialPageData);
    const [postLkPage, setPostLkPage] = useState(0);
    const [postSaveTab, setPostSaveTab] = useState("bookmark"); // "bookmark" | "like"
    const [postSaveCancelModal, setPostSaveCancelModal] = useState({ open: false, item: null });

    const [commentData, setCommentData] = useState(initialPageData);
    const [commentPage, setCommentPage] = useState(0);

    const [reviewData, setReviewData] = useState(initialPageData);
    const [reviewPage, setReviewPage] = useState(0);

    const [achievements, setAchievements] = useState({ contents: [] });

    const [savedRoutes, setSavedRoutes] = useState([]);
    const [routesLoading, setRoutesLoading] = useState(() => !!localStorage.getItem("token"));

    const currentTabData = postTab === "posts" ? postData : postTab === "comments" ? commentData : reviewData;
    const currentSetPage = postTab === "posts" ? setPostPage : postTab === "comments" ? setCommentPage : setReviewPage;
    const currentPageNum = postTab === "posts" ? postPage : postTab === "comments" ? commentPage : reviewPage;

    const PAGE_SIZE = 5;
    const HT_SIZE = 4;

    // 북마크/좋아요 취소 모달
    const [cancelModal, setCancelModal] = useState({ open: false, item: null });
    const handleCancelRequest = (item) => setCancelModal({ open: true, item });
    const handleCancelClose   = ()     => setCancelModal({ open: false, item: null });
    const handleCancelConfirm = ()     => {
        // TODO: API 연동 시 실제 취소 처리
        // heritageTab === "bookmark"
        //   ? DELETE /api/bookmarks/{cancelModal.item.heritageId}
        //   : DELETE /api/heritages/{cancelModal.item.heritageId}/likes
        setCancelModal({ open: false, item: null });
    };
    const ROUTE_SIZE = 3;

    const totalRoutePages = Math.max(1, Math.ceil(savedRoutes.length / ROUTE_SIZE));
    const displayedRoutes = savedRoutes.slice(routePage * ROUTE_SIZE, (routePage + 1) * ROUTE_SIZE);

    const currentActData = postTab === "posts" ? postData.contents : postTab === "comments" ? commentData.contents : reviewData.contents;
    const displayedAct = currentActData;

    const currentHtData = heritageTab === "bookmark" ? htBkData.contents : htLkData.contents;
    const totalHtPages = heritageTab === "bookmark" ? htBkData.totalPages : htLkData.totalPages;
    // 항상 마지막에 +1 가상 페이지(추가 슬롯 전용)
    const totalHtPagesWithAdd = totalHtPages + 1;
    const displayedHt = currentHtData;

    const fetchData = async (url, params, setData) => {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
            console.error("인증 정보가 없습니다.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:9990/topaboda/api${url}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: params,
            });
            setData(response.data);
        } catch (error) {
            console.error(`${url} 로드 실패:`, error);
        }
    };

    // 게시글 편집
    const handleEditPost = async (postId) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("ログイン情報がありません。");
            return;
        }

        const res = await axios.get(
            `http://localhost:9990/topaboda/api/boards/${postId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        navigate("/community/write", {
            state: {
                isEdit: true,
                post: {
                    id: res.data.id,
                    category: res.data.categories,
                    title: res.data.title,
                    content: res.data.content,
                },
            },
        });
        } catch (error) {
            console.error("게시글 상세 불러오기 실패:", error);
            alert("記事情報を読み込めませんでした。");
        }
    };

    // 게시글 삭제
    const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("ログイン情報がありません。");
        return;
    }

    try {
        await axios.delete(
            `http://localhost:9990/topaboda/api/boards/${postId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

    alert("記事が削除されました。");

        // 삭제 후 현재 게시글 목록 다시 불러오기
        fetchData(
            "/users/me/boards/snippet",
            { page: postPage, size: PAGE_SIZE },
            setPostData
        );
        } catch (error) {
            console.error("게시글 삭제 실패:", error);
            console.error("status:", error.response?.status);
            console.error("data:", error.response?.data);
            alert("記事の削除に失敗しました。");
        }
    };

    // 댓글 수정
    const handleEditComment = async (commentId, newContent) => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("ログイン情報がありません。");
        return;
    }

    try {
        await axios.patch(
            `http://localhost:9990/topaboda/api/comments/${commentId}`,
            { content: newContent },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        alert("コメントが修正されました。");

        fetchData(
            "/users/me/comments/snippet",
            { page: commentPage, size: PAGE_SIZE },
            setCommentData
        );
        } catch (error) {
            console.error("댓글 수정 실패:", error);
            console.error("status:", error.response?.status);
            console.error("data:", error.response?.data);
            alert("コメントの修正に失敗しました。");
        }
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("ログイン情報がありません。");
        return;
    }

    try {
        await axios.delete(
            `http://localhost:9990/topaboda/api/comments/${commentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

    alert("コメントが削除されました。");

        // 삭제 후 현재 게시글 목록 다시 불러오기
        fetchData(
            "/users/me/comments/snippet",
            { page: commentPage, size: PAGE_SIZE },
            setCommentData
        );
        } catch (error) {
            console.error("댓글 삭제 실패:", error);
            console.error("status:", error.response?.status);
            console.error("data:", error.response?.data);
            alert("コメントの削除に失敗しました。");
        }
    };

    useEffect(() => {
        const id = localStorage.getItem("id");
        fetchData(`/users/profile/${id}`, {}, setUser);
    }, []);

    useEffect(() => {
        fetchData("/heritages/likes/snippet", { page: htLkPage, size: HT_SIZE }, setHtLkData);
    }, [htLkPage]);

    useEffect(() => {
        fetchData("/heritages/bookmarks/snippet", { page: htBkPage, size: HT_SIZE }, setHtBkData);
    }, [htBkPage]);

    useEffect(() => {
        fetchData("/users/me/boards/snippet", { page: postPage, size: PAGE_SIZE }, setPostData);
    }, [postPage]);

    useEffect(() => {
        fetchData("/boards/bookmarks/snippet", { page: postBkPage, size: PAGE_SIZE }, setPostBkData);
    }, [postBkPage]);

    useEffect(() => {
        fetchData("/boards/likes/snippet", { page: postLkPage, size: PAGE_SIZE }, setPostLkData);
    }, [postLkPage]);

    useEffect(() => {
        fetchData("/users/me/comments/snippet", { page: commentPage, size: PAGE_SIZE }, setCommentData);
    }, [commentPage]);

    useEffect(() => {
        fetchData("/users/me/reviews/snippet", { page: reviewPage, size: PAGE_SIZE }, setReviewData);
    }, [reviewPage]);

    useEffect(() => {
        const MEDAL_MAP = {
            金: MEDAL_GOLD,
            銀: MEDAL_SILVER,
            銅: MEDAL_BRONZE,
        };

        const fetchAchievements = async () => {
            const id = localStorage.getItem("id");
            const token = localStorage.getItem("token");

            if (!id || !token) return;

            try {
                const response = await axios.get(`http://localhost:9990/topaboda/api/users/achievements/snippet`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const rawData = response.data.contents || response.data;

                const mappedData = rawData.map((item) => ({
                    id: item.id,
                    title: item.title || item.name,
                    grade: item.grade || item.rarity,
                    medal: MEDAL_MAP[item.grade || item.rarity] || MEDAL_BRONZE,
                    achieved: !!item.achieved,
                    progress: item.progress,
                }));

                mappedData.sort((a, b) => {
                    if (a.achieved !== b.achieved) {
                        return b.achieved - a.achieved;
                    }

                    return b.progress - a.progress;
                });

                setAchievements({ contents: mappedData });
            } catch (error) {
                console.error("업적 로드 실패:", error);
            }
        };

        fetchAchievements();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setSavedRoutes([]);
            setRoutesLoading(false);
            return;
        }
        let cancelled = false;
        setRoutesLoading(true);
        fetch(API_ROUTES, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                if (!res.ok) throw new Error("fail");
                return res.json();
            })
            .then((data) => {
                if (!cancelled) setSavedRoutes(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!cancelled) setSavedRoutes([]);
            })
            .finally(() => {
                if (!cancelled) setRoutesLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const maxPage = Math.max(0, Math.ceil(savedRoutes.length / ROUTE_SIZE) - 1);
        if (routePage > maxPage) setRoutePage(maxPage);
    }, [savedRoutes.length, routePage]);

    return (
        <>
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
                                <button disabled={routePage >= totalRoutePages - 1} onClick={() => setRoutePage((p) => p + 1)} style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${C.border}`, background: "white", cursor: routePage >= totalRoutePages - 1 ? "default" : "pointer", opacity: routePage >= totalRoutePages - 1 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                                    <ChevronRight />
                                </button>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                            {routesLoading ? (
                                <>
                                    <div style={{ height: 72, borderRadius: 12, background: C.bg, border: `1.5px solid ${C.border}` }} />
                                    <div style={{ height: 72, borderRadius: 12, background: C.bg, border: `1.5px solid ${C.border}` }} />
                                </>
                            ) : savedRoutes.length === 0 ? (
                                /* 목록 없을 때 */
                                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0" }}>
                                    <p style={{ fontSize: 14, color: C.gray3, margin: 0 }}>탐방로がありません。</p>
                                </div>
                            ) : (
                                /* 경로 카드 (최대 3개) */
                                displayedRoutes.slice(0, 3).map((r) => (
                                    <RouteCard
                                        key={r.id}
                                        route={r}
                                        onClick={() => navigate(`/route/create?routeId=${encodeURIComponent(r.id)}`)}
                                    />
                                ))
                            )}
                        </div>
                        {/* 항상 하단: 새 경로 만들기 버튼 */}
                        <button
                            onClick={() => navigate("/route/create")}
                            style={{ border: `2px solid ${C.red}`, borderRadius: 12, padding: "14px", background: "white", color: C.red, fontWeight: 700, cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = C.red; e.currentTarget.style.color = "white"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = C.red; }}
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
                                    }}
                                    style={{ background: "none", border: "none", fontSize: 18, fontWeight: 800, color: heritageTab === "bookmark" ? C.navy : C.gray4, cursor: "pointer", paddingBottom: 4, borderBottom: "none", display: "flex", alignItems: "center", gap: 7 }}
                                >
                                    <BookmarkIcon active={heritageTab === "bookmark"} />
                                    ブックマーク
                                </button>
                                <button
                                    onClick={() => {
                                        setHeritageTab("like");
                                    }}
                                    style={{ background: "none", border: "none", fontSize: 18, fontWeight: 800, color: heritageTab === "like" ? C.navy : C.gray4, cursor: "pointer", paddingBottom: 4, borderBottom: "none", display: "flex", alignItems: "center", gap: 7 }}
                                >
                                    <HeartIcon active={heritageTab === "like"} />
                                    いいね
                                </button>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    disabled={heritageTab === "bookmark" ? htBkPage === 0 : htLkPage === 0}
                                    onClick={() => {
                                        if (heritageTab === "bookmark") setHtBkPage((p) => p - 1);
                                        else setHtLkPage((p) => p - 1);
                                    }}
                                    style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${C.border}`, background: "white", cursor: (heritageTab === "bookmark" ? htBkPage === 0 : htLkPage === 0) ? "default" : "pointer", opacity: (heritageTab === "bookmark" ? htBkPage === 0 : htLkPage === 0) ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                                >
                                    <ChevronLeft />
                                </button>
                                <button
                                    disabled={heritageTab === "bookmark" ? htBkPage >= totalHtPagesWithAdd - 1 : htLkPage >= totalHtPagesWithAdd - 1}
                                    onClick={() => {
                                        if (heritageTab === "bookmark") setHtBkPage((p) => p + 1);
                                        else setHtLkPage((p) => p + 1);
                                    }}
                                    style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${C.border}`, background: "white", cursor: (heritageTab === "bookmark" ? htBkPage >= totalHtPagesWithAdd - 1 : htLkPage >= totalHtPagesWithAdd - 1) ? "default" : "pointer", opacity: (heritageTab === "bookmark" ? htBkPage >= totalHtPagesWithAdd - 1 : htLkPage >= totalHtPagesWithAdd - 1) ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                                >
                                    <ChevronRight />
                                </button>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                            {Array.from({ length: 4 }).map((_, i) => {
                                const item = displayedHt[i];
                                if (item) return (
                                    <HeritageCard
                                        key={item.heritageId}
                                        item={item}
                                        type={heritageTab}
                                        onCancel={handleCancelRequest}
                                    />
                                );
                                // AddSlot은 항목 바로 다음 칸에만 표시
                                if (i === displayedHt.length) return (
                                    <AddSlot key="add-slot" type={heritageTab} onClick={() => navigate("/heritage")} />
                                );
                                // 나머지는 빈 회색 칸
                                return (
                                    <div key={`ht-empty-${i}`} style={{
                                        borderRadius: 16, height: 170,
                                    }} />
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── 3. 활동 리스트 (2/3) + 게시글 북마크/좋아요 (1/3) ── */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" }}>

                    {/* ── 왼쪽: 투고/댓글/리뷰 ── */}
                    <div style={{ background: C.white, borderRadius: 24, padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        {/* 탭 + 새 글 작성 버튼 */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {[
                                    { key: "posts",    label: "投稿した記事", count: postData.totalElements },
                                    { key: "comments", label: "コメント",      count: commentData.totalElements },
                                    { key: "reviews",  label: "レビュー",      count: reviewData.totalElements },
                                ].map(({ key, label, count }) => {
                                    const isActive = postTab === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setPostTab(key)}
                                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, border: "none", background: isActive ? C.navy : "white", color: isActive ? "white" : C.gray3, cursor: "pointer", fontWeight: 500, fontSize: 15, boxShadow: isActive ? "0 4px 12px rgba(0,13,87,0.2)" : "none", transition: "all 0.2s" }}
                                        >
                                            {label}
                                            <span style={{ background: isActive ? "rgba(255,255,255,0.2)" : "#f3f4f6", color: isActive ? "white" : C.gray3, borderRadius: 99, padding: "1px 8px", fontSize: 13 }}>{count}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <button onClick={() => navigate("/community/write")} style={{ display: "flex", alignItems: "center", gap: 8, background: C.red, color: "white", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 700, cursor: "pointer", transition: "0.2s", flexShrink: 0 }} onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
                                <img src={icPen} alt="" style={{ width: 18 }} /> 投稿する
                            </button>
                        </div>

                        {/* 리스트 */}
                        <div style={{ minHeight: 500 }}>
                            {displayedAct.length === 0 ? (
                                <p style={{ textAlign: "center", color: C.gray3, padding: "60px 0", fontSize: 14 }}>
                                    {postTab === "posts"    && "投稿した記事がありません。"}
                                    {postTab === "comments" && "コメントがありません。"}
                                    {postTab === "reviews"  && "レビューがありません。"}
                                </p>
                            ) : (
                                displayedAct.map((item) => {
                                    if (postTab === "posts")    return <PostRow key={item.id} item={item} navigate={navigate} onEditPost={handleEditPost} onDeletePost={handleDeletePost} />;
                                    if (postTab === "comments") return <CommentRow key={item.id} item={item} onEditComment={handleEditComment} onDeleteComment={handleDeleteComment} />;
                                    return <ReviewRow key={item.id} item={item} />;
                                })
                            )}
                        </div>

                        {/* 페이지네이션 */}
                        {currentTabData.totalPages > 1 && (
                            <Pagination currentPage={currentPageNum + 1} totalPages={currentTabData.totalPages} onPageChange={(p) => currentSetPage(p - 1)} />
                        )}
                    </div>

                    {/* ── 오른쪽: 게시글 북마크/좋아요 ── */}
                    <div style={{ background: C.white, borderRadius: 24, padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        {/* 탭 헤더 */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <div style={{ display: "flex", gap: 8 }}>
                                {[
                                    { key: "bookmark", label: "ブックマーク", count: postBkData.totalElements },
                                    { key: "like",     label: "いいね",       count: postLkData.totalElements },
                                ].map(({ key, label, count }) => {
                                    const isActive = postSaveTab === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setPostSaveTab(key)}
                                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "none", background: isActive ? C.navy : "white", color: isActive ? "white" : C.gray3, cursor: "pointer", fontWeight: 500, fontSize: 14, boxShadow: isActive ? "0 4px 12px rgba(0,13,87,0.2)" : "none", transition: "all 0.2s" }}
                                        >
                                            {label}
                                            <span style={{ background: isActive ? "rgba(255,255,255,0.2)" : "#f3f4f6", color: isActive ? "white" : C.gray3, borderRadius: 99, padding: "1px 7px", fontSize: 12 }}>{count}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 리스트 */}
                        {(() => {
                            const saveData = postSaveTab === "bookmark" ? postBkData : postLkData;
                            const savePage = postSaveTab === "bookmark" ? postBkPage : postLkPage;
                            const setPage  = postSaveTab === "bookmark" ? setPostBkPage : setPostLkPage;
                            return (
                                <>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 500 }}>
                                        {saveData.contents.length === 0 ? (
                                            <p style={{ textAlign: "center", color: C.gray3, padding: "60px 0", fontSize: 14 }}>
                                                {postSaveTab === "bookmark" ? "ブックマークした記事がありません。" : "いいねした記事がありません。"}
                                            </p>
                                        ) : (
                                            saveData.contents.map((item) => (
                                                <PostSaveCard
                                                    key={item.id}
                                                    item={item}
                                                    type={postSaveTab}
                                                    onCancel={(it) => setPostSaveCancelModal({ open: true, item: { ...it, type: postSaveTab } })}
                                                />
                                            ))
                                        )}
                                    </div>
                                    {/* 항상 표시되는 화살표 페이지네이션 */}
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                                        <button
                                            disabled={savePage === 0}
                                            onClick={() => setPage((p) => p - 1)}
                                            style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${C.border}`, background: "white", cursor: savePage === 0 ? "default" : "pointer", opacity: savePage === 0 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                                        >
                                            <ChevronLeft />
                                        </button>
                                        <span style={{ fontSize: 13, color: C.gray3 }}>{savePage + 1} / {Math.max(1, saveData.totalPages)}</span>
                                        <button
                                            disabled={savePage >= Math.max(1, saveData.totalPages) - 1}
                                            onClick={() => setPage((p) => p + 1)}
                                            style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${C.border}`, background: "white", cursor: savePage >= Math.max(1, saveData.totalPages) - 1 ? "default" : "pointer", opacity: savePage >= Math.max(1, saveData.totalPages) - 1 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                                        >
                                            <ChevronRight />
                                        </button>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* ── 4. 업적 갤러리 ── */}
                <div style={{ background: C.white, borderRadius: 24, padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                    {/* 헤더 */}
                    <div style={{ marginBottom: 32 }}>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: "0 0 6px" }}>業績ギャラリー</h2>
                        <p style={{ fontSize: 14, color: C.gray2 }}>探検の足跡を記録してください</p>
                    </div>

                    {/* 16개 메달 그리드 */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "20px", justifyItems: "center" }}>
                        {achievements.contents.map((item) => (
                            <AchievementCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* 피그마 1767-2214 하단 바 */}
                    {(() => {
                        const achievedCount = achievements.contents.filter((a) => a.achieved).length;
                        const inProgressCount = achievements.contents.filter((a) => !a.achieved && a.progress > 0).length;
                        const notStartedCount = achievements.contents.filter((a) => !a.achieved && !a.progress).length;
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
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
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

        {/* 북마크 / 좋아요 취소 확인 모달 */}
        <TopaModal
            isOpen={cancelModal.open}
            onClose={handleCancelClose}
            onConfirm={handleCancelConfirm}
            variant={heritageTab === "bookmark" ? "info" : "danger"}
            title={heritageTab === "bookmark" ? "ブックマーク解除" : "いいね解除"}
            confirmLabel="解除する"
            cancelLabel="キャンセル"
            icon={heritageTab === "bookmark" ? "🔖" : "❤️"}
        >
            <p style={{ margin: 0, fontSize: 15, color: "#4a5565", lineHeight: 1.7 }}>
                <strong style={{ color: "#000d57" }}>
                    {cancelModal.item?.heritageName}
                </strong>
                {heritageTab === "bookmark"
                    ? " のブックマークを解除しますか？"
                    : " のいいねを解除しますか？"}
            </p>
        </TopaModal>

        {/* 게시글 북마크 / 좋아요 취소 확인 모달 */}
        <TopaModal
            isOpen={postSaveCancelModal.open}
            onClose={() => setPostSaveCancelModal({ open: false, item: null })}
            onConfirm={() => {
                // TODO: DELETE /api/boards/bookmarks/{id} or DELETE /api/boards/{id}/likes
                setPostSaveCancelModal({ open: false, item: null });
            }}
            variant={postSaveCancelModal.item?.type === "bookmark" ? "info" : "danger"}
            title={postSaveCancelModal.item?.type === "bookmark" ? "ブックマーク解除" : "いいね解除"}
            confirmLabel="解除する"
            cancelLabel="キャンセル"
            icon={postSaveCancelModal.item?.type === "bookmark" ? "🔖" : "❤️"}
        >
            <p style={{ margin: 0, fontSize: 15, color: "#4a5565", lineHeight: 1.7 }}>
                <strong style={{ color: "#000d57" }}>
                    {postSaveCancelModal.item?.title}
                </strong>
                {postSaveCancelModal.item?.type === "bookmark"
                    ? " のブックマークを解除しますか？"
                    : " のいいねを解除しますか？"}
            </p>
        </TopaModal>
        </>
    );
}
