import { C, font } from "./constants";
import { CircleProgress, BadgeStat } from "./AchievementUI";

// 업적 달성도 요약 카드 (원형 진행도 + 메달 통계 + 마이페이지 버튼)
export default function AchievementSummary({ achievedCount, totalCount, progressPct, goldCount, silverCount, bronzeCount }) {
    const safePct = Number(progressPct) || 0;

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

        </div>
    );
}
