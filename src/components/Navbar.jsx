import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// 에셋 임포트 (기존 유지)
import imgLogoWht from "../assets/logo_white.svg";
import imgLogoBlk from "../assets/logo_black.svg";
import imgLogoBlkSmall from "../assets/logo_black_small.svg";
import imgIconGlobeWht from "../assets/icon_globe_white.svg";
import imgIconGlobeBlk from "../assets/icon_globe_black.svg";
import imgIconLoginWht from "../assets/icon_login_white.svg";
import imgIconLoginBlk from "../assets/icon_login_black.svg";

const NAV_LINKS = [
  { label: "国の遺産リスト", to: "/heritage-list" },
  { label: "業績", to: "/achievements" },
  { label: "コミュニティー", to: "/community" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const isSubPage = location.pathname !== "/";
  // ★ 수정: isActive 조건 (PC 호버와 스크롤 우선 복구)
  const isActive = isSubPage || scrolled || isHovered;
  const isCompact = isSubPage || scrolled || isMobile;

  return (
    <>
      <style>{`
        .gnb-root {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 100;
          transition: all 0.3s ease; font-family: "Noto Sans KR", sans-serif;
          background: transparent; height: 11.9rem;
        }

        /* 활성화 시 흰색 배경 */
        .gnb-root.active {
          background: #ffffff !important;
          box-shadow: 0 1px 15px rgba(0,0,0,0.05);
          border-bottom: 1px solid #eee;
        }

        .gnb-root.compact { height: 5rem; }

        .gnb-inner {
          height: 100%; max-width: 1920px; margin: 0 auto;
          padding: 0 40px; display: flex; flex-direction: column;
          justify-content: center; align-items: center; transition: all 0.3s ease;
        }

        .gnb-root.compact .gnb-inner {
          display: grid !important; grid-template-columns: 1fr auto 1fr;
          align-items: center; flex-direction: row;
        }

        @media (max-width: 767px) {
          .gnb-root.compact .gnb-inner { grid-template-columns: 1fr auto; }
          .gnb-inner { padding: 0 20px; }
        }

        .gnb-top-row {
          position: relative; display: flex; justify-content: center; align-items: center;
          width: 100%; margin-bottom: 16px; transition: all 0.3s ease;
        }

        .gnb-root.compact .gnb-top-row {
          width: auto; margin-bottom: 0 !important; height: 100%; justify-content: flex-start;
        }

        .gnb-logo { display: flex; align-items: center; width: 120px; }
        .gnb-root.compact .gnb-logo { width: 90px; }
        .gnb-logo img { width: 100%; display: block; }

        .gnb-menus { display: flex; gap: 40px; height: 100%; align-items: center; }

        .gnb-menu-item {
          position: relative; font-weight: 500; text-decoration: none;
          padding: 8px 4px; transition: color 0.3s ease;
          color: var(--gnb-menu-color); font-size: 15px;
        }

        .gnb-menu-item::after {
          content: ''; position: absolute; left: 50%; bottom: -4px;
          transform: translateX(-50%); width: 0; height: 3px;
          background-color: var(--gnb-underline-color); transition: width 0.3s ease;
        }

        .gnb-root.compact .gnb-menu-item::after { bottom: -20px !important; }
        .gnb-menu-item:hover::after { width: 100%; }
        .gnb-menu-item.page-active::after { width: 100% !important; background-color: #6E0000 !important; }
        .gnb-menu-item.page-active { color: #6E0000 !important; }

        .gnb-actions {
          display: flex; gap: 12px; transition: all 0.3s ease;
          position: absolute; right: 40px; top: 50%; transform: translateY(-50%);
        }

        .gnb-root.compact .gnb-actions { position: static; transform: none; justify-content: flex-end; }

        .gnb-btn {
          display: flex; align-items: center; gap: 6px; background: transparent;
          padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 14px;
          transition: all 0.3s ease; border: none; 
          color: var(--gnb-btn-color); font-weight: 600;
        }
        
        /* 호버 시 골드 컬러 복구 */
        .gnb-btn:hover { color: #caca00 !important; transform: translateY(-1px); }

        /* 햄버거 메뉴 */
        .hamburger {
          display: flex; flex-direction: column; gap: 6px; cursor: pointer;
          width: 24px; justify-self: end; z-index: 1001;
        }
        .hamburger span {
          display: block; width: 100%; height: 2px;
          background: var(--gnb-menu-color); transition: all 0.3s;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        .mobile-drawer {
          position: fixed; top: 0; 
          right: ${isMenuOpen ? "0" : "-100%"};
          width: 80%; /* 1. 너비를 화면의 80% 정도로 설정 (또는 300px 등 고정값 가능) */
          max-width: 320px; /* 너무 커지지 않게 제한 */
          height: 100vh; 
          background: #fff; 
          z-index: 1000;
          transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 100px 30px 40px; /* 상단 여백을 닫기 버튼 자리를 위해 조금 더 늘림 */
          box-shadow: -10px 0 20px rgba(0,0,0,0.05);
          display: flex; 
          flex-direction: column; 
          gap: 40px;
        }
        .drawer-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.4); z-index: 999;
          opacity: ${isMenuOpen ? 1 : 0}; visibility: ${isMenuOpen ? "visible" : "hidden"};
          transition: all 0.3s;
        }

        /* 2. 닫기 버튼 스타일 추가 */
        .drawer-close-btn {
          position: absolute;
          top: 25px;
          right: 25px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .drawer-close-btn span {
          display: block;
          width: 25px;
          height: 2px;
          background: #000d57; /* 네이비 컬러 */
        }

        
      `}</style>

      <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)} />

      <header
        className={`gnb-root ${isActive ? "active" : ""} ${isCompact ? "compact" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          "--gnb-menu-color": isActive ? "#000000" : "#ffffff",
          "--gnb-underline-color": isActive ? "#6E0000" : "#ffffff",
          "--gnb-btn-color": isActive ? "#000000" : "#ffffff",
        }}
      >
        <div className="gnb-inner">
          <div className="gnb-top-row">
            <Link to="/" className="gnb-logo">
              <img
                src={isCompact ? (isActive ? imgLogoBlkSmall : imgLogoWht) : (isActive ? imgLogoBlk : imgLogoWht)}
                alt="Logo"
              />
            </Link>
          </div>

          {!isMobile ? (
            <>
              <nav className="gnb-menus">
                {NAV_LINKS.map((link) => (
                  <Link key={link.label} to={link.to} className={`gnb-menu-item ${location.pathname === link.to ? "page-active" : ""}`}>
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="gnb-actions">
                <button className="gnb-btn">
                  <img src={isActive ? imgIconGlobeBlk : imgIconGlobeWht} alt="globe" />
                  JP
                </button>
                <button className="gnb-btn">
                  <img src={isActive ? imgIconLoginBlk : imgIconLoginWht} alt="login" />
                  Login
                </button>
              </div>
            </>
          ) : (
            <div className={`hamburger ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span /> <span /> <span />
            </div>
          )}
        </div>
      </header>

      <div className="mobile-drawer">
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)}
              style={{ fontSize: '20px', fontWeight: '700', color: '#000d57', textDecoration: 'none' }}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="gnb-btn" style={{ color: '#000', padding: '12px 0', border: 'none' }}>
            <img src={imgIconGlobeBlk} alt="" /> Language: JP
          </button>
          <button className="gnb-btn" style={{ background: '#6E0000', color: '#fff', padding: '12px', borderRadius: '12px', justifyContent: 'center', border: 'none' }}>
            Login / Sign Up
          </button>
        </div>
      </div>

      {/* ── 모바일 전용 사이드바 ── */}
      <div className="mobile-drawer">
        {/* ★ 닫기 버튼 추가 */}
        <button className="drawer-close-btn" onClick={() => setIsMenuOpen(false)}>
          <div style={{ position: 'relative', width: '25px', height: '25px' }}>
            <span style={{ position: 'absolute', top: '12px', transform: 'rotate(45deg)' }}></span>
            <span style={{ position: 'absolute', top: '12px', transform: 'rotate(-45deg)' }}></span>
          </div>
        </button>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: location.pathname === link.to ? '#6E0000' : '#000d57',
                textDecoration: 'none'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="gnb-btn" style={{ color: '#000', padding: '12px 0', border: 'none', justifyContent: 'flex-start' }}>
            <img src={imgIconGlobeBlk} alt="" /> Language: JP
          </button>
          <button className="gnb-btn" style={{ background: '#6E0000', color: '#fff', padding: '15px', borderRadius: '12px', justifyContent: 'center', border: 'none', fontWeight: '700' }}>
            Login / Sign Up
          </button>
        </div>
      </div>
    </>
  );
}