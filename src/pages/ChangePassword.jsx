import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/config";

// ── 디자인 토큰 ─────────────────────────────────────────────────────
const C = {
    navy: "#000d57",
    red: "#6e0000",
    yellow: "#caca00",
    gray: "#6b7280",
    border: "#e5e7eb",
    bg: "#f8f9fc",
    white: "#ffffff",
    errorBg: "#fef2f2",
    errorBorder: "#fee2e2",
    errorText: "#dc2626",
};
const font = "'Noto Sans JP', 'Noto Sans KR', sans-serif";

// ── 아이콘 ────────────────────────────────────────────────────────────
const IconLock = ({ color = C.navy }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const IconEye = ({ show }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {show ? (
            <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ) : (
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        )}
    </svg>
);

// ── 입력 필드 컴포넌트 ─────────────────────────────────────────────────
function PasswordField({ label, value, onChange, show, onToggle, placeholder, error }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconLock color={error ? C.errorText : C.navy} />
                <label style={{ fontSize: 13, fontWeight: 600, color: error ? C.errorText : C.navy, fontFamily: font }}>{label}</label>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    border: `1.2px solid ${error ? C.errorBorder : C.border}`,
                    borderRadius: 13,
                    padding: "0 16px",
                    height: 48,
                    background: error ? C.errorBg : C.white,
                    transition: "border-color 0.2s",
                }}
            >
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        fontSize: 14,
                        color: "#0a0a0a",
                        background: "transparent",
                        fontFamily: font,
                    }}
                />
                <button type="button" onClick={onToggle} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
                    <IconEye show={show} />
                </button>
            </div>
            {error && <p style={{ fontSize: 12, color: C.errorText, margin: 0, fontFamily: font }}>{error}</p>}
        </div>
    );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────
export default function ChangePassword() {
    const navigate = useNavigate();

    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [errors, setErrors] = useState({});
    const [hoverSave, setHoverSave] = useState(false);
    const [hoverCancel, setHoverCancel] = useState(false);

    const validate = () => {
        const e = {};
        if (!currentPw) e.currentPw = "現在のパスワードを入力してください。";
        if (!newPw || newPw.length < 8) e.newPw = "新しいパスワードは8文字以上で入力してください。";
        if (newPw !== confirmPw) e.confirmPw = "パスワードが一致しません。";
        return e;
    };

    const handleSave = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) {
            setErrors(e);
            return;
        }

        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
            console.error("인증 정보가 없습니다.");
            return;
        }

        try {
            const response = await axios.patch(
                `${API_URL}/topaboda/api/auth/pw/reset/login`,
                {
                    oldPassword: currentPw,
                    newPassword: newPw,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            if (response.status === 200) {
                alert("パスワードを変更しました！");
                navigate("/mypage/edit");
            }
        } catch (e) {
            console.error("비밀번호 변경 오류:", e);
            const errorMsg = e.response?.data?.message || "패스워드 변경 중 문제가 발생했습니다.";
            alert(errorMsg);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font, paddingBottom: 80 }}>
            {/* ── 헤더 ── */}
            <div style={{ paddingTop: "11.9rem", textAlign: "center", marginBottom: 32 }}>
                <h1 style={{ fontSize: 34, fontWeight: 700, color: C.navy, margin: "0 0 10px" }}>パスワード変更</h1>
                <p style={{ fontSize: 15, color: C.gray, margin: 0 }}>新しいパスワードを設定してください</p>
            </div>

            <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px" }}>
                {/* ── 비밀번호 변경 카드 ── */}
                <div
                    style={{
                        background: C.white,
                        borderRadius: 15,
                        padding: "36px 32px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                    }}
                >
                    {/* 현재 비밀번호 */}
                    <PasswordField label="現在のパスワード" value={currentPw} onChange={setCurrentPw} show={showCurrent} onToggle={() => setShowCurrent((v) => !v)} placeholder="現在のパスワードを入力" error={errors.currentPw} />

                    {/* 구분선 */}
                    <div style={{ borderTop: `1px solid ${C.border}` }} />

                    {/* 새 비밀번호 */}
                    <PasswordField label="新しいパスワード" value={newPw} onChange={setNewPw} show={showNew} onToggle={() => setShowNew((v) => !v)} placeholder="8文字以上で入力してください" error={errors.newPw} />

                    {/* 비밀번호 확인 */}
                    <PasswordField label="パスワード確認" value={confirmPw} onChange={setConfirmPw} show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} placeholder="新しいパスワードをもう一度入力" error={errors.confirmPw} />

                    {/* 안내 메시지 */}
                    <div
                        style={{
                            background: "#fff9e6",
                            border: "1.2px solid rgba(202,202,0,0.2)",
                            borderRadius: 13,
                            padding: "14px 18px",
                            fontSize: 12,
                            color: C.gray,
                            fontFamily: font,
                        }}
                    >
                        🔒 パスワードは8文字以上で、英字・数字を組み合わせることをお勧めします。
                    </div>

                    {/* 버튼 행 */}
                    <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                        <button
                            onClick={() => navigate("/mypage/edit")}
                            onMouseEnter={() => setHoverCancel(true)}
                            onMouseLeave={() => setHoverCancel(false)}
                            style={{
                                flex: 1,
                                height: 56,
                                borderRadius: 13,
                                border: `1.2px solid ${C.border}`,
                                background: hoverCancel ? "#f5f5f5" : C.white,
                                color: C.gray,
                                fontSize: 15,
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "background 0.2s",
                                fontFamily: font,
                            }}
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleSave}
                            onMouseEnter={() => setHoverSave(true)}
                            onMouseLeave={() => setHoverSave(false)}
                            style={{
                                flex: 1,
                                height: 56,
                                borderRadius: 13,
                                border: "none",
                                background: hoverSave ? "#001080" : C.navy,
                                color: C.white,
                                fontSize: 15,
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "background 0.2s, transform 0.15s",
                                transform: hoverSave ? "translateY(-2px)" : "translateY(0)",
                                fontFamily: font,
                            }}
                        >
                            変更を保存
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
