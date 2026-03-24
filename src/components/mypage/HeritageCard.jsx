import { useState } from "react";
import { Link } from "react-router-dom";

// 북마크 아이콘
const IconBookmarkFill = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
);

// 하트 아이콘
const IconHeartFill = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

export default function HeritageCard({ item, type = "bookmark", onCancel }) {
    const [hovered, setHovered] = useState(false);

    const handleCancelClick = (e) => {
        e.preventDefault();
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
                    background: "#e0e0e0",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* 이미지 */}
                <img
                    src={item.image}
                    alt={item.heritageName}
                    style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        transform: hovered ? "scale(1.07)" : "scale(1)",
                        transition: "transform 0.35s ease",
                    }}
                />

                {/* 호버 오버레이: 이름 + 위치 + 취소 버튼 */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: hovered
                        ? "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0) 100%)"
                        : "linear-gradient(to top, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0) 100%)",
                    transition: "background 0.3s ease",
                    display: "flex", flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "14px",
                }}>
                    {/* 이름 + 위치 (호버 시만 표시) */}
                    <div style={{
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? "translateY(0)" : "translateY(6px)",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                    }}>
                        <div>
                            <p style={{
                                fontWeight: 800, fontSize: 14, margin: 0,
                                color: "white", textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                                lineHeight: 1.4,
                            }}>
                                {item.heritageName}
                            </p>
                            <p style={{ fontSize: 12, margin: "2px 0 0", color: "rgba(255,255,255,0.8)" }}>
                                {item.region}
                            </p>
                        </div>

                        {/* 취소 아이콘 버튼 */}
                        <button
                            onClick={handleCancelClick}
                            title={type === "bookmark" ? "ブックマーク解除" : "いいね解除"}
                            style={{
                                background: "rgba(255,255,255,0.15)",
                                border: "1.5px solid rgba(255,255,255,0.7)",
                                borderRadius: "50%",
                                width: 40, height: 40, flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer",
                                transition: "background 0.2s",
                                marginLeft: 8,
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                        >
                            {type === "bookmark" ? <IconBookmarkFill /> : <IconHeartFill />}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
