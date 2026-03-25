import { useEffect ,useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

/* ── 색상 토큰 ── */
const C = {
  navy:   "#000d57",
  red:    "#6e0000",
  gold:   "#caca00",
  bg:     "#f8f9fc",
  white:  "#ffffff",
  gray1:  "#364153",
  gray2:  "#4a5565",
  gray3:  "#6a7282",
  gray4:  "#99a1af",
  border: "#e5e7eb",
  borderL:"#f3f4f6",
};

const font     = "'Noto Sans JP', 'Noto Sans KR', sans-serif";
const fontBold = "'Noto Serif JP', serif";

const CAT_COLORS = {
  "レビュー":     { bg: "#dbeafe", color: "#1447e6" },
  "ヒント":       { bg: "#ffedd4", color: "#ca3500" },
  "フリートーク": { bg: "#f3e8ff", color: "#8200db" },
  "質問":         { bg: "#dcfce7", color: "#008236" },
};

/* ── SVG 아이콘 ── */
const BookmarkIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24"
    fill={active ? C.navy : "none"} stroke={active ? C.navy : C.gray3}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={C.gray3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke={C.gray3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke={C.gray3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke={C.gray3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24"
    fill={filled ? C.red : "none"}
    stroke={filled ? C.red : C.gray3}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const HeartLgIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24"
    fill={filled ? C.red : "none"}
    stroke={filled ? C.red : C.gray3}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const CommentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

/* ── 본문 공통 텍스트 스타일 ── */
const contentText = {
  fontFamily: "'Noto Sans JP', sans-serif",
  fontSize: 15,
  color: "#333",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: 1.9,
  margin: "6px 0",
};

/* ── 마크다운 간소화 렌더러 (굵기/크기 차이 없이 완전 통일) ── */
function renderContent(text) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("## "))
      return <p key={i} style={{ ...contentText, margin: "20px 0 6px" }}>{line.slice(3)}</p>;
    if (line.startsWith("### "))
      return <p key={i} style={{ ...contentText, margin: "14px 0 4px" }}>{line.slice(4)}</p>;
    if (line.startsWith("- ") || line.match(/^\d+\. /))
      return <p key={i} style={{ ...contentText, margin: "4px 0 4px 16px" }}>{line}</p>;
    if (line === "")
      return <div key={i} style={{ height: 6 }} />;
    return <p key={i} style={contentText}>{line}</p>;
  });
}

/* ── 메인 컴포넌트 ── */
export default function PostDetail() {
  const { postId } = useParams();
  const navigate   = useNavigate();

  const [post,        setPost]        = useState(null);
  const [liked,       setLiked]       = useState(false);
  const [likeCount,   setLikeCount]   = useState(0);
  // const [helpful,     setHelpful]     = useState(false);
  const [bookmarked,  setBookmarked]  = useState(false);
  const [comments,    setComments]    = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submitHover, setSubmitHover] = useState(false);

  const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
  };


const fetchPostDetail = async () => {
  try {
    const headers = getAuthHeader();

    const res = await axios.get(
      `http://localhost:9990/topaboda/api/boards/${postId}`,
      headers ? { headers } : {}
    );

    const mappedPost = {
      id: res.data.id,
      category: res.data.categories,
      title: res.data.title,
      author: res.data.nickname,
      date: res.data.createdAt?.slice(0, 10).replace(/-/g, "."),
      views: res.data.viewCount ?? 0,
      likes: res.data.likeCount ?? 0,
      content: res.data.content ?? "",
    };

    const mappedComments = (res.data.comments ?? []).map((comment) => ({
      id: comment.id,
      initial: comment.nickname?.[0] ?? "匿",
      author: comment.nickname,
      date: comment.createAt?.slice(0, 16).replace("T", " ").replace(/-/g, "."),
      content: comment.content,
    }));

    setPost(mappedPost);
    setLikeCount(mappedPost.likes);
    setComments(mappedComments);
  } catch (err) {
    console.error("상세 조회 실패:", err);
  }
};

const fetchInteractionStatus = async () => {
  const headers = getAuthHeader();

  if (!headers) {
    setBookmarked(false);
    setLiked(false);
    return;
  }

  try {
    const [bookmarkRes, likeRes] = await Promise.all([
      axios.get(
        `http://localhost:9990/topaboda/api/boards/${postId}/bookmarks`,
        { headers }
      ),
      axios.get(
        `http://localhost:9990/topaboda/api/boards/${postId}/likes`,
        { headers }
      ),
    ]);

    setBookmarked(bookmarkRes.data === true);
    setLiked(likeRes.data === true);
  } catch (error) {
    console.error("북마크/좋아요 상태 조회 실패:", error);
    console.error("status:", error.response?.status);
    console.error("data:", error.response?.data);
  }
};

