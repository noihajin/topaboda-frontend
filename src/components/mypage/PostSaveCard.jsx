import { useState } from "react";
import { useNavigate } from "react-router-dom";

const C = {
    navy:   "#000d57",
    red:    "#6e0000",
    border: "#e5e7eb",
    gray:   "#6b7280",
};

// 카테고리 뱃지 색상
const CATEGORY_STYLE = {
    "文化": { bg: "#eff6ff", color: "#1d4ed8" },
    "歴史": { bg: "#fef3c7", color: "#92400e" },
    "自然": { bg: "#ecfdf5", color: "#065f46" },
    "伝統": { bg: "#fdf4ff", color: "#7e22ce" },
    "祭り": { bg: "#fff1f2", color: "#9f1239" },
};
const DEFAULT_BADGE = { bg: "#f3f4f6", color: "#374151" };

// 북마크 아이콘
const IconBookmark = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
);

// 하트 아이콘
const IconHeart = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

export default function PostSaveCard({ item, type = "bookmark", onCancel }) {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const badgeStyle = CATEGORY_STYLE[item.category] || DEFAULT_BADGE;

    const handleCancelClick = (e) => {
        e.stopPropagation();
        if (onCancel) onCancel(item);
    };

    return (
        <div
            onClick={() => navigate(`/community/${item.id}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderRadius: 14,
                border: `1.5px solid ${hovered ? C.navy : C.border}`,
                background: hovered ? "#f8f9fc" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
            }}
        >
            {/* 카테고리 뱃지 */}
            <span style={{
                flexShrink: 0,
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 99,
                background: badgeStyle.bg,
                color: badgeStyle.color,
                whiteSpace: "nowrap",
            }}>
                {item.category || "投稿"}
            </span>

            {/* 제목 */}
            <p style={{
                flex: 1,
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: C.navy,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}>
                {item.title}
            </p>

            {/* 취소 버튼 */}
            <button
                onClick={handleCancelClick}
                title={type === "bookmark" ? "ブックマーク解除" : "いいね解除"}
                style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "none",
                    background: type === "bookmark" ? C.navy : C.red,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "opacity 0.2s, transform 0.2s",
                    opacity: 0.85,
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1)"; }}
            >
                {type === "bookmark" ? <IconBookmark /> : <IconHeart />}
            </button>
        </div>
    );
}
