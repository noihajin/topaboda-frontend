import { motion, AnimatePresence } from "framer-motion";

/**
 * TopaModal - 공통 확인/알림 모달 컴포넌트
 *
 * @param {boolean}  isOpen     - 모달 표시 여부
 * @param {function} onClose    - 닫기 콜백
 * @param {string}   title      - 모달 제목
 * @param {ReactNode} children  - 본문 내용
 * @param {function} onConfirm  - 확인 버튼 콜백 (없으면 확인 버튼만 표시)
 * @param {string}   variant    - 'success' | 'danger' | 'info'
 * @param {string}   icon       - 이모지 또는 아이콘 문자열
 * @param {string}   confirmLabel  - 확인 버튼 텍스트 (기본: 確認)
 * @param {string}   cancelLabel   - 취소 버튼 텍스트 (기본: キャンセル)
 * @param {boolean}  singleButton  - true 이면 확인 버튼 하나만 표시
 */
export default function TopaModal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  variant = "info",
  icon,
  confirmLabel = "確認",
  cancelLabel = "キャンセル",
  singleButton = false,
}) {
  if (!isOpen) return null;

  const config = {
    success: {
      primary: "#CACA00",
      bg: "rgba(202,202,0,0.12)",
      btn: { background: "#CACA00", color: "#000d57" },
    },
    danger: {
      primary: "#6E0000",
      bg: "rgba(110,0,0,0.08)",
      btn: { background: "#6E0000", color: "white" },
    },
    info: {
      primary: "#000d57",
      bg: "rgba(0,13,87,0.08)",
      btn: { background: "#000d57", color: "white" },
    },
  };

  const theme = config[variant] ?? config.info;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {/* 오버레이 */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={overlayStyle}
      >
        {/* 모달 박스 */}
        <motion.div
          key="modal"
          initial={{ scale: 0.88, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.88, y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "white",
            padding: "40px 40px 36px",
            borderRadius: 32,
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
            textAlign: "center",
            width: "90%",
            maxWidth: 420,
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${theme.primary}22`,
          }}
        >
          {/* 상단 포인트 라인 */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 6,
              background: theme.primary,
            }}
          />

          {/* 아이콘 */}
          {icon && (
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: theme.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 34,
              }}
            >
              {icon}
            </div>
          )}

          {/* 제목 */}
          <h2
            style={{
              color: "#000d57",
              fontSize: 22,
              fontWeight: 900,
              marginBottom: 12,
              letterSpacing: "-0.3px",
              fontFamily: "'Noto Serif JP', serif",
            }}
          >
            {title}
          </h2>

          {/* 본문 */}
          <div
            style={{
              color: "#4a5565",
              fontSize: 15,
              lineHeight: 1.7,
              marginBottom: 28,
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            {children}
          </div>

          {/* 버튼 영역 */}
          <div style={{ display: "flex", gap: 10 }}>
            {!singleButton && (
              <button onClick={onClose} style={cancelBtnStyle}>
                {cancelLabel}
              </button>
            )}
            <button
              onClick={handleConfirm}
              style={{
                ...confirmBtnBase,
                ...theme.btn,
                flex: singleButton ? "unset" : 1,
                width: singleButton ? "100%" : undefined,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── 공통 스타일 ── */
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,13,87,0.38)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10000,
};

const cancelBtnStyle = {
  flex: 1,
  padding: "14px 0",
  borderRadius: 16,
  border: "2px solid #e2e8f0",
  background: "white",
  color: "#99a1af",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  fontFamily: "'Noto Sans JP', sans-serif",
  transition: "background 0.15s",
};

const confirmBtnBase = {
  flex: 1,
  padding: "14px 0",
  borderRadius: 16,
  border: "none",
  fontWeight: 900,
  fontSize: 15,
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  fontFamily: "'Noto Sans JP', sans-serif",
  transition: "filter 0.15s, transform 0.1s",
};
