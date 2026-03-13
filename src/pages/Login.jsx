import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// ── Design Tokens ──────────────────────────────────────────────
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
  divider: "#d3d3d3",
  googleBg:"#f1f3f7",
  xBg:     "#000000", // X(Twitter) 브랜드 컬러
};

const font = "'Noto Sans JP', 'Noto Sans KR', sans-serif";

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [saveId, setSaveId] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // 로그인 핸들러
  const handleLogin = (e) => {
    e.preventDefault();
    if (!id.trim() || !password.trim()) {
      alert("IDとパスワードを入力してください。");
      return;
    }
    // 임시 토큰 저장 및 이동
    localStorage.setItem("token", "true");
    alert("ログインに成功しました！");
    navigate("/community");
  };

  return (
    <div style={{ 
      background: C.bg, minHeight: "100vh", fontFamily: font,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px"
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%", maxWidth: 480, background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)", borderRadius: 32, border: "1px solid rgba(255, 255, 255, 0.5)",
          padding: "60px 40px", boxShadow: "0 20px 60px rgba(0, 0, 87, 0.05)", textAlign: "center"
        }}
      >
        {/* 타이틀 */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ color: C.navy, fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: "-0.05em" }}>
            TOPABODA
          </h2>
          <p style={{ color: C.gray2, fontSize: 15, marginTop: 8, fontWeight: 500 }}>ログインしてください。</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* ID 입력 */}
          <div style={{ textAlign: "left" }}>
            <input
              type="text"
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder="ID入力"
              style={{
                width: "100%", height: 60, border: `1px solid ${C.border}`, borderRadius: 16,
                padding: "0 20px", fontSize: 16, outline: "none", boxSizing: "border-box",
                background: C.white, transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = C.navy}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>

          {/* 비밀번호 입력 */}
          <div style={{ position: "relative", textAlign: "left" }}>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="パスワード入力"
              style={{
                width: "100%", height: 60, border: `1px solid ${C.border}`, borderRadius: 16,
                padding: "0 54px 0 20px", fontSize: 16, outline: "none", boxSizing: "border-box",
                background: C.white, transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = C.navy}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: C.gray3
              }}
            >
              {showPw ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>

          {/* ID 저장 체크박스 */}
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: C.gray2, marginLeft: 4 }}>
            <div
              onClick={() => setSaveId(!saveId)}
              style={{
                width: 20, height: 20, borderRadius: "50%", border: `2px solid ${saveId ? C.navy : C.border}`,
                background: saveId ? C.navy : C.white, display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s"
              }}
            >
              {saveId && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            IDを保存
          </label>

          {/* 메인 로그인 버튼 */}
          <button
            type="submit"
            style={{
              width: "100%", height: 60, borderRadius: 18, border: "none",
              background: `linear-gradient(to bottom, ${C.red}, ${C.redL})`,
              color: "white", fontSize: 18, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 8px 20px rgba(110, 0, 0, 0.2)", marginTop: 10
            }}
          >
            ログイン
          </button>
        </form>

        {/* 소셜 로그인 구분선 */}
        <div style={{ display: "flex", alignItems: "center", gap: 15, margin: "30px 0" }}>
          <div style={{ flex: 1, height: "1px", background: C.divider }} />
          <span style={{ fontSize: 13, color: C.gray3, fontWeight: 600 }}>SNSでログイン</span>
          <div style={{ flex: 1, height: "1px", background: C.divider }} />
        </div>

        {/* 소셜 버튼 그룹 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Google 로그인 */}
          <button style={{
            width: "100%", height: 56, borderRadius: 16, border: `1px solid ${C.border}`,
            background: C.white, display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            cursor: "pointer", fontSize: 15, fontWeight: 700, color: C.gray1
          }}>
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="" style={{ width: 22 }} />
            Googleでログイン
          </button>

          {/* X (Twitter) 로그인 */}
          <button style={{
            width: "100%", height: 56, borderRadius: 16, border: "none",
            background: C.xBg, display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            cursor: "pointer", fontSize: 15, fontWeight: 700, color: C.white
          }}>
            {/* X 로고 (SVG) */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Xでログイン
          </button>
        </div>

        {/* 하단 보조 메뉴 */}
        <div style={{ marginTop: 35, display: "flex", justifyContent: "center", gap: 15, fontSize: 14, color: C.gray3 }}>
          <span style={{ cursor: "pointer", fontWeight: 600 }}>ID検索</span>
          <span style={{ color: C.divider }}>|</span>
          <span style={{ cursor: "pointer", fontWeight: 600 }}>パス워드検索</span>
          <span style={{ color: C.divider }}>|</span>
          <Link to="/register" style={{ textDecoration: "none", color: C.navy, fontWeight: 800 }}>会員登録</Link>
        </div>
      </motion.div>
    </div>
  );
}