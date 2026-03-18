import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const C = {
  navy:    "#000d57",
  red:     "#6e0000",
  redL:    "#8e0000",
  white:   "#ffffff",
  bg:      "#f8f9fc",
  gray1:   "#333333",
  gray2:   "#4a5565",
  gray3:   "#99a1af",
  border:  "#e5e7eb",
};

export default function RegisterSelect() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      background: C.bg, minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px"
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: "100%", maxWidth: 480, background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)", borderRadius: 32, border: "1px solid rgba(255, 255, 255, 0.5)",
          padding: "60px 40px", boxShadow: "0 20px 60px rgba(0, 0, 87, 0.05)", textAlign: "center"
        }}
      >
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: C.navy, fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: "-0.05em" }}>
            JOIN TOPABODA
          </h2>
          <p style={{ color: C.gray2, fontSize: 16, marginTop: 12, fontWeight: 500, lineHeight: 1.5 }}>
            探訪の旅を始めるために<br />会員登録の方法を選択してください。
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* 소셜 가입: Google */}
          <button 
            style={socialBtnStyle(C.white, C.gray1, C.border)}
            onClick={() => alert("Googleで登録を準備中です。")}
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="" style={{ width: 22 }} />
            Continue with Google
          </button>

          {/* 소셜 가입: X (Twitter) */}
          <button 
            style={socialBtnStyle("#000000", "#ffffff", "none")}
            onClick={() => alert("Xで登録を準備中です。")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Continue with X
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 15, margin: "10px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
            <span style={{ fontSize: 12, color: C.gray3, fontWeight: 700 }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
          </div>

          {/* 이메일 가입 (기본 이메일 가입 폼으로 이동) */}
          <button 
            onClick={() => navigate("/register/form")}
            style={{
              width: "100%", height: 64, borderRadius: 20, border: "none",
              background: `linear-gradient(to bottom, ${C.red}, ${C.redL})`,
              color: "white", fontSize: 16, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 8px 20px rgba(110, 0, 0, 0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10
            }}
          >
            📧 メールアドレスで登録
          </button>
        </div>

        <div style={{ marginTop: 40, fontSize: 14, color: C.gray2 }}>
          すでにアカウントをお持ちですか？ 
          <button 
            onClick={() => navigate("/login")}
            style={{ background: "none", border: "none", color: C.navy, fontWeight: 900, marginLeft: 8, cursor: "pointer", textDecoration: "underline" }}
          >
            ログイン
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// 버튼 공통 스타일 함수
const socialBtnStyle = (bg, color, border) => ({
  width: "100%", height: 60, borderRadius: 18, 
  border: border === "none" ? "none" : `1px solid ${border}`,
  background: bg, color: color,
  display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
  fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "0.2s"
});