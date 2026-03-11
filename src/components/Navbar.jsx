import { useState, useEffect } from "react";
// 로컬 에셋 임포트
import imgLogoWht from "../assets/logo_white.svg";
import imgLogoBlk from "../assets/logo_black.svg";
import imgIconGlobeWht from "../assets/icon_globe_white.svg";
import imgIconGlobeBlk from "../assets/icon_globe_black.svg";
import imgIconLoginWht from "../assets/icon_login_white.svg";
import imgIconLoginBlk from "../assets/icon_login_black.svg";

const NAV_LINKS = [
  { label: "国の遺産リスト", href: "#" },
  { label: "業績", href: "#" },
  { label: "コミュニティー", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = scrolled || isHovered;

  return (
    <>
      <style>{`
        /* 1. 기본 배경 설정 */
        .gnb-root {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 11.9rem;
          z-index: 100;
          transition: background 0.3s ease, box-shadow 0.3s ease;
          font-family: "Noto Sans JP", sans-serif;
          background: transparent;
      
        }

        .gnb-root.active {
          background: #ffffff;
          box-shadow: 0 1px 15px rgba(0, 0, 0, 0.05);
          border-bottom: 2px solid #eee;
          
        }

        /* 2. 전체 레이아웃 (패딩으로 높이를 잡아 끊김 방지) */
        .gnb-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px 40px; /* 위아래 30px, 좌우 40px */
          max-width: 1920px;
          margin: 0 auto;
          box-sizing: border-box;
          transition: padding 0.3s ease;
          width: 100%;
          
        }

        .gnb-root.active .gnb-inner {
          padding: 20px 40px; /* 스크롤/호버 시 여백이 줄어듦 */
        }

        /* 3. 상단 영역 (로고와 버튼을 같은 줄에 배치하여 완벽하게 가로 중앙 정렬) */
        .gnb-top-row {
          position: relative;
          display: flex;
          justify-content: center; /* 로고를 중앙으로 */
          align-items: center;     /* 세로축 중앙 정렬 */
          width: 100%;
          margin-bottom: 20px;     /* 메뉴와의 간격 */
        }

        .gnb-logo {
          width: 120px;
          transition: width 0.3s ease;
          display: block;
        }
        .gnb-logo img {
          width: 100%;
          height: auto;
          display: block;
        }
        .gnb-root.active .gnb-logo {
          width: 100px;
        }

        .gnb-actions {
          position: absolute;
          right: 0; /* 우측 끝에 고정 */
          top: 50%;
          transform: translateY(-50%); /* 로고의 정확한 수평 중앙에 맞춤 */
          display: flex;
          gap: 12px;
        }

        /* 4. 하단 메뉴 영역 및 밑줄 효과 */
        .gnb-menus {
          display: flex;
          gap: 40px;
        }

        .gnb-menu-item {
          position: relative;
          color: ${isActive ? "#000000" : "#ffffff"};
          font-weight: 500;
          text-decoration: none;
          padding: 8px 4px;
          transition: color 0.3s ease;
          
        }

        /* 메뉴 밑줄 애니메이션 */
        .gnb-menu-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background-color: ${isActive ? "#6E0000" : "#ffffff"};
          transition: width 0.3s ease;
        }

        .gnb-menu-item:hover::after{
          width: 100%; /* 호버 시 스르륵 길어짐 */
        }

        /* 5. 우측 버튼 디자인 */
        .gnb-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid ${isActive ? "#000000" : "transparent"};
          color: ${isActive ? "#000000" : "#ffffff"};
          padding: 6px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .gnb-btn img {
          width: 16px;
          height: 16px;
        }
      `}</style>

      <header
        className={`gnb-root ${isActive ? "active" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="gnb-inner">
          
          {/* [변경됨] 상단 줄: 로고와 액션 버튼을 하나의 div로 묶음 */}
          <div className="gnb-top-row">
            <a href="/" className="gnb-logo">
              <img src={isActive ? imgLogoBlk : imgLogoWht} alt="Logo" />
            </a>

            <div className="gnb-actions">
              <button className="gnb-btn">
                <img src={isActive ? imgIconGlobeBlk : imgIconGlobeWht} alt="" />
                JP
              </button>
              <button className="gnb-btn">
                <img src={isActive ? imgIconLoginBlk : imgIconLoginWht} alt="" />
                Login
              </button>
            </div>
          </div>

          {/* 하단 줄: 메뉴 */}
          <nav className="gnb-menus">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`gnb-menu-item ${activeMenu === link.label ? "active" : ""}`}
                onClick={() => setActiveMenu(link.label)}
              >
                {link.label}
              </a>
            ))}
          </nav>

        </div>
      </header>
    </>
  );
}