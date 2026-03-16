import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Design Tokens ─────────────────────────────────────────────
const C = {
  navy: "#000d57",
  red: "#6e0000",
  redL: "#8e0000",
  bg: "#f8f9fc", // 커뮤니티 배경색과 통일
  white: "#ffffff",
  gray1: "#364153",
  gray2: "#4a5565",
  gray3: "#6a7282",
  gray4: "#99a1af",
  border: "#e5e7eb",
  inputBg: "rgba(255, 255, 255, 0.8)",
};

const font = "'Noto Sans JP', 'Noto Sans KR', sans-serif";

// ★ 카테고리 일본어 현지화 및 구성 변경
const CATEGORIES = ["レビュー", "ヒント", "フリートーク", "質問"];

export default function WritePost() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // 이미지 업로드 핸들러
  const handleFiles = (files) => {
    const valid = Array.from(files).filter(
      (f) =>
        ["image/jpeg", "image/png"].includes(f.type) &&
        f.size <= 5 * 1024 * 1024
    );
    const mapped = valid.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...mapped]);
  };

  const handleSubmit = () => {
    if (!category) {
      alert("カテゴリーを選択してください。");
      return;
    }
    if (!title.trim()) {
      alert("タイトルを入力してください。");
      return;
    }
    if (!content.trim()) {
      alert("内容を入力してください。");
      return;
    }
    alert("記事が登録されました！");
    navigate("/community");
  };

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        fontFamily: font,
        paddingTop: "11.9rem",
        paddingBottom: "10rem",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        {/* ← 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.navy,
            fontSize: 16,
            fontWeight: 700,
            fontFamily: font,
            marginBottom: 32,
            padding: 0,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.navy}
            strokeWidth="2.5"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          キャンセル
        </button>

        {/* ── 메인 글쓰기 카드 (Glassmorphism 적용) ── */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(20px)",
            borderRadius: 32,
            border: "1px solid rgba(255, 255, 255, 0.5)",
            padding: "48px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.04)",
          }}
        >
          <h1
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: C.navy,
              margin: "0 0 40px",
              letterSpacing: "-0.02em",
            }}
          >
            記事を作成
          </h1>

          {/* ── 카테고리 ── */}
          <Field label="カテゴリー" required>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setCatOpen((v) => !v)}
                style={{
                  width: "100%",
                  height: 56,
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: "0 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  fontFamily: font,
                  fontSize: 15,
                  color: category ? C.navy : C.gray3,
                  fontWeight: 600,
                }}
              >
                <span>{category || "カテゴリーを選択してください"}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={C.gray3}
                  strokeWidth="2"
                  style={{
                    transform: catOpen ? "rotate(180deg)" : "none",
                    transition: "0.2s",
                  }}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      right: 0,
                      background: C.white,
                      borderRadius: 16,
                      zIndex: 50,
                      border: `1px solid ${C.border}`,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      overflow: "hidden",
                    }}
                  >
                    {CATEGORIES.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setCatOpen(false);
                        }}
                        className="hover:bg-gray-50"
                        style={{
                          padding: "14px 20px",
                          cursor: "pointer",
                          fontSize: 14,
                          color: C.navy,
                          fontWeight: category === cat ? 800 : 500,
                          borderBottom: `1px solid ${C.border}22`,
                          transition: "0.2s",
                        }}
                      >
                        {cat}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Field>

          {/* ── 제목 ── */}
          <Field label="タイトル" required>
            <div style={{ position: "relative" }}>
              <input
                value={title}
                onChange={(e) =>
                  e.target.value.length <= 100 && setTitle(e.target.value)
                }
                placeholder="タイトルを入力してください"
                style={{
                  width: "100%",
                  height: 56,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: "0 20px",
                  fontSize: 16,
                  fontFamily: font,
                  outline: "none",
                  boxSizing: "border-box",
                  color: C.navy,
                  fontWeight: 600,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 12,
                  color: C.gray3,
                }}
              >
                {title.length}/100
              </span>
            </div>
          </Field>

          {/* ── 내용 ── */}
          <Field label="内容" required style={{ marginTop: 32 }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="探訪の感想や役立つ情報を自由に作成してください。"
              style={{
                width: "100%",
                minHeight: 300,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "24px",
                fontSize: 15,
                lineHeight: 1.7,
                fontFamily: font,
                outline: "none",
                boxSizing: "border-box",
                color: C.navy,
                resize: "vertical",
              }}
            />
          </Field>

          {/* ── 이미지 첨부 ── */}
          <Field label="画像を添付" style={{ marginTop: 32 }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              style={{
                border: `2px dashed ${dragOver ? C.navy : C.border}`,
                borderRadius: 16,
                padding: "40px 24px",
                textAlign: "center",
                cursor: "pointer",
                background: dragOver
                  ? "rgba(0,13,87,0.05)"
                  : "rgba(255,255,255,0.3)",
                transition: "all 0.2s",
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.gray3}
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline
                  points="21 15 16 10 5 21"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p
                style={{
                  fontSize: 15,
                  color: C.gray2,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                クリックして画像をアップロード
              </p>
              <p style={{ fontSize: 12, color: C.gray4, margin: 0 }}>
                JPG, PNG (最大 5MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)}
            />

            {images.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 16,
                }}
              >
                {images.map((img, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img
                      src={img.url}
                      alt=""
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 12,
                      }}
                    />
                    <button
                      onClick={() =>
                        setImages((prev) => prev.filter((_, j) => j !== i))
                      }
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: C.red,
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 900,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          {/* ── 작성 가이드 ── */}
          <div
            style={{
              background: "rgba(0,13,87,0.03)",
              borderRadius: 16,
              padding: "24px",
              marginTop: 40,
            }}
          >
            <h4
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: C.navy,
                margin: "0 0 12px",
              }}
            >
              作成ガイド
            </h4>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {[
                "他のユーザーを尊重する内容を作成してください。",
                " 구체적이고 유용한 정보를 공유해주세요.",
                "상업적 광고글은 제한될 수 있습니다.",
              ].map((text, i) => (
                <li
                  key={i}
                  style={{ fontSize: 13, color: C.gray2, lineHeight: 1.6 }}
                >
                  • {text}
                </li>
              ))}
            </ul>
          </div>

          {/* ── 버튼 행 ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 48,
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "0 32px",
                height: 56,
                borderRadius: 16,
                border: `1px solid ${C.border}`,
                background: C.white,
                color: C.gray1,
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: "0 48px",
                height: 56,
                borderRadius: 16,
                border: "none",
                background: `linear-gradient(to bottom, ${C.red}, ${C.redL})`,
                color: "white",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(110, 0, 0, 0.2)",
              }}
            >
              登録する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children, style }) {
  return (
    <div style={{ marginBottom: 28, ...style }}>
      <label
        style={{
          display: "block",
          marginBottom: 12,
          fontSize: 15,
          fontWeight: 800,
          color: C.navy,
          fontFamily: font,
        }}
      >
        {label}
        {required && <span style={{ color: C.red, marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </div>
  );
}
