import React, { useState } from "react";
import { Link } from "react-router-dom";
import imgLogoBlkSmall from "../assets/logo_black_small.svg";
import axios from "axios";
import { API_URL } from "../config/config";

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

export default function FindPasswordPage() {
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    // focus 상태
    const [userIdFocused, setUserIdFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);

    // hover 상태
    const [btnHover, setBtnHover] = useState(false);
    const [loginHover, setLoginHover] = useState(false);
    const [idHover, setIdHover] = useState(false);
    const [kochiraHover, setKochiraHover] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        setError("");

        if (!userId.trim()) {
            setError("IDを入力してください。");
            return;
        }
        if (!email.trim()) {
            setError("メールアドレスを入力してください。");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/topaboda/api/auth/pw/email`, { id: userId, email: email });
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message || "該当するアカウントが見つかりませんでした。");
        } finally {
            setLoading(false);
        }
    };

    /* ── 발송 완료 화면 ── */
    if (sent) {
        return (
            <div style={pageStyle}>
                <div style={cardStyle}>
                    {/* 헤더 */}
                    <div style={resultHeaderStyle}>
                        <p style={resultTitleStyle}>パスワード再設定</p>
                    </div>
                    {/* 바디 */}
                    <div style={{ padding: "48px 40px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                        <div style={{ fontSize: 40, marginBottom: 20 }}>✉️</div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: "0 0 8px", textAlign: "center", fontFamily: font }}>メールを送信しました</p>
                        <p style={{ fontSize: 13, color: C.gray2, textAlign: "center", lineHeight: 1.7, margin: "0 0 32px", fontFamily: font }}>
                            {email} に<br />
                            パスワード再設定用のリンクを送りました。
                            <br />
                            メールをご確認ください。
                        </p>
                        <div style={{ width: "100%", height: "1.25px", background: "#d3d3d3", marginBottom: 20 }} />
                        <p style={{ fontSize: 12, color: "#6a7282", textAlign: "center", lineHeight: 1.7, margin: 0, fontFamily: font }}>
                            メールが届かない場合は
                            <br />
                            迷惑メールフォルダをご確認ください。
                        </p>
                        <Link to="/login" style={{ marginTop: 28, color: C.navy, fontWeight: 700, fontSize: 14, textDecoration: "none", fontFamily: font }}>
                            ← ログインに戻る
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    /* ── 입력 화면 ── */
    return (
        <div style={pageStyle}>
            <div
                style={{
                    width: "100%",
                    maxWidth: 420,
                    background: C.white,
                    borderRadius: 24,
                    padding: "45px 40px",
                    boxShadow: "0 10px 40px rgba(0,13,87,0.03)",
                    border: `1px solid ${C.border}`,
                    textAlign: "center",
                }}
            >
                {/* 로고 · 타이틀 */}
                <div style={{ marginBottom: 35, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img src={imgLogoBlkSmall} alt="TOPABODA" style={{ height: 48, marginBottom: 12 }} />
                    <p style={{ color: C.gray1, fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "1px", fontFamily: font }}>パスワード検索</p>
                    <p style={{ fontSize: 13, color: C.gray3, margin: "8px 0 0", fontWeight: 500, fontFamily: font }}>登録済みのIDとメールアドレスを入力してください</p>
                </div>

                {/* 폼 */}
                <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* ID 입력 */}
                    <input
                        type="text"
                        placeholder={userIdFocused ? "" : "IDを入力してください。"}
                        value={userId}
                        onFocus={() => setUserIdFocused(true)}
                        onBlur={() => setUserIdFocused(false)}
                        onChange={(e) => {
                            setUserId(e.target.value);
                            setError("");
                        }}
                        style={{ ...inputStyle, border: `1px solid ${userIdFocused ? C.navy : "#d4d4d4"}`, transition: "border-color 0.2s" }}
                    />

                    {/* 이메일 입력 */}
                    <input
                        type="email"
                        placeholder={emailFocused ? "" : "メールアドレスを入力してください。"}
                        value={email}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        style={{ ...inputStyle, border: `1px solid ${emailFocused ? C.navy : "#d4d4d4"}`, transition: "border-color 0.2s" }}
                    />

                    {error && <p style={{ fontSize: 13, color: "#b91c1c", margin: 0, textAlign: "left", fontWeight: 500 }}>{error}</p>}

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
                            marginTop: 8,
                        }}
                    >
                        {loading ? "送信中..." : "メールを送信"}
                    </button>
                </form>

                {/* 하단 링크 */}
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.divider}`, display: "flex", justifyContent: "center", gap: 10, fontSize: 14, color: C.gray3, fontWeight: 500 }}>
                    <Link to="/login" onMouseEnter={() => setLoginHover(true)} onMouseLeave={() => setLoginHover(false)} style={{ color: C.gray3, textDecoration: loginHover ? "underline" : "none", textUnderlineOffset: "3px", transition: "text-decoration 0.15s", cursor: "pointer" }}>
                        ログイン
                    </Link>
                    <span style={{ color: C.divider }}>|</span>
                    <Link to="/find-id" onMouseEnter={() => setIdHover(true)} onMouseLeave={() => setIdHover(false)} style={{ color: C.gray3, textDecoration: idHover ? "underline" : "none", textUnderlineOffset: "3px", transition: "text-decoration 0.15s", cursor: "pointer" }}>
                        ID検索
                    </Link>
                </div>

                {/* 신규 가입 링크 */}
                <div style={{ marginTop: 14, fontSize: 14, color: C.gray3, fontWeight: 500, fontFamily: font }}>
                    初めてご利用の方は
                    <Link to="/register" onMouseEnter={() => setKochiraHover(true)} onMouseLeave={() => setKochiraHover(false)} style={{ color: kochiraHover ? C.red : C.navy, fontWeight: 700, textDecoration: "none", marginLeft: 2, transition: "color 0.2s" }}>
                        こちら
                    </Link>
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
    padding: "120px 20px 60px",
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

const resultHeaderStyle = {
    padding: "28px 28px 24px",
    borderBottom: "1.25px solid #e5e7eb",
};

const resultTitleStyle = {
    fontSize: 20,
    fontWeight: 700,
    color: "#000d57",
    margin: 0,
    fontFamily: "'Noto Sans KR', 'Noto Sans JP', sans-serif",
};

const inputStyle = {
    width: "100%",
    height: 50,
    padding: "0 16px",
    borderRadius: 10,
    fontSize: 15,
    fontFamily: font,
    outline: "none",
    boxSizing: "border-box",
    background: "#ffffff",
    color: "#4c4c4c",
};

const actionBtnBase = {
    width: "100%",
    height: 50,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: font,
};
