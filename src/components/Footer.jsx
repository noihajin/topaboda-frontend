import React from "react";
import { useLocation } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import icFacebook from "../assets/icon_facebook.svg";
import icInstagram from "../assets/icon_instagram.svg";
import icTwitter from "../assets/icon_twitter.svg";
import icYoutube from "../assets/icon_youtube.svg";

const fJP  = "'Noto Sans JP', 'Noto Sans KR', sans-serif";
const fEN  = "'Roboto', sans-serif";

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

const socialIcons = [
  { src: icFacebook, alt: "Facebook" },
  { src: icInstagram, alt: "Instagram" },
  { src: icTwitter, alt: "Twitter" },
  { src: icYoutube, alt: "YouTube" },
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
            {socialIcons.map((icon) => (
              <a
                key={icon.alt}
                href="#"
                className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-all"
              >
                <img src={icon.src} alt={icon.alt} className="w-4 h-4" />
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
