import React from "react";
import { useLocation } from "react-router-dom";
import imgLogo from "../assets/logo.png";

const fJP  = "'Noto Sans JP', 'Noto Sans KR', sans-serif";
const fEN  = "'Roboto', sans-serif";

const IcInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const IcX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IcFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const socialIcons = [
  { key: "instagram", Icon: IcInstagram, label: "Instagram" },
  { key: "x",         Icon: IcX,         label: "X" },
  { key: "facebook",  Icon: IcFacebook,  label: "Facebook" },
];

const navSections = [
  {
    heading: "サービス",
    links: ["国家遺産一覧", "詳細を見る", "コミュニティ"],
  },
  {
    heading: "関連サイト",
    links: ["国家遺産庁", "国立中央博物館", "韓国文化財財団"],
  },
  {
    heading: "TOPABODA",
    links: ["紹介", "チーム", "お知らせ"],
  },
];


export default function Footer() {
  const location = useLocation();
  const isMain = location.pathname === "/";
  const bg = isMain ? "#f8f9fc" : "#ffffff";
  const borderTop = isMain ? "1px solid #e5e7eb" : "1px solid #f3f4f6";

  return (
    <footer
      className="w-full"
      style={{ background: bg, borderTop, fontFamily: fJP }}
    >
      <div className="max-w-[1400px] mx-auto px-10 lg:px-16 pt-16">
        {/* 상단: 내비게이션 + 로고 */}
        <div className="flex flex-col md:flex-row justify-between items-start pb-12 gap-10">
          <div className="flex flex-wrap gap-12 lg:gap-20">
            {navSections.map((section) => (
              <div key={section.heading} className="min-w-[120px]">
                <h4
                  className="text-[#000D57] text-sm font-bold mb-5"
                  style={{ fontFamily: fJP }}
                >
                  {section.heading}
                </h4>
                <ul className="flex flex-col gap-3 text-[#000D57]/70 text-xs">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="hover:text-[#000D57] transition-colors"
                        style={{ fontFamily: fJP }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="w-24 flex items-center justify-center">
            <img src={imgLogo} alt="Topaboda Logo" className="w-full h-auto" />
          </div>
        </div>

        <div className="border-t border-[#000D57]/10" />

        {/* 하단: 저작권 + 소셜 아이콘 */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 gap-6">
          <div className="flex flex-wrap items-center gap-5 text-[#000D57]/60 text-xs">
            <span style={{ fontFamily: fEN }}>
              © 2026 Topaboda. All rights reserved.
            </span>
            {["個人情報処理方針", "利用規約"].map((label) => (
              <a
                key={label}
                href="#"
                className="underline hover:text-[#000D57]"
                style={{ fontFamily: fJP }}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex gap-3">
            {socialIcons.map(({ key, Icon, label }) => (
              <a
                key={key}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: "rgba(0,13,87,0.07)",
                  color: "#000D57",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#000D57"; e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,13,87,0.07)"; e.currentTarget.style.color = "#000D57"; }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="py-6 text-center border-t border-[#000D57]/5">
          <p
            className="text-[#000D57]/40 text-[10px] leading-relaxed"
            style={{ fontFamily: fJP }}
          >
            本サイトの国宝情報は、国宝庁の公共データを活用しています。
          </p>
        </div>
      </div>
    </footer>
  );
}
