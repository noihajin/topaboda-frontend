import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
};

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 가입 성공 모달 상태

  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });

  // 1단계: 이메일 전송
  const handleSendEmail = (e) => {
    e.preventDefault();
    alert(`${email}へ認証コードを送りました。(Test: 1234)`);
    setStep(2);
  };

  // 2단계: 코드 인증
  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (authCode === "1234") {
      setStep(3);
    } else {
      alert("コードが一致しません。");
    }
  };

  // 3단계: 최종 가입 처리 (자동 로그인 포함)
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm)
      return alert("パスワードが一致しません。");

    // ── [자동 로그인 시뮬레이션] ──────────────────────────────────
    // 실제 백엔드 연동 시에는 가입 응답으로 토큰을 받아 저장합니다.
    localStorage.setItem("token", "test-auth-token-1234");
    localStorage.setItem("userName", formData.nickname);

    // 성공 모달 띄우기
    setShowSuccessModal(true);
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
      {/* 회원가입 폼 컨테이너 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          borderRadius: 32,
          padding: "60px 40px",
          boxShadow: "0 20px 60px rgba(0, 0, 87, 0.05)",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginBottom: 40,
          }}
        >
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                background: step >= s ? C.red : C.border,
                transition: "0.3s",
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendEmail}
            >
              <h2
                style={{
                  color: C.navy,
                  fontWeight: 900,
                  fontSize: 28,
                  marginBottom: 12,
                }}
              >
                Email Verification
              </h2>
              <input
                type="email"
                required
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <button type="submit" style={mainBtnStyle}>
                認証メールを送信
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyCode}
            >
              <h2
                style={{
                  color: C.navy,
                  fontWeight: 900,
                  fontSize: 28,
                  marginBottom: 12,
                }}
              >
                Enter Code
              </h2>
              <input
                type="text"
                required
                maxLength="4"
                placeholder="0 0 0 0"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                style={{
                  ...inputStyle,
                  textAlign: "center",
                  fontSize: 24,
                  letterSpacing: "10px",
                }}
              />
              <button type="submit" style={mainBtnStyle}>
                認証する
              </button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleFinalSubmit}
            >
              <h2
                style={{
                  color: C.navy,
                  fontWeight: 900,
                  fontSize: 28,
                  marginBottom: 32,
                }}
              >
                Create Account
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <input
                  type="text"
                  placeholder="ID"
                  required
                  style={inputStyle}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    type="text"
                    placeholder="Nickname"
                    required
                    style={{ ...inputStyle, flex: 1 }}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => alert("Available!")}
                    style={{
                      width: 100,
                      background: C.navy,
                      color: "white",
                      border: "none",
                      borderRadius: 16,
                      cursor: "pointer",
                    }}
                  >
                    Check
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  style={inputStyle}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  style={inputStyle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passwordConfirm: e.target.value,
                    })
                  }
                />
                <button type="submit" style={mainBtnStyle}>
                  登録完了
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── [가입 완료 축하 팝업 모달] ──────────────────────────────── */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,13,87,0.4)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{
                background: "white",
                padding: "50px 40px",
                borderRadius: 40,
                textAlign: "center",
                maxWidth: 400,
                width: "100%",
                boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
              <h2
                style={{
                  color: C.navy,
                  fontWeight: 900,
                  fontSize: 28,
                  marginBottom: 12,
                }}
              >
                Welcome to TOPABODA!
              </h2>
              <p style={{ color: C.gray2, lineHeight: 1.6, marginBottom: 30 }}>
                {formData.nickname}様、会員登録ありがとうございます。
                <br />
                探訪の旅を今すぐ始めましょう！
              </p>
              <button
                onClick={() => navigate("/")}
                style={{ ...mainBtnStyle, marginTop: 0, width: "100%" }}
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

// 스타일 상수는 이전과 동일
const inputStyle = {
  width: "100%",
  height: 60,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: "0 20px",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};
const mainBtnStyle = {
  width: "100%",
  height: 64,
  borderRadius: 20,
  border: "none",
  background: `linear-gradient(to bottom, ${C.red}, ${C.redL})`,
  color: "white",
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(110, 0, 0, 0.2)",
  marginTop: 20,
};
