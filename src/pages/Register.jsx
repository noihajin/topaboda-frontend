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
  gray4:   "#4c4c4c",
  border:  "#e2e8f0",
  divider: "#edf2f7",
  panel:   "rgba(238,238,238,0.93)",
};

const font = "'Roboto', 'Noto Sans JP', 'Noto Sans KR', sans-serif";

/* ── アイコン ── */
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

/* ── SNSアイテム ── */
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

/* ── 共通インプット ── */
const FigmaInput = ({ style, ...props }) => (
  <input
    style={{
      width: "100%",
      height: 60,
      background: C.white,
      border: `1px solid ${C.navy}`,
      borderRadius: 10,
      padding: "0 16px",
      fontSize: 16,
      fontFamily: font,
      outline: "none",
      boxSizing: "border-box",
      ...style,
    }}
    {...props}
  />
);

/* ── ネイビーボタン ── */
const NavyButton = ({ children, onClick, type = "button", style }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 340,
        height: 64,
        background: hover ? "#001080" : C.navy,
        color: "#e6e6e6",
        border: "none",
        borderRadius: 10,
        fontSize: 18,
        fontWeight: 600,
        fontFamily: font,
        letterSpacing: "0.9px",
        cursor: "pointer",
        transition: "background 0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

/* ── ステップインジケーター ── */
function StepIndicator({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
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
  );
}

/* ════════════════════════════════ */
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

  /* API ハンドラー */
  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:9990/topaboda/api/auth/signUp/email",
        { email }
      );
      if (res.status === 200) {
        alert(`${email} に認証コードを送信しました。`);
        setAuthCode("");
        setStep(2);
      }
    } catch (err) {
      alert(err.response?.data?.message || "サーバーエラーが発生しました。");
    }
  };

  const handleResendEmail = async () => {
    try {
      const res = await axios.post(
        "http://localhost:9990/topaboda/api/auth/signUp/email",
        { email }
      );
      if (res.status === 200) alert("認証コードを再送信しました。");
    } catch (err) {
      alert(err.response?.data?.message || "再送信に失敗しました。");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:9990/topaboda/api/auth/signUp/verify",
        { email, token: authCode }
      );
      if (res.status === 200) setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "認証コードが一致しません。");
      setStep(1);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (nicknameStatus !== "available") return alert("ニックネームの重複確認を行ってください。");
    if (formData.password !== formData.passwordConfirm) return alert("パスワードが一致しません。");
    try {
      const res = await axios.post(
        "http://localhost:9990/topaboda/api/auth/signUp",
        { id: formData.userId, email, password: formData.password, nickname: formData.nickname }
      );
      if (res.status === 200) {
        localStorage.setItem("jwt", res.data.jwt);
        localStorage.setItem("userName", formData.nickname);
        setShowSuccessModal(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "サーバーエラーが発生しました。");
    }
  };

  const handleNicknameCheck = async () => {
    if (!formData.nickname) return alert("ニックネームを入力してください。");
    try {
      setNicknameStatus("checking");
      const res = await axios.post(
        "http://localhost:9990/topaboda/api/auth/signUp/nickname",
        { nickname: formData.nickname }
      );
      if (res.status === 200) {
        setNicknameStatus("available");
      }
    } catch (err) {
      if (err.response?.status === 409) setNicknameStatus("duplicate");
      else setNicknameStatus("error");
    }
  };

  /* ════ レンダー ════ */
  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: font,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "120px 20px 60px",
    }}>

      {/* ── ホワイトカード (Step 1 / 2 / 3共通) ── */}
      <div style={{
        width: "100%", maxWidth: step === 3 ? 560 : 420,
        background: C.white, borderRadius: 24,
        padding: "45px 40px",
        boxShadow: "0 10px 40px rgba(0,13,87,0.03)",
        border: `1px solid ${C.border}`, textAlign: "center",
        transition: "max-width 0.3s ease",
      }}>

        {/* ロゴ */}
        <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={imgLogoBlkSmall} alt="TOPABODA" style={{ height: 48, marginBottom: 12 }} />
          <p style={{ color: C.gray2, fontSize: 14, fontWeight: 500, margin: 0 }}>会員登録</p>
        </div>

        <StepIndicator step={step} />

        <AnimatePresence mode="wait">

          {/* ════ STEP 1: メールアドレス入力 ════ */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {/* SNS REGISTER */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <div style={{ flex: 1, height: 1, background: C.divider }} />
                <span style={{ fontSize: 10, color: C.gray3, fontWeight: 700, letterSpacing: "0.05em" }}>SNS REGISTER</span>
                <div style={{ flex: 1, height: 1, background: C.divider }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 45, marginBottom: 28 }}>
                {SNS_ITEMS.map(item => (
                  <button key={item.key} type="button" onClick={() => alert("準備中です。")}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <div style={{ width: 54, height: 54, borderRadius: "50%", background: item.bg, border: item.border, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
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

              {/* MAIL REGISTER */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <div style={{ flex: 1, height: 1, background: C.divider }} />
                <span style={{ fontSize: 10, color: C.gray3, fontWeight: 700, letterSpacing: "0.05em" }}>MAIL REGISTER</span>
                <div style={{ flex: 1, height: 1, background: C.divider }} />
              </div>

              <form onSubmit={handleSendEmail} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="email" required placeholder="メールアドレスを入力"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{
                    width: "100%", height: 46, padding: "0 16px",
                    border: "1px solid #e2e8f0", borderRadius: 12,
                    fontSize: 15, fontFamily: font, outline: "none",
                    boxSizing: "border-box", background: C.white,
                  }}
                />
                <Step1Button label="認証メールを送信" />
              </form>
            </motion.div>
          )}

          {/* ════ STEP 2: 認証コード入力 (Figma 1100-2163) ════ */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {/* タイトル */}
              <div style={{ textAlign: "left", marginBottom: 20 }}>
                <p style={{ color: C.gray4, fontSize: 16, fontWeight: 500, margin: "0 0 8px", lineHeight: 1.5 }}>
                  認証コードをお送りいたしました。
                </p>
                <p style={{ color: C.gray4, fontSize: 15, fontWeight: 400, margin: 0, lineHeight: 1.5 }}>
                  送信された認証コードを5分以内に入力してください。
                </p>
              </div>

              {/* グレーパネル */}
              <div style={{
                background: C.panel,
                borderRadius: 14,
                padding: "28px 24px 32px",
              }}>
                <form onSubmit={handleVerifyCode}>

                  {/* 認証コード ラベル + インプット */}
                  <div style={{ marginBottom: 10 }}>
                    <p style={{ fontSize: 16, fontWeight: 500, color: "#000", textAlign: "left", margin: "0 0 10px" }}>
                      認証コード
                    </p>
                    <FigmaInput
                      type="text"
                      required
                      maxLength="6"
                      placeholder="認証コードを入力"
                      value={authCode}
                      onChange={e => setAuthCode(e.target.value)}
                    />
                  </div>

                  {/* 再送信リンク */}
                  <div style={{ textAlign: "right", marginBottom: 28 }}>
                    <button
                      type="button"
                      onClick={handleResendEmail}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: C.gray4, fontSize: 14, fontWeight: 500,
                        textDecoration: "underline", fontFamily: font,
                        letterSpacing: "0.15px",
                      }}
                    >
                      認証コードを再送信する
                    </button>
                  </div>

                  {/* 入力ボタン */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                    <NavyButton type="submit">入力</NavyButton>

                    {/* 戻るリンク */}
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: C.gray4, fontSize: 15, fontWeight: 500,
                        textDecoration: "underline", fontFamily: font,
                      }}
                    >
                      戻る
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* ════ STEP 3: 会員情報入力 (Figma 1023-549) ════ */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {/* グレーパネル */}
              <div style={{
                background: C.panel,
                borderRadius: 14,
                padding: "36px 32px 40px",
              }}>
                <form onSubmit={handleFinalSubmit}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

                    {/* アイディー */}
                    <FormRow label="アイディー">
                      <FigmaInput
                        type="text"
                        required
                        placeholder="IDを入力"
                        onChange={e => setFormData({ ...formData, userId: e.target.value })}
                      />
                    </FormRow>

                    {/* パスワード */}
                    <FormRow label="パスワード">
                      <div style={{ position: "relative" }}>
                        <FigmaInput
                          type={showPw ? "text" : "password"}
                          required
                          placeholder="パスワードを入力"
                          style={{ paddingRight: 48 }}
                          onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)} style={eyeBtnStyle}>
                          {showPw ? <EyeIcon /> : <EyeOffIcon />}
                        </button>
                      </div>
                      <p style={{ fontSize: 13, color: "#999", margin: "6px 0 0", textAlign: "left" }}>
                        ※英語、数字、記号を含む
                      </p>
                    </FormRow>

                    {/* パスワード確認 */}
                    <FormRow label={<>パスワード<br />(確認)</>}>
                      <div style={{ position: "relative" }}>
                        <FigmaInput
                          type={showPwConfirm ? "text" : "password"}
                          required
                          placeholder="パスワードを確認"
                          style={{ paddingRight: 48 }}
                          onChange={e => setFormData({ ...formData, passwordConfirm: e.target.value })}
                        />
                        <button type="button" onClick={() => setShowPwConfirm(!showPwConfirm)} style={eyeBtnStyle}>
                          {showPwConfirm ? <EyeIcon /> : <EyeOffIcon />}
                        </button>
                      </div>
                    </FormRow>

                    {/* ニックネーム */}
                    <FormRow label="ニックネーム">
                      <div style={{ display: "flex", gap: 10 }}>
                        <FigmaInput
                          type="text"
                          required
                          placeholder="ニックネームを入力"
                          style={{ flex: 1 }}
                          onChange={e => {
                            setFormData({ ...formData, nickname: e.target.value });
                            setNicknameStatus("idle");
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleNicknameCheck}
                          style={{
                            flexShrink: 0, width: 80, height: 60,
                            borderRadius: 10,
                            border: `1px solid ${C.navy}`,
                            background: C.white, color: C.navy,
                            fontWeight: 700, fontSize: 14,
                            cursor: "pointer", fontFamily: font,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = C.navy; e.currentTarget.style.color = C.white; }}
                          onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.color = C.navy; }}
                        >
                          確認
                        </button>
                      </div>
                      {nicknameStatus === "available" && (
                        <p style={{ fontSize: 12, color: "#16a34a", margin: "5px 0 0", textAlign: "left" }}>✓ 使用可能です</p>
                      )}
                      {nicknameStatus === "duplicate" && (
                        <p style={{ fontSize: 12, color: C.red, margin: "5px 0 0", textAlign: "left" }}>✗ すでに使用中です</p>
                      )}
                    </FormRow>

                  </div>

                  {/* 登録するボタン */}
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 36 }}>
                    <NavyButton type="submit">登録する</NavyButton>
                  </div>
                </form>
              </div>
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

      {/* ── 가입 완료 모달 ── */}
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
                background: C.white, padding: "50px 40px", borderRadius: 24,
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
              <ModalButton onClick={() => navigate("/")}>メインページへ</ModalButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── サブコンポーネント ── */

