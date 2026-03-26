import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { C, font } from "./theme";

const MAX = 1000;
const MIN = 1;

export default function ReviewEditModal({ isOpen, onClose, item, onSave }) {
    const [text, setText] = useState(item?.content ?? "");

    /* 모달 열릴 때마다 원본 내용 세팅 */
    useEffect(() => {
        if (isOpen) setText(item?.content ?? "");
    }, [isOpen, item]);

    const canSubmit = text.trim().length >= MIN;

    const handleSave = () => {
        if (!canSubmit) return;
        onSave?.(text.trim());
        onClose();
    };

    /* ESC 닫기 */
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        if (isOpen) window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                    style={{
                        position: "fixed", inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 9999,
                        padding: "20px",
                    }}
                >
                    {/* 모달 본체 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                            width: "100%",
                            maxWidth: 672,
                            fontFamily: font,
                            overflow: "hidden",
                        }}
                    >
                        {/* ── 헤더 ── */}
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "24px",
                            borderBottom: `1.25px solid ${C.border}`,
                        }}>
                            <div>
                                <p style={{ fontSize: 20, fontWeight: 700, color: C.navy, fontFamily: "'Noto Serif JP', 'Noto Serif KR', serif", margin: 0, lineHeight: 1.4 }}>
                                    レビュー編集
                                </p>
                                {item?.heritageName && (
                                    <p style={{ fontSize: 14, color: C.gray3, margin: "4px 0 0", lineHeight: 1.4 }}>
                                        {item.heritageName}
                                    </p>
                                )}
                            </div>
                            {/* X 버튼 */}
                            <button
                                onClick={onClose}
                                style={{
                                    width: 40, height: 40, borderRadius: "50%",
                                    background: "#f3f4f6", border: "none",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer", flexShrink: 0, transition: "background 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = C.border)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15 5L5 15M5 5l10 10" stroke={C.gray2} strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        {/* ── 본문 ── */}
                        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24 }}>
                            <div>
                                <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: C.gray1, marginBottom: 10 }}>
                                    レビュー内容 <span style={{ color: C.red }}>*</span>
                                </label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value.slice(0, MAX))}
                                    placeholder="レビューを入力してください。"
                                    rows={7}
                                    style={{
                                        width: "100%", boxSizing: "border-box",
                                        border: `1.25px solid ${C.border}`,
                                        borderRadius: 14, padding: "12px 16px",
                                        fontSize: 15, color: C.gray1,
                                        fontFamily: font, resize: "none",
                                        outline: "none", lineHeight: 1.6,
                                        transition: "border-color 0.2s",
                                    }}
                                    onFocus={(e) => (e.currentTarget.style.borderColor = C.navy)}
                                    onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                                />
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                                    <span style={{ fontSize: 12, color: C.gray4 }}>{text.length}/{MAX}</span>
                                </div>
                            </div>

                            {/* 가이드 */}
                            <div style={{ background: "#f9fafb", borderRadius: 14, padding: "16px" }}>
                                <p style={{ fontSize: 14, fontWeight: 700, color: C.gray1, margin: "0 0 8px" }}>
                                    レビュー編集ガイド
                                </p>
                                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                                    {[
                                        "訪問経験に基づいて正直に作成してください",
                                        "他の人に役立つ情報を含めてください",
                                        "誹謗・広告性の内容は削除される場合があります",
                                    ].map((t) => (
                                        <li key={t} style={{ fontSize: 12, color: C.gray2, lineHeight: 1.5 }}>• {t}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* ── 푸터 ── */}
                        <div style={{
                            display: "flex", gap: 12,
                            padding: "17px 24px",
                            background: "#f9fafb",
                            borderTop: `1.25px solid ${C.border}`,
                        }}>
                            <button
                                onClick={onClose}
                                style={{
                                    flex: 1, height: 50, borderRadius: 14,
                                    background: "#fff", border: `1.25px solid ${C.borderD}`,
                                    fontSize: 16, fontWeight: 700, color: C.gray1,
                                    cursor: "pointer", fontFamily: font, transition: "background 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!canSubmit}
                                style={{
                                    flex: 1, height: 50, borderRadius: 14, border: "none",
                                    fontSize: 16, fontWeight: 700,
                                    color: canSubmit ? "#fff" : C.gray4,
                                    cursor: canSubmit ? "pointer" : "not-allowed",
                                    fontFamily: font, transition: "opacity 0.2s",
                                    background: canSubmit
                                        ? `linear-gradient(135deg, ${C.red}, ${C.navy})`
                                        : "#e5e7eb",
                                    opacity: 1,
                                }}
                                onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.opacity = "0.85"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                            >
                                保存する
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