useEffect(() => {
  fetchPostDetail();
  fetchInteractionStatus();
}, [postId]);

if (!post) {
  return <div style={{ paddingTop: "11.9rem", textAlign: "center" }}>ローディング中...</div>;
}

  const catColor = CAT_COLORS[post.category] ?? { bg: "#f3f4f6", color: C.gray3 };

const handleLike = async () => {
  const headers = getAuthHeader();

  if (!headers) {
    alert("ログイン情報がありません。");
    return;
  }

  try {
    if (liked) {
      await axios.delete(
        `http://localhost:9990/topaboda/api/boards/${postId}/likes`,
        { headers }
      );
    } else {
      await axios.post(
        `http://localhost:9990/topaboda/api/boards/${postId}/likes`,
        {},
        { headers }
      );
    }

    await fetchPostDetail();
    await fetchInteractionStatus();
  } catch (error) {
    console.error("좋아요 처리 실패:", error);
    console.error("status:", error.response?.status);
    console.error("data:", error.response?.data);
  }
};

const handleBookmark = async () => {
  const headers = getAuthHeader();

  if (!headers) {
    alert("ログイン情報がありません。");
    return;
  }

  try {
    if (bookmarked) {
      await axios.delete(
        `http://localhost:9990/topaboda/api/boards/${postId}/bookmarks`,
        { headers }
      );
    } else {
      await axios.post(
        `http://localhost:9990/topaboda/api/boards/${postId}/bookmarks`,
        {},
        { headers }
      );
    }

    await fetchPostDetail();
    await fetchInteractionStatus();
  } catch (error) {
    console.error("북마크 처리 실패:", error);
    console.error("status:", error.response?.status);
    console.error("data:", error.response?.data);
  }
};

  const handleCommentSubmit = async () => {
  const trimmed = commentText.trim();


  if (!trimmed) return;

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("ログイン情報がありません。");
      return;
    }

    const response = await axios.post(
      `http://localhost:9990/topaboda/api/boards/${postId}/comments`,
      { content: trimmed },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    setCommentText("");
    await fetchPostDetail();
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      console.error("status:", error.response?.status);
      console.error("data:", error.response?.data);
    }
  };

  const handleCommentKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleCommentSubmit();
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingTop: "11.9rem", paddingBottom: "8rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>

        {/* ── 메인 카드 ── */}
        <div style={{
          background: C.white, borderRadius: 14,
          boxShadow: "0 1.4px 4.2px rgba(0,0,0,0.1), 0 1.4px 2.8px -1.4px rgba(0,0,0,0.1)",
          overflow: "hidden", marginBottom: 24,
        }}>
          {/* 헤더 */}
          <div style={{ padding: "45px 45px 0", borderBottom: `1px solid ${C.border}`, paddingBottom: 22 }}>
            {/* 배지 + 액션 버튼 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <span style={{
                display: "inline-block", background: catColor.bg, color: catColor.color,
                padding: "5px 16px", borderRadius: 99, fontSize: 13, fontWeight: 700, fontFamily: font,
              }}>
                {post.category}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleBookmark} style={iconBtnStyle}>
                  <BookmarkIcon active={bookmarked} />
                </button>
                <button style={iconBtnStyle}><ShareIcon /></button>
              </div>
            </div>

            {/* 제목 */}
            <h1 style={{
              fontSize: 28, fontWeight: 900, color: C.navy,
              margin: "0 0 18px", lineHeight: 1.35,
              fontFamily: fontBold,
            }}>
              {post.title}
            </h1>

            {/* 메타 정보 */}
            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <MetaItem icon={<UserIcon />} text={post.author} />
              <MetaItem icon={<CalendarIcon />} text={post.date} />
              <MetaItem icon={<EyeIcon />} text={post.views.toLocaleString()} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
                <HeartIcon filled={liked} />
                <span
                  style={{
                  fontSize: 14,
                  fontWeight: liked ? 700 : 400,
                  color: liked ? C.red : C.gray3,
                  fontFamily: font
                  }}>
                  {likeCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 이미지 영역 */}
          <div style={{ display: "flex", gap: 10, height: 380 }}>
            <div style={{ flex: "0 0 41%", overflow: "hidden", background: C.border }}>
              <img
                src={`https://picsum.photos/seed/heritage${post.id}a/800/600`}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: "0 0 59%", overflow: "hidden", background: C.border }}>
              <img
                src={`https://picsum.photos/seed/heritage${post.id}b/1200/600`}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* 본문 */}
          <div style={{ padding: "45px 45px 32px" }}>
            {renderContent(post.content)}
          </div>

          {/* "この記事が役に立ちました" 버튼 */}
          <div style={{ display: "flex", justifyContent: "center", padding: "0 45px 45px" }}>
            <button onClick={handleLike} style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "20px 40px",
              borderRadius: 14,
              background: liked ? `${C.red}10` : "#f3f4f6",
              border: liked ? `1.5px solid ${C.red}40` : "1.5px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: font,
            }}>
            <HeartLgIcon filled={liked} />
            <span style={{
              fontSize: 16,
              fontWeight: 700,
              color: liked ? C.red : C.gray2,
              fontFamily: font,
            }}>
            この記事が役に立ちました
            </span>
            </button>
          </div>
        </div>

        {/* ── 댓글 카드 ── */}
        <div style={{
          background: C.white, borderRadius: 14,
          boxShadow: "0 1.4px 4.2px rgba(0,0,0,0.1), 0 1.4px 2.8px rgba(0,0,0,0.1)",
          padding: "45px",
        }}>
          {/* 댓글 헤더 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <CommentIcon />
            <span style={{ fontSize: 20, fontWeight: 900, color: C.navy, fontFamily: "'Noto Sans JP', sans-serif" }}>コメント</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: C.red, fontFamily: "'Noto Sans JP', sans-serif" }}>{comments.length}</span>
          </div>

          {/* 댓글 작성 폼 */}
          <div style={{ marginBottom: 36 }}>
            <div style={{
              border: `2px solid ${C.border}`, borderRadius: 14,
              padding: "16px 22px", marginBottom: 12,
              background: C.white,
            }}>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={handleCommentKeyDown}
                placeholder="コメントを入力してください···"
                rows={3}
                style={{
                  width: "100%", border: "none", background: "transparent",
                  resize: "none", outline: "none",
                  fontSize: 15, lineHeight: 1.75, color: C.gray2,
                  fontFamily: font, boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleCommentSubmit}
                onMouseEnter={() => setSubmitHover(true)}
                onMouseLeave={() => setSubmitHover(false)}
                style={{
                  padding: "11px 28px", borderRadius: 11,
                  background: submitHover ? "#8a0000" : C.red,
                  border: "none", color: C.white,
                  fontWeight: 600, fontSize: 15, cursor: "pointer",
                  fontFamily: font, transition: "background 0.2s",
                }}
              >
                コメントを投稿する
              </button>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {comments.map((c, idx) => (
              <div key={c.id} style={{
                padding: "22px 0",
                borderBottom: idx < comments.length - 1 ? `1.4px solid ${C.borderL}` : "none",
              }}>
                {/* 댓글 헤더 */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: C.navy, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: C.white, fontFamily: font }}>
                      {c.initial}
                    </span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.navy, fontFamily: font }}>{c.author}</p>
                    <p style={{ margin: 0, fontSize: 13, color: C.gray3, fontFamily: font }}>{c.date}</p>
                  </div>
                </div>
                {/* 댓글 내용 */}
                <p style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: "0 0 0 60px",
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: C.gray1,
                  fontFamily: font,
                }}>
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 하단 뒤로가기 ── */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
          <BackButton navigate={navigate} />
        </div>

      </div>
    </div>
  );
}

/* ── 서브 컴포넌트 ── */
function MetaItem({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {icon}
      <span style={{ fontSize: 14, color: "#4a5565", fontFamily: "'Noto Sans JP', sans-serif" }}>{text}</span>
    </div>
  );
}

function BackButton({ navigate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => navigate(-1)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 28px 12px 20px", borderRadius: 99,
        border: `1.5px solid #000d57`,
        background: hovered ? "#000d57" : "#ffffff",
        color: hovered ? "#ffffff" : "#000d57",
        fontWeight: 700, fontSize: 15, cursor: "pointer",
        transition: "background 0.2s, color 0.2s",
        fontFamily: "'Noto Sans JP', sans-serif",
        boxShadow: "0 2px 8px rgba(0,13,87,0.08)",
      }}
    >
      <span style={{
        display: "inline-block",
        transform: hovered ? "translateX(-4px)" : "translateX(0)",
        transition: "transform 0.22s ease",
        fontSize: 18, lineHeight: 1,
      }}>←</span>
      一覧に戻る
    </button>
  );
}

const iconBtnStyle = {
  width: 40, height: 40, borderRadius: 10,
  background: "#f3f4f6", border: "none",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
};
