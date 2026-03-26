import React from "react";

/**
 * 공용 Pagination 컴포넌트
 * @param {number}   currentPage  - 현재 페이지 (1-based)
 * @param {number}   totalPages   - 전체 페이지 수
 * @param {function} onPageChange - 페이지 변경 콜백 (page: number) => void
 *
 * 렌더링 예시:
 *   ◀  1 2 3 4 5 ... 999  ▶   (1페이지일 때)
 *   ◀  1 ... 8 9 10 11 12 ... 999  ▶  (중간 페이지)
 *   ◀  1 ... 995 996 997 998 999  ▶   (마지막 페이지)
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrent   = Math.min(Math.max(1, currentPage), safeTotalPages);

  const pages = getPageNumbers(safeCurrent, safeTotalPages);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        marginTop: 48,
      }}
    >
      {/* 이전 버튼 */}
      <button
        onClick={() => onPageChange(safeCurrent - 1)}
        disabled={safeCurrent === 1}
        style={arrowBtnStyle(safeCurrent === 1)}
        aria-label="前のページ"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke={safeCurrent === 1 ? "#c8ccd4" : "#000D57"}
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* 페이지 번호 + 말줄임표 */}
      {pages.map((item, idx) =>
        item === "..."
          ? <Ellipsis key={`dots-${idx}`} />
          : <PageBtn
              key={item}
              n={item}
              active={safeCurrent === item}
              onClick={() => onPageChange(item)}
            />
      )}

      {/* 다음 버튼 */}
      <button
        onClick={() => onPageChange(safeCurrent + 1)}
        disabled={safeCurrent === safeTotalPages}
        style={arrowBtnStyle(safeCurrent === safeTotalPages)}
        aria-label="次のページ"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke={safeCurrent === safeTotalPages ? "#c8ccd4" : "#000D57"}
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

/**
 * 표시할 페이지 번호 배열 생성
 * 항상 첫 페이지와 마지막 페이지를 표시하고,
 * 현재 페이지 ±2 범위의 윈도우를 표시 (최소 5개)
 * 공백이 2 이상이면 "..." 삽입
 */
function getPageNumbers(current, total) {
  // 7페이지 이하면 전부 표시
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const WING = 2; // 현재 페이지 기준 좌우 표시 개수
  let winStart = Math.max(1, current - WING);
  let winEnd   = Math.min(total, current + WING);

  // 시작/끝 근처에서 최소 5개 보장
  if (winEnd - winStart < WING * 2) {
    if (winStart === 1) winEnd   = Math.min(total, 1 + WING * 2);
    if (winEnd === total) winStart = Math.max(1, total - WING * 2);
  }

  const result = [];

  // 첫 페이지 ~ 윈도우 앞
  if (winStart > 1) {
    result.push(1);
    if (winStart > 2) result.push("...");
  }

  // 윈도우
  for (let i = winStart; i <= winEnd; i++) result.push(i);

  // 윈도우 뒤 ~ 마지막 페이지
  if (winEnd < total) {
    if (winEnd < total - 1) result.push("...");
    result.push(total);
  }

  return result;
}

/* 말줄임표 */
function Ellipsis() {
  return (
    <span style={{
      width: 36,
      height: 36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 15,
      color: "#99a1af",
      letterSpacing: "0.05em",
      userSelect: "none",
    }}>
      ···
    </span>
  );
}

/* 숫자 버튼 */
function PageBtn({ n, active, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: 36,
        height: 36,
        padding: "0 4px",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 15,
        fontWeight: active ? 900 : 500,
        color: active ? "#000D57" : hovered ? "#000D57" : "#99a1af",
        transition: "color 0.15s, font-weight 0.15s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Noto Sans JP', sans-serif",
        letterSpacing: "-0.01em",
        position: "relative",
      }}
    >
      {n}
      {active && (
        <span style={{
          position: "absolute",
          bottom: 2,
          left: "50%",
          transform: "translateX(-50%)",
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#000D57",
        }} />
      )}
    </button>
  );
}

/* 화살표 버튼 공통 스타일 */
const arrowBtnStyle = (disabled) => ({
  width: 36,
  height: 36,
  background: "none",
  border: "none",
  cursor: disabled ? "default" : "pointer",
  opacity: disabled ? 0.35 : 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  transition: "opacity 0.15s",
});
