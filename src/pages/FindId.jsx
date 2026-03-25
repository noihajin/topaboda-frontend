import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import imgLogoBlkSmall from "../assets/logo_black_small.svg";
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

export default function FindIdPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [btnHover, setBtnHover] = useState(false);
    const [result, setResult] = useState(null);   // { id: string } | null
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 인터랙션 상태
    const [inputFocused, setInputFocused] = useState(false);
    const [loginHover, setLoginHover] = useState(false);
    const [pwHover, setPwHover] = useState(false);
    const [kochiraHover, setKochiraHover] = useState(false);

    const handleFindId = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);

        if (!email.trim()) {
            setError("メールアドレスを入力してください。");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:9990/topaboda/api/auth/find-id",
                { email }
            );
            setResult({ id: response.data.id });
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "該当するアカウントが見つかりませんでした。";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

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
                {/* ロゴ・タイトル */}
                <div
                    style={{
                        marginBottom: 35,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <img
                        src={imgLogoBlkSmall}
                        alt="TOPABODA"
                        style={{ height: 48, marginBottom: 12 }}
                    />
                    <p
                        style={{
                            color: C.gray1,
                            fontSize: 20,
                            fontWeight: 700,
                            margin: 0,
                            letterSpacing: "1px",
                        }}
                    >
                        ID検索
                    </p>
                </div>

                {/* 검색 폼 */}
                <form
                    onSubmit={handleFindId}
                    style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                    <input
                        type="email"
                        placeholder={inputFocused ? "" : "メールアドレスを入力してください。"}
                        value={email}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                            setResult(null);
                        }}
                        style={{
                            ...inputStyle,
                            border: `1px solid ${inputFocused ? C.navy : "#d4d4d4"}`,
                            transition: "border-color 0.2s",
                        }}
                    />

                    {/* 에러 메시지 */}
                    {error && (
                        <p
                            style={{
                                fontSize: 13,
                                color: "#b91c1c",
                                margin: "0",
                                textAlign: "left",
                                fontWeight: 500,
                            }}
                        >
                            {error}
                        </p>
                    )}

                    {/* ID 검색 결과 */}
                    {result && (
                        <div
                            style={{
                                background: "#f0f4ff",
                                border: `1px solid ${C.navy}22`,
                                borderRadius: 12,
                                padding: "14px 16px",
                                textAlign: "left",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: 12,
                                    color: C.gray3,
                                    fontWeight: 600,
                                    margin: "0 0 4px",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                登録されたIDは：
                            </p>
                            <p
                                style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: C.navy,
                                    margin: 0,
                                    letterSpacing: "0.5px",
                                }}
                            >
                                {result.id}
                            </p>
                        </div>
                    )}

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
                            boxShadow:
                                btnHover && !loading
                                    ? "0 4px 12px rgba(0,13,87,0.12)"
                                    : "none",
                            opacity: loading ? 0.65 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                            marginTop: 8,
                        }}
                    >
                        {loading ? "検索中..." : "ID検索"}
                    </button>
                </form>

                {/* 하단 링크 */}
                <div
                    style={{
                        marginTop: 24,
                        paddingTop: 20,
                        borderTop: `1px solid ${C.divider}`,
                        display: "flex",
                        justifyContent: "center",
                        gap: 10,
                        fontSize: 14,
                        color: C.gray3,
                        fontWeight: 500,
                    }}
                >
                    <Link
                        to="/login"
                        onMouseEnter={() => setLoginHover(true)}
                        onMouseLeave={() => setLoginHover(false)}
                        style={{
                            color: C.gray3,
                            textDecoration: loginHover ? "underline" : "none",
                            textUnderlineOffset: "3px",
                            transition: "text-decoration 0.15s",
                            cursor: "pointer",
                        }}
                    >
                        ログイン
                    </Link>
                    <span style={{ color: C.divider }}>|</span>
                    <span
                        onMouseEnter={() => setPwHover(true)}
                        onMouseLeave={() => setPwHover(false)}
                        style={{
                            cursor: "pointer",
                            textDecoration: pwHover ? "underline" : "none",
                            textUnderlineOffset: "3px",
                            transition: "text-decoration 0.15s",
                        }}
                    >
                        パスワード検索
                    </span>
                </div>

                {/* 신규 가입 링크 */}
                <div
                    style={{
                        marginTop: 14,
                        fontSize: 14,
                        color: C.gray3,
                        fontWeight: 500,
                    }}
                >
                    初めてご利用の方は
                    <Link
                        to="/register"
                        onMouseEnter={() => setKochiraHover(true)}
                        onMouseLeave={() => setKochiraHover(false)}
                        style={{
                            color: kochiraHover ? C.red : C.navy,
                            fontWeight: 700,
                            textDecoration: "none",
                            marginLeft: 2,
                            transition: "color 0.2s",
                        }}
                    >
                        こちら
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* 스타일 */
const inputStyle = {
    width: "100%",
    height: 50,
    padding: "0 16px",
    border: "1px solid #d4d4d4",
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
