import { C, font, CAT_COLORS } from "./theme";
import { CalendarIcon, EyeIcon, SmallHeartIcon, EditIcon, TrashIcon } from "./Icons";

export function ListRow({ category, title, desc, date, views, likes, onEdit, onDelete, onCategoryClick, onTitleClick, showDesc }) {
    const cat = CAT_COLORS[category];
    return (
        <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 10, padding: showDesc ? "6px 16px" : "10px 16px", background: C.white, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {showDesc ? (
                        /* 게시글 탭: 카테고리 + 제목 한 줄 */
                        <>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, minWidth: 0 }}>
                                {cat && (
                                    <span
                                        onClick={onCategoryClick}
                                        style={{
                                            flexShrink: 0,
                                            background: cat.bg,
                                            color: cat.color,
                                            padding: "2px 8px",
                                            borderRadius: 99,
                                            fontSize: 11,
                                            fontWeight: 700,
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
                                        flex: 1,
                                        minWidth: 0,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: C.navy,
                                        margin: 0,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        fontFamily: font,
                                        cursor: onTitleClick ? "pointer" : "default",
                                    }}
                                >
                                    {title}
                                </h4>
                            </div>
                            {desc && (
                                <p style={{
                                    fontSize: 11,
                                    color: C.gray3,
                                    margin: "0 0 3px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontFamily: font,
                                    lineHeight: 1.4,
                                }}>
                                    {desc}
                                </p>
                            )}
                        </>
                    ) : (
                        /* 댓글/리뷰 탭: 기존 레이아웃 */
                        <>
                            {cat && (
                                <span
                                    onClick={onCategoryClick}
                                    style={{
                                        display: "inline-block",
                                        background: cat.bg,
                                        color: cat.color,
                                        padding: "3px 10px",
                                        borderRadius: 99,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        marginBottom: 4,
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
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: C.navy,
                                    margin: "0 0 4px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontFamily: font,
                                    cursor: onTitleClick ? "pointer" : "default",
                                }}
                            >
                                {title}
                            </h4>
                        </>
                    )}
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.gray3 }}>
                            <CalendarIcon /> {date?.slice(0, 10) ?? date}
                        </span>
                        {views !== undefined && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.gray3 }}>
                                <EyeIcon /> {views}
                            </span>
                        )}
                        {likes !== undefined && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.gray3 }}>
                                <SmallHeartIcon /> {likes}
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                    <button onClick={onEdit} style={{ display: "flex", alignItems: "center", gap: 4, background: "#f3f4f6", border: "none", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontWeight: 500, fontSize: 12, color: C.gray1, transition: "background 0.2s", fontFamily: font }} onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")} onMouseLeave={(e) => (e.currentTarget.style.background = "#f3f4f6")}>
                        <EditIcon /> 編集
                    </button>
                    <button onClick={onDelete} style={{ display: "flex", alignItems: "center", gap: 4, background: "#fff0f0", border: "none", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontWeight: 500, fontSize: 12, color: C.red, transition: "background 0.2s", fontFamily: font }} onMouseEnter={(e) => (e.currentTarget.style.background = "#ffe0e0")} onMouseLeave={(e) => (e.currentTarget.style.background = "#fff0f0")}>
                        <TrashIcon /> 削除
                    </button>
                </div>
            </div>
        </div>
    );
}
