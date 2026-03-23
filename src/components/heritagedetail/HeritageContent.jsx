import { C, font, fontSerif } from "./constants";
import { SectionTitle, ReviewCard, IconChevronLeft, IconChevronRight } from "./DetailUI";

export default function HeritageContent({
  data,
  reviews,
  showReviewForm,
  reviewText,
  setShowReviewForm,
  setReviewText,
  galleryRef,
  scrollGallery,
}) {
  return (
    <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 40 }}>

      {/* 텍스트 섹션들 */}
      {data.content.map((section) => (
        <div
          key={section.title}
          style={{
            background: "white", borderRadius: 18, padding: "48px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <SectionTitle>{section.title}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {section.paragraphs.map((para, i) => (
              <p key={i} style={{
                fontSize: 16, lineHeight: 2, color: C.textDark,
                margin: 0, fontFamily: font,
              }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      ))}

      {/* 포토 갤러리 */}
      <div style={{
        background: "white", borderRadius: 18, padding: "48px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <h2 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 700, color: C.navy, margin: 0 }}>
            フォトギャラリー
          </h2>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ dir: -1, icon: <IconChevronLeft /> }, { dir: 1, icon: <IconChevronRight /> }].map(({ dir, icon }) => (
              <button
                key={dir}
                onClick={() => scrollGallery(dir)}
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: C.navy, border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        <div
          ref={galleryRef}
          style={{
            display: "flex", gap: 16, overflowX: "auto",
            scrollbarWidth: "none", paddingBottom: 4,
          }}
        >
          {data.images.map((src, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0, width: 300, height: 220, borderRadius: 14,
                overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={src}
                alt={`${data.nameJa} ${i + 1}`}
                style={{
                  width: "100%", height: "100%", objectFit: "cover", display: "block",
                  transition: "transform 0.4s", cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <div style={{
        background: "white", borderRadius: 18, padding: "48px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 700, color: C.navy, margin: "0 0 6px" }}>
              訪問者の声
            </h2>
            <p style={{ fontSize: 14, color: C.textMedium, margin: 0, fontFamily: font }}>
              実際に訪問した方々のレビュー
            </p>
          </div>
          <button
            onClick={() => setShowReviewForm((v) => !v)}
            style={{
              background: C.red, color: "white", border: "none", borderRadius: 10,
              padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer",
              fontFamily: font, transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            レビューを書く
          </button>
        </div>

        {/* 리뷰 작성 폼 */}
        {showReviewForm && (
          <div style={{
            background: "#f8f9fc", borderRadius: 14, padding: "24px",
            marginBottom: 24, border: `1px solid ${C.border}`,
          }}>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="この文化遺産についての感想を書いてください..."
              rows={4}
              style={{
                width: "100%", borderRadius: 10, border: `1px solid ${C.border}`,
                padding: "14px 16px", fontSize: 15, fontFamily: font,
                resize: "none", outline: "none", boxSizing: "border-box",
                lineHeight: 1.7,
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
              <button
                onClick={() => setShowReviewForm(false)}
                style={{
                  padding: "10px 20px", borderRadius: 8,
                  border: `1px solid ${C.border}`, background: "white",
                  cursor: "pointer", fontFamily: font, fontSize: 14,
                }}
              >
                キャンセル
              </button>
              <button
                onClick={() => { /* POST /api/heritages/{id}/reviews */ setShowReviewForm(false); setReviewText(""); }}
                style={{
                  padding: "10px 20px", borderRadius: 8, border: "none",
                  background: C.navy, color: "white", cursor: "pointer",
                  fontFamily: font, fontSize: 14, fontWeight: 700,
                }}
              >
                投稿する
              </button>
            </div>
          </div>
        )}

        {/* 리뷰 목록 */}
        {/* GET /api/heritages/{heritageId}/reviews */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
