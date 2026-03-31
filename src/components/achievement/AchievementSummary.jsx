import { useNavigate } from "react-router-dom";
import { C, font } from "./constants";
import { CircleProgress, BadgeStat } from "./AchievementUI";

// 업적 달성도 요약 카드 (원형 진행도 + 메달 통계 + 마이페이지 버튼)
export default function AchievementSummary({ achievedCount, totalCount, progressPct, goldCount, silverCount, bronzeCount }) {
    const safePct = Number(progressPct) || 0;
    const isLoggedIn = !!localStorage.getItem("token");
    const navigate = useNavigate();

    return (
        <div
            style={{
                background: C.white,
                borderRadius: 20,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
                padding: "36px 44px",
                display: "flex",
                alignItems: "center",
                gap: 48,
                flexWrap: "wrap",
                marginBottom: 40,
            }}
        >
            {/* 円形プログレス */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                <p style={{ margin: "0 0 4px", fontSize: 13, color: C.sub, fontWeight: 600, fontFamily: font }}>達成度</p>
                <div style={{ position: "relative" }}>
                    <CircleProgress percent={progressPct} size={160} strokeWidth={12} />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 34,
                                fontWeight: 900,
                                fontFamily: font,
                                lineHeight: 1,
                                background: "linear-gradient(155deg, #DAA520, #FFD700)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {safePct}%
                        </span>
                        <span style={{ fontSize: 11, color: C.sub, fontWeight: 600, marginTop: 4, fontFamily: font }}>達成度</span>
                    </div>
                </div>
            </div>

            {/* 区切り線 */}
            <div style={{ width: 1, height: 120, background: C.border, flexShrink: 0 }} />

            {/* バッジ統計 */}
            <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 44, fontWeight: 900, color: C.red, fontFamily: font, lineHeight: 1 }}>{achievedCount}</span>
                    <span style={{ fontSize: 15, color: C.sub, fontWeight: 600, fontFamily: font, marginLeft: 10 }}>獲得バッジ</span>
                    <span style={{ fontSize: 13, color: C.sub, fontFamily: font, marginLeft: 8 }}>/ 全 {totalCount} 業績</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <BadgeStat label="金" count={goldCount} color="#FFD700" borderColor="rgba(255,215,0,0.25)" bgGrad="linear-gradient(135deg, #FFF9E6 0%, #FFF 100%)" />
                    <BadgeStat label="銀" count={silverCount} color={C.silver} borderColor="rgba(192,192,192,0.25)" bgGrad="linear-gradient(135deg, #F5F5F5 0%, #FFF 100%)" />
                    <BadgeStat label="銅" count={bronzeCount} color={C.bronze} borderColor="rgba(205,127,50,0.25)" bgGrad="linear-gradient(135deg, #FFF4E6 0%, #FFF 100%)" />
                </div>
            </div>

            {/* 비로그인 시 로그인 버튼 */}
            {!isLoggedIn && (
                <>
                    <div style={{ width: 1, height: 120, background: C.border, flexShrink: 0 }} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <p style={{ margin: 0, fontSize: 13, color: C.sub, fontWeight: 600, fontFamily: font, textAlign: "center" }}>
                            ログインして<br />業績を獲得しよう
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            style={{
                                background: "rgba(0,13,87,0.07)",
                                color: C.navy,
                                border: "none",
                                borderRadius: 999,
                                padding: "10px 20px",
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                cursor: "pointer",
                                transition: "background 0.2s, color 0.2s",
                                flexShrink: 0,
                                fontSize: 13,
                                fontWeight: 700,
                                fontFamily: font,
                                whiteSpace: "nowrap",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = C.navy;
                                e.currentTarget.style.color = "#fff";
                                e.currentTarget.querySelector("svg").style.stroke = "#fff";
                                e.currentTarget.querySelector("svg").style.transform = "translateX(4px)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "rgba(0,13,87,0.07)";
                                e.currentTarget.style.color = C.navy;
                                e.currentTarget.querySelector("svg").style.stroke = C.navy;
                                e.currentTarget.querySelector("svg").style.transform = "translateX(0)";
                            }}
                        >
                            ログイン
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000d57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                style={{ transition: "transform 0.25s ease, stroke 0.2s" }}>
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    </div>
                </>
            )}

        </div>
    );
}
