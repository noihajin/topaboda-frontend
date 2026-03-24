import { useState } from "react";
import { C, font, fontSerif } from "./constants";
import { SectionTitle, ReviewCard, IconChevronLeft, IconChevronRight } from "./DetailUI";
import Pagination from "../Pagination";
import ReviewWriteModal from "./ReviewWriteModal";
import axios from "axios";

export default function HeritageContent({ data, reviews, reviewPage, totalPages, setReviewPage, fetchReviews, galleryRef, scrollGallery }) {
    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    const handleSubmitReview = async (text) => {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
            alert("ログインが必要です。");
            return;
        }

        try {
            await axios.post(
                `http://localhost:9990/topaboda/api/heritages/${data.id}/reviews`,
                { content: text },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            await fetchReviews();
            setReviewPage(0);
        } catch (e) {
            console.error("리뷰 등록 실패:", e);
        }

        console.log("리뷰 등록:", text);
    };

    return (
        <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 40 }}>
            {/* 텍스트 섹션들 */}
            {data.content?.map((section) => (
                <div
                    key={section.title}
                    style={{
                        background: "white",
                        borderRadius: 18,
                        padding: "48px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <SectionTitle>{section.title}</SectionTitle>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {section.paragraphs.map((para, i) => (
                            <p
                                key={i}
                                style={{
                                    fontSize: 16,
                                    lineHeight: 2,
                                    color: C.textDark,
                                    margin: 0,
                                    fontFamily: font,
                                }}
                            >
                                {para}
                            </p>
                        ))}
                    </div>
                </div>
            ))}

            {/* 포토 갤러리 */}
            <div
                style={{
                    background: "white",
                    borderRadius: 18,
                    padding: "48px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
                    <h2 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 700, color: C.navy, margin: 0 }}>フォトギャラリー</h2>
                    <div style={{ display: "flex", gap: 10 }}>
                        {[
                            { dir: -1, icon: <IconChevronLeft /> },
                            { dir: 1, icon: <IconChevronRight /> },
                        ].map(({ dir, icon }) => (
                            <button
                                key={dir}
                                onClick={() => scrollGallery(dir)}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    background: C.navy,
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "opacity 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
                <div
                    ref={galleryRef}
                    style={{
                        display: "flex",
                        gap: 16,
                        overflowX: "auto",
                        scrollbarWidth: "none",
                        paddingBottom: 4,
                    }}
                >
                    {data.images?.map((src, i) => (
                        <div
                            key={i}
                            style={{
                                flexShrink: 0,
                                width: 300,
                                height: 220,
                                borderRadius: 14,
                                overflow: "hidden",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                        >
                            <img
                                src={src}
                                alt={`${data.nameJa} ${i + 1}`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                    transition: "transform 0.4s",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* 리뷰 섹션 */}
            <div
                style={{
                    background: "white",
                    borderRadius: 18,
                    padding: "48px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
                    <div>
                        <h2 style={{ fontFamily: fontSerif, fontSize: 28, fontWeight: 700, color: C.navy, margin: "0 0 6px" }}>訪問者の声</h2>
                        <p style={{ fontSize: 14, color: C.textMedium, margin: 0, fontFamily: font }}>実際に訪問した方々のレビュー</p>
                    </div>
                    {/* 리뷰 작성 버튼 → 모달 오픈 */}
                    <button
                        onClick={() => setReviewModalOpen(true)}
                        style={{
                            background: C.red,
                            color: "white",
                            border: "none",
                            borderRadius: 10,
                            padding: "12px 28px",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: font,
                            transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                        レビューを書く
                    </button>
                </div>

                {/* 리뷰 목록 */}

                {/* GET /api/heritages/{heritageId}/reviews */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {reviews?.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
                {totalPages > 1 && (
                    <Pagination
                        currentPage={reviewPage + 1}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            setReviewPage(page - 1);
                        }}
                    />
                )}
            </div>

            {/* 리뷰 작성 모달 */}
            <ReviewWriteModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} heritageName={data.nameJa} onSubmit={handleSubmitReview} />
        </div>
    );
}
