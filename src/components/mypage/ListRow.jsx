import { C, font, CAT_COLORS } from "./theme";
import { CalendarIcon, EyeIcon, SmallHeartIcon, EditIcon, TrashIcon } from "./Icons";

export function ListRow({ category, title, desc, date, views, likes, onEdit, onDelete, onCategoryClick, onTitleClick }) {
    const cat = CAT_COLORS[category];
    return (
        <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "20px 22px", background: C.white, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* 카테고리 배지 */}
                    {cat && (
                        <span
                            onClick={onCategoryClick}
                            style={{
                                display: "inline-block",
                                background: cat.bg,
                                color: cat.color,
                                padding: "3px 12px",
                                borderRadius: 99,
                                fontSize: 11,
                                fontWeight: 700,
                                marginBottom: 8,
                                fontFamily: font,
                                cursor: onCategoryClick ? "pointer" : "default",
                            }}
                        >
                            {category}
                        </span>
                    )}
                    <h4
                        onClick={onTitleClick}
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: C.navy,
                            margin: "0 0 6px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontFamily: font,
                            cursor: onTitleClick ? "pointer" : "default",
                        }}
                    >
                        {title}
                    </h4>
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
