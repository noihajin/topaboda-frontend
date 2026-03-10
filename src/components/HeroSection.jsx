import React from "react";
import heroBg from "../assets/hero_background.png";
import SearchFilter from "./SearchFilter"; // ★ 방금 만든 파일 불러오기!

export default function HeroSection() {
  return (
    <>  {/* 두 개의 섹션을 묶기 위해 쓴다. */}
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "820px",
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          margin: 0,
          padding: 0,
          overflow: "hidden"
        }}
      >
        {/* 텍스트 영역: Tailwind 없이 순수 CSS로 좌표를 콱! 찍습니다. */}
        <div
        className="hidden md:block font-title"
          style={{
            position: "absolute",
            top: "350px",  /* 위에서부터 무조건 500px 내려옴 */
            left: "10%",   /* 왼쪽에서 10% 띄움 (피그마 여백 비율) */
            zIndex: 10     /* 무조건 맨 위로 */
          }}
        >
          <h1
            style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              color: "#000D57",
              fontFamily: "'Noto Serif JP', serif",
              fontWeight: "500",
              margin: 0,
              lineHeight: "1.2"
            }}
          >
            韓国の宝を<br />隅々とトパボダ
          </h1>
          <p
            style={{
              marginTop: "16px",
              fontSize: "18px",
              fontWeight: "500",
              color: "#000D57",
              margin: "24px 0 0 0",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            韓国の国家遺産を探検してみよう。
          </p>

        </div>
      </section>
      <SearchFilter />
    </>

  );
}