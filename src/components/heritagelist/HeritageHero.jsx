import { useState } from "react";
import { motion } from "framer-motion";
import imgIconSearchWht from "../../assets/icon_search_white.svg";
const BG_IMAGE = "/heritage_list_banner.png";
import { C, font, fontSerif } from "./constants";

export default function HeritageHero({ searchInput, onSearchChange, onSearch, onKeyDown }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const scrollDown = () => window.scrollTo({ top: window.innerHeight, behavior: "smooth" });

  return (
    <>
      {/* ── 풀페이지 히어로 배너 ── */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        /* 이미지 로드 전 보이는 플레이스홀더 (하늘 색상) */
        background: "linear-gradient(180deg, #a8c4d8 0%, #c5d8e5 40%, #dce8ef 100%)",
      }}>
        {/* 배경 이미지 — fetchpriority high + 로드 후 페이드인 */}
        <img
          src={BG_IMAGE}
          alt=""
          fetchpriority="high"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center top",
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.6s ease",
            pointerEvents: "none",
          }}
        />

        {/* 텍스트 가독성을 위한 최소 오버레이 */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.04) 60%, rgba(0,0,0,0.04) 100%)",
          pointerEvents: "none",
        }} />

        {/* 텍스트 콘텐츠 */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", transform: "translateY(calc(-12% - 80px))" }}>
          {/* 타이틀 */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              fontFamily: fontSerif,
              fontSize: "clamp(38px, 4.6vw, 66px)",
              fontWeight: 600,
              color: "#ffffff",
              margin: "-20px 0 28px",
              lineHeight: 1.11,
              letterSpacing: "-0.01em",
              textShadow: "0 2px 16px rgba(0,0,0,0.25)",
            }}
          >
            国家遺産リスト
          </motion.h1>

          {/* 통계 수치 행 */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            flexWrap: "wrap",
            rowGap: 20,
          }}>
            {[
              { num: "349",    label: "国宝" },
              { num: "2,220",  label: "宝物" },
              { num: "536",    label: "史跡" },
              { num: "473",    label: "天然記念物" },
              { num: "4,000+", label: "全体遺産" },
            ].map(({ num, label }, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                    style={{
                      width: 2, height: 72,
                      background: "rgba(255,255,255,0.18)",
                      margin: "0 36px",
                      flexShrink: 0,
                    }}
                  />
                )}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.1 }}
                  style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 6,
                  }}
                >
                  <span style={{
                    fontFamily: fontSerif,
                    fontSize: "clamp(18px, 1.8vw, 24px)",
                    fontWeight: 600,
                    color: "#ffffff",
                    lineHeight: 1,
                    textShadow: "0 2px 12px rgba(0,0,0,0.2)",
                    letterSpacing: "-0.01em",
                  }}>{num}</span>
                  <span style={{
                    fontFamily: font,
                    fontSize: "clamp(10px, 0.85vw, 12px)",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.55)",
                    letterSpacing: "0.02em",
                  }}>{label}</span>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 바운스 화살표 */}
        <div
          onClick={scrollDown}
          style={{
            position: "absolute",
            bottom: 44,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
            cursor: "pointer",
          }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <svg width="38" height="22" viewBox="0 0 38 22" fill="none">
              <polyline
                points="2,2 19,19 36,2"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* ── 검색 바 ── */}
      <div style={{ background: C.white, borderBottom: `1.5px solid ${C.border}`, padding: "16px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
            <input
              value={searchInput}
              onChange={onSearchChange}
              onKeyDown={onKeyDown}
              placeholder="国家遺産の検索 (例: 景福宮、石窟庵、瞻星台)"
              style={{
                width: "100%", height: 56, padding: "0 70px 0 28px",
                border: "none", borderRadius: 9999, background: "#f3f4f6",
                fontSize: 15, outline: "none", fontFamily: font, fontWeight: 500,
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={onSearch}
              style={{
                position: "absolute", right: 6, top: 6, bottom: 6, width: 44,
                background: C.navy, border: "none", borderRadius: 9999,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.red}
              onMouseLeave={e => e.currentTarget.style.background = C.navy}
            >
              <img src={imgIconSearchWht} alt="検索" style={{ width: 18 }} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
