import { useState, useEffect } from "react";
// 1. Link 컴포넌트 임포트 확인 (이미 되어 있다면 패스!)
import { Link, useLocation } from "react-router-dom";
import imgLogoWht from "../assets/logo_white.svg";
import imgLogoBlk from "../assets/logo_black.svg";
import imgIconGlobeWht from "../assets/icon_globe_white.svg";
import imgIconGlobeBlk from "../assets/icon_globe_black.svg";
import imgIconLoginWht from "../assets/icon_login_white.svg";
import imgIconLoginBlk from "../assets/icon_login_black.svg";

// 2. 경로(to)를 실제 라우터 주소와 맞춥니다.
const NAV_LINKS = [
  { label: "국가유산 목록", to: "/heritage-list" },
  { label: "업적", to: "/achievements" },
  { label: "커뮤니티", to: "/community" }, // 아까 App.jsx에 설정한 경로
];

// Navbar 컴포넌트 내부
const location = useLocation();
const isMainHome = location.pathname === "/"; // 메인 홈인지 확인

// 메인 홈이 아니거나, 스크롤 됐거나, 호버 중일 때 'active' 스타일 적용
const isActive = !isMainHome || scrolled || isHovered;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation(); // 현재 페이지 주소를 가져옵니다.

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = scrolled || isHovered;

  return (
    <>
      <style>{`
        /* 기존 CSS는 그대로 유지하되, active 클래스 색상만 살짝 보강합니다 */
        .gnb-root {
          position: fixed; top: 0; left: 0; width: 100%; height: 11.9rem;
          z-index: 100; transition: all 0.3s ease; font-family: "Noto Sans KR", sans-serif;
          background: transparent;
        }
        .gnb-root.active {
          background: #ffffff; box-shadow: 0 1px 15px rgba(0, 0, 0, 0.05);
          border-bottom: 2px solid #eee;
        }
        .gnb-inner {
          display: flex; flex-direction: column; align-items: center;
          padding: 30px 40px; max-width: 1920px; margin: 0 auto; width: 100%; transition: padding 0.3s ease;
        }
        .gnb-root.active .gnb-inner { padding: 20px 40px; }
        .gnb-top-row { position: relative; display: flex; justify-content: center; align-items: center; width: 100%; margin-bottom: 20px; }
        .gnb-logo { width: 120px; transition: width 0.3s ease; display: block; }
        .gnb-root.active .gnb-logo { width: 100px; }
        .gnb-actions { position: absolute; right: 0; top: 50%; transform: translateY(-50%); display: flex; gap: 12px; }
        .gnb-menus { display: flex; gap: 40px; }
        
        /* <a> 태그와 <Link> 태그 모두에 적용되도록 설정 */
        .gnb-menu-item {
          position: relative;
          color: ${isActive ? "#000000" : "#ffffff"};
          font-weight: 500; text-decoration: none; padding: 8px 4px; transition: color 0.3s ease;
        }

        /* 현재 페이지일 때 빨간 밑줄 고정 효과 */
        .gnb-menu-item.page-active::after {
          width: 100% !important;
          background-color: #6E0000 !important;
        }

        .gnb-menu-item::after {
          content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 0; height: 2px; background-color: ${isActive ? "#6E0000" : "#ffffff"};
          transition: width 0.3s ease;
        }
        .gnb-menu-item:hover::after { width: 100%; }
        .gnb-btn { display: flex; align-items: center; gap: 6px; background: transparent; 
          border: 1px solid ${isActive ? "#000000" : "rgba(255,255,255,0.3)"};
          color: ${isActive ? "#000000" : "#ffffff"}; padding: 6px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.3s ease;
        }
      `}</style>

      <header
        className={`gnb-root ${isActive ? "active" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="gnb-inner">
          <div className="gnb-top-row">
            {/* 로고: 클릭 시 메인홈(/)으로 이동 */}
            <Link to="/" className="gnb-logo">
              <img src={isActive ? imgLogoBlk : imgLogoWht} alt="Logo" />
            </Link>

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

          <nav className="gnb-menus">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                /* 현재 주소(location.pathname)와 링크 주소가 같으면 'page-active' 클래스 추가 */
                className={`gnb-menu-item ${location.pathname === link.to ? "page-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}