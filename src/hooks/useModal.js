import { useState, useCallback } from "react";

/**
 * useModal - TopaModal 상태 관리 커스텀 훅
 *
 * 사용 예시:
 *   const { isOpen, open, close } = useModal();
 *   <button onClick={open}>열기</button>
 *   <TopaModal isOpen={isOpen} onClose={close} ... />
 */
export default function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open  = useCallback(() => setIsOpen(true),  []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle };
}
