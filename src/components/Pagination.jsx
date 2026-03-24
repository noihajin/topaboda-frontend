import React from "react";

/**
 * 공용 Pagination 컴포넌트
 * @param {number}   currentPage  - 현재 페이지 (1-based)
 * @param {number}   totalPages   - 전체 페이지 수
 * @param {function} onPageChange - 페이지 변경 콜백 (page: number) => void
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // 데이터가 없거나 1페이지여도 항상 표시 (비활성 상태)
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrent = Math.max(1, currentPage);

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

      {/* 페이지 번호 */}
      {Array.from({ length: safeTotalPages }, (_, i) => i + 1).map(n => (
        <PageBtn
          key={n}
          n={n}
          active={safeCurrent === n}
          onClick={() => onPageChange(n)}
        />
      ))}

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

/* 숫자 버튼: 배경 없음, 활성 시 색+굵기만 변경 */
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
        /* 활성 숫자 아래 dot */
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
