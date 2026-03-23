// 업적 페이지에서 쓰이는 작은 UI 부품들
import { C, font } from "./constants";

// ── 円形プログレスリング ──
export function CircleProgress({ percent = 0, size = 160, strokeWidth = 12 }) {
    const safePercent = Number(percent) || 0;
    const r = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (safePercent / 100) * circumference;
    const cx = size / 2;
    const cy = size / 2;
    return (
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
            <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={C.red} />
                    <stop offset="100%" stopColor={C.goldDark} />
                </linearGradient>
            </defs>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#progressGrad)" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
    );
}

// ── バッジ統計ミニカード ──
export function BadgeStat({ label, count, color, borderColor, bgGrad }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                background: bgGrad,
                borderRadius: 12,
                padding: "12px 18px",
                border: `1px solid ${borderColor}`,
                minWidth: 60,
            }}
        >
            <span style={{ fontSize: 22, fontWeight: 900, color, fontFamily: font, lineHeight: 1 }}>{count}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.sub, fontFamily: font }}>{label}</span>
        </div>
    );
}

// ── 進捗バー ──
export function ProgressBar({ current, total }) {
    const pct = Math.min((current / total) * 100, 100);
    const done = pct >= 100;
    return (
        <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: C.sub, fontFamily: font, fontWeight: 600 }}>進行度</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: font, color: done ? C.goldDark : C.red }}>{Math.round(pct)}%</span>
            </div>
            <div style={{ height: 10, borderRadius: 99, background: "#E5E7EB", overflow: "hidden" }}>
                <div
                    style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: done ? "linear-gradient(90deg, #6E0000 0%, #8B1A1A 20%, #B05A1A 60%, #DAA520 100%)" : "linear-gradient(90deg, #6E0000, #B03010)",
                        borderRadius: 99,
                        boxShadow: done ? "0 0 8px rgba(218,165,32,0.4)" : "none",
                        transition: "width 0.6s ease",
                    }}
                />
            </div>
            <div style={{ marginTop: 5, fontSize: 12, color: C.red, fontWeight: 700, fontFamily: font }}>
                {current} / {total}
            </div>
        </div>
    );
}
