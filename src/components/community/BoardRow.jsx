import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import icEye from "../../assets/community/icon_eye_c.svg";

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

const BoardCell = ({ children, style, ...props }) => (
    <div style={{ padding: "16px 8px", display: "flex", alignItems: "center", ...style }} {...props}>
        {children}
    </div>
);

// 제목 셀
const TitleCell = ({ title, commentCount }) => (
    <BoardCell style={{ gap: 8, minWidth: 0, flex: 1 }}>
        <span
            style={{
                fontWeight: 700,
                color: C.navy,
                fontSize: 14,
                fontFamily: fJP,
                lineHeight: 1.4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}
        >
            {title}
        </span>
        {commentCount > 0 && <span style={{ color: C.red, fontSize: 12, fontWeight: 800, flexShrink: 0, fontFamily: "'Roboto', sans-serif" }}>[{commentCount}]</span>}
    </BoardCell>
);

// 조회수 셀
const ViewCell = ({ views }) => (
    <BoardCell style={{ justifyContent: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.gray3, fontFamily: "'Roboto', sans-serif" }}>
            <img src={icEye} alt="" style={{ width: 13, opacity: 0.4 }} />
            {views}
        </span>
    </BoardCell>
);

function BoardRow({ post, displayNo }) {
    const navigate = useNavigate();
    const cat = CAT[post.category] || { bg: "#eee", color: "#555" };
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate(`/community/${post.id}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: "grid",
                gridTemplateColumns: "60px 110px 1fr 100px 96px 70px",
                padding: "0 20px",
                borderBottom: `1px solid ${C.border}`,
                cursor: "pointer",
                transition: "background 0.15s",
                background: isHovered ? "#f8f9ff" : "transparent",
            }}
        >
            {/* 1. 번호 */}
            <BoardCell style={{ justifyContent: "center", color: C.gray3, fontSize: 13, fontFamily: "'Roboto', sans-serif" }}>{displayNo}</BoardCell>

            {/* 2. 카테고리 */}
            <BoardCell>
                <span
                    style={{
                        background: cat.bg,
                        color: cat.color,
                        borderRadius: 7,
                        padding: "4px 10px",
                        fontSize: 11,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                        fontFamily: fJP,
                    }}
                >
                    {post.category}
                </span>
            </BoardCell>

            {/* 3. 제목 (분리된 컴포넌트) */}
            <TitleCell title={post.title} commentCount={post.comments} />

            {/* 4. 작성자 */}
            <BoardCell>
                <span style={{ fontSize: 13, color: C.gray1, fontFamily: fKR, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.author}</span>
            </BoardCell>

            {/* 5. 날짜 */}
            <BoardCell>
                <span style={{ fontSize: 12, color: C.gray2, fontFamily: "'Roboto', sans-serif" }}>{post.date}</span>
            </BoardCell>

            {/* 6. 조회수 (분리된 컴포넌트) */}
            <ViewCell views={post.views} />
        </motion.div>
    );
}

export default BoardRow;
