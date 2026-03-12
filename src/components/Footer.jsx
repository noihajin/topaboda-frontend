import React from "react";
// 톱파보다 네이밍 규칙: 로컬 파일 임포트는 camelCase 변수명을 사용합니다.
import imgLogo from "../assets/logo.png";
import icFacebook from "../assets/icon_facebook.svg";
import icInstagram from "../assets/icon_instagram.svg";
import icTwitter from "../assets/icon_twitter.svg";
import icYoutube from "../assets/icon_youtube.svg";

const navSections = [
  {
    heading: "서비스",
    links: ["국가유산 목록", "상세 보기", "커뮤니티"],
  },
  {
    heading: "관련 사이트",
    links: ["국가유산청", "국립중앙박물관", "한국문화재재단"],
  },
  {
    heading: "톺아보다",
    links: ["소개", "팀", "공지사항"],
  },
];

// 배열 내부 객체들도 camelCase 규칙을 따릅니다.
const socialIcons = [
  { src: icFacebook, alt: "Facebook" },
  { src: icInstagram, alt: "Instagram" },
  { src: icTwitter, alt: "Twitter" },
  { src: icYoutube, alt: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 font-sans">
      <div className="max-w-[1400px] mx-auto px-10 lg:px-16 pt-16">
        
        {/* 상단: 내비게이션 + 로고 */}
        <div className="flex flex-col md:flex-row justify-between items-start pb-12 gap-10">
          <div className="flex flex-wrap gap-12 lg:gap-20">
            {navSections.map((section) => (
              <div key={section.heading} className="min-w-[120px]">
                <h4 className="text-[#000D57] text-sm font-bold mb-5">{section.heading}</h4>
                <ul className="flex flex-col gap-3 text-[#000D57]/70 text-xs">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-[#000D57] transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="w-24 flex items-center justify-center">
            {/* 임포트한 변수를 src에 그대로 사용합니다. */}
            <img src={imgLogo} alt="Topaboda Logo" className="w-full h-auto" />
          </div>
        </div>

        <div className="border-t border-[#000D57]/10" />

        {/* 하단: 저작권 + 소셜 아이콘 */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 gap-6">
          <div className="flex flex-wrap items-center gap-5 text-[#000D57]/60 text-xs">
            <span>© 2026 Topaboda. All rights reserved.</span>
            {["개인정보처리방침", "이용약관"].map((label) => (
              <a key={label} href="#" className="underline hover:text-[#000D57]">{label}</a>
            ))}
          </div>

          <div className="flex gap-3">
            {socialIcons.map((icon) => (
              <a
                key={icon.alt}
                href="#"
                className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all"
              >
                {/* SVG 파일을 img 태그로 렌더링 */}
                <img src={icon.src} alt={icon.alt} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="py-6 text-center border-t border-[#000D57]/5">
          <p className="text-[#000D57]/40 text-[10px] leading-relaxed">
            본 사이트의 국가유산 정보는 국가유산청 공공데이터를 활용하고 있습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}