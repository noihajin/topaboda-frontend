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
      bg: "rgba(202,202,0,0.10)",
      gradient: "linear-gradient(135deg, #caca00 0%, #a0a000 100%)",
      btn: { color: "#000d57" },
      bar: "linear-gradient(90deg, #caca00, #a0a000)",
    },
    danger: {
      primary: "#6E0000",
      bg: "rgba(110,0,0,0.07)",
      gradient: "linear-gradient(135deg, #6e0000 0%, #000d57 100%)",
      btn: { color: "white" },
      bar: "linear-gradient(90deg, #6e0000, #000d57)",
    },
    info: {
      primary: "#000d57",
      bg: "rgba(0,13,87,0.07)",
      gradient: "linear-gradient(135deg, #000d57 0%, #1a2fa0 100%)",
      btn: { color: "white" },
      bar: "linear-gradient(90deg, #000d57, #1a2fa0)",
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
            padding: "40px 36px 32px",
            borderRadius: 20,
            boxShadow: "0 12px 40px rgba(0,13,87,0.13)",
            textAlign: "center",
            width: "90%",
            maxWidth: 400,
            position: "relative",
            overflow: "hidden",
            border: `1px solid rgba(0,13,87,0.10)`,
          }}
        >

          {/* 아이콘 */}
          {icon && (
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 18,
                background: theme.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                fontSize: 30,
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
              fontFamily: "'Noto Sans JP', sans-serif",
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
          <div style={{ display: "flex", gap: 8 }}>
            {!singleButton && (
              <button
                onClick={onClose}
                style={cancelBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0,13,87,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {cancelLabel}
              </button>
            )}
            <button
              onClick={handleConfirm}
              style={{
                ...confirmBtnBase,
                background: theme.gradient,
                ...theme.btn,
                flex: singleButton ? "unset" : 1,
                width: singleButton ? "100%" : undefined,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
  padding: "12px 0",
  borderRadius: 999,
  border: "1.5px solid rgba(0,13,87,0.25)",
  background: "transparent",
  color: "#000d57",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  fontFamily: "'Noto Sans JP', sans-serif",
  transition: "background 0.15s",
};

const confirmBtnBase = {
  flex: 1,
  padding: "12px 0",
  borderRadius: 999,
  border: "none",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(0,13,87,0.18)",
  fontFamily: "'Noto Sans JP', sans-serif",
  transition: "opacity 0.15s",
};
