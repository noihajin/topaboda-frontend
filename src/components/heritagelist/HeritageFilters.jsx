import { useRef, useState, useCallback } from "react";
import { C, font, CATEGORIES, REGIONS } from "./constants";

// 카테고리 탭 + 지역 필터
export default function HeritageFilters({ activeCategory, onCategoryChange, activeRegion, onRegionChange }) {
  const regionRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(true);

  const onScroll = useCallback(() => {
    const el = regionRef.current;
    if (!el) return;
    setFadeLeft(el.scrollLeft > 8);
    setFadeRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const onMouseDown = (e) => {
    setIsDragging(false);
    dragStart.current = { x: e.pageX, scrollLeft: regionRef.current.scrollLeft };
    regionRef.current._isDown = true;
  };
  const onMouseMove = (e) => {
    if (!regionRef.current._isDown) return;
    const dx = e.pageX - dragStart.current.x;
    if (Math.abs(dx) > 4) setIsDragging(true);
    regionRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  };
  const onMouseUp = () => { regionRef.current._isDown = false; };
  const onMouseLeave = () => { regionRef.current._isDown = false; };

  return (
    <>
      {/* ── 카테고리 탭 ── */}
      <div style={{ background: C.white, borderBottom: `1.5px solid ${C.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none", justifyContent: "center" }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  style={{
                    background: "none", border: "none",
                    borderBottom: isActive ? `3px solid ${C.navy}` : "3px solid transparent",
                    color: isActive ? C.navy : C.textSub,
                    fontSize: 15, fontWeight: isActive ? 700 : 500,
                    padding: "16px 20px", cursor: "pointer", fontFamily: font, whiteSpace: "nowrap",
                    transition: "color 0.2s",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 지역 필터 ── */}
      <div style={{ background: C.white, borderBottom: `1.5px solid ${C.border}`, padding: "12px 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 40px" }}>
          {/* 페이드 래퍼 */}
          <div style={{ position: "relative" }}>
            {/* 왼쪽 페이드 */}
            {fadeLeft && (
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: 48, zIndex: 1,
                background: "linear-gradient(to right, #ffffff, transparent)",
                pointerEvents: "none",
              }} />
            )}
            {/* 오른쪽 페이드 */}
            {fadeRight && (
              <div style={{
                position: "absolute", right: 0, top: 0, bottom: 0, width: 48, zIndex: 1,
                background: "linear-gradient(to left, #ffffff, transparent)",
                pointerEvents: "none",
              }} />
            )}
          <div
            ref={regionRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onScroll={onScroll}
            style={{
              display: "flex", gap: 8,
              flexWrap: "nowrap",
              overflowX: "auto",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              paddingBottom: 2,
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
            }}
          >
            {REGIONS.map(reg => {
              const isActive = activeRegion === reg;
              return (
                <button
                  key={reg}
                  onClick={() => { if (!isDragging) onRegionChange(reg); }}
                  style={{
                    background: isActive ? C.navy : "#f3f4f6",
                    color: isActive ? "white" : C.textBody,
                    border: `2px solid ${isActive ? C.navy : "transparent"}`,
                    borderRadius: 999, padding: "6px 16px",
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                    cursor: "pointer", fontFamily: font, transition: "all 0.2s",
                    flexShrink: 0, whiteSpace: "nowrap",
                  }}
                >
                  {reg}
                </button>
              );
            })}
          </div>
          </div>{/* 페이드 래퍼 끝 */}
        </div>
      </div>
    </>
  );
}
