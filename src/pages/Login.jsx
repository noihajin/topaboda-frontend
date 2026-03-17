import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const C = {
    navy: "#000d57",
    red: "#6e0000",
    redL: "#8e0000",
    white: "#ffffff",
    bg: "#f8f9fc",
    gray1: "#333333",
    gray2: "#4a5565",
    gray3: "#99a1af",
    border: "#e5e7eb",
    divider: "#d3d3d3",
    googleBg: "#f1f3f7",
    xBg: "#000000",
};

// 컴포넌트 내부 폰트 변수 선언 제거 (index.css 설정을 따름)

export default function Login() {
    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [saveId, setSaveId] = useState(false);
    const [showPw, setShowPw] = useState(false);

    useEffect(() => {
        const savedId = localStorage.getItem("savedId");
        if (savedId) {
            setId(savedId); // 저장된 아이디를 input에 넣음
            setSaveId(true); // 체크박스를 체크 상태로 만듦
        }
    }, []);

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
                localStorage.setItem("jwt", response.data.jwt);

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
                background: C.bg,
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: "100%",
                    maxWidth: 480,
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 32,
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    padding: "60px 40px",
                    boxShadow: "0 20px 60px rgba(0, 0, 87, 0.05)",
                    textAlign: "center",
                }}
            >
                {/* 타이틀: Roboto의 굵직한 느낌 강조 */}
                <div style={{ marginBottom: 40 }}>
                    <h2
                        style={{
                            color: C.navy,
                            fontSize: 36,
                            fontWeight: 900,
                            margin: 0,
                            letterSpacing: "-0.05em", // Roboto 특유의 세련된 자간
                        }}
                    >
                        TOPABODA
                    </h2>
                    <p
                        style={{
                            color: C.gray2,
                            fontSize: 15,
                            marginTop: 8,
                            fontWeight: 500,
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
                        gap: 16,
                    }}
                >
                    {/* ID/PW 입력: 영문은 Roboto, 일본어 Placeholder는 Noto Sans JP 적용 */}
                    <div style={{ textAlign: "left" }}>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="ID入力"
                            style={{
                                width: "100%",
                                height: 60,
                                border: `1px solid ${C.border}`,
                                borderRadius: 16,
                                padding: "0 20px",
                                fontSize: 16,
                                outline: "none",
                                boxSizing: "border-box",
                                background: C.white,
                                transition: "0.2s",
                                fontWeight: 500,
                            }}
                            onFocus={(e) =>
                                (e.target.style.borderColor = C.navy)
                            }
                            onBlur={(e) =>
                                (e.target.style.borderColor = C.border)
                            }
                        />
                    </div>

                    <div style={{ position: "relative", textAlign: "left" }}>
                        <input
                            type={showPw ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="パスワード入力"
                            style={{
                                width: "100%",
                                height: 60,
                                border: `1px solid ${C.border}`,
                                borderRadius: 16,
                                padding: "0 54px 0 20px",
                                fontSize: 16,
                                outline: "none",
                                boxSizing: "border-box",
                                background: C.white,
                                transition: "0.2s",
                                fontWeight: 500,
                            }}
                            onFocus={(e) =>
                                (e.target.style.borderColor = C.navy)
                            }
                            onBlur={(e) =>
                                (e.target.style.borderColor = C.border)
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            style={{
                                position: "absolute",
                                right: 18,
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: C.gray3,
                            }}
                        >
                            {showPw ? "🙈" : "👁️"}
                        </button>
                    </div>

                    {/* 체크박스 라벨 */}
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            cursor: "pointer",
                            fontSize: 14,
                            color: C.gray2,
                            marginLeft: 4,
                            fontWeight: 600,
                        }}
                    >
                        <div
                            onClick={() => setSaveId(!saveId)}
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                border: `2px solid ${saveId ? C.navy : C.border}`,
                                background: saveId ? C.navy : C.white,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "0.2s",
                            }}
                        >
                            {saveId && (
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                >
                                    <path
                                        d="M2 5l2.5 2.5L8 3"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </div>
                        IDを保存
                    </label>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            height: 60,
                            borderRadius: 18,
                            border: "none",
                            background: `linear-gradient(to bottom, ${C.red}, ${C.redL})`,
                            color: "white",
                            fontSize: 18,
                            fontWeight: 800,
                            cursor: "pointer",
                            boxShadow: "0 8px 20px rgba(110, 0, 0, 0.2)",
                            marginTop: 10,
                        }}
                    >
                        ログイン
                    </button>
                </form>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 15,
                        margin: "30px 0",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            background: C.divider,
                        }}
                    />
                    <span
                        style={{
                            fontSize: 12,
                            color: C.gray3,
                            fontWeight: 800,
                            letterSpacing: "0.05em",
                        }}
                    >
                        SNS LOGIN
                    </span>
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            background: C.divider,
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    {/* SNS 버튼: 영문은 Roboto 볼드체로 가독성 확보 */}
                    <button
                        style={{
                            width: "100%",
                            height: 56,
                            borderRadius: 16,
                            border: `1px solid ${C.border}`,
                            background: C.white,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            cursor: "pointer",
                            fontSize: 15,
                            fontWeight: 700,
                            color: C.gray1,
                        }}
                    >
                        <img
                            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                            alt=""
                            style={{ width: 20 }}
                        />
                        Continue with Google
                    </button>

                    <button
                        style={{
                            width: "100%",
                            height: 56,
                            borderRadius: 16,
                            border: "none",
                            background: C.xBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            cursor: "pointer",
                            fontSize: 15,
                            fontWeight: 700,
                            color: C.white,
                        }}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Continue with X
                    </button>
                </div>

                <div
                    style={{
                        marginTop: 35,
                        display: "flex",
                        justifyContent: "center",
                        gap: 15,
                        fontSize: 14,
                        color: C.gray3,
                        fontWeight: 600,
                    }}
                >
                    <span style={{ cursor: "pointer" }}>ID検索</span>
                    <span style={{ color: C.divider }}>|</span>
                    <span style={{ cursor: "pointer" }}>パスワード検索</span>
                    <span style={{ color: C.divider }}>|</span>
                    <Link
                        to="/register"
                        style={{
                            textDecoration: "none",
                            color: C.navy,
                            fontWeight: 800,
                        }}
                    >
                        会員登録
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
