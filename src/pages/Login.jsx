import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import imgLogoBlkSmall from "../assets/logo_black_small.svg";

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

const EyeIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const SNS_ITEMS = [
    {
        key: "line",
        bg: "#06C755",
        border: "none",
        icon: (
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
                alt="LINE"
                style={{ width: 24 }}
            />
        ),
        lines: ["LINEで", "ログイン"],
    },
    {
        key: "google",
        bg: "#ffffff",
        border: "1px solid #e2e8f0",
        icon: (
            <img
                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                alt="Google"
                style={{ width: 22 }}
            />
        ),
        lines: ["Googleで", "ログイン"],
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
        lines: ["Xで", "ログイン"],
    },
];

export default function LoginPage() {
    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [saveId, setSaveId] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [loginHover, setLoginHover] = useState(false);
    const [registerHover, setRegisterHover] = useState(false);

    const handleLogin = async (e) => {
        // 2. async 키워드 추가
        e.preventDefault();

        if (!id.trim() || !password.trim()) {
            alert("IDとパスワードを入力してください。");
            return;
        }

        try {
            // 3. 실제 API 호출 (엔드포인트는 실제 서버 주소에 맞게 수정)
            const response = await axios.post(
                "http://localhost:9990/topaboda/api/auth/login",
                {
                    id: id,
                    password: password,
                },
            );

            if (response.data.jwt) {
                // 4. 성공 시 토큰 저장 (예: JWT)
                localStorage.setItem("token", response.data.jwt);

                // ID 저장 체크박스가 활성화된 경우 로직 추가 가능
                if (saveId) {
                    localStorage.setItem("savedId", id);
                } else {
                    localStorage.removeItem("savedId");
                }

                alert("ログインに成功しました！");
                navigate("/community");
            }
        } catch (error) {
            // 5. 에러 처리 (ID/PW 불일치, 서버 에러 등)
            console.error("Login Error:", error);
            const message =
                error.response?.data?.message ||
                "로그인 중 오류가 발생했습니다.";
            alert(message);
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
                            color: C.gray2,
                            fontSize: 14,
                            fontWeight: 500,
                            margin: 0,
                        }}
                    >
                        ログインしてください。
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    <input
                        type="text"
                        placeholder="IDを入力"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        style={inputStyle}
                    />
                    <div style={{ position: "relative" }}>
                        <input
                            type={showPw ? "text" : "password"}
                            placeholder="パスワードを入力"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ ...inputStyle, paddingRight: 45 }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            style={eyeBtnStyle}
                        >
                            {showPw ? <EyeIcon /> : <EyeOffIcon />}
                        </button>
                    </div>

                    <label style={checkboxLabelStyle}>
                        <input
                            type="checkbox"
                            checked={saveId}
                            onChange={() => setSaveId(!saveId)}
                            style={{ cursor: "pointer", width: 15, height: 15 }}
                        />
                        IDを保存
                    </label>

                    <button
                        type="submit"
                        onMouseEnter={() => setLoginHover(true)}
                        onMouseLeave={() => setLoginHover(false)}
                        style={{
                            ...actionBtnBase,
                            border: `1.2px solid ${C.navy}`,
                            background: loginHover ? C.navy : C.white,
                            color: loginHover ? C.white : C.navy,
                            transform: loginHover ? "translateY(-1px)" : "none",
                            boxShadow: loginHover
                                ? "0 4px 12px rgba(0,13,87,0.12)"
                                : "none",
                            marginTop: 8,
                        }}
                    >
                        ログイン
                    </button>
                </form>

                {/* ID・パスワード検索 */}
                <div
                    style={{
                        marginTop: 18,
                        display: "flex",
                        justifyContent: "center",
                        gap: 10,
                        fontSize: 13,
                        color: C.gray3,
                    }}
                >
                    <span style={{ cursor: "pointer" }}>ID検索</span>
                    <span style={{ color: C.divider }}>|</span>
                    <span style={{ cursor: "pointer" }}>パスワード検索</span>
                </div>

                {/* SNS LOGIN 구분선 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        margin: "35px 0 25px",
                    }}
                >
                    <div
                        style={{ flex: 1, height: 1, background: C.divider }}
                    />
                    <span
                        style={{
                            fontSize: 10,
                            color: C.gray3,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                        }}
                    >
                        SNS LOGIN
                    </span>
                    <div
                        style={{ flex: 1, height: 1, background: C.divider }}
                    />
                </div>

                {/* ✅ SNS 버튼 - 간격 확대 (gap: 45) */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 45,
                    }}
                >
                    {SNS_ITEMS.map((item) => (
                        <button
                            key={item.key}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 8,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        >
                            <div
                                style={{
                                    width: 54,
                                    height: 54,
                                    borderRadius: "50%",
                                    background: item.bg,
                                    border: item.border,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "none";
                                }}
                            >
                                {item.icon}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 0,
                                }}
                            >
                                {item.lines.map((line, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: C.gray2,
                                            fontFamily: font,
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {line}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>

                <div
                    style={{
                        margin: "40px 0 20px",
                        height: 1,
                        background: C.divider,
                    }}
                />

                <p
                    style={{
                        fontSize: 13,
                        color: C.gray3,
                        marginBottom: 14,
                        fontWeight: 500,
                    }}
                >
                    まだアカウントをお持ちでないですか？
                </p>

                <Link to="/register" style={{ textDecoration: "none" }}>
                    <button
                        onMouseEnter={() => setRegisterHover(true)}
                        onMouseLeave={() => setRegisterHover(false)}
                        style={{
                            ...actionBtnBase,
                            border: `1.2px solid ${C.navy}`,
                            background: registerHover ? C.navy : C.white,
                            color: registerHover ? C.white : C.navy,
                            transform: registerHover
                                ? "translateY(-1px)"
                                : "none",
                            boxShadow: registerHover
                                ? "0 4px 12px rgba(0,13,87,0.1)"
                                : "none",
                        }}
                    >
                        会員登録
                    </button>
                </Link>
            </div>
        </div>
    );
}

/* 스타일 객체 */
const inputStyle = {
    width: "100%",
    height: 46,
    padding: "0 16px",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    fontSize: 15,
    fontFamily: font,
    outline: "none",
    boxSizing: "border-box",
    background: "#ffffff",
};

const eyeBtnStyle = {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#b0b8c1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const checkboxLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    fontSize: 14,
    color: "#4a5565",
    marginTop: 4,
    fontWeight: 500,
    alignSelf: "flex-start",
};

const actionBtnBase = {
    width: "100%",
    height: 50,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};
