import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/config";

import icHeart from "../../assets/community/icon_heart_c_2.svg";
import icComment from "../../assets/community/icon_comment_c.svg";

/* ── 색상 ── */
const C = {
    navy: "#000d57",
    red: "#6e0000",
    gold: "#caca00",
    goldD: "#a0a000",
    bg: "#f8f9fc",
    white: "#ffffff",
    gray1: "#4a5565",
    gray2: "#6a7282",
    gray3: "#99a1af",
    border: "#e5e7eb",
};

const fJP = "'Noto Sans JP', sans-serif";
const fKR = "'Noto Sans KR', sans-serif";

/* ── 카테고리 색상 ── */
const CAT = {
    レビュー: { bg: "#dbeafe", color: "#1447e6" },
    ヒント: { bg: "#ffedd4", color: "#ca3500" },
    フリートーク: { bg: "#f3e8ff", color: "#8200db" },
    質問: { bg: "#dcfce7", color: "#008236" },
};



export const cardStyles = {
    container: (isHovered) => ({
        borderRadius: 18,
        overflow: "hidden",
        background: C.white,
        border: `1px solid ${C.border}`,
        boxShadow: isHovered ? "0 12px 30px rgba(0,0,0,0.10)" : "0 4px 16px rgba(0,0,0,0.06)",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        transform: isHovered ? "translateY(-5px)" : "none",
    }),
    thumbnailWrapper: {
        position: "relative",
        height: 160,
        background: "#eef1f6",
        overflow: "hidden",
    },
    rankBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "rgba(220,224,232,0.92)",
        color: C.navy,
        fontSize: 17,
        fontWeight: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        fontFamily: "'Roboto', sans-serif",
    },
    tag: (cat) => ({
    background: cat.bg,
    color: cat.color,
    display: "inline-block",
    fontSize: 11,
    fontWeight: 800,
    padding: "3px 10px",
    borderRadius: 6,
    marginBottom: 10,
    fontFamily: fJP,
    whiteSpace: "nowrap",
}),
};

const CardThumbnail = ({ src, title, rank }) => (
    <div style={cardStyles.thumbnailWrapper}>
        <img
            src={src || `${API_URL}/topaboda/boards/default-board-thumbnail.png`}
            alt={title}
            onError={(e) => {
                e.currentTarget.src = `${API_URL}/topaboda/boards/default-board-thumbnail.png`;
            }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={cardStyles.rankBadge}>{rank}</div>
    </div>
);

const CardContent = ({ post, cat }) => (
    <div style={{ padding: "16px 18px 18px" }}>
        <span style={cardStyles.tag(cat)}>{post.category}</span>
        <p
            style={{
                fontSize: 15,
                fontWeight: 800,
                color: C.navy,
                lineHeight: 1.4,
                margin: "0 0 12px",
                fontFamily: fJP,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: 42,
            }}
        >
            {post.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: C.gray3, fontFamily: fKR }}>
                {post.author} · {post.date}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <IconStat icon={icHeart} count={post.likes} />
                <IconStat icon={icComment} count={post.comments} />
            </div>
        </div>
    </div>
);

const IconStat = ({ icon, count }) => (
    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: C.gray3, fontFamily: "'Roboto', sans-serif" }}>
        <img src={icon} alt="" style={{ width: 12, opacity: 0.5 }} /> {count}
    </span>
);

function PopularCard({ post, rank }) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const cat = CAT[post.category] || { bg: "#eee", color: "#555" };

    return (
        <div onClick={() => navigate(`/community/${post.id}`)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={cardStyles.container(isHovered)}>
            <CardThumbnail src={post.thumbnailUrl} title={post.title} rank={rank} />
            <CardContent post={post} cat={cat} />
        </div>
    );
}

export default PopularCard;
