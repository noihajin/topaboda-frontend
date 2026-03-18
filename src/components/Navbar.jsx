import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// 에셋 임포트
import imgLogoWht from "../assets/logo_white.svg";
import imgLogoBlk from "../assets/logo_black.svg";
import imgLogoBlkSmall from "../assets/logo_black_small.svg";
import imgIconGlobeWht from "../assets/icon_globe_white.svg";
import imgIconGlobeBlk from "../assets/icon_globe_black.svg";
import imgIconLoginWht from "../assets/icon_login_white.svg";
import imgIconLoginBlk from "../assets/icon_login_black.svg";

const NAV_LINKS = [
    { label: "国の遺産リスト", to: "/heritage" },
    { label: "業績", to: "/achievements" },
    { label: "コミュニティー", to: "/community" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAuthenticated = Boolean(localStorage.getItem("token"));

    const location = useLocation();
    const navigate = useNavigate();

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
    const isActive = isSubPage || scrolled || isHovered;
    const isCompact = isSubPage || scrolled || isMobile;

    const handleLoginClick = () => {
        setIsMenuOpen(false);
        navigate("/login");
    };

    const handleMyPageClick = () => {
        setIsMenuOpen(false);
        navigate("/mypage");
    };

    return (
        <>
            <style>{`
        .gnb-root {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 100;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: "Roboto", "Noto Sans JP", sans-serif;
          background: transparent; height: 11.9rem;
          display: flex; align-items: center;
        }
        .gnb-root.active {
          background: #ffffff !important;
          box-shadow: 0 1px 15px rgba(0,0,0,0.05);
          border-bottom: 1px solid #eee; /* 하얀 배경일 때 생기는 연한 바닥선 */
        }
        .gnb-root.active:not(.compact) { height: 11.4rem; }
        .gnb-root.compact { height: 5.5rem; }

        .gnb-inner {
          width: 100%; max-width: 1920px; margin: 0 auto;
          padding: 0 40px; display: flex;
          flex-direction: column;
          justify-content: center; align-items: center;
          height: 100%; position: relative;
          transition: all 0.4s ease;
        }
        .gnb-root.compact .gnb-inner {
          flex-direction: row;
          justify-content: space-between;
        }

        /* 1. 로고 영역 */
        .gnb-logo-area {
          display: flex; justify-content: center; align-items: center;
          transition: all 0.4s ease;
          margin-bottom: 20px;
        }
        .gnb-root.active:not(.compact) .gnb-logo-area { margin-bottom: 16px; }
        .gnb-root.compact .gnb-logo-area { margin-bottom: 0; flex: 1; justify-content: flex-start; }

        .gnb-logo { width: 140px; transition: width 0.4s ease; }
        .gnb-root.active:not(.compact) .gnb-logo { width: 130px; }
        .gnb-root.compact .gnb-logo { width: 95px; }
        .gnb-logo img { width: 100%; display: block; }

        /* 2. 메뉴 영역 (핵심: 하단 정렬) */
        .gnb-nav-area {
          display: flex; justify-content: center; align-items: flex-end; /* 바닥에 딱 붙임 */
          height: 100%;
          transition: all 0.4s ease;
        }
        .gnb-root.compact .gnb-nav-area { flex: 2; height: 100%; }

        .gnb-menus {
          display: flex; gap: 50px; 
          height: 100%; /* 네비바 높이를 다 차지하게 함 */
          align-items: flex-end; 
        }
        .gnb-root.compact .gnb-menus { gap: 40px; }

        .gnb-menu-item {
          font-weight: 700; text-decoration: none;
          color: var(--gnb-menu-color); font-size: 16px;
          position: relative; white-space: nowrap;
          display: flex; align-items: center; 
          height: 100%; /* 네비바 하단 라인까지 높이 확보 */
          padding: 0 4px 0px 4px; /* 아래 패딩으로 글자 위치 살짝 올림 */
          transition: color 0.3s ease;
        }
        .gnb-root.compact .gnb-menu-item { font-size: 15px; padding-bottom: 0; }

        /* 밑줄 애니메이션 (네비바 하단 라인과 일치) */
        .gnb-menu-item::after {
          content: ''; position: absolute; left: 50%;
          bottom: -1px; /* 네비바 border-bottom 위치와 정확히 겹침 */
          transform: translateX(-50%); width: 0; height: 3px;
          background-color: var(--gnb-underline-color);
          transition: width 0.3s ease, background-color 0.3s ease;
        }
        .gnb-menu-item:hover::after { width: 100%; }

        .gnb-menu-item.page-active { color: #6E0000 !important; }
        .gnb-menu-item.page-active::after {
          width: 100%; background-color: #6E0000 !important;
          bottom: -1px;
        }

        /* 3. 액션 영역 */
        .gnb-action-area {
          display: flex; gap: 15px; align-items: center;
          position: absolute; right: 40px; top: 50%; transform: translateY(-50%);
          transition: all 0.4s ease;
        }
        .gnb-root.compact .gnb-action-area {
          position: static; transform: none; flex: 1; justify-content: flex-end;
        }

        .gnb-btn {
          display: flex; align-items: center; gap: 6px; background: transparent;
          padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 14px;
          border: none; color: var(--gnb-btn-color); font-weight: 700;
          transition: all 0.2s ease;
        }
        .gnb-btn:hover { color: #caca00 !important; }

        /* 모바일 햄버거 & 드로어 */
        .hamburger { display: flex; flex-direction: column; gap: 6px; cursor: pointer; width: 24px; }
        .hamburger span { display: block; width: 100%; height: 2px; background: var(--gnb-menu-color); transition: all 0.3s; }

        .drawer-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.4); z-index: 999;
          opacity: ${isMenuOpen ? 1 : 0}; visibility: ${isMenuOpen ? "visible" : "hidden"};
          transition: all 0.3s;
        }
        .mobile-drawer {
          position: fixed; top: 0; right: ${isMenuOpen ? "0" : "-100%"};
          width: 80%; max-width: 320px; height: 100vh; background: #fff; z-index: 1000;
          transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 80px 30px 40px; display: flex; flex-direction: column;
        }
        .drawer-close-btn {
          position: absolute; top: 20px; right: 20px; background: none; border: none; cursor: pointer; padding: 10px;
        }
        .close-icon { position: relative; width: 24px; height: 24px; }
        .close-icon span {
          position: absolute; left: 0; top: 11px; width: 24px; height: 2px;
          background: #000d57; transition: all 0.3s;
        }

        @media (max-width: 767px) {
          .gnb-root { height: 5rem; }
          .gnb-root.active:not(.compact) { height: 5rem; }
          .gnb-inner { flex-direction: row !important; justify-content: space-between !important; padding: 0 20px; }
          .gnb-logo-area { margin-bottom: 0 !important; flex: 1; justify-content: flex-start; }
          .gnb-logo { width: 90px !important; }
          .gnb-nav-area { display: none; }
        }
      `}</style>

            <div
                className="drawer-overlay"
                onClick={() => setIsMenuOpen(false)}
            />

            <header
                className={`gnb-root ${isActive ? "active" : ""} ${isCompact ? "compact" : ""}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    "--gnb-menu-color": isActive ? "#000000" : "#ffffff",
                    "--gnb-btn-color": isActive ? "#000000" : "#ffffff",
                    "--gnb-underline-color": isActive ? "#6E0000" : "#ffffff",
                }}
            >
                <div className="gnb-inner">
                    <div className="gnb-logo-area">
                        <Link to="/" className="gnb-logo">
                            <img
                                src={
                                    isCompact
                                        ? isActive
                                            ? imgLogoBlkSmall
                                            : imgLogoWht
                                        : isActive
                                          ? imgLogoBlk
                                          : imgLogoWht
                                }
                                alt="Logo"
                            />
                        </Link>
                    </div>

                    {!isMobile && (
                        <nav className="gnb-nav-area">
                            <div className="gnb-menus">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.label}
                                        to={link.to}
                                        className={`gnb-menu-item ${location.pathname === link.to ? "page-active" : ""}`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    )}

                    <div className="gnb-action-area">
                        {!isMobile ? (
                            <>
                                <button className="gnb-btn">
                                    <img
                                        src={
                                            isActive
                                                ? imgIconGlobeBlk
                                                : imgIconGlobeWht
                                        }
                                        alt=""
                                    />{" "}
                                    JP
                                </button>
                                {isAuthenticated ? (
                                    <button
                                        className="gnb-btn"
                                        onClick={handleMyPageClick}
                                    >
                                        MyPage
                                    </button>
                                ) : (
                                    <button
                                        className="gnb-btn"
                                        onClick={handleLoginClick}
                                    >
                                        <img
                                            src={
                                                isActive
                                                    ? imgIconLoginBlk
                                                    : imgIconLoginWht
                                            }
                                            alt=""
                                        />{" "}
                                        Login
                                    </button>
                                )}
                            </>
                        ) : (
                            <div
                                className="hamburger"
                                onClick={() => setIsMenuOpen(true)}
                            >
                                <span />
                                <span />
                                <span />
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* 모바일 드로어 */}
            <div className="mobile-drawer">
                <button
                    className="drawer-close-btn"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <div className="close-icon">
                        <span
                            style={{
                                position: "absolute",
                                top: "11px",
                                left: 0,
                                width: "24px",
                                height: "2px",
                                background: "#000d57",
                                transform: "rotate(45deg)",
                            }}
                        ></span>
                        <span
                            style={{
                                position: "absolute",
                                top: "11px",
                                left: 0,
                                width: "24px",
                                height: "2px",
                                background: "#000d57",
                                transform: "rotate(-45deg)",
                            }}
                        ></span>
                    </div>
                </button>
                <nav
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                        marginTop: "40px",
                    }}
                >
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                fontSize: "20px",
                                fontWeight: "700",
                                textDecoration: "none",
                                color:
                                    location.pathname === link.to
                                        ? "#6E0000"
                                        : "#000d57",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div
                    style={{
                        marginTop: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <button
                        className="gnb-btn"
                        style={{
                            color: "#000",
                            padding: "12px 0",
                            justifyContent: "flex-start",
                        }}
                    >
                        <img src={imgIconGlobeBlk} alt="" /> Language: JP
                    </button>
                    {isAuthenticated ? (
                        <button
                            onClick={handleMyPageClick}
                            style={{
                                background: "#000d57",
                                color: "#fff",
                                padding: "15px",
                                borderRadius: "12px",
                                border: "none",
                                fontWeight: "700",
                                fontSize: "16px",
                                cursor: "pointer",
                            }}
                        >
                            MyPage
                        </button>
                    ) : (
                        <button
                            onClick={handleLoginClick}
                            style={{
                                background: "#6E0000",
                                color: "#fff",
                                padding: "15px",
                                borderRadius: "12px",
                                border: "none",
                                fontWeight: "700",
                                fontSize: "16px",
                                cursor: "pointer",
                            }}
                        >
                            Login / Sign Up
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
