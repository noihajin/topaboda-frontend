import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import imgLogoBlkSmall from "../assets/logo_black_small.svg";

const C = {
    navy: "#000d57",
    red: "#6e0000",
    white: "#ffffff",
    bg: "#f8f9fc",
    gray2: "#4a5565",
    gray3: "#99a1af",
    border: "#e2e8f0",
    divider: "#edf2f7",
};

const font = "'Roboto', 'Noto Sans JP', 'Noto Sans KR', sans-serif";

const SNS_ITEMS = [
    {
        key: "line",
        bg: "#06C755",
        border: "none",
        icon: <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE" style={{ width: 24 }} />,
        lines: ["LINEで", "登録"],
        url: "http://localhost:9990/topaboda/api/auth/line/signUp",
    },
    {
        key: "google",
        bg: "#ffffff",
        border: "1px solid #e2e8f0",
        icon: <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" style={{ width: 22 }} />,
        lines: ["Googleで", "登録"],
        url: "",
    },
    {
        key: "x",
        bg: "#000000",
        border: "none",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        lines: ["Xで", "登録"],
        url: "",
    },
];

export default function RegisterSelect() {
    const navigate = useNavigate();
    const [emailHover, setEmailHover] = useState(false);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: C.bg,
                fontFamily: font,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "120px 20px 60px",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                {/* ロゴ・タイトル */}
                <div style={{ marginBottom: 35, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img src={imgLogoBlkSmall} alt="TOPABODA" style={{ height: 48, marginBottom: 12 }} />
                    <p style={{ color: C.gray2, fontSize: 14, fontWeight: 500, margin: 0 }}>会員登録の方法を選択してください。</p>
                </div>

                {/* SNS 가입 방법 */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 25 }}>
                    <div style={{ flex: 1, height: 1, background: C.divider }} />
                    <span style={{ fontSize: 10, color: C.gray3, fontWeight: 700, letterSpacing: "0.05em" }}>SNS REGISTER</span>
                    <div style={{ flex: 1, height: 1, background: C.divider }} />
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: 45, marginBottom: 32 }}>
                    {SNS_ITEMS.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => {
                                window.location.href = item.url;
                            }}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        >
                            <div
                                style={{ width: 54, height: 54, borderRadius: "50%", background: item.bg, border: item.border, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.2s" }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "none";
                                }}
                            >
                                {item.icon}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                {item.lines.map((line, i) => (
                                    <span key={i} style={{ fontSize: 11, fontWeight: 600, color: C.gray2, lineHeight: 1.3 }}>
                                        {line}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>

                {/* メール 구분선 */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                    <div style={{ flex: 1, height: 1, background: C.divider }} />
                    <span style={{ fontSize: 10, color: C.gray3, fontWeight: 700, letterSpacing: "0.05em" }}>MAIL REGISTER</span>
                    <div style={{ flex: 1, height: 1, background: C.divider }} />
                </div>

                {/* メール 가입 버튼 */}
                <button
                    onClick={() => navigate("/register/form")}
                    onMouseEnter={() => setEmailHover(true)}
                    onMouseLeave={() => setEmailHover(false)}
                    style={{
                        width: "100%",
                        height: 50,
                        borderRadius: 12,
                        border: `1.2px solid ${C.navy}`,
                        background: emailHover ? C.navy : C.white,
                        color: emailHover ? C.white : C.navy,
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: font,
                        transform: emailHover ? "translateY(-1px)" : "none",
                        boxShadow: emailHover ? "0 4px 12px rgba(0,13,87,0.12)" : "none",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    メールアドレスで登録
                </button>

                {/* ログインへ */}
                <div style={{ margin: "32px 0 0", height: 1, background: C.divider }} />
                <p style={{ fontSize: 13, color: C.gray3, margin: "16px 0 0", fontWeight: 500 }}>
                    すでにアカウントをお持ちですか？{" "}
                    <Link to="/login" style={{ color: C.navy, fontWeight: 700, textDecoration: "none" }}>
                        ログイン
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
