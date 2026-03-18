import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import imgLogoBlkSmall from "../assets/logo_black_small.svg";

const C = {
  navy:    "#000d57",
  red:     "#6e0000",
  white:   "#ffffff",
  bg:      "#f8f9fc",
  gray2:   "#4a5565",
  gray3:   "#99a1af",
  border:  "#e2e8f0",
  divider: "#edf2f7",
};

const font = "'Roboto', 'Noto Sans JP', 'Noto Sans KR', sans-serif";

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const SNS_ITEMS = [
  {
    key: "line",
    bg: "#06C755",
    border: "none",
    icon: <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE" style={{ width: 24 }} />,
    lines: ["LINEで", "登録"],
  },
  {
    key: "google",
    bg: "#ffffff",
    border: "1px solid #e2e8f0",
    icon: <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" style={{ width: 22 }} />,
    lines: ["Googleで", "登録"],
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
  },
];

function SubmitButton({ label }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="submit"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...actionBtnBase,
        border: `1.2px solid ${C.navy}`,
        background: hover ? C.navy : C.white,
        color: hover ? C.white : C.navy,
        transform: hover ? "translateY(-1px)" : "none",
        boxShadow: hover ? "0 4px 12px rgba(0,13,87,0.12)" : "none",
        marginTop: 8,
      }}
    >
      {label}
    </button>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState("idle");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9990/topaboda/api/auth/signUp/email",
        { email }
      );
      if (response.status === 200) {
        alert(`${email} に認証コードを送信しました。`);
        setAuthCode("");
        setStep(2);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "サーバーエラーが発生しました。";
      alert(errorMsg);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9990/topaboda/api/auth/signUp/verify",
        { email, token: authCode }
      );
      if (response.status === 200) {
        setStep(3);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "認証コードが一致しません。";
      alert(errorMsg);
      setStep(1);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (nicknameStatus !== "available") return alert("ニックネームの重複確認を行ってください。");
    if (formData.password !== formData.passwordConfirm) return alert("パスワードが一致しません。");
    try {
      const response = await axios.post(
        "http://localhost:9990/topaboda/api/auth/signUp",
        { id: formData.userId, email, password: formData.password, nickname: formData.nickname }
      );
      if (response.status === 200) {
        localStorage.setItem("jwt", response.data.jwt);
        localStorage.setItem("userName", formData.nickname);
        setShowSuccessModal(true);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "サーバーエラーが発生しました。";
      alert(errorMsg);
    }
  };

  const handleNicknameCheck = async () => {
    if (!formData.nickname) return alert("ニックネームを入力してください。");
    try {
      setNicknameStatus("checking");
      const response = await axios.post(
        "http://localhost:9990/topaboda/api/auth/signUp/nickname",
        { nickname: formData.nickname }
      );
      if (response.status === 200) {
        alert("使用可能なニックネームです。");
        setNicknameStatus("available");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert("すでに使用中のニックネームです。");
        setNicknameStatus("duplicate");
      } else {
        alert("サーバーエラー");
        setNicknameStatus("error");
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: font,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "120px 20px 60px",
    }}>
      <div style={{
        width: "100%", maxWidth: 420,
        background: C.white, borderRadius: 24, padding: "45px 40px",
        boxShadow: "0 10px 40px rgba(0,13,87,0.03)",
        border: `1px solid ${C.border}`, textAlign: "center",
      }}>

        {/* ロゴ・タイトル */}
        <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={imgLogoBlkSmall} alt="TOPABODA" style={{ height: 48, marginBottom: 12 }} />
          <p style={{ color: C.gray2, fontSize: 14, fontWeight: 500, margin: 0 }}>会員登録</p>
        </div>

        {/* ステップインジケーター */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
          {[1, 2, 3].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: step >= s ? C.navy : C.border,
                color: step >= s ? "white" : C.gray3,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0,
                transition: "all 0.3s",
              }}>
                {step > s ? "✓" : s}
              </div>
              {i < 2 && (
                <div style={{
                  flex: 1, height: 2, minWidth: 40,
                  background: step > s ? C.navy : C.border,
                  transition: "all 0.3s",
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── STEP 1: メール入力 ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* SNS 가입 방법 */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <div style={{ flex: 1, height: 1, background: C.divider }} />
                <span style={{ fontSize: 10, color: C.gray3, fontWeight: 700, letterSpacing: "0.05em" }}>SNS REGISTER</span>
                <div style={{ flex: 1, height: 1, background: C.divider }} />
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 45, marginBottom: 28 }}>
                {SNS_ITEMS.map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => alert("準備中です。")}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <div
                      style={{ width: 54, height: 54, borderRadius: "50%", background: item.bg, border: item.border, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      {item.lines.map((line, i) => (
                        <span key={i} style={{ fontSize: 11, fontWeight: 600, color: C.gray2, lineHeight: 1.3 }}>{line}</span>
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

              <form onSubmit={handleSendEmail} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="email" required placeholder="メールアドレスを入力"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                />
                <SubmitButton label="認証メールを送信" />
              </form>
            </motion.div>
          )}

          {/* ── STEP 2: 인증코드 ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p style={{ color: C.gray2, fontSize: 13, marginBottom: 20, fontWeight: 500, lineHeight: 1.6 }}>
                <strong style={{ color: C.navy }}>{email}</strong><br />
                に届いた認証コードを入力してください。
              </p>
              <form onSubmit={handleVerifyCode} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="text" required maxLength="6" placeholder="認証コード"
                  value={authCode} onChange={e => setAuthCode(e.target.value)}
                  style={{ ...inputStyle, textAlign: "center", fontSize: 22, letterSpacing: "8px" }}
                />
                <SubmitButton label="認証する" />
              </form>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ marginTop: 14, background: "none", border: "none", color: C.gray3, fontSize: 13, cursor: "pointer", textDecoration: "underline", fontFamily: font }}
              >
                ← メールを再入力
              </button>
            </motion.div>
          )}

          {/* ── STEP 3: 회원정보 입력 ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleFinalSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="text" placeholder="IDを入力" required
                  style={inputStyle}
                  onChange={e => setFormData({ ...formData, userId: e.target.value })}
                />

                {/* ニックネーム + 중복확인 */}
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text" placeholder="ニックネームを入力" required
                    style={{ ...inputStyle, flex: 1 }}
                    onChange={e => { setFormData({ ...formData, nickname: e.target.value }); setNicknameStatus("idle"); }}
                  />
                  <button
                    type="button"
                    onClick={handleNicknameCheck}
                    style={{
                      flexShrink: 0, width: 72, height: 46, borderRadius: 12,
                      border: `1.2px solid ${C.navy}`, background: C.white,
                      color: C.navy, fontWeight: 700, fontSize: 13,
                      cursor: "pointer", fontFamily: font,
                    }}
                  >
                    確認
                  </button>
                </div>
                {nicknameStatus === "available" && (
                  <p style={{ color: "#16a34a", fontSize: 12, margin: "-4px 0 0", textAlign: "left" }}>✓ 使用可能です</p>
                )}
                {nicknameStatus === "duplicate" && (
                  <p style={{ color: C.red, fontSize: 12, margin: "-4px 0 0", textAlign: "left" }}>✗ すでに使用中です</p>
                )}

                {/* パスワード */}
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"} placeholder="パスワードを入力" required
                    style={{ ...inputStyle, paddingRight: 45 }}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={eyeBtnStyle}>
                    {showPw ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>

                {/* パスワード確認 */}
                <div style={{ position: "relative" }}>
                  <input
                    type={showPwConfirm ? "text" : "password"} placeholder="パスワードを確認" required
                    style={{ ...inputStyle, paddingRight: 45 }}
                    onChange={e => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPwConfirm(!showPwConfirm)} style={eyeBtnStyle}>
                    {showPwConfirm ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>

                <SubmitButton label="登録完了" />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ログインへ */}
        <div style={{ margin: "32px 0 0", height: 1, background: C.divider }} />
        <p style={{ fontSize: 13, color: C.gray3, margin: "16px 0 0", fontWeight: 500 }}>
          すでにアカウントをお持ちですか？{" "}
          <Link to="/login" style={{ color: C.navy, fontWeight: 700, textDecoration: "none" }}>
            ログイン
          </Link>
        </p>
      </div>

      {/* 가입 완료 모달 */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
              background: "rgba(0,13,87,0.4)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1000, padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
              style={{
                background: "white", padding: "50px 40px", borderRadius: 24,
                textAlign: "center", maxWidth: 380, width: "100%",
                boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
                border: `1px solid ${C.border}`,
              }}
            >
              <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
              <h2 style={{ color: C.navy, fontWeight: 900, fontSize: 24, marginBottom: 12 }}>
                Welcome to TOPABODA!
              </h2>
              <p style={{ color: C.gray2, lineHeight: 1.6, marginBottom: 30, fontSize: 14 }}>
                {formData.nickname}様、会員登録ありがとうございます。<br />
                探訪の旅を今すぐ始めましょう！
              </p>
              <button
                onClick={() => navigate("/")}
                style={{
                  ...actionBtnBase,
                  border: `1.2px solid ${C.navy}`,
                  background: C.navy, color: C.white,
                }}
              >
                メインページへ
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 스타일 상수 ── */
const inputStyle = {
  width: "100%", height: 46, padding: "0 16px",
  border: "1px solid #e2e8f0", borderRadius: 12,
  fontSize: 15, fontFamily: font, outline: "none",
  boxSizing: "border-box", background: "#ffffff",
};

const eyeBtnStyle = {
  position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", cursor: "pointer", color: "#b0b8c1",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const actionBtnBase = {
  width: "100%", height: 50, borderRadius: 12,
  fontSize: 16, fontWeight: 700, cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  fontFamily: font,
};
