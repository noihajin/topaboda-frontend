import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const C = {
    navy: "#000d57",
    red: "#6e0000",
    white: "#ffffff",
    bg: "#f8f9fc",
    gray2: "#4a5565",
    gray3: "#99a1af",
    gray4: "#4c4c4c",
    border: "#e2e8f0",
    divider: "#edf2f7",
    panel: "rgba(238,238,238,0.93)",
};

const font = "'Roboto', 'Noto Sans JP', 'Noto Sans KR', sans-serif";

/** モーダルボタン */
function ModalButton({ children, onClick }) {
    const [hover, setHover] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                width: "100%",
                height: 50,
                borderRadius: 12,
                border: `1.2px solid ${C.navy}`,
                background: hover ? C.white : C.navy,
                color: hover ? C.navy : C.white,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: font,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
        >
            {children}
        </button>
    );
}

const InfoModal = ({ open, icon, title, content, onClose, onMove }) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,13,87,0.4)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: 20,
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 20 }}
                        style={{
                            background: C.white,
                            padding: "50px 40px",
                            borderRadius: 24,
                            textAlign: "center",
                            maxWidth: 380,
                            width: "100%",
                            boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
                            border: `1px solid ${C.border}`,
                        }}
                    >
                        <div style={{ fontSize: 60, marginBottom: 20 }}>{icon}</div>

                        <h2 style={{ color: C.navy, fontWeight: 900, fontSize: 24, marginBottom: 12 }}>{title}</h2>

                        <p style={{ color: C.gray2, lineHeight: 1.6, marginBottom: 30, fontSize: 14 }}>{content}</p>

                        <ModalButton onClick={onMove}>メインページへ</ModalButton>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InfoModal;
