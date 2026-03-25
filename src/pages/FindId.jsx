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

    // 이메일 입력
    const [email, setEmail] = useState("");
    // 단계: 'email' → 이메일 입력, 'code' → 인증번호 입력, 'done' → ID 표시
    const [step, setStep] = useState("email");

    // 인증번호
    const [code, setCode] = useState("");
    const [codeFocused, setCodeFocused] = useState(false);
    const [codeError, setCodeError] = useState("");

    // 결과
    const [result, setResult] = useState(null);  // { id: string }

    // 알림 배너
    const [notice, setNotice] = useState("");

    // 에러 / 로딩
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);

    // 버튼 hover
    const [btnHover, setBtnHover] = useState(false);
    const [verifyBtnHover, setVerifyBtnHover] = useState(false);
    const [loginBtnHover, setLoginBtnHover] = useState(false);

    // 인터랙션 상태
    const [inputFocused, setInputFocused] = useState(false);
    const [loginHover, setLoginHover] = useState(false);
    const [pwHover, setPwHover] = useState(false);
    const [kochiraHover, setKochiraHover] = useState(false);

    /* ── STEP 1: 이메일로 인증번호 발송 ── */
    const handleSendCode = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("メールアドレスを入力してください。");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                "http://localhost:9990/topaboda/api/auth/find-id",
                { email }
            );
            setNotice("認証番号をメールに送信しました。");
            setStep("code");
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "該当するアカウントが見つかりませんでした。";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    /* ── STEP 2: 인증번호 확인 → ID 표시 ── */
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setCodeError("");

        if (!code.trim()) {
            setCodeError("認証番号を入力してください。");
            return;
        }

        setVerifying(true);
        try {
            const response = await axios.post(
                "http://localhost:9990/topaboda/api/auth/find-id/verify",
                { email, code }
            );
            setResult({ id: response.data.id });
            setStep("done");
            setNotice("");
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "認証番号が正しくありません。";
            setCodeError(msg);
        } finally {
            setVerifying(false);
        }
    };

    /* ── 결과 카드 (피그마 디자인) ── */
    if (step === "done" && result) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: C.bg,
                    fontFamily: font,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    padding: "180px 20px 60px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: 480,
                        background: C.white,
                        borderRadius: 16,
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
                        border: `1px solid ${C.border}`,
                        overflow: "hidden",
                    }}
                >
                    {/* 헤더 */}
                    <div
                        style={{
                            padding: "28px 28px 24px",
                            borderBottom: `1.25px solid #e5e7eb`,
                        }}
                    >
                        <p
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: C.navy,
                                margin: 0,
                                fontFamily: "'Noto Sans KR', 'Noto Sans JP', sans-serif",
                            }}
                        >
                            ID検索結果
                        </p>
                    </div>

                    {/* 바디 */}
                    <div
                        style={{
                            padding: "48px 40px 40px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0,
                        }}
                    >
                        {/* ID 표시 */}
                        <p
                            style={{
                                fontSize: 16,
                                color: C.gray1,
                                fontWeight: 400,
                                margin: "0 0 32px",
                                fontFamily: "'Noto Sans KR', sans-serif",
                                letterSpacing: "0.02em",
                            }}
                        >
                            ID：{result.id}
                        </p>

                        {/* ログイン 버튼 */}
                        <button
                            onClick={() => navigate("/login")}
                            onMouseEnter={() => setLoginBtnHover(true)}
                            onMouseLeave={() => setLoginBtnHover(false)}
                            style={{
                                width: "100%",
                                maxWidth: 306,
                                height: 50,
                                borderRadius: 14,
                                border: `1.25px solid ${C.navy}`,
                                background: loginBtnHover ? C.navy : C.white,
                                color: loginBtnHover ? C.white : "#364153",
                                fontSize: 16,
                                fontWeight: 700,
                                fontFamily: "'Noto Sans KR', sans-serif",
                                cursor: "pointer",
                                transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                                transform: loginBtnHover ? "translateY(-1px)" : "none",
                                boxShadow: loginBtnHover ? "0 4px 12px rgba(0,13,87,0.12)" : "none",
                                marginBottom: 36,
                            }}
                        >
                            ログイン
                        </button>

                        {/* 구분선 */}
                        <div
                            style={{
                                width: "100%",
                                height: "1.25px",
                                background: "#d3d3d3",
                                marginBottom: 20,
                            }}
                        />

                        {/* 안내 문구 */}
                        <p
                            style={{
                                fontSize: 12,
                                color: "#6a7282",
                                fontWeight: 400,
                                textAlign: "center",
                                lineHeight: 1.7,
                                margin: 0,
                                fontFamily: "'Noto Sans KR', 'Noto Sans JP', sans-serif",
                            }}
                        >
                            IDをお忘れた方は<br />
                            会員登録時に登録したメールアドレスに<br />
                            IDを発送いたします。
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: C.bg,
                fontFamily: font,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "180px 20px 60px",
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
                    <p style={{ fontSize: 13, color: C.gray3, margin: "8px 0 0", fontWeight: 500 }}>
                        登録済みのメールアドレスに認証番号をお送りします
                    </p>
                </div>

                {/* ── STEP 1: 이메일 입력 ── */}
                {step === "email" && (
                    <form
                        onSubmit={handleSendCode}
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
                            }}
                            style={{
                                ...inputStyle,
                                border: `1px solid ${inputFocused ? C.navy : "#d4d4d4"}`,
                                transition: "border-color 0.2s",
                            }}
                        />
                        {error && (
                            <p style={errorStyle}>{error}</p>
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
                                boxShadow: btnHover && !loading ? "0 4px 12px rgba(0,13,87,0.12)" : "none",
                                opacity: loading ? 0.65 : 1,
                                cursor: loading ? "not-allowed" : "pointer",
                                marginTop: 8,
                            }}
                        >
                            {loading ? "送信中..." : "認証番号を送信"}
                        </button>
                    </form>
                )}

                {/* ── STEP 2: 인증번호 입력 ── */}
                {step === "code" && (
                    <form
                        onSubmit={handleVerifyCode}
                        style={{ display: "flex", flexDirection: "column", gap: 12 }}
                    >
                        {/* 인증번호 발송 알림 배너 */}
                        {notice && (
                            <div
                                style={{
                                    background: "#f0fdf4",
                                    border: "1px solid #bbf7d0",
                                    borderRadius: 10,
                                    padding: "11px 14px",
                                    fontSize: 13,
                                    color: "#166534",
                                    fontWeight: 600,
                                    textAlign: "left",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <span style={{ fontSize: 15 }}>✉️</span>
                                {notice}
                            </div>
                        )}

                        {/* 이메일 표시 (수정 불가 + 수정 링크) */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "#f8f9fc",
                                border: "1px solid #e2e8f0",
                                borderRadius: 10,
                                padding: "0 16px",
                                height: 50,
                            }}
                        >
                            <span style={{ fontSize: 14, color: C.gray2, fontWeight: 500 }}>
                                {email}
                            </span>
                            <button
                                type="button"
                                onClick={() => { setStep("email"); setCode(""); setCodeError(""); setNotice(""); }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: 12,
                                    color: C.gray3,
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    textUnderlineOffset: "2px",
                                    padding: 0,
                                    fontFamily: font,
                                }}
                            >
                                変更
                            </button>
                        </div>

                        {/* 인증번호 입력 */}
                        <input
                            type="text"
                            maxLength={6}
                            placeholder={codeFocused ? "" : "認証番号を入力してください。"}
                            value={code}
                            onFocus={() => setCodeFocused(true)}
                            onBlur={() => setCodeFocused(false)}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setCodeError("");
                            }}
                            style={{
                                ...inputStyle,
                                border: `1px solid ${codeFocused ? C.navy : "#d4d4d4"}`,
                                transition: "border-color 0.2s",
                                letterSpacing: "0.15em",
                            }}
                        />
                        {codeError && (
                            <p style={errorStyle}>{codeError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={verifying}
                            onMouseEnter={() => setVerifyBtnHover(true)}
                            onMouseLeave={() => setVerifyBtnHover(false)}
                            style={{
                                ...actionBtnBase,
                                border: `1.2px solid ${C.navy}`,
                                background: verifyBtnHover && !verifying ? C.navy : C.white,
                                color: verifyBtnHover && !verifying ? C.white : C.navy,
                                transform: verifyBtnHover && !verifying ? "translateY(-1px)" : "none",
                                boxShadow: verifyBtnHover && !verifying ? "0 4px 12px rgba(0,13,87,0.12)" : "none",
                                opacity: verifying ? 0.65 : 1,
                                cursor: verifying ? "not-allowed" : "pointer",
                                marginTop: 8,
                            }}
                        >
                            {verifying ? "確認中..." : "認証番号確認"}
                        </button>
                    </form>
                )}

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

const errorStyle = {
    fontSize: 13,
    color: "#b91c1c",
    margin: "0",
    textAlign: "left",
    fontWeight: 500,
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
