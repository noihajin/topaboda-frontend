import { useState } from "react";
import { Link } from "react-router-dom";

// 북마크 아이콘
const IconBookmarkFill = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
);

// 하트 아이콘
const IconHeartFill = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

export default function HeritageCard({ item, type = "bookmark", onCancel }) {
    const [hovered, setHovered] = useState(false);

    const handleCancelClick = (e) => {
        e.preventDefault(); // Link 이동 방지
        e.stopPropagation();
        if (onCancel) onCancel(item);
    };

    return (
        <Link to={`/heritage/${item.heritageId}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div
                style={{
                    position: "relative",
                    borderRadius: 16,
                    overflow: "hidden",
                    height: 170,
                    cursor: "pointer",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <img
                    src={item.image}
                    alt={item.heritageName}
                    style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        transform: hovered ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.3s ease",
                    }}
                />

                {/* 기본 하단 그라디언트 + 이름 */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 55%)",
                    display: "flex", flexDirection: "column",
                    justifyContent: "flex-end", padding: "14px",
                    color: "white",
                }}>
                    <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 2, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{item.heritageName}</p>
                    <p style={{ fontSize: 12, opacity: 0.8 }}>{item.region}</p>
                </div>

                {/* 호버 시 취소 오버레이 */}
                {hovered && (
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                        <button
                            onClick={handleCancelClick}
                            style={{
                                background: "rgba(255,255,255,0.15)",
                                border: "2px solid rgba(255,255,255,0.8)",
                                borderRadius: "50%",
                                width: 52, height: 52,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                        >
                            {type === "bookmark" ? <IconBookmarkFill /> : <IconHeartFill />}
                        </button>
                        <span style={{ color: "white", fontSize: 12, fontWeight: 600, opacity: 0.9 }}>
                            {type === "bookmark" ? "ブックマーク解除" : "いいね解除"}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}