/** ラベル + コンテンツの行レイアウト */
function FormRow({ label, children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
      <div style={{
        flexShrink: 0, width: 110,
        paddingTop: 18,
        fontSize: 16, fontWeight: 500, color: "#000",
        textAlign: "left", lineHeight: 1.4,
      }}>
        {label}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

/** Step1用アウトラインボタン */
function Step1Button({ label }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="submit"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", height: 50, borderRadius: 12,
        border: `1.2px solid ${C.navy}`,
        background: hover ? C.navy : C.white,
        color: hover ? C.white : C.navy,
        fontSize: 16, fontWeight: 700, cursor: "pointer",
        fontFamily: font,
        transform: hover ? "translateY(-1px)" : "none",
        boxShadow: hover ? "0 4px 12px rgba(0,13,87,0.12)" : "none",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        marginTop: 8,
      }}
    >
      {label}
    </button>
  );
}

/** モーダルボタン */
function ModalButton({ children, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", height: 50, borderRadius: 12,
        border: `1.2px solid ${C.navy}`,
        background: hover ? C.white : C.navy,
        color: hover ? C.navy : C.white,
        fontSize: 16, fontWeight: 700, cursor: "pointer",
        fontFamily: font,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </button>
  );
}

/* ── スタイル定数 ── */
const eyeBtnStyle = {
  position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", cursor: "pointer", color: "#b0b8c1",
  display: "flex", alignItems: "center", justifyContent: "center",
};
