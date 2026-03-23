import { C, font, fontSerif } from "./constants";

// ── 아이콘 SVG ────────────────────────────────────────────────────────
export const IconMapPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

export const IconBookmark = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? C.navy : "none"} stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>
);

export const IconHeart = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#e53e3e" : "none"} stroke={active ? "#e53e3e" : C.textDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

export const IconShare = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.textDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

export const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export const IconTag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

export const IconMapPinSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

export const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export const IconExternalLink = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

export const IconAward = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

export const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

export const IconChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

export const IconChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ── 섹션 헤딩 ─────────────────────────────────────────────────────────
export function SectionTitle({ children }) {
  return (
    <div style={{ borderBottom: `3px solid ${C.yellow}`, paddingBottom: 14, marginBottom: 24 }}>
      <h2 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 700, color: C.navy, margin: 0 }}>
        {children}
      </h2>
    </div>
  );
}

// ── 사이드바 정보 행 ──────────────────────────────────────────────────
export function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: "rgba(255,255,255,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: "0 0 4px", fontFamily: font }}>{label}</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: "white", margin: 0, fontFamily: font, lineHeight: 1.5 }}>{value}</p>
      </div>
    </div>
  );
}

// ── 리뷰 카드 ─────────────────────────────────────────────────────────
export function ReviewCard({ review }) {
  return (
    <div style={{
      background: "#eeeeee", borderRadius: 14, padding: "24px",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
          background: C.navyGrad,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 700, color: "white", fontFamily: font,
        }}>
          {review.initial}
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: font }}>{review.name}</span>
      </div>
      <p style={{ fontSize: 15, color: C.textDark, lineHeight: 1.8, margin: 0, fontFamily: font }}>
        {review.text}
      </p>
      {review.date && (
        <p style={{ fontSize: 12, color: C.gray, margin: 0, fontFamily: font }}>{review.date}</p>
      )}
    </div>
  );
}
