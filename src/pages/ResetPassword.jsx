import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const C = {
    navy: "#000d57",
    red: "#6e0000",
    white: "#ffffff",
    bg: "#f8f9fc",
    gray1: "#333333",
    gray2: "#4a5565",
    gray3: "#99a1af",
    border: "#e2e8f0",
    divider: "#edf2f7",
};

const font = "'Roboto', 'Noto Sans JP', 'Noto Sans KR', sans-serif";

/* 눈 아이콘 */
const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);
const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

/* 자물쇠 아이콘 (피그마) */
const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000d57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [newFocused, setNewFocused] = useState(false);
    const [confirmFocused, setConfirmFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);
    const [btnHover, setBtnHover] = useState(false);

    /* 비밀번호 강도 체크 */
    const hasMinLength = newPw.length >= 8;
    const hasNumberOrSpecial = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPw);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!newPw) { setError("新しいパスワードを入力してください。"); return; }
        if (newPw.length < 8) { setError("パスワードは8文字以上で入力してください。"); return; }
        if (newPw !== confirmPw) { setError("パスワードが一致しません。"); return; }
        if (!token) { setError("無効なリンクです。再度パスワード検索を行ってください。"); return; }

        setLoading(true);
        try {
            await axios.post(
                "http://localhost:9990/topaboda/api/auth/reset-password",
                { token, newPassword: newPw }
            );
            setDone(true);
        } catch (err) {
            setError(err.response?.data?.message || "パスワードの再設定に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    /* ── 완료 화면 ── */
    if (done) {
        return (
            <div style={pageStyle}>
                <div style={cardStyle}>
                    <div style={headerStyle}>
                        <p style={titleStyle}>パスワード再設定</p>
                    </div>
                    <div style={{ padding: "48px 40px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ fontSize: 44, marginBottom: 20 }}>✅</div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: "0 0 8px", textAlign: "center", fontFamily: font }}>
                            パスワードを変更しました
                        </p>
                        <p style={{ fontSize: 13, color: C.gray2, textAlign: "center", lineHeight: 1.7, margin: "0 0 32px", fontFamily: font }}>
                            新しいパスワードでログインしてください。
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            style={{
                                ...actionBtnBase,
                                border: `1.2px solid ${C.navy}`,
                                background: C.navy,
                                color: C.white,
                                cursor: "pointer",
                                width: "100%",
                                maxWidth: 306,
                            }}
                        >
                            ログインへ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ── 입력 화면 ── */
    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                {/* 헤더 */}
                <div style={headerStyle}>
                    <p style={titleStyle}>パスワード再設定</p>
                </div>

                {/* 바디 */}
                <div style={{ padding: "28px 28px 36px" }}>
                    {/* 파란 요건 박스 (피그마) */}
                    <div style={{
                        background: "#eff6ff",
                        border: "1.2px solid #93c5fd",
                        borderRadius: 13,
                        padding: "16px",
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        marginBottom: 28,
                    }}>
                        <div style={{ flexShrink: 0, marginTop: 1 }}>
                            <LockIcon />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: "0 0 6px", fontFamily: font }}>
                                パスワード要件
                            </p>
                            <p style={{
                                fontSize: 12,
                                color: hasMinLength ? "#16a34a" : "#6b7280",
                                margin: "0 0 3px",
                                fontFamily: font,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                transition: "color 0.2s",
                            }}>
                                {hasMinLength ? "✓" : "•"} 最低8文字以上
                            </p>
                            <p style={{
                                fontSize: 12,
                                color: hasNumberOrSpecial ? "#16a34a" : "#6b7280",
                                margin: 0,
                                fontFamily: font,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                transition: "color 0.2s",
                            }}>
                                {hasNumberOrSpecial ? "✓" : "•"} 数字と特殊文字を含む（推奨）
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {/* 새 비밀번호 */}
                        <div>
                            <label style={labelStyle}>新しいパスワード</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showNew ? "text" : "password"}
                                    placeholder={newFocused ? "" : "新しいパスワードを入力"}
                                    value={newPw}
                                    onFocus={() => setNewFocused(true)}
                                    onBlur={() => setNewFocused(false)}
                                    onChange={(e) => { setNewPw(e.target.value); setError(""); }}
                                    style={{
                                        ...inputStyle,
                                        border: `1px solid ${newFocused ? C.navy : "#d4d4d4"}`,
                                        paddingRight: 45,
                                        transition: "border-color 0.2s",
                                    }}
                                />
                                <button type="button" onClick={() => setShowNew(!showNew)} style={eyeBtnStyle}>
                                    {showNew ? <EyeIcon /> : <EyeOffIcon />}
                                </button>
                            </div>
                        </div>

                        {/* 비밀번호 확인 */}
                        <div>
                            <label style={labelStyle}>新しいパスワード（確認）</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder={confirmFocused ? "" : "パスワードを再入力"}
                                    value={confirmPw}
                                    onFocus={() => setConfirmFocused(true)}
                                    onBlur={() => setConfirmFocused(false)}
                                    onChange={(e) => { setConfirmPw(e.target.value); setError(""); }}
                                    style={{
                                        ...inputStyle,
                                        border: `1px solid ${
                                            confirmPw && confirmPw !== newPw
                                                ? "#b91c1c"
                                                : confirmFocused
                                                ? C.navy
                                                : "#d4d4d4"
                                        }`,
                                        paddingRight: 45,
                                        transition: "border-color 0.2s",
                                    }}
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtnStyle}>
                                    {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
                                </button>
                            </div>
                            {/* 불일치 인라인 메시지 */}
                            {confirmPw && confirmPw !== newPw && (
                                <p style={{ fontSize: 12, color: "#b91c1c", margin: "4px 0 0", fontWeight: 500 }}>
                                    パスワードが一致しません。
                                </p>
                            )}
                        </div>

                        {error && (
                            <p style={{ fontSize: 13, color: "#b91c1c", margin: 0, fontWeight: 500 }}>{error}</p>
                        )}

                        {/* 제출 버튼 */}
                        <button
                            type="submit"
                            disabled={loading}
                            onMouseEnter={() => setBtnHover(true)}
                            onMouseLeave={() => setBtnHover(false)}
                            style={{
                                ...actionBtnBase,
                                border: `1.2px solid ${C.navy}`,
                                background: btnHover && !loading ? C.navy : C.white,
                                color: btnHover && !loading ? C.white : C.navy,
                                transform: btnHover && !loading ? "translateY(-1px)" : "none",
                                boxShadow: btnHover && !loading ? "0 4px 12px rgba(0,13,87,0.12)" : "none",
                                opacity: loading ? 0.65 : 1,
                                cursor: loading ? "not-allowed" : "pointer",
                                width: "100%",
                                marginTop: 4,
                            }}
                        >
                            {loading ? "設定中..." : "パスワードを再設定する"}
                        </button>

                        {/* 하단 링크 */}
                        <div style={{ textAlign: "center", paddingTop: 4 }}>
                            <Link to="/login" style={{ fontSize: 13, color: C.gray3, textDecoration: "none", fontWeight: 500 }}>
                                ← ログインに戻る
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

/* 공통 스타일 */
const pageStyle = {
    minHeight: "100vh",
    background: "#f8f9fc",
    fontFamily: font,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "180px 20px 60px",
};

const cardStyle = {
    width: "100%",
    maxWidth: 480,
    background: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
};

const headerStyle = {
    padding: "28px 28px 24px",
    borderBottom: "1.25px solid #e5e7eb",
};

const titleStyle = {
    fontSize: 20,
    fontWeight: 700,
    color: "#000d57",
    margin: 0,
    fontFamily: "'Noto Sans KR', 'Noto Sans JP', sans-serif",
};

const labelStyle = {
    display: "block",
    fontSize: 14,
    fontWeight: 500,
    color: "#111",
    marginBottom: 8,
    fontFamily: font,
};

const inputStyle = {
    width: "100%",
    height: 52,
    padding: "0 16px",
    borderRadius: 10,
    fontSize: 15,
    fontFamily: font,
    outline: "none",
    boxSizing: "border-box",
    background: "#ffffff",
    color: "#4c4c4c",
};

const eyeBtnStyle = {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#b0b8c1",
    display: "flex",
    alignItems: "center",
};

const actionBtnBase = {
    height: 50,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: font,
};
